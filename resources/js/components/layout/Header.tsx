import { Icon } from "@/components/ui/Icon"
import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { getBlogUrl, getMainUrl, isBlogSubdomain } from "@/lib/subdomain"
import { prefetchRoute } from "@/routing/lifecycle"
import { pageIsListed, useCms } from "@/cms/useCms"

function SiteNavLink({
  to,
  className,
  children,
  onClick,
  onIntent,
}: {
  to: string
  className: (props: { isActive: boolean }) => string
  children: React.ReactNode
  onClick?: () => void
  onIntent?: () => void
}) {
  const onBlog = isBlogSubdomain()
  if (onBlog) {
    const href = getMainUrl(to)
    return (
      <a href={href} onClick={onClick} onMouseEnter={onIntent} onFocus={onIntent} className={className({ isActive: false })}>
        {children}
      </a>
    )
  }
  return (
    <NavLink end={to === "/"} to={to} onClick={onClick} onMouseEnter={onIntent} onFocus={onIntent} className={className}>
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
  onIntent,
}: {
  to: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  onClick?: () => void
  onIntent?: () => void
}) {
  const onBlog = isBlogSubdomain()
  if (onBlog) {
    const href = getMainUrl(to)
    return (
      <a href={href} onClick={onClick} onMouseEnter={onIntent} onFocus={onIntent} className={className} style={style}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} onClick={onClick} onMouseEnter={onIntent} onFocus={onIntent} className={className} style={style}>
      {children}
    </Link>
  )
}

export function Header({ onToast }: { onToast: (m: string) => void }) {
  void onToast
  const [open, setOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const [hidden, setHidden] = useState(false)
  const loc = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef(open)
  const onBlog = isBlogSubdomain()
  const { nav, pages } = useCms()
  const menu = nav.filter((item, index) => item.visible && pageIsListed(pages, item.to, false)
    && nav.findIndex((candidate) => candidate.visible && candidate.to === item.to) === index)
  const mobile = menu.filter((item) => item.to !== "/" && item.id !== "quote")
  const desktop = menu.filter((item) => !["contact", "quote", "pricing"].includes(item.id))
  const homeListed = pageIsListed(pages, "/", false)
  const contactListed = pageIsListed(pages, "/contact", false)
  const quoteListed = pageIsListed(pages, "/quote", false)

  useEffect(() => {
    openRef.current = open
    if (open) setHidden(false)
  }, [open])

  useEffect(() => {
    setOpen(false)
    setHidden(false)
    setCondensed(window.scrollY > 16)
  }, [loc.key])

  useEffect(() => {
    const closeOnDesktop = () => { if (window.innerWidth >= 1200) setOpen(false) }
    window.addEventListener("resize", closeOnDesktop)
    return () => window.removeEventListener("resize", closeOnDesktop)
  }, [])

  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const nextCondensed = y > 16
        let nextHidden = false
        if (!reduce && !openRef.current && y > last + 6 && y > 80) nextHidden = true
        if (y < last - 6 || y < 48) nextHidden = false
        last = y
        setCondensed((value) => (value === nextCondensed ? value : nextCondensed))
        setHidden((value) => (value === nextHidden ? value : nextHidden))
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const menu = menuRef.current
    const toggle = toggleRef.current
    const items = () => {
      const links = menu ? [...menu.querySelectorAll<HTMLElement>("a, button:not([disabled])")] : []
      return toggle ? [...links, toggle] : links
    }
    items()[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        toggle?.focus()
        return
      }
      if (event.key !== "Tab") return
      const list = items()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const renderItem = (item: (typeof menu)[number], onClick?: () => void) => {
    const className = ({ isActive }: { isActive: boolean }) => `site-nav${isActive ? " is-active" : ""}`
    if (item.id === "blog" && onBlog) {
      return <Link key={item.id} to="/" onClick={onClick} aria-current={loc.pathname === "/" ? "page" : undefined} className="site-nav is-active">{item.label}</Link>
    }
    if (item.id === "blog") {
      return (
        <a key={item.id} href={getBlogUrl("/")} className="site-nav" onClick={onClick}>
          {item.label}
        </a>
      )
    }
    return (
      <SiteNavLink
        key={item.id}
        to={item.id === "blog" ? "/" : item.to}
        onClick={onClick}
        onIntent={() => prefetchRoute(item.to)}
        className={className}
      >
        {item.label}
      </SiteNavLink>
    )
  }

  return (
    <>
      <header className={`site-header is-in${condensed ? " is-condensed" : ""}${hidden && !open ? " is-hidden" : ""}${open ? " is-menu-open" : ""}`}>
        <div className="site-header-stack">
        <div className="site-header-utility">
          <span>امتدكس سوفت — من الفكرة إلى التنفيذ</span>
        </div>
        <div className="site-header-bar">
          <span className="site-header-shimmer" aria-hidden />
          <SiteLink to="/" className="site-brand">
            <span className="site-brand-mark" aria-hidden />
            <span className="site-brand-text">
              <span className="site-brand-name">AMTDEX SOFT</span>
              <span className="site-brand-sub">هندسة الفكرة قبل برمجتها</span>
            </span>
          </SiteLink>

          <nav className="site-nav-track" aria-label="التنقل الرئيسي">
            {desktop.map((item) => renderItem(item))}
          </nav>

          <div className="site-header-actions">
            {contactListed && (
              <SiteLink to="/contact" onIntent={() => prefetchRoute("/contact")} className="site-nav site-nav-quiet">
                تواصل معنا
              </SiteLink>
            )}
            {quoteListed && (
              <SiteLink to="/quote" className="btn btn-ink brand-cta site-header-cta">
                <span className="hidden sm:inline">ابدأ مشروعك</span>
                <span className="sm:hidden">ابدأ</span>
              </SiteLink>
            )}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "إغلاق" : "فتح القائمة"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`site-nav-burger${open ? " is-open" : ""}`}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        </div>
      </header>
      <div className="site-header-spacer" aria-hidden />

      {open && (
        <>
          <button type="button" className="site-menu-dim" aria-label="إغلاق القائمة" onClick={() => setOpen(false)} />
          <div id="mobile-menu" ref={menuRef} className="site-menu" role="dialog" aria-modal="true" aria-label="القائمة">
            {homeListed && (
              <SiteNavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => `site-nav${isActive ? " is-active" : ""}`}>
                الرئيسية
              </SiteNavLink>
            )}
            <div className="site-menu-heading"><span>اكتشف امتدكس</span><span className="site-menu-caption">من الفكرة إلى التنفيذ</span></div>
            <nav className="site-menu-links" aria-label="التنقل على الهاتف">
              {mobile.map((item) => renderItem(item, () => setOpen(false)))}
            </nav>
            {quoteListed && <SiteLink to="/quote" className="site-menu-cta" onClick={() => setOpen(false)}>ابدأ مشروعك <Icon name="actionArrow" size={18} /></SiteLink>}
          </div>
        </>
      )}
    </>
  )
}
