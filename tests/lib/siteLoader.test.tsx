import { act, render } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { SiteLoader } from "@/components/ui/SiteLoader"
import { beginLoading } from "@/lib/loading"

beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

const mount = () => {
  const view = render(<QueryClientProvider client={new QueryClient()}><SiteLoader /></QueryClientProvider>)
  return view.container.querySelector<HTMLElement>(".site-loader")!
}

it("stays hidden for waits too short to notice", () => {
  const bar = mount()
  let end = () => {}
  act(() => { end = beginLoading() })
  act(() => { vi.advanceTimersByTime(100) })
  act(() => { end() })
  act(() => { vi.advanceTimersByTime(1000) })
  expect(bar).toHaveAttribute("data-state", "idle")
  expect(bar).toHaveAttribute("aria-hidden", "true")
})

it("shows for a real wait, holds briefly, then completes and clears", () => {
  const bar = mount()
  let end = () => {}
  act(() => { end = beginLoading() })
  act(() => { vi.advanceTimersByTime(200) })
  expect(bar).toHaveAttribute("data-state", "loading")
  expect(bar).toHaveAttribute("aria-busy", "true")
  act(() => { end() })
  // Finished almost at once after appearing: it still stays long enough to be read.
  act(() => { vi.advanceTimersByTime(100) })
  expect(bar).toHaveAttribute("data-state", "loading")
  act(() => { vi.advanceTimersByTime(300) })
  expect(bar).toHaveAttribute("data-state", "done")
  act(() => { vi.advanceTimersByTime(500) })
  expect(bar).toHaveAttribute("data-state", "idle")
})

it("counts overlapping work as one wait", () => {
  const bar = mount()
  let first = () => {}, second = () => {}
  act(() => { first = beginLoading(); second = beginLoading() })
  act(() => { vi.advanceTimersByTime(600) })
  act(() => { first(); first() })
  act(() => { vi.advanceTimersByTime(600) })
  expect(bar).toHaveAttribute("data-state", "loading")
  act(() => { second() })
  act(() => { vi.advanceTimersByTime(50) })
  expect(bar).toHaveAttribute("data-state", "done")
})
