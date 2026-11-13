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
    scenes ??= import("@/lib/motion/brandScenes")
    void scenes.then(({ mountBrandScenes }) => {
      if (!disposed) revert = mountBrandScenes(root)
    }).catch(() => { /* Motion is progressive enhancement. */ })
    return () => { disposed = true; revert?.() }
  }, [routeKey])
  return ref
}
