import { useEffect, useMemo, useState } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Icon, type IconName } from "@/components/ui/Icon"
import { getSession, logout } from "@/lib/auth"

type NavItem = { to: string; label: string; icon: IconName; end?: boolean }
type NavGroup = { label: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    label: "مساحة العمل",
    items: [
      { to: "/dashboard", label: "الرئيسية", icon: "home", end: true },
      { to: "/dashboard/blog", label: "المدونة", icon: "pen" },
      { to: "/dashboard/content", label: "المحتوى", icon: "layers" },
      { to: "/dashboard/leads", label: "الطلبات", icon: "mail" },
      { to: "/dashboard/media", label: "الوسائط", icon: "image" },
    ],
  },
  {
    label: "النمو والتشغيل",
    items: [
      { to: "/dashboard/seo", label: "تحسين الظهور", icon: "globe" },
      { to: "/dashboard/users", label: "المستخدمون", icon: "users" },
      { to: "/dashboard/audit", label: "سجل النشاط", icon: "history" },
      { to: "/dashboard/settings", label: "الإعدادات", icon: "settings" },
    ],
  },
]

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
  const session = getSession()
  const nav = useNavigate()
  const groups = useMemo(() => {
    const q = filter.trim()
    if (!q) return NAV_GROUPS
    return NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.includes(q)),
    })).filter((g) => g.items.length > 0)
  }, [filter])

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
            <div className="text-[10px] text-white/50 truncate">{session?.user.role ?? "viewer"}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/15 hover:bg-white hover:text-[var(--color-ink)] transition-colors"
          >
            خروج
          </button>
        </div>
        <div className="dash-status">
          <span className="dash-status-dot" aria-hidden />
          محرك النظام متصل — جاهز للعمل
        </div>
        <Link
          to="/"
          onClick={onNavigate}
          className="text-[11px] text-center text-white/55 hover:text-white transition-colors"
        >
          ← العودة للموقع
        </Link>
      </div>
    </>
  )
}

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navFilter, setNavFilter] = useState("")
  const session = getSession()
  const location = useLocation()
  const isOverview = location.pathname === "/dashboard" || location.pathname === "/dashboard/overview"
  const content = children ?? <Outlet />

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileOpen])

  return (
    <div className="dash-shell">
      <div className="dash-frame">
        <aside className="dash-sidebar hidden lg:flex">
          <SidebarContent filter={navFilter} showSearch searchValue={navFilter} onSearch={setNavFilter} />
        </aside>

        <div className="dash-main">
          <div className="dash-topbar lg:hidden">
            <button
              type="button"
              className="dash-mobile-toggle"
              aria-label="فتح القائمة"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="menu" size={18} />
            </button>
            <div className="min-w-0">
              <div className="text-[13px] font-extrabold text-[var(--color-ink)] font-display tracking-tight">AMTDEX</div>
              <div className="text-[10px] text-[var(--color-text-faint)] truncate">{session?.user.name ?? "لوحة التحكم"}</div>
            </div>
            <Link
              to="/"
              className="text-[11px] font-bold px-3 py-2 rounded-full border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
            >
              الموقع
            </Link>
          </div>

          {isOverview ? content : <div className="dash-panel min-h-[70vh]">{content}</div>}
        </div>
      </div>

      {mobileOpen && (
        <div className="dash-mobile-drawer lg:hidden" role="dialog" aria-modal="true" aria-label="قائمة لوحة التحكم">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="إغلاق" onClick={() => setMobileOpen(false)} />
          <div className="dash-mobile-drawer-panel dash-sidebar relative z-10">
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-[12px] font-bold text-white/70">القائمة</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="size-9 grid place-items-center rounded-full border border-white/15"
                aria-label="إغلاق القائمة"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <SidebarContent
              filter={navFilter}
              onNavigate={() => setMobileOpen(false)}
              searchValue={navFilter}
              onSearch={setNavFilter}
            />
          </div>
        </div>
      )}
    </div>
  )
}
