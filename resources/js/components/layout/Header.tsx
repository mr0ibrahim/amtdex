import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Icon } from "@/components/ui/Icon"
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
    <NavLink to={to} onClick={onClick} onMouseEnter={onIntent} onFocus={onIntent} className={className}>
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
  const [entered, setEntered] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [pill, setPill] = useState({ x: 0, w: 0, on: false })
  const loc = useLocation()
  const prevPath = useRef(loc.pathname)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)
  const onBlog = isBlogSubdomain()
  const { nav, pages } = useCms()
  const menu = nav.filter((item) => item.visible && pageIsListed(pages, item.to, false))
  const desktop = menu.filter((item) => !["contact", "quote", "pricing"].includes(item.id))
  const mobileMenu = menu
    .filter((item) => !["contact", "quote"].includes(item.id) && item.to !== "/")
    .filter((item, index, items) => items.findIndex((other) => other.to === item.to) === index)
  const closeMenu = (returnFocus = true) => { restoreFocus.current = returnFocus; setOpen(false) }
  const homeListed = pageIsListed(pages, "/", false)
  const contactListed = pageIsListed(pages, "/contact", false)
  const quoteListed = pageIsListed(pages, "/quote", false)

  useEffect(() => {
    openRef.current = open
    if (open) setHidden(false)
  }, [open])

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (prevPath.current !== loc.pathname) {
      prevPath.current = loc.pathname
      setOpen(false)
    }
  }, [loc.pathname])

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
        if (window.innerWidth >= 1024 && !reduce && !openRef.current && y > last + 6 && y > 80) nextHidden = true
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

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const place = () => {
      const active = track.querySelector<HTMLElement>(".is-active")
      if (!active) {
        setPill((value) => (value.on ? { ...value, on: false } : value))
        return
      }
      const trackBox = track.getBoundingClientRect()
      const linkBox = active.getBoundingClientRect()
      setPill({ x: linkBox.left - trackBox.left, w: linkBox.width, on: true })
    }
    place()
    window.addEventListener("resize", place)
    return () => window.removeEventListener("resize", place)
  }, [loc.pathname, desktop.map((item) => item.id).join("|")])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    const previousPadding = document.body.style.paddingInlineEnd
    const gap = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
    document.body.style.overflow = "hidden"
    if (gap) document.body.style.paddingInlineEnd = `${gap}px`
    const menu = menuRef.current
    const toggle = toggleRef.current
    const shell = toggle?.closest<HTMLElement>(".brand-motion")
    const previousInert = shell?.inert ?? false
    if (shell) shell.inert = true
    const items = () => menu ? [...menu.querySelectorAll<HTMLElement>("a, button:not([disabled])")] : []
    items()[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        restoreFocus.current = true
        setOpen(false)
        return
      }
      if (event.key !== "Tab") return
      const list = items()
      const first = list[0]
      const last = list[list.length - 1]
      if (!first) return
      if (event.shiftKey && (document.activeElement === first || !menu?.contains(document.activeElement))) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !menu?.contains(document.activeElement))) {
        event.preventDefault(); first.focus()
      }
    }
    const desktopQuery = window.matchMedia("(min-width: 1024px)")
    const onDesktop = () => { if (desktopQuery.matches) { restoreFocus.current = false; setOpen(false) } }
    desktopQuery.addEventListener("change", onDesktop)
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      document.body.style.paddingInlineEnd = previousPadding
      if (shell) shell.inert = previousInert
      document.removeEventListener("keydown", onKey)
      desktopQuery.removeEventListener("change", onDesktop)
      if (restoreFocus.current) toggle?.focus()
    }
  }, [open])

  const renderItem = (item: (typeof menu)[number], onClick?: () => void) => {
    const className = ({ isActive }: { isActive: boolean }) => `site-nav${isActive ? " is-active" : ""}`
    if (item.id === "blog" && !onBlog) {
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
      <header className={`site-header${entered ? " is-in" : ""}${condensed ? " is-condensed" : ""}${hidden ? " is-hidden" : ""}`}>
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

          <div className="site-nav-track" ref={trackRef}>
            <span
              className="site-nav-pill"
              aria-hidden
              style={{
                transform: `translateX(${pill.x}px) scaleX(${pill.on ? pill.w : 0})`,
                opacity: pill.on ? 1 : 0,
              }}
            />
            {desktop.map((item) => renderItem(item))}
          </div>

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
              onClick={() => { restoreFocus.current = false; setOpen((value) => !value) }}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
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

      {open && createPortal(
        <div className="site-mobile-overlay" dir="rtl">
          <button type="button" tabIndex={-1} className="site-menu-dim" aria-label="إغلاق القائمة بالنقر خارجها" onClick={() => closeMenu()} />
          <div id="mobile-menu" ref={menuRef} className="site-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
            <div className="site-menu-heading">
              <div><span className="site-menu-overline">AMTDEX SOFT</span><h2 id="mobile-menu-title">استكشف امتدكس</h2></div>
              <button type="button" className="site-menu-close" aria-label="إغلاق القائمة" onClick={() => closeMenu()}><Icon name="close" size={22} /></button>
            </div>
            <nav className="site-menu-links" aria-label="التنقل الرئيسي">
              {homeListed && (
                <SiteNavLink to="/" onClick={() => closeMenu(false)} className={({ isActive }) => `site-nav${isActive ? " is-active" : ""}`}>
                  الرئيسية
                </SiteNavLink>
              )}
              {mobileMenu.map((item) => renderItem(item, () => closeMenu(false)))}
            </nav>
            <div className="site-menu-footer">
              <p>من الفكرة إلى التنفيذ.</p>
              {quoteListed && <SiteLink to="/quote" className="site-menu-primary" onClick={() => closeMenu(false)}>ابدأ مشروعك <Icon name="arrowUpLeft" size={19} /></SiteLink>}
              {contactListed && <SiteLink to="/contact" className="site-menu-contact" onClick={() => closeMenu(false)}>تواصل معنا <Icon name="mail" size={17} /></SiteLink>}
            </div>
          </div>
        </div>, document.body
      )}
    </>
  )
}
