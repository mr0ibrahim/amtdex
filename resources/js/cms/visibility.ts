import { CMS_DEFAULTS, type CmsDocument, type CmsPage } from "./defaults"

export function readBootstrap(): Partial<CmsDocument> | undefined {
  if (typeof window === "undefined") return undefined
  return window.__CMS_VISIBILITY__ as Partial<CmsDocument> | undefined
}

/** Merge the server payload over the defaults. A known page missing from the payload is hidden. */
export function applyVisibility(remote?: Partial<CmsDocument> | null, preview = false): CmsDocument {
  const source = remote?.pages ? remote : readBootstrap()
  if (!source?.pages) return CMS_DEFAULTS
  const byPath = new Map(source.pages.map((page) => [page.path, page]))
  const pages: CmsPage[] = CMS_DEFAULTS.pages.map((page) => byPath.get(page.path) ?? { ...page, published: false })
  const sourceNav = source.nav ?? CMS_DEFAULTS.nav
  const supportedNav = sourceNav.filter(item => CMS_DEFAULTS.nav.some(known => known.id === item.id))
  const nav = preview ? supportedNav : supportedNav.filter((item) => item.visible && pages.some((page) => page.path === item.to && page.published))
  const savedSections = source.homeSections ?? []
  const sectionById = new Map(savedSections.map(section => [section.id, section]))
  const homeSections = CMS_DEFAULTS.homeSections.map(section => {
    const saved = sectionById.get(section.id)
    return { ...section, ...(saved ?? {}), visible: saved?.visible ?? false,
      fields: Object.fromEntries(Object.entries(section.fields).map(([key, value]) => [key, saved?.fields?.[key] ?? value])) }
  })
  const order = savedSections.map(section => section.id)
  homeSections.sort((a,b) => {
    const rank = (id: string) => { const i = order.indexOf(id); return i < 0 ? 999 : i }
    return rank(a.id) - rank(b.id)
  })
  return {
    copy: { ...CMS_DEFAULTS.copy, ...(source.copy ?? {}) },
    pages,
    nav,
    homeSections,
  }
}

export function ownerPath(path: string): string | null {
  const base = (path.split("#")[0].split("?")[0] || "/").replace(/\/$/, "") || "/"
  const known = CMS_DEFAULTS.pages.map((page) => page.path)
  if (known.includes(base)) return base
  return known.find((page) => page !== "/" && base.startsWith(`${page}/`)) ?? null
}

export function pageIsListed(pages: { path: string; published: boolean }[], path: string, staff = false): boolean {
  if (path === "/login" || path === "/dashboard" || path.startsWith("/dashboard/")) return false
  if (staff && typeof window !== "undefined" && window.__AMTDEX_CONFIG__?.isDashboardHost) return true
  const owner = ownerPath(path)
  if (!owner) return true
  return pages.some((page) => page.path === owner && page.published)
}
