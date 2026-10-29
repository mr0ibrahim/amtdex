import { Icon } from "@/components/ui/Icon"
import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"

export function Header({ onToast }: { onToast: (m: string) => void }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const prevPath = useRef(loc.pathname)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

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
        <nav className="mx-auto max-w-[1280px] xl:max-w-[1440px] px-4 sm:px-6 lg:px-10 h-16 sm:h-[75.5px] flex items-center justify-between gap-4 sm:gap-6" aria-label="التنقل">
          <div className="flex items-center gap-7 h-full">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <span className="size-2.5 rounded-full bg-[var(--color-primary)] shrink-0" aria-hidden />
              <span className="font-extrabold text-[18px] tracking-[-0.5px] text-[var(--color-ink)]" style={{ fontFamily: "var(--font-display)" }}>
                AMTDEX
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-[22px]">
              <NavLink to="/services" className={({ isActive }) => `text-[13.5px] font-medium ${isActive ? "text-[var(--color-ink)] font-semibold" : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"}`}>
                الخدمات
              </NavLink>
              <NavLink to="/portfolio" className={({ isActive }) => `text-[13.5px] font-medium ${isActive ? "text-[var(--color-ink)] font-semibold" : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"}`}>
                أعمالنا
              </NavLink>
              <Link to="/services" className="text-[13.5px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-ink)]">
                التقنيات
              </Link>
              <NavLink to="/about" className={({ isActive }) => `text-[13.5px] font-medium ${isActive ? "text-[var(--color-ink)] font-semibold" : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"}`}>
                من نحن
              </NavLink>
            </div>
          </div>

          {/* Desktop right — يطابق المرجع: تواصل نص + CTA غامق مع سهم */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link to="/contact" className="text-[13.5px] font-semibold text-[var(--color-ink)] hover:opacity-70 transition-opacity">
              تواصل معنا
            </Link>
            <Link to="/quote" className="inline-flex items-center gap-2 text-white text-[13.5px] font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity" style={{ background: "var(--gradient-primary)" }}>
              اطلب عرض سعر <span aria-hidden>←</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/quote" className="bg-[var(--color-ink)] text-white text-[12px] font-semibold px-4 py-2 rounded-full">
              عرض سعر
            </Link>
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
              <NavLink to="/" className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                الرئيسية
              </NavLink>
              <NavLink to="/services" className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                الخدمات
              </NavLink>
              <NavLink to="/portfolio" className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                أعمالنا
              </NavLink>
              <NavLink to="/pricing" className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                الأسعار
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                من نحن
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)]"}`}>
                تواصل
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => `py-3 px-3 rounded-xl text-[15px] font-medium border mt-1 ${isActive ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "border-[var(--color-border)] hover:bg-[var(--color-lavender)]"}`}>
                لوحة التحكم — تجريبي
              </NavLink>
              <button onClick={() => onToast("سيتم فتح تسجيل الدخول عند ربط Laravel")} className="mt-2 w-full py-3 rounded-full border border-[var(--color-border)] font-medium">
                تسجيل الدخول
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
