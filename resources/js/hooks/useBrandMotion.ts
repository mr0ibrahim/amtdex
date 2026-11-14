import { useEffect, useRef } from "react"

let scenes: Promise<typeof import("@/lib/motion/brandScenes")> | undefined

/** Load motion only inside the public layout; leave readable HTML on failure. */
export function useBrandMotion(routeKey = "") {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    let disposed = false
    let revert: (() => void) | undefined
    const start = () => {
      if (disposed) return
      scenes ??= import("@/lib/motion/brandScenes")
      void scenes.then(({ mountBrandScenes }) => {
        if (!disposed) revert = mountBrandScenes(root)
      }).catch(() => { /* Readable content does not depend on motion. */ })
    }
    const idle = typeof window.requestIdleCallback === "function"
    const job = idle ? window.requestIdleCallback(start, { timeout: 1000 }) : window.setTimeout(start, 100)
    return () => {
      disposed = true
      if (idle) window.cancelIdleCallback(job); else window.clearTimeout(job)
      revert?.()
    }
  }, [routeKey])
  return ref
}
