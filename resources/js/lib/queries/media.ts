import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { API, ApiError } from "@/lib/api"

export interface MediaItem {
  id: string
  url: string
  name: string
  size: number
  mime: string
}

export function useMediaQuery() {
  return useQuery({ queryKey: ["media"], queryFn: async () => (await API.media.list()).data as MediaItem[] })
}

export function useUploadMediaMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      // Security client boundary: max 10MB, image MIME only
      const MAX_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_SIZE) {
        throw new ApiError(422, "حجم الملف يتجاوز الحد المسموح (10 ميجابايت)")
      }
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"]
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new ApiError(422, "نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, SVG, PDF")
      }
      return API.media.upload(file)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

export function useDeleteMediaMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return API.media.delete(id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["media"] })
    },
  })
}
