import { afterEach, expect, it, vi } from "vitest"
import { mountBrandScenes } from "@/lib/motion/brandScenes"

const state = vi.hoisted(() => ({ reduced: false, desktop: false, cleanup: undefined as (() => void) | undefined, reverts: [] as ReturnType<typeof vi.fn>[], fromTo: vi.fn() }))
vi.mock("gsap", () => ({ gsap: {
  registerPlugin() {},
  matchMedia: () => ({
    add: (_: unknown, callback: (ctx: unknown) => (() => void) | undefined) => { state.cleanup = callback({ conditions: { motion: !state.reduced, desktop: state.desktop }, ignore: (fn: () => void) => fn() }) },
    revert: () => state.cleanup?.(),
  }),
  context: (fn: () => void) => { fn(); const revert = vi.fn(); state.reverts.push(revert); return { revert } },
  fromTo: state.fromTo,
} }))
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }))
afterEach(() => { document.body.innerHTML = ""; state.reduced = false; state.desktop = false; state.reverts = []; vi.clearAllMocks() })

it("keeps reduced-motion content visible without creating scenes", () => {
  state.reduced = true
  const root = document.createElement("div")
  root.innerHTML = '<section data-motion-group><p data-motion="rise">Content</p></section>'
  const stop = mountBrandScenes(root)
  expect(state.fromTo).not.toHaveBeenCalled()
  expect(root.querySelector("p")?.style.opacity).toBe("")
  stop()
})

it("releases removed tab content and observes its replacement exactly once", async () => {
  const root = document.createElement("div")
  root.innerHTML = '<section data-motion-group><p data-motion="rise">First</p></section>'
  document.body.append(root)
  const stop = mountBrandScenes(root)
  expect(state.fromTo).toHaveBeenCalledTimes(1)
  root.querySelector("p")!.remove()
  const next = document.createElement("p")
  next.dataset.motion = "rise"
  root.querySelector("section")!.append(next)
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(state.reverts[0]).toHaveBeenCalledTimes(1)
  expect(state.fromTo).toHaveBeenCalledTimes(2)
  next.append("Changed copy")
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(state.fromTo).toHaveBeenCalledTimes(2)
  stop()
  expect(state.reverts[1]).toHaveBeenCalledTimes(1)
})


it("pins an overflowing desktop process rail in the RTL direction and reverts it", () => {
  state.desktop = true
  const root = document.createElement("div")
  root.innerHTML = '<section data-motion-group><div data-process-viewport><div data-process-track>Steps</div></div></section>'
  const viewport = root.querySelector<HTMLElement>("[data-process-viewport]")!
  const track = root.querySelector<HTMLElement>("[data-process-track]")!
  Object.defineProperty(viewport, "clientWidth", { value: 900 })
  Object.defineProperty(track, "scrollWidth", { value: 1600 })
  const stop = mountBrandScenes(root)
  const [, , target] = state.fromTo.mock.calls[0]
  expect(target.x()).toBe(700)
  expect(target.scrollTrigger.pin).toBe(true)
  expect(target.scrollTrigger.invalidateOnRefresh).toBe(true)
  stop()
  expect(state.reverts[0]).toHaveBeenCalledTimes(1)
})

it("does not pin the process rail on touch-sized layouts", () => {
  const root = document.createElement("div")
  root.innerHTML = '<section data-motion-group><div data-process-viewport><div data-process-track>Steps</div></div></section>'
  const stop = mountBrandScenes(root)
  expect(state.fromTo).not.toHaveBeenCalled()
  stop()
})
