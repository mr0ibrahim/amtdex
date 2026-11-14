import "../../../css/dashboard.css"
import "../../../css/dashboard-mobile.css"
import { useEffect, useMemo, useState } from "react"
import { useDebouncedValue } from "@/routing/search"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Icon } from "@/components/ui/Icon"
import { useSession, logout } from "@/lib/auth"
import { useDialog } from "@/hooks/useDialog"
import { DASHBOARD_PAGES, dashboardNavigation } from "@/routing/dashboard"
import { getMainUrl } from "@/lib/subdomain"

function SidebarContent({
  filter,
  onNavigate,
  showSearch = true,
  searchValue = "",
  onSearch,
}: {
  filter: string
  onNavigate?: () => void
  showSearch?: boolean
  searchValue?: string
  onSearch?: (value: string) => void
}) {
  const session = useSession()
  const nav = useNavigate()
  const groups = useMemo(() => dashboardNavigation(session?.user.role, filter), [session?.user.role, filter])

  const handleLogout = () => {
    logout()
    nav("/login", { replace: true })
  }

  const initial = (session?.user.name ?? "A").trim().slice(0, 1) || "A"

  return (
    <>
      <div className="dash-sidebar-brand">
        <span className="dash-sidebar-brand-mark font-display">A</span>
        <div className="min-w-0">
          <div className="dash-sidebar-brand-title">AMTDEX</div>
          <div className="dash-sidebar-brand-sub">مركز التحكم التشغيلي</div>
        </div>
      </div>

      {showSearch && (
        <label className="dash-sidebar-search">
          <Icon name="search" size={15} />
          <input
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="بحث سريع في القائمة..."
            aria-label="بحث في القائمة"
            role="searchbox"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onSearch?.("")
              }
              if (e.key === "ArrowDown") {
                e.preventDefault()
                const root = e.currentTarget.closest("aside, .dash-mobile-drawer-panel")
                root?.querySelector<HTMLElement>(".dash-nav-link")?.focus()
              }
            }}
          />
        </label>
      )}

      <nav className="grid gap-3" aria-label="تنقل لوحة التحكم">
        {groups.map((group) => (
          <div key={group.label} className="dash-nav-group">
            <div className="dash-nav-label">{group.label}</div>
            <div className="grid gap-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) => `dash-nav-link${isActive ? " is-active" : ""}`}
                >
                  <span className="dash-nav-ico">
                    <Icon name={item.icon} size={15} />
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="dash-sidebar-foot">
        <div className="dash-user-card">
          <span className="dash-user-avatar">{initial}</span>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-bold truncate">{session?.user.name ?? "مستخدم Amtdex"}</div>
            <div className="text-[10px] text-[var(--color-text-muted)] truncate"><bdi dir="ltr">{session?.user.role ?? "viewer"}</bdi></div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[11px] font-bold min-h-11 px-3 rounded-full border border-[var(--color-border)] hover:bg-[#461667] hover:text-[#F8F2FB] transition-colors"
          >
            خروج
          </button>
        </div>
        <div className="dash-status">
          <span className="dash-status-dot" aria-hidden />
          مساحة إدارة الموقع
        </div>
        <a
          href={getMainUrl("/")}
          onClick={onNavigate}
          className="text-[11px] text-center text-[var(--color-text-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          <span className="dash-mirror" aria-hidden>←</span> العودة للموقع
        </a>
      </div>
    </>
  )
}

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navQuery, setNavQuery] = useState("")
  const navFilter = useDebouncedValue(navQuery, 120)
  const session = useSession()
  const location = useLocation()
  const isOverview = location.pathname === "/dashboard" || location.pathname === "/dashboard/overview"
  const content = children ?? <Outlet />
  const drawer = useDialog(mobileOpen, () => setMobileOpen(false))
  const currentPage = Object.values(DASHBOARD_PAGES).find(page => location.pathname === page.path || (page.path !== "/dashboard" && location.pathname.startsWith(`${page.path}/`)))
  const quickLinks = useMemo(() => {
    const allowed = dashboardNavigation(session?.user.role).flatMap(group => group.items)
    return ["/dashboard", "/dashboard/leads", "/dashboard/blog", "/dashboard/content", "/dashboard/media"]
      .flatMap(path => allowed.filter(item => item.to === path)).slice(0, 4)
  }, [session?.user.role])


  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const closeOnDesktop = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener("resize", closeOnDesktop, { passive: true })
    return () => window.removeEventListener("resize", closeOnDesktop)
  }, [])

  return (
    <div className="dash-shell" dir="rtl" lang="ar">
      <div className="dash-frame">
        <aside className="dash-sidebar dash-desktop-sidebar">
          <SidebarContent filter={navFilter} showSearch searchValue={navQuery} onSearch={setNavQuery} />
        </aside>

        <div className="dash-main" id="main-content" tabIndex={-1}>
          <div className="dash-topbar">
            <button
              type="button"
              className="dash-mobile-toggle"
              aria-label="فتح القائمة"
              aria-expanded={mobileOpen}
              aria-controls="dash-mobile-navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="menu" size={18} />
            </button>
            <div className="dash-topbar-heading">
              <span className="dash-topbar-brand">AMTDEX</span>
              <strong>{currentPage?.label ?? "لوحة التحكم"}</strong>
            </div>
            <a
              href={getMainUrl("/")}
              className="dash-topbar-site"
            >
              الموقع
            </a>
          </div>

          <div className={`dash-content${isOverview ? " is-overview" : ""}`}>{content}</div>
        </div>
      </div>

      <nav className="dash-mobile-dock" aria-label="التنقل السريع في لوحة التحكم">
        {quickLinks.map(item => <NavLink key={item.to} to={item.to} end={item.end}
          className={({ isActive }) => `dash-dock-link${isActive ? " is-active" : ""}`}>
          <Icon name={item.icon} size={20} /><span>{item.label}</span>
        </NavLink>)}
        <button type="button" className="dash-dock-link" aria-label="المزيد من أقسام اللوحة" aria-controls="dash-mobile-navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
          <Icon name="menu" size={20} /><span>المزيد</span>
        </button>
      </nav>

      {mobileOpen && (
        <div className="dash-mobile-drawer">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="إغلاق" onClick={() => setMobileOpen(false)} />
          <div ref={drawer} id="dash-mobile-navigation" className="dash-mobile-drawer-panel dash-sidebar relative z-10" role="dialog" aria-modal="true" aria-label="قائمة لوحة التحكم" tabIndex={-1}>
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-[12px] font-bold text-[var(--color-ink)]">القائمة</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="size-11 grid place-items-center rounded-full border border-[var(--color-border)]"
                aria-label="إغلاق القائمة"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <SidebarContent
              filter={navFilter}
              onNavigate={() => setMobileOpen(false)}
              searchValue={navQuery}
              onSearch={setNavQuery}
            />
          </div>
        </div>
      )}
    </div>
  )
}
