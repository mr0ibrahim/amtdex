import type { Role } from "./auth"

/** Presentation only; Laravel continues to enforce every permission. */
export function canVisitDashboard(path: string, role?: Role): boolean {
  if (!role) return false
  if (path === "/") return true
  const admin = ["/dashboard/settings", "/dashboard/users", "/dashboard/audit", "/dashboard/legacy"]
  const editors = ["/dashboard/content", "/dashboard/site", "/dashboard/seo"]
  const writers = ["/dashboard/blog", "/dashboard/media"]
  if (admin.includes(path)) return role === "admin"
  if (editors.includes(path)) return role === "admin" || role === "editor"
  if (writers.includes(path)) return role !== "viewer"
  if (path === "/dashboard/leads") return role !== "author"
  return path === "/dashboard" || path === "/dashboard/overview"
}
