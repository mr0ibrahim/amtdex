import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API } from "@/lib/api"

export interface SiteSettings {
  siteName: string
  email: string
  phone: string
}

export function useSettingsQuery() {
  return useQuery({ queryKey: ["settings"], queryFn: () => API.settings.get() })
}
export function useUpdateSettingsMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (settings: SiteSettings) => API.settings.update(settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  })
}
