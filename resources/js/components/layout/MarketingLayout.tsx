import { Outlet } from "react-router-dom"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"

export function MarketingLayout({ onToast }: { onToast: (m: string) => void }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-ink)] selection:text-white">
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
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-lavender)]/40 grid place-items-center px-4 py-10">
      <Outlet />
    </div>
  )
}
