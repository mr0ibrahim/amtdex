import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { hasRole, isAuthenticated } from "@/lib/auth"
import { CMS_DEFAULTS, type CmsDocument, type CmsSection } from "./defaults"

function merge(remote?: Partial<CmsDocument>): CmsDocument {
  if (!remote) return CMS_DEFAULTS
  return {
    copy: { ...CMS_DEFAULTS.copy, ...(remote.copy ?? {}) },
    pages: remote.pages?.length ? remote.pages : CMS_DEFAULTS.pages,
    nav: remote.nav?.length ? remote.nav : CMS_DEFAULTS.nav,
    homeSections: remote.homeSections?.length ? remote.homeSections : CMS_DEFAULTS.homeSections,
  }
}

export function useCms() {
  const staff = isAuthenticated() && hasRole(["admin", "editor"])
  const query = useQuery({
    queryKey: ["cms", staff ? "preview" : "public"],
    queryFn: ({ signal }) => apiClient<CmsDocument>(staff ? "/cms?preview=1" : "/cms", "GET", undefined, { signal }),
    placeholderData: CMS_DEFAULTS,
    staleTime: 30_000,
  })
  const doc = merge(query.data)
  return { ...doc, staff, ready: query.isSuccess }
}

export function useSection(id: string): CmsSection {
  const { homeSections } = useCms()
  return homeSections.find((section) => section.id === id) ?? CMS_DEFAULTS.homeSections.find((section) => section.id === id)!
}

export function pageIsListed(pages: { path: string; published: boolean }[], path: string, staff: boolean) {
  if (staff) return true
  const base = path.split("#")[0]
  return pages.some((page) => page.path === base && page.published)
}

export function useCopy(key: string, fallback: string) {
  const { copy } = useCms()
  return copy[key] || fallback
}

export function useSaveCms() {
  const client = useQueryClient()
  return async (doc: CmsDocument) => {
    const saved = await apiClient<CmsDocument>("/cms", "PUT", doc)
    await client.invalidateQueries({ queryKey: ["cms"] })
    return saved
  }
}
