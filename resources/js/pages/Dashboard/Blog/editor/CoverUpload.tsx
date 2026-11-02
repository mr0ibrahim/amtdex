import { useRef, useState } from "react"
import { API } from "@/lib/api"
import { FieldHint, FieldLabel } from "./FieldHint"

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPT = "image/jpeg,image/png,image/webp"

type Props = {
  url?: string | null
  alt?: string | null
  onChange: (next: { cover_image: string; cover_image_alt?: string }) => void
  onClear: () => void
}

export function CoverUpload({ url, alt, onChange, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = (file: File): string | null => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return "يُسمح بصور JPEG أو PNG أو WebP فقط."
    }
    if (file.size > MAX_BYTES) return "الحجم الأقصى 5MB."
    return null
  }

  const upload = async (file: File) => {
    const err = validate(file)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setUploading(true)
    try {
      const res = await API.media.upload(file)
      const nextUrl = res?.url || (res as { data?: { url?: string } })?.data?.url
      if (!nextUrl) throw new Error("لم يُرجع الخادم رابط الصورة.")
      onChange({
        cover_image: nextUrl,
        cover_image_alt: alt || file.name.replace(/\.[^.]+$/, ""),
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "فشل رفع الغلاف")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <FieldLabel>صورة الغلاف</FieldLabel>
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
        className={`rounded-2xl border-2 border-dashed p-4 sm:p-5 transition-colors ${
          dragging
            ? "border-[var(--color-primary)] bg-[var(--color-lavender)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
        }`}
      >
        {url ? (
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <img src={url} alt={alt || "معاينة الغلاف"} className="h-28 w-full sm:w-44 object-cover rounded-xl border" />
            <div className="flex-1 space-y-2 w-full">
              <p className="text-[11px] text-[var(--color-text-muted)] break-all font-mono">{url}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-[var(--color-ink)] text-white text-xs font-bold"
                  disabled={uploading}
                >
                  {uploading ? "جارٍ الرفع..." : "استبدال الصورة"}
                </button>
                <button type="button" onClick={onClear} className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold">
                  حذف
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 py-2">
            <p className="text-xs font-bold text-[var(--color-ink)]">اسحب الصورة هنا أو ارفعها من جهازك</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[var(--color-ink)] text-white text-xs font-bold"
            >
              {uploading ? "جارٍ الرفع..." : "رفع صورة الغلاف"}
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void upload(file)
            e.target.value = ""
          }}
        />
      </div>
      <FieldHint>الأبعاد الموصى بها 1200×630 — JPEG/PNG/WebP — بحد أقصى 5MB. على الجوال يمكن استخدام الكاميرا.</FieldHint>
      <div>
        <FieldLabel htmlFor="cover-alt">النص البديل للغلاف (Alt)</FieldLabel>
        <input
          id="cover-alt"
          type="text"
          value={alt ?? ""}
          onChange={(e) => onChange({ cover_image: url || "", cover_image_alt: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="وصف مختصر للصورة لمحركات البحث وإمكانية الوصول"
        />
      </div>
      {error && (
        <p role="alert" className="text-[11px] font-semibold text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}
