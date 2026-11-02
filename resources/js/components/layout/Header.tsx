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
      <div className="hidden md:flex h-8 bg-[var(--color-ink)] text-white/70 text-[11px] tracking-wide items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> جميع الأنظمة تعمل — 99.99% uptime
        </span>
        <span className="hidden lg:inline opacity-40">|</span>
        <span className="hidden lg:inline">Amtdex — نبني حلولك البرمجية من الفكرة للإطلاق</span>
      </div>
      <header className="sticky top-0 z-40 backdrop-blur-[14px] bg-[var(--color-bg)]/95 border-b border-[var(--color-border)]">
        <nav className="page-container page-container--wide h-16 sm:h-[76px] flex items-center justify-between gap-4 sm:gap-6" aria-label="التنقل">
          <div className="flex items-center gap-7 h-full">
            <SiteLink to="/" className="flex items-center gap-2.5 shrink-0 group">
              <span className="size-2.5 rounded-full bg-[var(--color-primary)] shrink-0" aria-hidden />
              <span className="font-display font-extrabold text-[18px] tracking-[-0.5px] text-[var(--color-ink)]">
                AMTDEX
              </span>
            </SiteLink>
            <div className="hidden lg:flex items-center gap-[22px]">
              <SiteNavLink to="/services" className={({ isActive }) => `text-[13.5px] font-medium ${isActive ? "text-[var(--color-ink)] font-semibold" : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"}`}>
                الخدمات
              </SiteNavLink>
              <SiteNavLink to="/portfolio" className={({ isActive }) => `text-[13.5px] font-medium ${isActive ? "text-[var(--color-ink)] font-semibold" : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"}`}>
                أعمالنا
              </SiteNavLink>
              {onBlog ? (
                <NavLink to="/" className="text-[13.5px] font-semibold text-[var(--color-ink)] transition-colors">
                  المدونة
                </NavLink>
              ) : (
                <a href={getBlogUrl("/")} className="text-[13.5px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-ink)] transition-colors">
                  المدونة
                </a>
              )}
              <SiteLink to="/services" className="text-[13.5px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-ink)]">
                التقنيات
              </SiteLink>
              <SiteNavLink to="/about" className={({ isActive }) => `text-[13.5px] font-medium ${isActive ? "text-[var(--color-ink)] font-semibold" : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"}`}>
                من نحن
              </SiteNavLink>
            </div>
          </div>

          {/* Desktop right — لوحة التحكم + تواصل + عرض سعر */}
          <div className="hidden lg:flex items-center gap-2.5">
            <SiteLink to="/dashboard" className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-ink)] px-3 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-ink)] transition-all">
              لوحة التحكم
            </SiteLink>
            <SiteLink to="/contact" className="text-[13.5px] font-semibold text-[var(--color-ink)] hover:opacity-70 transition-opacity">
              تواصل معنا
            </SiteLink>
            <SiteLink to="/quote" className="inline-flex items-center gap-2 text-white text-[13.5px] font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity bg-gradient-primary">
              اطلب عرض سعر <span aria-hidden>←</span>
            </SiteLink>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <SiteLink to="/quote" className="bg-[var(--color-ink)] text-white text-[12px] font-semibold px-4 py-2 rounded-full">
              عرض سعر
            </SiteLink>
            <button
              ref={toggleRef}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "إغلاق" : "فتح القائمة"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="size-9 grid place-items-center rounded-full border border-[var(--color-border)] bg-white text-[14px]"
            >
              <Icon name={open ? "close" : "menu"} size={19} />
            </button>
          </div>
        </nav>

        {open && (
          <div id="mobile-menu" ref={menuRef} className="lg:hidden border-t border-[var(--color-border)] bg-white px-4 py-4" style={{ animation: "fadeIn 0.2s ease" }}>
            <div className="grid gap-1">
              <SiteNavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                الرئيسية
              </SiteNavLink>
              <SiteNavLink to="/services" onClick={() => setOpen(false)} className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                الخدمات
              </SiteNavLink>
              <SiteNavLink to="/portfolio" onClick={() => setOpen(false)} className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                أعمالنا
              </SiteNavLink>
              {onBlog ? (
                <NavLink to="/" onClick={() => setOpen(false)} className="py-3 px-3 rounded-xl text-[15px] font-medium bg-[var(--color-ink)] text-white">
                  المدونة
                </NavLink>
              ) : (
                <a href={getBlogUrl("/")} onClick={() => setOpen(false)} className="py-3 px-3 rounded-xl text-[15px] font-medium hover:bg-[var(--color-lavender)]">
                  المدونة
                </a>
              )}
              <SiteNavLink to="/pricing" onClick={() => setOpen(false)} className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                الأسعار
              </SiteNavLink>
              <SiteNavLink to="/about" onClick={() => setOpen(false)} className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                من نحن
              </SiteNavLink>
              <SiteNavLink to="/contact" onClick={() => setOpen(false)} className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                تواصل
              </SiteNavLink>
              <SiteNavLink to="/dashboard" onClick={() => setOpen(false)} className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium border mt-1 ${isActive ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "border-[var(--color-border)] hover:bg-[var(--color-lavender)]"}`}>
                لوحة التحكم
              </SiteNavLink>
              <SiteLink to="/login" onClick={() => setOpen(false)} className="mt-2 text-center w-full py-3 rounded-full border border-[var(--color-border)] font-medium text-[13px] hover:bg-[var(--color-lavender)] transition-colors">
                تسجيل الدخول
              </SiteLink>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
