import "@testing-library/jest-dom/vitest"

// jsdom lacks IntersectionObserver — stub it
class MockIntersectionObserver implements IntersectionObserver {
  root: Element | null = null
  rootMargin = ""
  scrollMargin = ""
  thresholds: ReadonlyArray<number> = []
  constructor(_cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
}
// @ts-ignore — jsdom global
if (typeof globalThis.IntersectionObserver === "undefined") {
  // @ts-ignore
  globalThis.IntersectionObserver = MockIntersectionObserver
}

// jsdom warns on scrollTo — silence it
if (typeof window !== "undefined") {
  // @ts-ignore
  window.scrollTo = () => {}
}
