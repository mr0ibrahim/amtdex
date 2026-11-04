import { useEffect, useRef, useState } from "react"
import { API } from "@/lib/api"
import { toAbsoluteUrl } from "@/lib/seoKeywords"
import { FieldHint, FieldLabel } from "./FieldHint"
import { isAllowedImage } from "./mediaUpload"

const MAX_BYTES = 10 * 1024 * 1024

type Props = {
  url?: string | null
  onChange: (url: string) => void
  onClear: () => void
  disabled?: boolean
}

export function OgImageField({ url, onChange, onClear, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const upload = async (file: File) => {
    if (!isAllowedImage(file) && !file.type.startsWith("image/")) {
      setError("يُسمح بملفات الصور فقط.")
      return
    }
    if (file.size > MAX_BYTES) {
      setError("الحجم الأقصى 10MB.")
      return
    }
    setError(null)
    const blobUrl = URL.createObjectURL(file)
    setLocalPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev)
      return blobUrl
    })
    setUploading(true)
    try {
      const res = await API.media.upload(file)
      const nextUrl = res?.url || (res as { data?: { url?: string } })?.data?.url
      if (!nextUrl) throw new Error("لم يُرجع الخادم رابط الصورة.")
      setLocalPreview((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev)
        return null
      })
      onChange(nextUrl)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "فشل رفع صورة المشاركة")
    } finally {
      setUploading(false)
    }
  }

  const clear = () => {
    setError(null)
    setLocalPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev)
      return null
    })
    onClear()
  }

  const stored = (url ?? "").trim()
  const displayUrl = uploading && localPreview ? localPreview : stored ? toAbsoluteUrl(stored) : localPreview

  return (
    <div className="space-y-2">
      <FieldLabel htmlFor="og-image-url">صورة Open Graph</FieldLabel>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files?.[0]
          if (file) void upload(file)
        }}
        className={`rounded-2xl border-2 border-dashed p-3 sm:p-4 transition-colors ${
          dragging
            ? "border-[var(--color-primary)] bg-[var(--color-lavender)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
        }`}
      >
        {displayUrl ? (
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <img
              src={displayUrl}
              alt="معاينة صورة المشاركة"
              className="h-28 w-full sm:w-48 object-cover rounded-xl border bg-white"
            />
            <div className="flex-1 space-y-2 w-full min-w-0">
              <p className="text-[11px] text-[var(--color-text-muted)] break-all font-mono">
                {stored || (uploading ? "جارٍ رفع الصورة…" : "")}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={disabled || uploading}
                  className="px-3 py-2 rounded-xl bg-[var(--color-ink)] text-white text-xs font-bold disabled:opacity-60"
                >
                  {uploading ? "جارٍ الرفع..." : "استبدال الصورة"}
                </button>
                <button
                  type="button"
                  onClick={clear}
                  disabled={disabled || uploading}
                  className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold disabled:opacity-60"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 py-2">
            <p className="text-xs font-bold text-[var(--color-ink)]">ارفع صورة المشاركة أو الصق رابطها</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[var(--color-ink)] text-white text-xs font-bold disabled:opacity-60"
            >
              {uploading ? "جارٍ الرفع..." : "رفع صورة من الجهاز"}
            </button>
          </div>
        )}
        {/* No capture attribute: phones open the gallery/files chooser, not the camera. */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="اختيار صورة المشاركة"
          disabled={disabled || uploading}
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ""
            if (file) void upload(file)
          }}
        />
      </div>
      <input
        id="og-image-url"
        type="text"
        inputMode="url"
        dir="ltr"
        value={url ?? ""}
        disabled={disabled || uploading}
        onChange={(e) => {
          setError(null)
          setLocalPreview(null)
          onChange(e.target.value)
        }}
        placeholder="https://example.com/share.jpg أو /uploads/media/..."
        aria-label="رابط صورة المشاركة"
        className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-mono outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
      <FieldHint>
        تُستخدم في og:image و twitter:image. ارفعها من المعرض أو الصق رابطاً. إن تُركت فارغة تُستخدم صورة الغلاف عند النشر.
      </FieldHint>
      {error && (
        <p role="alert" className="text-[11px] font-semibold text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}
