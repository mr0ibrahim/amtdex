import { createContext, useContext, useEffect, useState, type RefObject } from "react"

export const MotionPlayback = createContext(false)

/** Visibility and the shared pause preference gate timers, not just painted frames. */
export function useMotionPlayback(ref: RefObject<HTMLElement | null>) {
  const paused = useContext(MotionPlayback)
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(() => document.hidden)
  const [reduced, setReduced] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false)
  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(preference?.matches ?? false)
    const visibility = () => setHidden(document.hidden)
    preference?.addEventListener("change", sync)
    document.addEventListener("visibilitychange", visibility)
    const node = ref.current
    let observer: IntersectionObserver | undefined
    if (node && typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)))
      observer.observe(node)
    } else setVisible(true)
    return () => { observer?.disconnect(); preference?.removeEventListener("change", sync); document.removeEventListener("visibilitychange", visibility) }
  }, [ref])
  return !paused && !reduced && !hidden && visible
}
