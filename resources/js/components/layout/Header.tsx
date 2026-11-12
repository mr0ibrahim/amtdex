import { Icon } from "@/components/ui/Icon"
import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { getBlogUrl, getMainUrl, isBlogSubdomain } from "@/lib/subdomain"

function SiteNavLink({
  to,
  className,
  children,
  onClick,
}: {
  to: string
  className: (props: { isActive: boolean }) => string
  children: React.ReactNode
  onClick?: () => void
}) {
  const onBlog = isBlogSubdomain()
  if (onBlog) {
    const href = getMainUrl(to)
    return (
      <a href={href} onClick={onClick} className={className({ isActive: false })}>
        {children}
      </a>
    )
  }
  return (
    <NavLink to={to} onClick={onClick} className={className}>
      {children}
    </NavLink>
  )
}

function SiteLink({
  to,
  className,
  style,
  children,
  onClick,
}: {
  to: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  onClick?: () => void
}) {
  const onBlog = isBlogSubdomain()
  if (onBlog) {
    const href = getMainUrl(to)
    return (
      <a href={href} onClick={onClick} className={className} style={style}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} onClick={onClick} className={className} style={style}>
      {children}
    </Link>
  )
}

export function Header({ onToast }: { onToast: (m: string) => void }) {
  void onToast
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const prevPath = useRef(loc.pathname)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const onBlog = isBlogSubdomain()

  useEffect(() => {
    if (prevPath.current !== loc.pathname) {
      prevPath.current = loc.pathname
      setOpen(false)
    }
  }, [loc.pathname])

  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [open])

  useEffect(() => {
    if (!open || !menuRef.current) return
    const menu = menuRef.current
    const focusable = menu.querySelectorAll<HTMLElement>("a, button:not([disabled])")
    focusable[0]?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    menu.addEventListener("keydown", trap as unknown as EventListener)
    return () => menu.removeEventListener("keydown", trap as unknown as EventListener)
  }, [open])

  return (
    <>
      <div className="hidden md:block border-b border-[var(--color-border)] text-[12px] text-[var(--color-text-muted)]">
        <div className="page-container page-container--wide h-9 flex items-center justify-between gap-6">
          <span>جميع الأنظمة تعمل — 99.99% uptime</span>
          <span className="hidden lg:inline">Amtdex — نبني حلولك البرمجية من الفكرة للإطلاق</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <nav className="page-container page-container--wide h-16 sm:h-[72px] flex items-center justify-between gap-4 sm:gap-6" aria-label="التنقل">
          <div className="flex items-center gap-8 h-full">
            <SiteLink to="/" className="flex items-center gap-2.5 shrink-0">
              <span className="size-2 bg-[var(--color-gold)] shrink-0" aria-hidden />
              <span className="font-display font-semibold text-[18px] text-[var(--color-ink)]">
                AMTDEX
              </span>
            </SiteLink>
            <div className="hidden lg:flex items-center gap-6 h-full">
              <SiteNavLink to="/services" className={({ isActive }) => `site-nav ${isActive ? "is-active" : ""}`}>
                الخدمات
              </SiteNavLink>
              <SiteNavLink to="/portfolio" className={({ isActive }) => `site-nav ${isActive ? "is-active" : ""}`}>
                أعمالنا
              </SiteNavLink>
              {onBlog ? (
                <NavLink to="/" className="site-nav is-active">
                  المدونة
                </NavLink>
              ) : (
                <a href={getBlogUrl("/")} className="site-nav">
                  المدونة
                </a>
              )}
              <SiteLink to="/services" className="site-nav">
                التقنيات
              </SiteLink>
              <SiteNavLink to="/about" className={({ isActive }) => `site-nav ${isActive ? "is-active" : ""}`}>
                من نحن
              </SiteNavLink>
            </div>
          </div>

          {/* Desktop right — لوحة التحكم + تواصل + عرض سعر */}
          <div className="hidden lg:flex items-center gap-2.5">
            <SiteLink to="/dashboard" className="site-nav">
              لوحة التحكم
            </SiteLink>
            <SiteLink to="/contact" className="site-nav">
              تواصل معنا
            </SiteLink>
            <SiteLink to="/quote" className="btn btn-ink brand-cta">
              اطلب عرض سعر
            </SiteLink>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <SiteLink to="/quote" className="btn btn-ink min-h-9 px-3 text-[12px]">
              عرض سعر
            </SiteLink>
            <button
              ref={toggleRef}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "إغلاق" : "فتح القائمة"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="size-10 grid place-items-center border border-[var(--color-ink)] bg-[var(--color-bg)]"
            >
              <Icon name={open ? "close" : "menu"} size={19} />
            </button>
          </div>
        </nav>

        {open && (
          <div id="mobile-menu" ref={menuRef} className="da-menu lg:hidden" style={{ animation: "fadeIn 0.2s ease" }}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-display font-semibold">AMTDEX</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="إغلاق" className="size-10 grid place-items-center border border-white/20">
                <Icon name="close" size={18} />
              </button>
            </div>
            <SiteNavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "is-on" : ""}>الرئيسية</SiteNavLink>
            <SiteNavLink to="/services" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "is-on" : ""}>الخدمات</SiteNavLink>
            <SiteNavLink to="/portfolio" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "is-on" : ""}>أعمالنا</SiteNavLink>
            {onBlog ? (
              <NavLink to="/" onClick={() => setOpen(false)} className="is-on">المدونة</NavLink>
            ) : (
              <a href={getBlogUrl("/")} onClick={() => setOpen(false)}>المدونة</a>
            )}
            <SiteLink to="/services" onClick={() => setOpen(false)}>التقنيات</SiteLink>
            <SiteNavLink to="/pricing" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "is-on" : ""}>الأسعار</SiteNavLink>
            <SiteNavLink to="/about" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "is-on" : ""}>من نحن</SiteNavLink>
            <SiteNavLink to="/contact" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "is-on" : ""}>تواصل</SiteNavLink>
            <SiteNavLink to="/dashboard" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "is-on" : ""}>لوحة التحكم</SiteNavLink>
            <SiteLink to="/login" onClick={() => setOpen(false)}>تسجيل الدخول</SiteLink>
            <SiteLink to="/quote" onClick={() => setOpen(false)} className="btn btn-ink brand-cta" style={{ marginTop: 16, width: "100%" }}>اطلب عرض سعر</SiteLink>
          </div>
        )}
      </header>
    </>
  )
}
