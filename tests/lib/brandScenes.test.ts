import { afterEach, expect, it, vi } from "vitest"
import { mountBrandScenes } from "@/lib/motion/brandScenes"

const state = vi.hoisted(() => ({ reduced: false, desktop: false, cleanup: undefined as (() => void) | undefined, reverts: [] as ReturnType<typeof vi.fn>[], fromTo: vi.fn(), set: vi.fn(), to: vi.fn(), create: vi.fn() }))
vi.mock("gsap", () => ({ gsap: {
  registerPlugin() {},
  matchMedia: () => ({
    add: (_: unknown, callback: (ctx: unknown) => (() => void) | undefined) => { state.cleanup = callback({ conditions: { motion: !state.reduced, desktop: state.desktop }, ignore: (fn: () => void) => fn() }) },
    revert: () => state.cleanup?.(),
  }),
  context: (fn: () => void) => { fn(); const revert = vi.fn(); state.reverts.push(revert); return { revert } },
  fromTo: state.fromTo,
  set: state.set,
  to: state.to,
} }))
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { create: state.create } }))
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
  expect(state.create).toHaveBeenCalledTimes(1)
  root.querySelector("p")!.remove()
  const next = document.createElement("p")
  next.dataset.motion = "rise"
  root.querySelector("section")!.append(next)
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(state.reverts[0]).toHaveBeenCalledTimes(1)
  expect(state.create).toHaveBeenCalledTimes(2)
  next.append("Changed copy")
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(state.create).toHaveBeenCalledTimes(2)
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

it("does not hide first-viewport copy when it is inserted after the initial scan", async () => {
  const root = document.createElement("div")
  root.innerHTML = '<section data-motion-group></section>'
  document.body.append(root)
  const stop = mountBrandScenes(root)
  const headline = document.createElement("h1")
  headline.dataset.motion = "reveal"
  headline.textContent = "Ready immediately"
  headline.getBoundingClientRect = () => ({ top: 40, bottom: 100, left: 0, right: 300, width: 300, height: 60, x: 0, y: 40, toJSON() {} })
  root.querySelector("section")!.append(headline)
  await new Promise(resolve => setTimeout(resolve, 0))
  // Visible copy is never moved to a hidden start state, and its first "enter" is ignored.
  expect(state.set).not.toHaveBeenCalled()
  state.create.mock.calls[0][0].onEnter()
  expect(state.fromTo).not.toHaveBeenCalled()
  expect(headline.style.opacity).toBe("")
  stop()
})

it("reveals public cards without explicit motion markers and avoids nested scene ownership", () => {
  const root = document.createElement("div")
  root.innerHTML = '<main><article class="blog-article-card">Public card</article><div data-stack><h2>Owned by stack</h2></div></main>'
  const article = root.querySelector("article")!
  article.getBoundingClientRect = () => ({ top: 2000, bottom: 2300, left: 0, right: 300, width: 300, height: 300, x: 0, y: 2000, toJSON() {} })
  const stop = mountBrandScenes(root)
  expect(state.create).toHaveBeenCalledTimes(1)
  expect(state.create.mock.calls[0][0].trigger).toBe(article)
  // Off-screen cards wait in their hidden start state.
  expect(state.set).toHaveBeenCalledWith(article, expect.objectContaining({ opacity: 0 }))
  // Cards release inline transforms once settled so CSS hover and touch lift keep working.
  state.create.mock.calls[0][0].onEnter()
  state.fromTo.mock.calls[0][2].onComplete()
  expect(state.set).toHaveBeenLastCalledWith(article, expect.objectContaining({ clearProps: expect.stringContaining("transform") }))
  stop()
})

it("enters from the direction of travel and leaves the opposite way", () => {
  const root = document.createElement("div")
  root.innerHTML = '<main><h2>Section title</h2></main>'
  const heading = root.querySelector("h2")!
  heading.getBoundingClientRect = () => ({ top: 2000, bottom: 2060, left: 0, right: 300, width: 300, height: 60, x: 0, y: 2000, toJSON() {} })
  const stop = mountBrandScenes(root)
  const trigger = state.create.mock.calls[0][0]
  trigger.onEnter()
  expect(state.fromTo.mock.calls[0][1].y).toBeGreaterThan(0)
  trigger.onLeave()
  expect(state.to.mock.calls[0][1].y).toBeLessThan(0)
  trigger.onEnterBack()
  expect(state.fromTo.mock.calls[1][1].y).toBeLessThan(0)
  trigger.onLeaveBack()
  expect(state.to.mock.calls[1][1].y).toBeGreaterThan(0)
  stop()
})
