import { cleanup, render } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { useBrandMotion } from "@/hooks/useBrandMotion"

const originalAnimate = Object.getOwnPropertyDescriptor(Element.prototype, "animate")

function Scene() {
  const ref = useBrandMotion()
  return <div ref={ref}><section data-motion-group><div data-motion="rise">Content</div></section></div>
}
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  if (originalAnimate) Object.defineProperty(Element.prototype, "animate", originalAnimate)
  else Reflect.deleteProperty(Element.prototype, "animate")
})

it("never hides content or starts animation with reduced motion", () => {
  vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
  const animate = vi.fn()
  vi.stubGlobal("IntersectionObserver", undefined)
  Object.defineProperty(Element.prototype, "animate", { value: animate, configurable: true })
  const view = render(<Scene />)
  expect(view.getByText("Content")).toBeVisible()
  expect(animate).not.toHaveBeenCalled()
})

it("plays an entering scene once and cancels its animation on unmount", () => {
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }))
  let notify: IntersectionObserverCallback
  const disconnect = vi.fn()
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { notify = callback }
    observe() {}
    unobserve() {}
    disconnect = disconnect
  })
  const cancel = vi.fn()
  const animate = vi.fn(() => ({ cancel, addEventListener() {} }))
  Object.defineProperty(Element.prototype, "animate", { value: animate, configurable: true })
  const view = render(<Scene />)
  const entry = { target: view.container.querySelector("section"), isIntersecting: true } as unknown as IntersectionObserverEntry
  notify!([entry], {} as IntersectionObserver)
  notify!([entry], {} as IntersectionObserver)
  expect(animate).toHaveBeenCalledTimes(1)
  view.unmount()
  expect(cancel).toHaveBeenCalledTimes(1)
  expect(disconnect).toHaveBeenCalled()
})
