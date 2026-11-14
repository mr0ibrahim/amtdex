import { useQuery } from "@tanstack/react-query"
import { API, ApiError } from "@/lib/api"

export type ContentQueryOptions = { fallback?: boolean }
export type ContentResource = Parameters<typeof API.adminContent.list>[0]

export function useContentCollection<T>(resource: ContentResource, publicList: () => Promise<{ data: unknown[] }>,
  fallback: () => Promise<T[]>, options: ContentQueryOptions) {
  const admin = options.fallback === false
  return useQuery({
    queryKey: ["content", resource, admin ? "admin" : "public"],
    queryFn: async () => {
      try {
        const response = await (admin ? API.adminContent.list<T>(resource) : publicList())
        if (!Array.isArray(response.data)) throw new ApiError(502, "استجابة الخادم غير صالحة")
        return response.data as T[]
      } catch (error) {
        if (admin || (error instanceof ApiError && [401, 403].includes(error.status))) throw error
        return fallback()
      }
    },
  })
}
