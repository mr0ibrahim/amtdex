import { useEffect, useRef } from "react"

/** One-shot, compositor-driven scenes. Content remains visible without animation APIs. */
export function useBrandMotion() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === "undefined" || !Element.prototype.animate) return
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    const compact = window.matchMedia?.("(max-width: 767px)").matches
    const active = new Set<Animation>()
    const paused = new Set<Animation>()
    const played = new WeakSet<Element>()
    const stop = () => { active.forEach(animation => animation.cancel()); active.clear(); paused.clear() }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || played.has(entry.target)) return
        played.add(entry.target)
        observer.unobserve(entry.target)
        if (preference?.matches) return
        entry.target.querySelectorAll<HTMLElement | SVGElement>("[data-motion]").forEach(el => {
          const type = el.dataset.motion
          const delay = Number(el.dataset.motionDelay || 0)
          const keyframes: Keyframe[] = type === "bar"
            ? [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }]
            : type === "draw"
              ? [{ strokeDashoffset: "1", opacity: 0 }, { strokeDashoffset: "0", opacity: 1 }]
              : type === "signal"
                ? [{ opacity: 0, transform: "scale(.88)" }, { opacity: 1, transform: "scale(1)" }]
                : [{ opacity: 0, transform: `translateY(${compact ? 10 : 22}px)` }, { opacity: 1, transform: "translateY(0)" }]
          const animation = el.animate(keyframes, {
            duration: type === "draw" ? 1500 : type === "bar" ? 1100 : 750,
            delay: compact ? delay * .7 : delay,
            easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards",
          })
          active.add(animation)
          animation.addEventListener("finish", () => { active.delete(animation); paused.delete(animation) }, { once: true })
        })
      })
    }, { threshold: .12 })
    root.querySelectorAll("[data-motion-group]").forEach(el => observer.observe(el))
    const preferenceChanged = () => { if (preference?.matches) stop() }
    const visibilityChanged = () => {
      if (document.hidden) active.forEach(animation => {
        if (animation.playState === "running") { paused.add(animation); animation.pause() }
      })
      else { paused.forEach(animation => animation.play()); paused.clear() }
    }
    preference?.addEventListener("change", preferenceChanged)
    document.addEventListener("visibilitychange", visibilityChanged)
    return () => {
      observer.disconnect()
      stop()
      preference?.removeEventListener("change", preferenceChanged)
      document.removeEventListener("visibilitychange", visibilityChanged)
    }
  }, [])
  return ref
}
