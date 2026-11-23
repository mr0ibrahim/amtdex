import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import { useLocation } from "react-router-dom"
import { bindPublicMotion, type PublicMotionApi } from "./bindPublicMotion"

export function PublicMotionEngine() {
  const { pathname } = useLocation()
  const api = useRef<PublicMotionApi | null>(null)
  const first = useRef(true)

  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-public-root]")
    if (!root) return
    try { api.current = bindPublicMotion(root) } catch { api.current = null }
    return () => api.current?.kill()
  }, [])

  useGSAP(() => {
    if (first.current) { first.current = false; return }
    api.current?.onRoute()
  }, [pathname])

  return null
}
