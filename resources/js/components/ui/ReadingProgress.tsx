import { useEffect, useRef } from "react"

/** Keep reading progress out of React's render loop, including the fallback path. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = bar.current
    if (!node || (typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: scroll()"))) return
    let frame = 0
    let distance = 0
    const update = () => {
      frame = 0
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0
      node.style.transform = `scaleX(${progress})`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const measure = () => {
      distance = document.documentElement.scrollHeight - window.innerHeight
      schedule()
    }
    const resize = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : undefined
    resize?.observe(document.documentElement)
    resize?.observe(document.body)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", measure, { passive: true })
    measure()
    return () => {
      cancelAnimationFrame(frame)
      resize?.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", measure)
    }
  }, [])
  return <div className="reading-progress" aria-hidden="true"><div ref={bar} /></div>
}
