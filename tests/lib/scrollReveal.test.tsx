import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useScrollReveal } from "@/hooks/useScrollReveal"

function fixture() {
  const root = document.createElement("div")
  root.innerHTML = '<main><h1>Heading</h1><article class="geo-card"><h3>Card title</h3></article></main>'
  document.body.append(root)
  const heading = root.querySelector("h1")!
  const card = root.querySelector<HTMLElement>("article")!
  vi.spyOn(heading, "getBoundingClientRect").mockReturnValue({ top: 100, bottom: 160, left: 0, width: 300, height: 60 } as DOMRect)
  vi.spyOn(card, "getBoundingClientRect").mockReturnValue({ top: 1200, bottom: 1500, left: 0, width: 300, height: 300 } as DOMRect)
  return { root, heading, card, ref: { current: root } }
}

afterEach(() => { document.body.innerHTML = ""; vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe("scroll reveals", () => {
  it("keeps restored visible content readable and hides upcoming content before observer delivery", () => {
    vi.stubGlobal("CSS", { supports: () => false })
    const { heading, card, ref } = fixture()
    const { unmount } = renderHook(() => useScrollReveal(ref, "/"))
    expect(heading.dataset.reveal).toBe("initial")
    expect(heading.dataset.revealState).toBe("shown")
    expect(card.dataset.revealState).toBe("below")
    expect(card.querySelector("h3")!.hasAttribute("data-reveal")).toBe(false)
    unmount()
    expect(card.hasAttribute("data-reveal-state")).toBe(false)
    expect(ref.current.hasAttribute("data-reveal-mode")).toBe(false)
  })

  it("keeps fallback content visible when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("CSS", { supports: () => false })
    vi.stubGlobal("IntersectionObserver", undefined)
    const { card, ref } = fixture()
    renderHook(() => useScrollReveal(ref, "/"))
    expect(card.hasAttribute("data-reveal-state")).toBe(false)
  })

  it("uses the native timeline without creating visibility observers", () => {
    vi.stubGlobal("CSS", { supports: () => true })
    const observer = vi.fn()
    vi.stubGlobal("IntersectionObserver", observer)
    const { card, ref } = fixture()
    renderHook(() => useScrollReveal(ref, "/services"))
    expect(ref.current.dataset.revealMode).toBe("timeline")
    expect(card.dataset.reveal).toBe("both")
    expect(observer).not.toHaveBeenCalled()
  })
})
