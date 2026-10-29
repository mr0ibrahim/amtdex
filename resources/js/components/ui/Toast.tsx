import { useEffect, useRef, useState } from "react"

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const show = (m: string) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    setMsg(m)
    timerRef.current = window.setTimeout(() => {
      setMsg(null)
      timerRef.current = null
    }, 2800)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  const el = msg ? (
    <div aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div
        className="pointer-events-auto bg-[var(--color-ink)] text-white text-[13px] font-medium px-5 py-3 rounded-full shadow-[var(--shadow-toast)]"
        style={{ animation: "toastIn 0.35s cubic-bezier(.16,1,.3,1)" }}
      >
        {msg}
      </div>
    </div>
  ) : null

  return { show, el, msg }
}
