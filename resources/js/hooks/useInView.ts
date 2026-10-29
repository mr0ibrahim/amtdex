import { useEffect, useRef, useState } from "react"

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(() =>
    typeof IntersectionObserver === "undefined" ||
    (typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches),
  )

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    const reveal = () => { if (preference?.matches) setVisible(true) }
    preference?.addEventListener("change", reveal)
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      return () => preference?.removeEventListener("change", reveal)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      preference?.removeEventListener("change", reveal)
    }
  }, [threshold])

  return [ref, visible] as const
}
