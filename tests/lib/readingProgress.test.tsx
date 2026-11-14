import { Profiler } from "react"
import { act, fireEvent, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ReadingProgress } from "@/components/ui/ReadingProgress"

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe("reading progress", () => {
  it("updates a composited transform without rendering the article again", () => {
    vi.stubGlobal("CSS", { supports: () => false })
    let nextFrame: FrameRequestCallback = () => {}
    vi.stubGlobal("requestAnimationFrame", vi.fn(callback => { nextFrame = callback; return 1 }))
    vi.stubGlobal("cancelAnimationFrame", vi.fn())
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(2000)
    vi.stubGlobal("innerHeight", 1000)
    vi.stubGlobal("scrollY", 500)
    const commits = vi.fn()
    const { container, unmount } = render(<Profiler id="reader" onRender={commits}><ReadingProgress /></Profiler>)
    act(() => nextFrame(0))
    const bar = container.querySelector<HTMLElement>(".reading-progress > div")!
    expect(bar.style.transform).toBe("scaleX(0.5)")
    const rendered = commits.mock.calls.length
    vi.stubGlobal("scrollY", 2000)
    fireEvent.scroll(window)
    act(() => nextFrame(1))
    expect(bar.style.transform).toBe("scaleX(1)")
    expect(commits).toHaveBeenCalledTimes(rendered)
    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })

  it("leaves progress to CSS when native scroll timelines are available", () => {
    vi.stubGlobal("CSS", { supports: () => true })
    const schedule = vi.fn()
    vi.stubGlobal("requestAnimationFrame", schedule)
    const { unmount } = render(<ReadingProgress />)
    expect(schedule).not.toHaveBeenCalled()
    unmount()
  })
})
