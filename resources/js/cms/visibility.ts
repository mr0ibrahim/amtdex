import { CMS_DEFAULTS, type CmsDocument, type CmsPage } from "./defaults"

export function readBootstrap(): Partial<CmsDocument> | undefined {
  if (typeof window === "undefined") return undefined
  return window.__CMS_VISIBILITY__ as Partial<CmsDocument> | undefined
}

/** Merge the server payload over the defaults. A known page missing from the payload is hidden. */
export function applyVisibility(remote?: Partial<CmsDocument> | null): CmsDocument {
  const source = remote?.pages ? remote : readBootstrap()
  if (!source?.pages) return CMS_DEFAULTS
  const byPath = new Map(source.pages.map((page) => [page.path, page]))
  const pages: CmsPage[] = CMS_DEFAULTS.pages.map((page) => byPath.get(page.path) ?? { ...page, published: false })
  const nav = (source.nav ?? CMS_DEFAULTS.nav).filter((item) => item.visible && pages.some((page) => page.path === item.to && page.published))
  return {
    copy: { ...CMS_DEFAULTS.copy, ...(source.copy ?? {}) },
    pages,
    nav,
    homeSections: source.homeSections?.length ? source.homeSections : CMS_DEFAULTS.homeSections,
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
