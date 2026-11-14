import { describe, expect, it } from "vitest"
import { GEO_VARIANTS, createGeoLayer, lissajousPath, polygonPoints, sinePath, toneOf } from "@/lib/motion/geoLayer"

describe("geometric card layers", () => {
  it("builds a decorative, non-interactive layer for every variant", () => {
    for (const variant of GEO_VARIANTS) {
      const layer = createGeoLayer(variant)
      expect(layer.getAttribute("aria-hidden")).toBe("true")
      expect(layer.dataset.geo).toBe(variant)
      expect(layer.querySelector("svg")).not.toBeNull()
      expect(layer.querySelector("a, button, [tabindex]")).toBeNull()
    }
  })

  it("draws closed curves and loopable waves from their equations", () => {
    expect(lissajousPath(3, 2, Math.PI / 2)).toMatch(/^M[\d. -]+L.*Z$/)
    expect(polygonPoints(6, 90).split(" ")).toHaveLength(6)
    // One wavelength of overscan on both sides lets the wave loop by translating.
    expect(sinePath(10, 200, 60).startsWith("M-200 60")).toBe(true)
  })

  it("picks light strokes for dark surfaces", () => {
    expect(toneOf("rgb(70, 22, 103)")).toBe("dark")
    expect(toneOf("rgb(255, 255, 255)")).toBe("light")
    expect(toneOf("rgba(0, 0, 0, 0)")).toBe("light")
  })
})
