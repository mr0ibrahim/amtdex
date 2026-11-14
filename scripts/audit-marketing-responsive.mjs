import { chromium } from "playwright"
import { mkdir, writeFile } from "node:fs/promises"

// Run against a running Laravel instance: BASE_URL=http://127.0.0.1:8000 node scripts/audit-marketing-responsive.mjs
const base = process.env.BASE_URL || "http://127.0.0.1:8000"
const output = process.env.RESPONSIVE_AUDIT_DIR || "artifacts/responsive-audit"
const viewports = [
  [320, 720], [360, 800], [390, 844], [430, 932], [640, 900],
  [768, 1024], [844, 390], [1024, 768], [1280, 800], [1440, 900], [1920, 1080], [2560, 1440],
]
const paths = ["/", "/services", "/portfolio", "/about", "/contact", "/quote", "/blog"]
const browser = await chromium.launch({ headless: true })
const results = []
try {
  await mkdir(output, { recursive: true })
  for (const path of paths) {
    for (const [width, height] of viewports) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" })
      await page.goto(new URL(path, base).href, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      const geometry = await page.evaluate(() => {
        const clipped = [...document.querySelectorAll("main button, main input, main select, main textarea")].flatMap(element => {
          const rect = element.getBoundingClientRect()
          if (!rect.width || !rect.height || element.closest('[aria-hidden="true"]')) return []
          let left = rect.left, right = rect.right
          for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            const style = getComputedStyle(parent)
            if (["hidden", "clip"].includes(style.overflowX)) {
              const bounds = parent.getBoundingClientRect()
              left = Math.max(left, bounds.left); right = Math.min(right, bounds.right)
            }
          }
          const escaped = rect.left < -1 || rect.right > innerWidth + 1
          const cut = right - left < rect.width - 2
          return escaped || cut ? [{ tag: element.tagName, id: element.id, label: element.getAttribute("aria-label") || element.textContent.trim().slice(0, 70), escaped, cut }] : []
        })
        return { viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, clipped }
      })
      const slug = path === "/" ? "home" : path.slice(1).replaceAll("/", "-")
      await page.screenshot({ path: `${output}/${slug}-${width}x${height}.png`, fullPage: true })
      results.push({ path, width, height, ...geometry, pass: geometry.scrollWidth <= width + 1 && !geometry.clipped.length })
      await page.close()
    }
  }
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2))
  const failures = results.filter(result => !result.pass)
  console.log(JSON.stringify({ checked: results.length, failures }, null, 2))
  if (failures.length) process.exitCode = 1
} finally {
  await browser.close()
}
