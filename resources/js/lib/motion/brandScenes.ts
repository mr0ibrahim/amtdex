import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/** Isolated ownership also releases scenes removed by CMS updates or tab changes. */
export function mountBrandScenes(root: HTMLElement) {
  const media = gsap.matchMedia()
  media.add({
    motion: "(prefers-reduced-motion: no-preference)",
    desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
  }, context => {
    if (!context.conditions?.motion) return
    const desktop = context.conditions.desktop
    const scenes = new Map<Element, { context: gsap.Context; dispose?: () => void }>()
    const scan = () => {
      scenes.forEach((scene, el) => {
        if (!root.contains(el)) { scene.dispose?.(); scene.context.revert(); scenes.delete(el) }
      })
      root.querySelectorAll<HTMLElement | SVGElement>("[data-motion-group] [data-motion], [data-parallax], [data-tilt]").forEach(el => {
        if (scenes.has(el)) return
        if (!el.hasAttribute("data-motion") && !desktop) return
        let dispose: (() => void) | undefined
        // Own contexts explicitly so repeated tab changes don't retain detached nodes.
        const scene = gsap.context(() => {
          if (el.hasAttribute("data-motion")) {
            const type = el.dataset.motion
            const from: gsap.TweenVars = type === "bar" ? { scaleY: 0 }
              : type === "draw" ? { strokeDashoffset: 1, opacity: 0 }
              : type === "signal" ? { opacity: 0, scale: .94 }
              : type === "fade" ? { opacity: 0 } : { opacity: 0, y: desktop ? 34 : 18 }
            gsap.fromTo(el, from, {
              opacity: 1, y: 0, scale: 1, ...(type === "draw" ? { strokeDashoffset: 0 } : {}),
              duration: type === "bar" ? .95 : .8, ease: "power3.out",
              delay: Math.min(Number(el.dataset.motionDelay || 0) / 1000, .55) * (desktop ? 1 : .6),
              immediateRender: false,
              scrollTrigger: { trigger: el, start: "top 96%", once: true },
            })
          }
          if (desktop && el.hasAttribute("data-parallax")) {
            gsap.fromTo(el, { y: 28 }, {
              y: -28, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
            })
          }
          if (desktop && el.hasAttribute("data-tilt")) {
            const x = gsap.quickTo(el, "rotationY", { duration: .5, ease: "power3.out" })
            const y = gsap.quickTo(el, "rotationX", { duration: .5, ease: "power3.out" })
            const move = (event: Event) => {
              const pointer = event as PointerEvent
              const rect = el.getBoundingClientRect()
              x(((pointer.clientX - rect.left) / rect.width - .5) * 7)
              y(-((pointer.clientY - rect.top) / rect.height - .5) * 7)
            }
            const reset = () => { x(0); y(0) }
            el.addEventListener("pointermove", move)
            el.addEventListener("pointerleave", reset)
            dispose = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", reset) }
          }
        })
        scenes.set(el, { context: scene, dispose })
      })
    }
    const update = () => context.ignore(scan)
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      scenes.forEach(scene => { scene.dispose?.(); scene.context.revert() })
      scenes.clear()
    }
  }, root)
  return () => media.revert()
}
