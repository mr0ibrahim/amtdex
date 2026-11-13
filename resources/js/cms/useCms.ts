import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { hasRole, isAuthenticated } from "@/lib/auth"
import { CMS_DEFAULTS, type CmsDocument, type CmsSection } from "./defaults"
import { applyVisibility } from "./visibility"

export function useCms() {
  const staff = isAuthenticated() && hasRole(["admin", "editor"])
  const onDashboard = typeof window !== "undefined" && (Boolean(window.__AMTDEX_CONFIG__?.isDashboardHost) || /^\/dashboard(?:\/|$)/.test(window.location.pathname))
  const preview = staff && onDashboard
  const boot = applyVisibility()
  const query = useQuery({
    queryKey: ["cms", preview ? "preview" : "public"],
    queryFn: ({ signal }) => apiClient<CmsDocument>(preview ? "/cms?preview=1" : "/cms", "GET", undefined, { signal }),
    initialData: preview ? undefined : boot,
    placeholderData: preview ? CMS_DEFAULTS : boot,
    staleTime: 0,
  })
  const doc = applyVisibility(query.data ?? (preview ? undefined : boot), preview)
  return { ...doc, staff: preview, ready: preview ? query.isSuccess : true, error: query.error, refetch: query.refetch }
}

export function useSection(id: string): CmsSection {
  const { homeSections } = useCms()
  return homeSections.find((section) => section.id === id) ?? CMS_DEFAULTS.homeSections.find((section) => section.id === id)!
}

export { pageIsListed } from "./visibility"

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
