import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GEO_CARD_SELECTOR } from "@/lib/motion/geoLayer"

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
    // Everything a visitor reads enters on scroll and leaves again in the direction of travel.
    const textTargets = "main h1, main h2, main h3, main :is(h1, h2) + p, main .eyebrow, main .da-kicker, main .reference-section-label, main .reference-section-heading > p, main .brand-page-header-art, main .da-filters, main .hero-actions, main .quote-choice, .site-footer .footer-grid > *, .site-footer .footer-bottom"
    const automaticTargets = `${textTargets}, ${GEO_CARD_SELECTOR}`
    const owners = "[data-motion], [data-tilt], [data-stack], [data-scroll-composition], [data-process-viewport], .project-showcase, .product-scene"
    const CLEAR = "transform,translate,rotate,scale,transformOrigin,opacity,filter"
    /** The state an element leaves to past the top edge: its entry state mirrored vertically. */
    const mirror = (below: gsap.TweenVars): gsap.TweenVars => ({
      ...below,
      ...(typeof below.y === "number" ? { y: -below.y * .8 } : {}),
      ...(typeof below.rotationX === "number" ? { rotationX: -below.rotationX } : {}),
      ...(typeof below.rotation === "number" ? { rotation: -below.rotation } : {}),
      ...(typeof below.skewY === "number" ? { skewY: -below.skewY } : {}),
    })
    /**
     * Direction-aware scroll motion: enter from below when scrolling down and from above
     * when scrolling up; leave upward past the top edge and downward past the bottom edge.
     */
    const inOut = (trigger: Element, targets: gsap.TweenTarget, below: gsap.TweenVars, rest: gsap.TweenVars, visible: boolean, clear = false) => {
      const above = mirror(below)
      // Content already on screen at load stays put; it only animates after it has left once.
      let settled = visible
      const enter = (from: gsap.TweenVars) => {
        if (settled) { settled = false; return }
        gsap.fromTo(targets, from, { ...rest, overwrite: true, ...(clear ? { onComplete: () => { gsap.set(targets, { clearProps: CLEAR }) } } : {}) })
      }
      const leave = (to: gsap.TweenVars) => { settled = false; gsap.to(targets, { ...to, duration: .5, ease: "power2.in", overwrite: true }) }
      if (!visible) gsap.set(targets, below)
      ScrollTrigger.create({
        trigger, start: "top 93%", end: "bottom 7%",
        onEnter: () => enter(below), onEnterBack: () => enter(above),
        onLeave: () => leave(above), onLeaveBack: () => leave(below),
      })
    }
    const progress = root.querySelector<HTMLElement>("[data-scroll-progress]")
    if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .3 } })
    let initialScan = true
    const scan = () => {
      scenes.forEach((scene, el) => {
        if (!root.contains(el)) { scene.dispose?.(); scene.context.revert(); scenes.delete(el) }
      })
      root.querySelectorAll<HTMLElement | SVGElement>("[data-motion-group] [data-motion], [data-motion=\"vector\"], [data-parallax], [data-tilt], [data-progress], [data-stack], [data-process-viewport], [data-scroll-composition], " + automaticTargets).forEach(el => {
        if (scenes.has(el)) return
        const automatic = el.matches(automaticTargets) && !el.hasAttribute("data-motion")
        if (automatic && (el.closest(owners) || el.parentElement?.closest(GEO_CARD_SELECTOR))) return
        const card = el.matches(GEO_CARD_SELECTOR)
        if (!el.hasAttribute("data-motion") && !el.hasAttribute("data-progress") && !el.hasAttribute("data-stack") && !el.hasAttribute("data-scroll-composition") && !automatic && !desktop) return
        const rect = el.getBoundingClientRect()
        const initiallyVisible = (initialScan || window.scrollY === 0) && rect.top < window.innerHeight && rect.bottom > 0
        let dispose: (() => void) | undefined
        // Own contexts explicitly so repeated tab changes don't retain detached nodes.
        const scene = gsap.context(() => {
          if (el.hasAttribute("data-motion") || automatic) {
            const type = el.dataset.motion || (automatic && !card ? "text" : "rise")
            const index = Math.max(0, Array.from(el.parentElement?.children || []).indexOf(el))
            // Cards fan in from their own side of the page; in a single column they alternate.
            const centre = rect.left + rect.width / 2 - window.innerWidth / 2
            const side = Math.abs(centre) < window.innerWidth * .12 ? (desktop ? 0 : index % 2 ? 1 : -1) : Math.sign(centre)
            const blur = desktop ? { filter: "blur(10px)" } : {}
            const below: gsap.TweenVars = type === "vector" ? { opacity: 0, x: desktop ? -44 : 0, y: 20, scale: .96 } : type === "bar" ? { scaleY: 0 }
              : type === "reveal" ? { opacity: 0, y: 18, clipPath: "inset(0% 0% 100% 0%)" }
              : type === "screen" ? { opacity: 0, y: desktop ? 48 : 24, scale: .97, rotationX: desktop ? 5 : 0, transformPerspective: 1000 }
              : type === "draw" ? { strokeDashoffset: 1, opacity: 0 }
              : type === "signal" ? { opacity: 0, scale: .94 }
              : type === "fade" ? { opacity: 0 }
              : type === "text" ? { opacity: 0, y: desktop ? 48 : 34, skewY: desktop ? 3 : 2, ...blur }
              : card ? { opacity: 0, x: side * (desktop ? 56 : 0), y: desktop ? 104 : 64, scale: desktop ? .84 : .88, rotationX: desktop ? 18 : 14, rotation: side * (desktop ? 2.4 : 1.6), transformPerspective: 900, ...blur }
              : { opacity: 0, y: desktop ? 60 : 28 }
            const delay = Math.min(Number(el.dataset.motionDelay || (automatic ? Math.min(index * 90, 450) : 0)) / 1000, .55) * (desktop ? 1 : .6)
            inOut(el, el, below, {
              opacity: 1, x: 0, y: 0, scale: 1, rotationX: 0, rotation: 0, skewY: 0,
              ...(below.filter ? { filter: "blur(0px)" } : {}),
              ...(type === "reveal" ? { clipPath: "inset(0% 0% 0% 0%)" } : {}), ...(type === "draw" ? { strokeDashoffset: 0 } : {}), ...(type === "bar" ? { scaleY: 1 } : {}),
              duration: type === "text" ? .9 : card ? 1.15 : 1, ease: card ? "expo.out" : "power3.out", delay,
            }, initiallyVisible, automatic)
            // The geometric figure drifts and turns with the scroll position.
            const figure = card ? el.querySelector<HTMLElement>(":scope > .geo-layer .geo-figure") : null
            if (figure) {
              const wave = figure.parentElement?.dataset.geo === "wave"
              gsap.fromTo(figure, { yPercent: wave ? 30 : 16, rotation: wave ? 0 : -24 }, {
                yPercent: wave ? -10 : -16, rotation: wave ? 0 : 24, ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: .6 },
              })
            }
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
            if (layers.length) inOut(el, layers, { y: 70, opacity: 0 }, { y: 0, opacity: 1, stagger: .13, duration: 1.15, ease: "power3.out" }, initiallyVisible)
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
      initialScan = false
    }
    const update = () => context.ignore(scan)
    update()
    const observer = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1))) update()
    })
    observer.observe(root, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      scenes.forEach(scene => { scene.dispose?.(); scene.context.revert() })
      scenes.clear()
    }
  }, root)
  return () => media.revert()
}
