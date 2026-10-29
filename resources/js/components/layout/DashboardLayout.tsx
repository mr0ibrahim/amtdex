import { NavLink, useNavigate } from "react-router-dom"
import { getSession, logout } from "@/lib/auth"

const NAV: Array<{ to: string; label: string; icon: string }> = [
  { to: "/dashboard", label: "نظرة عامة", icon: "◈" },
  { to: "/dashboard/blog", label: "المدونة", icon: "✍" },
  { to: "/dashboard/content", label: "المحتوى", icon: "⬢" },
  { to: "/dashboard/leads", label: "الطلبات", icon: "⬔" },
  { to: "/dashboard/seo", label: "SEO", icon: "⬣" },
  { to: "/dashboard/media", label: "الوسائط", icon: "⬘" },
  { to: "/dashboard/settings", label: "الإعدادات", icon: "⬙" },
  { to: "/dashboard/users", label: "المستخدمون", icon: "👤" },
  { to: "/dashboard/audit", label: "السجل", icon: "◎" },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const nav = useNavigate()
  const session = getSession()

  const handleLogout = () => {
    logout()
    nav("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--color-card-soft)]">
      {/* Dashboard top bar — مستقل تماماً عن Header التسويقي */}
      <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 h-[56px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="size-8 rounded-xl bg-[var(--color-ink)] text-white grid place-items-center text-[12px] font-bold">A</span>
            <span className="font-extrabold text-[14px] tracking-[-0.5px] text-[var(--color-ink)]">AMTDEX — لوحة التحكم</span>
            <span className="hidden sm:inline text-[10px] bg-[var(--color-lavender)] text-[var(--color-primary)] font-bold px-2 py-1 rounded-full">DASHBOARD</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-[12px] font-bold text-[var(--color-ink)] leading-none truncate">{session?.user.name ?? "—"}</div>
              <div className="text-[10px] text-[var(--color-text-faint)] truncate">{session?.user.email ?? ""} • {session?.user.role ?? ""}</div>
            </div>
            <button onClick={handleLogout} className="text-[12px] font-medium border border-[var(--color-border)] px-4 py-2 rounded-full hover:bg-[var(--color-ink)] hover:text-white transition-colors">
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 grid lg:grid-cols-[240px_1fr] gap-6 items-start">
        <aside className="bg-white border border-[var(--color-border)] rounded-[20px] p-3 lg:sticky lg:top-[72px]">
          <div className="sm:hidden flex items-center gap-2 px-2 py-2 border-b border-[var(--color-border)] mb-3 pb-3">
            <div className="min-w-0">
              <div className="text-[12px] font-bold leading-none text-[var(--color-ink)] truncate">{session?.user.name ?? "لوحة Amtdex"}</div>
              <div className="text-[10px] text-[var(--color-text-faint)] truncate">{session?.user.email ?? "—"} • {session?.user.role ?? "viewer"}</div>
            </div>
          </div>
          <nav className="mt-4 grid gap-1" aria-label="لوحة التحكم">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  `text-right flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${isActive ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-lavender)] text-[var(--color-text-muted)]"}`
                }
              >
                <span className="text-[12px] w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 bg-white border border-[var(--color-border)] rounded-[20px] p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
