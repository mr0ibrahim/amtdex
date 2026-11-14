import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API } from "@/lib/api"
import type { SeoEntry } from "@/lib/seoStore"

export function useSeoQuery() {
  return useQuery({
    queryKey: ["seo"],
    queryFn: async () => {
      try {
        const res = await API.seo.list()
        if (Array.isArray(res?.data) && res.data.length > 0) {
          return res.data as SeoEntry[]
        }
        const { getSeo } = await import("@/lib/seoStore")
        return getSeo()
      } catch (err) {
        if (!import.meta.env.DEV) throw err
        const { getSeo } = await import("@/lib/seoStore")
        return getSeo()
      }
    },
  })
}

export function useSeoToolsQuery() {
  return useQuery({
    queryKey: ["seo-tools"],
    queryFn: () => API.seo.tools(),
    staleTime: 60_000,
  })
}

export function useSeoReindexMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => API.seo.reindex(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo-tools"] })
    },
  })
}

export function useUpsertSeoMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (entry: SeoEntry) => {
      await API.seo.upsert(entry)
      const { upsertSeo } = await import("@/lib/seoStore")
      upsertSeo(entry)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo"] })
    },
  })
}

export function useDeleteSeoMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (path: string) => {
      await API.seo.delete(path)
      const { deleteSeo } = await import("@/lib/seoStore")
      deleteSeo(path)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo"] })
    },
  })
}
