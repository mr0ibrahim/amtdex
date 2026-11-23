import { MotionPlayback } from "@/hooks/useMotionPlayback"
import { useAmbientMotion } from "@/hooks/useAmbientMotion"
import { useEffect, useRef, useState, Suspense } from "react"
import { PageLoader } from "@/components/ui/SiteLoader"
import { Icon } from "@/components/ui/Icon"
import { Outlet, useLocation } from "react-router-dom"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useGeoCards } from "@/hooks/useGeoCards"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { PublicMotion } from "@/motion/PublicMotion"

export function MarketingLayout({ onToast }: { onToast: (m: string) => void }) {
  const { pathname } = useLocation()
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem("amtdex-motion-paused") === "true" } catch { return false }
  })
  const motionRef = useRef<HTMLDivElement>(null)
  useScrollReveal(motionRef, pathname)
  useAmbientMotion(motionRef, pathname)
  useGeoCards(motionRef, pathname)
  useEffect(() => {
    try { localStorage.setItem("amtdex-motion-paused", String(paused)) } catch { /* Motion preferences work without storage. */ }
  }, [paused])

  return (
    <MotionPlayback value={paused}><div ref={motionRef} data-public-root data-motion-paused={paused} className="reference-design-scope reference-motion-scope brand-motion min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-ink)] selection:text-white">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-3 focus:z-[100] focus:bg-[var(--color-ink)] focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-[13px]"
      >
        تخطي إلى المحتوى
      </a>
      <div className="glass-aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="scroll-progress" aria-hidden="true"><i /></div>
      <Header onToast={onToast} />
      <main id="main-content" tabIndex={-1}>
        {/* The header and footer stay in place while the next page's code arrives. */}
        <div className="route-stage"><Suspense fallback={<PageLoader />}><Outlet /></Suspense></div>
      </main>
      <Footer onToast={onToast} />
      <WhatsAppButton />
      <PublicMotion />
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
