import { useEffect, useRef } from "react"

/** Scroll-scrubbed perspective and opposing rows, limited to this gallery. */
export function useGalleryMotion() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    const update = () => {
      frame = 0
      if (preference.matches) {
        ["--gallery-tilt", "--gallery-turn", "--gallery-travel"].forEach(key => el.style.removeProperty(key))
        return
      }
      if (document.hidden) return
      const { top, height, bottom } = el.getBoundingClientRect()
      const viewport = window.innerHeight
      if (bottom < 0 || top > viewport) return
      const progress = Math.min(1, Math.max(0, (viewport - top) / (viewport + height)))
      const compact = window.innerWidth < 768
      const entrance = Math.max(0, 1 - progress / 0.55)
      el.style.setProperty("--gallery-tilt", `${entrance * (compact ? 7 : 15)}deg`)
      el.style.setProperty("--gallery-turn", `${entrance * (compact ? -3 : -9)}deg`)
      el.style.setProperty("--gallery-travel", `${(progress - 0.5) * (compact ? 220 : 760)}px`)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    preference.addEventListener("change", schedule)
    document.addEventListener("visibilitychange", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      preference.removeEventListener("change", schedule)
      document.removeEventListener("visibilitychange", schedule)
    }
  }, [])
  return ref
}
