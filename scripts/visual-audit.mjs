import { chromium } from "playwright"
import { mkdirSync } from "node:fs"
import { join } from "node:path"

const BASE = process.env.BASE_URL || "http://127.0.0.1:8000"
const OUT = process.env.SHOT_DIR || "/opt/cursor/artifacts/screenshots/before"
const VIEWPORTS = [
  { name: "320", width: 320, height: 720 },
  { name: "375", width: 375, height: 812 },
  { name: "425", width: 425, height: 900 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
]
const PAGES = [
  { slug: "home", path: "/" },
  { slug: "services", path: "/services" },
  { slug: "portfolio", path: "/portfolio" },
  { slug: "pricing", path: "/pricing" },
  { slug: "about", path: "/about" },
  { slug: "contact", path: "/contact" },
  { slug: "quote", path: "/quote" },
]

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const results = []

for (const pageDef of PAGES) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: "ar-SA",
    })
    const page = await context.newPage()
    const consoleErrors = []
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })
    page.on("pageerror", (err) => consoleErrors.push(String(err)))

    try {
      await page.goto(`${BASE}${pageDef.path}`, { waitUntil: "networkidle", timeout: 45000 })
      await page.waitForTimeout(600)

      const metrics = await page.evaluate(() => {
        const doc = document.documentElement
        const body = document.body
        const overflowX = Math.max(doc.scrollWidth, body.scrollWidth) > Math.ceil(window.innerWidth) + 1
        const overlapping = []
        const sticky = document.querySelector("header")
        if (sticky) {
          const hr = sticky.getBoundingClientRect()
          if (hr.bottom > window.innerHeight) overlapping.push("header-taller-than-viewport")
        }
        return {
          scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
          innerWidth: window.innerWidth,
          overflowX,
          title: document.title,
        }
      })

      const file = join(OUT, `${pageDef.slug}-${vp.name}.png`)
      await page.screenshot({ path: file, fullPage: false })

      results.push({
        page: pageDef.slug,
        viewport: vp.name,
        overflowX: metrics.overflowX,
        scrollWidth: metrics.scrollWidth,
        innerWidth: metrics.innerWidth,
        consoleErrors: consoleErrors.slice(0, 8),
        shot: file,
      })
      console.log(
        `${pageDef.slug}@${vp.name}: overflowX=${metrics.overflowX} scroll=${metrics.scrollWidth}/${metrics.innerWidth} errors=${consoleErrors.length}`,
      )
    } catch (err) {
      results.push({
        page: pageDef.slug,
        viewport: vp.name,
        error: String(err),
      })
      console.error(`${pageDef.slug}@${vp.name}: FAIL`, err)
    } finally {
      await context.close()
    }
  }
}

await browser.close()
const reportPath = join(OUT, "audit-report.json")
await import("node:fs/promises").then((fs) => fs.writeFile(reportPath, JSON.stringify(results, null, 2)))
console.log(`Wrote ${reportPath}`)
const overflows = results.filter((r) => r.overflowX)
const failed = results.filter((r) => r.error)
console.log(`Overflows: ${overflows.length}, Failures: ${failed.length}`)
