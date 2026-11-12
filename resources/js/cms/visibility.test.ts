import { describe, expect, it } from "vitest"
import { CMS_DEFAULTS } from "./defaults"
import { applyVisibility, pageIsListed } from "./visibility"

describe("page visibility", () => {
  it("hides a page that the server omitted and drops it from every nav list", () => {
    const doc = applyVisibility({
      ...CMS_DEFAULTS,
      pages: CMS_DEFAULTS.pages.filter((page) => page.path !== "/about"),
      nav: CMS_DEFAULTS.nav.filter((item) => item.to !== "/about"),
    })
    expect(pageIsListed(doc.pages, "/about", false)).toBe(false)
    expect(pageIsListed(doc.pages, "/services", false)).toBe(true)
    expect(doc.nav.some((item) => item.to === "/about")).toBe(false)
    expect(pageIsListed(doc.pages, "/dashboard", false)).toBe(false)
    expect(pageIsListed(doc.pages, "/login", false)).toBe(false)
  })
})
