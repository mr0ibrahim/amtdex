import { useContext, useEffect, useRef } from "react"
import { MotionPlayback } from "@/hooks/useMotionPlayback"

/** Fine-pointer enhancement; retains the native cursor and never captures input. */
export function PointerHalo() {
  const paused = useContext(MotionPlayback)
  const ring = useRef<HTMLSpanElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const media = window.matchMedia?.("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
    let stop: (() => void) | undefined
    const setup = () => {
      stop?.(); stop = undefined
      const halo = ring.current, point = dot.current
      if (!halo || !point || paused || !media?.matches) return
      let frame = 0, x = 0, y = 0, targetX = 0, targetY = 0, initialized = false
      const hide = () => { halo.style.opacity = "0"; point.style.opacity = "0"; cancelAnimationFrame(frame); frame = 0; initialized = false }
      const tick = () => {
        frame = 0
        x += (targetX - x) * .15; y += (targetY - y) * .15
        halo.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`
        if (Math.abs(targetX - x) + Math.abs(targetY - y) > .2) frame = requestAnimationFrame(tick)
      }
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return
        targetX = event.clientX; targetY = event.clientY
        if (!initialized) { x = targetX; y = targetY; initialized = true }
        halo.style.opacity = "1"; point.style.opacity = "1"
        point.style.transform = `translate3d(${targetX}px,${targetY}px,0) translate(-50%,-50%)`
        halo.dataset.interactive = String(event.target instanceof Element && !!event.target.closest("a,button,input,select,textarea"))
        if (!frame) frame = requestAnimationFrame(tick)
      }
      const visibility = () => { if (document.hidden) hide() }
      document.addEventListener("pointermove", move, { passive: true })
      document.documentElement.addEventListener("pointerleave", hide)
      document.addEventListener("visibilitychange", visibility)
      window.addEventListener("blur", hide)
      stop = () => { hide(); document.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", hide); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("blur", hide) }
    }
    setup(); media?.addEventListener("change", setup)
    return () => { stop?.(); media?.removeEventListener("change", setup) }
  }, [paused])
  return <div aria-hidden="true"><span ref={ring} className="reference-pointer-ring" /><span ref={dot} className="reference-pointer-dot" /></div>
}
