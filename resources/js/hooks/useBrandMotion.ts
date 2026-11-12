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
    if (!preference?.matches) root.classList.add("motion-ready")
    const paused = new Set<Animation>()
    const played = new WeakSet<Element>()
    const stop = () => { active.forEach(animation => animation.cancel()); active.clear(); paused.clear() }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visible.add(entry.target)
          play(entry.target)
        } else {
          visible.delete(entry.target)
        }
      })
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" })
    const seen = new WeakSet<Element>()
    const visible = new Set<Element>()
    const play = (group: Element) => {
      if (preference?.matches) return
      group.querySelectorAll<HTMLElement | SVGElement>("[data-motion]").forEach(el => {
        if (played.has(el)) return
        played.add(el)
        const type = el.dataset.motion
        const delay = Number(el.dataset.motionDelay || 0)
        const rise = compact ? 18 : 36
        const keyframes: Keyframe[] = type === "bar"
          ? [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }]
          : type === "draw"
            ? [{ strokeDashoffset: "1", opacity: 0 }, { strokeDashoffset: "0", opacity: 1 }]
            : type === "fade"
              ? [{ opacity: 0 }, { opacity: 1 }]
              : type === "signal"
                ? [{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1)" }]
                : [{ opacity: 0, transform: `translateY(${rise}px)` }, { opacity: 1, transform: "translateY(0)" }]
        const animation = el.animate(keyframes, {
          duration: type === "draw" ? 1500 : type === "bar" ? 1100 : 1250,
          delay: compact ? delay * .7 : delay,
          easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
          fill: "forwards",
        })
        active.add(animation)
        animation.addEventListener("finish", () => { active.delete(animation); paused.delete(animation) }, { once: true })
      })
    }
    const scan = () => {
      root.querySelectorAll("[data-motion-group]").forEach(el => {
        if (seen.has(el)) return
        seen.add(el)
        observer.observe(el)
      })
      visible.forEach(play)
    }
    scan()
    const mutations = typeof MutationObserver === "undefined" ? null : new MutationObserver(scan)
    mutations?.observe(root, { childList: true, subtree: true })
    const preferenceChanged = () => {
      if (preference?.matches) {
        root.classList.remove("motion-ready")
        stop()
      }
    }
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
      mutations?.disconnect()
      root.classList.remove("motion-ready")
      stop()
      preference?.removeEventListener("change", preferenceChanged)
      document.removeEventListener("visibilitychange", visibilityChanged)
    }
  }, [])
  return ref
}
