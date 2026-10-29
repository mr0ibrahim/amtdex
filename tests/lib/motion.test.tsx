import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useInView } from "@/hooks/useInView"

afterEach(() => vi.unstubAllGlobals())

describe("motion accessibility fallbacks", () => {
  it("keeps content visible when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined)
    const { result } = renderHook(() => useInView())
    expect(result.current[1]).toBe(true)
  })

  it("shows content immediately when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener() {}, removeEventListener() {} })))
    const { result } = renderHook(() => useInView())
    expect(result.current[1]).toBe(true)
  })
})
