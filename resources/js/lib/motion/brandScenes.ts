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
      root.querySelectorAll<HTMLElement | SVGElement>("[data-motion-group] [data-motion], [data-motion=\"vector\"], [data-parallax], [data-tilt], [data-progress], [data-stack], [data-process-viewport], [data-scroll-composition]").forEach(el => {
        if (scenes.has(el)) return
        if (!el.hasAttribute("data-motion") && !el.hasAttribute("data-progress") && !el.hasAttribute("data-stack") && !el.hasAttribute("data-scroll-composition") && !desktop) return
        let dispose: (() => void) | undefined
        // Own contexts explicitly so repeated tab changes don't retain detached nodes.
        const scene = gsap.context(() => {
          if (el.hasAttribute("data-motion")) {
            const type = el.dataset.motion
            const from: gsap.TweenVars = type === "vector" ? { opacity: 0, y: 20, scale: .96 } : type === "bar" ? { scaleY: 0 }
              : type === "reveal" ? { opacity: 0, y: 18, clipPath: "inset(0% 0% 100% 0%)" }
              : type === "screen" ? { opacity: 0, y: desktop ? 48 : 24, scale: .97, rotationX: desktop ? 5 : 0, transformPerspective: 1000 }
              : type === "draw" ? { strokeDashoffset: 1, opacity: 0 }
              : type === "signal" ? { opacity: 0, scale: .94 }
              : type === "fade" ? { opacity: 0 } : { opacity: 0, y: desktop ? 34 : 18 }
            gsap.fromTo(el, from, {
              opacity: 1, y: 0, scale: 1, rotationX: 0, ...(type === "reveal" ? { clipPath: "inset(0% 0% 0% 0%)" } : {}), ...(type === "draw" ? { strokeDashoffset: 0 } : {}),
              duration: type === "screen" ? 1 : type === "bar" ? .8 : .7, ease: "power3.out",
              delay: Math.min(Number(el.dataset.motionDelay || 0) / 1000, .55) * (desktop ? 1 : .6),
              immediateRender: false,
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            })
          }
          if (el.dataset.motion === "vector") {
            const strokes = el.querySelectorAll<SVGPathElement>(".vector-trace")
            if (strokes.length) gsap.fromTo(strokes, { strokeDasharray: 1, strokeDashoffset: 1 }, {
              strokeDashoffset: 0, duration: 1.1, ease: "power2.out", stagger: .12,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            })
          }
          if (el.hasAttribute("data-scroll-composition")) {
            const stack = el.querySelector<HTMLElement>(".product-stack")
            if (stack) gsap.fromTo(stack, { y: 0, rotation: -5, scale: 1 }, {
              y: desktop ? -100 : -38, rotation: desktop ? 12 : 7, scale: .9, ease: "none",
              scrollTrigger: { trigger: el, start: "top top+=120", end: "bottom top", scrub: .8 },
            })
          }
          if (el.hasAttribute("data-stack")) {
            const layers = el.querySelectorAll<HTMLElement>("[data-stack-layer]")
            gsap.fromTo(layers, { y: 70, opacity: 0 }, {
              y: 0, opacity: 1, stagger: .13, duration: 1.15, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            })
          }
          if (desktop && el.hasAttribute("data-process-viewport")) {
            const track = el.querySelector<HTMLElement>("[data-process-track]")
            const distance = () => Math.max(0, (track?.scrollWidth || 0) - el.clientWidth)
            if (track && distance() > 0) {
              // RTL starts at the right: translate positively to reveal later cards.
              gsap.fromTo(track, { x: 0 }, {
                x: distance, ease: "none",
                scrollTrigger: { trigger: el, start: "top 30%", end: () => `+=${distance() + 160}`, pin: true, scrub: .65, invalidateOnRefresh: true },
              })
            }
          }
          if (el.hasAttribute("data-progress")) {
            gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el.closest("[data-motion-group]"), start: "top 75%", end: "bottom 65%", scrub: .4 } })
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
