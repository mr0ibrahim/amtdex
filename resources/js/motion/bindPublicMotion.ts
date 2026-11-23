import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export type PublicMotionApi = { kill: () => void; onRoute: () => void }

const cleanups: Array<() => void> = []

function compact() {
  return window.matchMedia("(max-width: 767px)").matches
}

function scan(root: HTMLElement) {
  if (root.dataset.motionPaused === "true") return
  const stage = root.querySelector<HTMLElement>(".route-stage") ?? root
  const small = compact()
  const title = stage.querySelector<HTMLElement>("[data-gsap-title]")
  const lines = title?.querySelectorAll<HTMLElement>(":scope > span")
  if (lines && lines.length) {
    gsap.from(lines, {
      y: small ? 16 : 28,
      autoAlpha: 0,
      duration: small ? 0.45 : 0.7,
      stagger: 0.08,
      ease: "power3.out",
    })
  }
  gsap.from(stage.querySelectorAll("[data-gsap-line]"), {
    y: small ? 12 : 22, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power2.out",
  })
  const mock = stage.querySelector<HTMLElement>("[data-gsap-parallax]")
  const hero = mock?.closest("section")
  if (mock && hero && !small) {
    gsap.to(mock, { y: 48, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } })
  }
  gsap.utils.toArray<HTMLElement>(stage.querySelectorAll("[data-gsap-reveal]")).forEach((el) => {
    gsap.from(el, { y: small ? 14 : 36, autoAlpha: 0, duration: small ? 0.45 : 0.7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%" } })
  })
  stage.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count)
    if (!Number.isFinite(target)) return
    const prefix = el.dataset.countPrefix ?? ""
    const suffix = el.dataset.countSuffix ?? ""
    const decimals = (el.dataset.count ?? "").includes(".") ? 1 : 0
    const state = { n: 0 }
    gsap.to(state, {
      n: target, duration: small ? 0.7 : 1.25, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onUpdate: () => { el.textContent = `${prefix}${state.n.toFixed(decimals)}${suffix}` },
    })
  })
  const bar = stage.querySelector<HTMLElement>("[data-step-progress]")
  if (bar) {
    gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: bar, start: "top 80%", end: "bottom 55%", scrub: true } })
  }
  const pin = stage.querySelector<HTMLElement>("[data-pin-timeline]")
  const track = pin?.querySelector<HTMLElement>("[data-pin-track]")
  const pinBar = pin?.querySelector<HTMLElement>("[data-pin-progress]")
  if (pin && track && !small) {
    const distance = () => Math.max(0, track.scrollWidth - track.clientWidth)
    const rtl = getComputedStyle(track).direction === "rtl"
    gsap.to(track, {
      x: () => (rtl ? distance() : -distance()),
      ease: "none",
      scrollTrigger: { trigger: pin, pin: true, scrub: 0.55, start: "top top", end: () => `+=${distance() + 80}`, invalidateOnRefresh: true },
    })
  }
  if (pin && pinBar) {
    gsap.fromTo(pinBar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: pin, start: "top 70%", end: "bottom 40%", scrub: true } })
  }
}

function magnetic(root: HTMLElement) {
  if (compact()) return
  root.querySelectorAll<HTMLElement>(".brand-cta").forEach((btn) => {
    const move = (event: PointerEvent) => {
      const box = btn.getBoundingClientRect()
      gsap.to(btn, { x: (event.clientX - box.left - box.width / 2) * 0.22, y: (event.clientY - box.top - box.height / 2) * 0.3, duration: 0.28, ease: "power3.out", overwrite: "auto" })
    }
    const reset = () => gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" })
    btn.addEventListener("pointermove", move)
    btn.addEventListener("pointerleave", reset)
    cleanups.push(() => { btn.removeEventListener("pointermove", move); btn.removeEventListener("pointerleave", reset); gsap.set(btn, { clearProps: "transform" }) })
  })
}

function tilt(root: HTMLElement) {
  if (compact() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
  root.querySelectorAll<HTMLElement>(".premium-card").forEach((card) => {
    if (card.dataset.tiltBound === "1") return
    card.dataset.tiltBound = "1"
    const move = (event: PointerEvent) => {
      const box = card.getBoundingClientRect()
      const px = (event.clientX - box.left) / box.width
      const py = (event.clientY - box.top) / box.height
      card.style.setProperty("--spot-x", `${px * 100}%`)
      card.style.setProperty("--spot-y", `${py * 100}%`)
      gsap.to(card, { rotateY: (px - 0.5) * -8, rotateX: (0.5 - py) * -8, transformPerspective: 800, duration: 0.35, ease: "power2.out", overwrite: "auto" })
    }
    const reset = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" })
    card.addEventListener("pointermove", move)
    card.addEventListener("pointerleave", reset)
    cleanups.push(() => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", reset) })
  })
}

export function bindPublicMotion(root: HTMLElement): PublicMotionApi {
  gsap.registerPlugin(ScrollTrigger)
  let page = gsap.context(() => scan(root), root)
  magnetic(root)
  tilt(root)
  return {
    kill() {
      page.revert()
      cleanups.splice(0).forEach((fn) => fn())
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    },
    onRoute() {
      const stage = root.querySelector<HTMLElement>(".route-stage")
      page.revert()
      if (stage) gsap.fromTo(stage, { autoAlpha: 0, y: compact() ? 8 : 18 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", overwrite: true })
      window.setTimeout(() => {
        page = gsap.context(() => scan(root), root)
        tilt(root)
        ScrollTrigger.refresh()
      }, 40)
    },
  }
}
