import { PointerHalo } from "@/components/ui/PointerHalo"
import { MotionPlayback } from "@/hooks/useMotionPlayback"
import { useAmbientMotion } from "@/hooks/useAmbientMotion"
import { useEffect, useState } from "react"
import { Icon } from "@/components/ui/Icon"
import { Outlet, useLocation } from "react-router-dom"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { useBrandMotion } from "@/hooks/useBrandMotion"

export function MarketingLayout({ onToast }: { onToast: (m: string) => void }) {
  const { pathname } = useLocation()
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem("amtdex-motion-paused") === "true" } catch { return false }
  })
  const motionRef = useBrandMotion(pathname, paused)
  useAmbientMotion(motionRef, pathname)
  useEffect(() => {
    try { localStorage.setItem("amtdex-motion-paused", String(paused)) } catch { /* Motion preferences work without storage. */ }
  }, [paused])

  return (
    <MotionPlayback value={paused}><div ref={motionRef} data-motion-paused={paused} className="reference-motion-scope brand-motion min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-ink)] selection:text-white">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-3 focus:z-[100] focus:bg-[var(--color-ink)] focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-[13px]"
      >
        تخطي إلى المحتوى
      </a>
      <Header onToast={onToast} />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer onToast={onToast} />
      <PointerHalo />
      <button type="button" className="reference-motion-toggle" aria-pressed={paused} aria-label={paused ? "تشغيل الحركات" : "إيقاف الحركات"} title={paused ? "تشغيل الحركات" : "إيقاف الحركات"} onClick={() => setPaused(value => !value)}><Icon name={paused ? "play" : "pause"} size={16} /><span>{paused ? "تشغيل الحركة" : "إيقاف الحركة"}</span></button>
    </div></MotionPlayback>
  )
}

export function AuthLayout() {
  return (
    <div className="surface-dark min-h-screen bg-[var(--bg)] text-[var(--text)] grid place-items-center px-4 py-10">
      <Outlet />
    </div>
  )
}
