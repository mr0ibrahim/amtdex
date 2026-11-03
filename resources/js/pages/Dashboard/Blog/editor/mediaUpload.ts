import { API } from "@/lib/api"

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif"]

export function resolveMediaUrl(url: string): string {
  if (!url) return url
  if (/^(https?:|blob:|data:)/i.test(url)) return url
  if (url.startsWith("//")) return `${window.location.protocol}${url}`
  if (url.startsWith("/")) return `${window.location.origin}${url}`
  return url
}

export function isAllowedImage(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  return IMAGE_TYPES.includes(file.type) || (!file.type && IMAGE_EXT.includes(ext))
}

export async function uploadMediaFile(file: File): Promise<string> {
  const res = await API.media.upload(file)
  const url = res?.url || (res as { data?: { url?: string } })?.data?.url
  if (!url) throw new Error("لم يُرجع الخادم رابط الملف.")
  return resolveMediaUrl(url)
}
