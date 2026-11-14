import type { Role } from "@/lib/auth"
import type { IconName } from "@/components/ui/Icon"

export const STAFF: Role[] = ["admin", "editor", "author", "viewer"]
const EDITORS: Role[] = ["admin", "editor"]
const WRITERS: Role[] = ["admin", "editor", "author"]
const READERS: Role[] = ["admin", "editor", "viewer"]
const ADMINS: Role[] = ["admin"]

type DashboardPage = { path: string; label: string; icon: IconName; roles: Role[]; group: string; end?: boolean }

/** Routing and sidebar permissions use the same page definitions. Server authorization is separate. */
export const DASHBOARD_PAGES = {
  overview: { path: "/dashboard", label: "الرئيسية", icon: "home", roles: STAFF, group: "مساحة العمل", end: true },
  blog: { path: "/dashboard/blog", label: "المدونة", icon: "pen", roles: WRITERS, group: "مساحة العمل" },
  content: { path: "/dashboard/content", label: "المحتوى", icon: "layers", roles: EDITORS, group: "مساحة العمل" },
  site: { path: "/dashboard/site", label: "الموقع", icon: "layers", roles: EDITORS, group: "مساحة العمل" },
  leads: { path: "/dashboard/leads", label: "الطلبات", icon: "mail", roles: READERS, group: "مساحة العمل" },
  media: { path: "/dashboard/media", label: "الوسائط", icon: "image", roles: WRITERS, group: "مساحة العمل" },
  seo: { path: "/dashboard/seo", label: "تحسين الظهور", icon: "globe", roles: EDITORS, group: "النمو والتشغيل" },
  users: { path: "/dashboard/users", label: "المستخدمون", icon: "users", roles: ADMINS, group: "النمو والتشغيل" },
  audit: { path: "/dashboard/audit", label: "سجل النشاط", icon: "history", roles: ADMINS, group: "النمو والتشغيل" },
  settings: { path: "/dashboard/settings", label: "الإعدادات", icon: "settings", roles: ADMINS, group: "النمو والتشغيل" },
} satisfies Record<string, DashboardPage>

export function dashboardNavigation(role: Role | undefined, filter = "") {
  const groups = new Map<string, { to: string; label: string; icon: IconName; end?: boolean }[]>()
  for (const page of Object.values(DASHBOARD_PAGES) as DashboardPage[]) {
    if (!role || !page.roles.includes(role) || !page.label.includes(filter.trim())) continue
    const items = groups.get(page.group) ?? []
    items.push({ to: page.path, label: page.label, icon: page.icon, end: page.end })
    groups.set(page.group, items)
  }
  return Array.from(groups, ([label, items]) => ({ label, items }))
}
