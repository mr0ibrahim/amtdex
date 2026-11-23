import { lazy, Suspense, useEffect, useState } from "react"

const Engine = lazy(() => import("./PublicMotionEngine").then((m) => ({ default: m.PublicMotionEngine })))

/** Loads the GSAP chunk after first paint. The dashboard never mounts this. */
export function PublicMotion() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (import.meta.env.VITEST) return
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let cancel = false
    const id = window.setTimeout(() => { if (!cancel) setReady(true) }, 350)
    return () => { cancel = true; window.clearTimeout(id) }
  }, [])

  if (!ready) return null
  return <Suspense fallback={null}><Engine /></Suspense>
}
