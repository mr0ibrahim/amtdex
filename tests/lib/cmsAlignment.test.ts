import { expect, it } from "vitest"
import { CMS_DEFAULTS } from "@/cms/defaults"
import { applyVisibility } from "@/cms/visibility"
import { canVisitDashboard } from "@/lib/dashboardAccess"

it("keeps the editor manifest aligned with the supported home sections", () => {
  expect(CMS_DEFAULTS.homeSections.map(section => section.id)).toEqual(["hero", "stats", "gallery", "testimonials", "workflow", "guarantee", "contact"])
})
it("drops retired sections, merges new fields and preserves saved ordering and visibility", () => {
  const defaults = CMS_DEFAULTS.homeSections
  const result = applyVisibility({ ...CMS_DEFAULTS, homeSections: [
    { ...defaults[5], visible: false, fields: { title: "ضمان خاص" } },
    { id: "newsletter", label: "قديم", visible: true, fields: {} },
    defaults[0],
  ] }, true)
  expect(result.homeSections[0].id).toBe("guarantee")
  expect(result.homeSections[0].visible).toBe(false)
  expect(result.homeSections[0].fields.title).toBe("ضمان خاص")
  expect(result.homeSections[0].fields.cta).toBe("تواصل معنا")
  expect(result.homeSections.some(section => section.id === "newsletter")).toBe(false)
  expect(result.homeSections.find(section => section.id === "contact")?.visible).toBe(false)
})
it("keeps hidden navigation editable in preview and absent from public navigation", () => {
  const doc = { ...CMS_DEFAULTS, nav: CMS_DEFAULTS.nav.map(item => ({ ...item, visible: false })) }
  expect(applyVisibility(doc, true).nav.length).toBe(CMS_DEFAULTS.nav.length)
  expect(applyVisibility(doc).nav).toEqual([])
})
it("matches dashboard route roles without granting extra access", () => {
  expect(canVisitDashboard("/dashboard/settings", "editor")).toBe(false)
  expect(canVisitDashboard("/dashboard/blog", "viewer")).toBe(false)
  expect(canVisitDashboard("/dashboard/leads", "author")).toBe(false)
  expect(canVisitDashboard("/dashboard/site", "editor")).toBe(true)
  expect(canVisitDashboard("/dashboard/users", "admin")).toBe(true)
  expect(canVisitDashboard("/dashboard/users")).toBe(false)
})
