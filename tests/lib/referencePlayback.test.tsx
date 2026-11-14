import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { AnimatedBrief, briefPhrases } from "@/components/ui/AnimatedBrief"
import { ExperienceStudio } from "@/pages/Home/ExperienceStudio"
const state = vi.hoisted(() => ({ running: true }))
vi.mock("@/hooks/useMotionPlayback", async importOriginal => ({ ...await importOriginal<object>(), useMotionPlayback: () => state.running }))
vi.mock("@/cms/PublicLink", async () => ({ PublicLink: (await import("react-router-dom")).Link }))
beforeEach(() => {
  vi.useFakeTimers(); state.running = true
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })
it("types and deletes at the reference cadence and freezes when playback stops", () => {
  const view = render(<MemoryRouter><AnimatedBrief /></MemoryRouter>)
  expect(screen.getByText(briefPhrases[0])).toBeInTheDocument()
  act(() => { vi.advanceTimersByTime(2000) })
  act(() => { vi.advanceTimersByTime(50) })
  expect(view.container.querySelector('.reference-brief-typing')?.textContent).toBe(briefPhrases[0].slice(0, -1))
  state.running = false
  view.rerender(<MemoryRouter><AnimatedBrief /></MemoryRouter>)
  const previous = view.container.querySelector('.reference-brief-typing')?.textContent
  act(() => { vi.advanceTimersByTime(5000) })
  expect(view.container.querySelector('.reference-brief-typing')?.textContent).toBe(previous)
  view.unmount()
  expect(vi.getTimerCount()).toBe(0)
})
it("rotates the project deck every five seconds and pauses for keyboard interaction", () => {
  render(<MemoryRouter><ExperienceStudio /></MemoryRouter>)
  expect(screen.getByRole('tab', { name: /متجر إلكتروني/ })).toHaveAttribute('aria-selected', 'true')
  act(() => { vi.advanceTimersByTime(5000) })
  const operations = screen.getByRole('tab', { name: /نظام أعمال/ })
  expect(operations).toHaveAttribute('aria-selected', 'true')
  fireEvent.focus(operations)
  act(() => { vi.advanceTimersByTime(10000) })
  expect(operations).toHaveAttribute('aria-selected', 'true')
})
