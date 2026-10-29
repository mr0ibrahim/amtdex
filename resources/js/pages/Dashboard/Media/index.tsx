import { useState } from "react"
import { useMediaQuery, useUploadMediaMutation } from "@/lib/queries"

export function MediaPage() {
  const { data: media = [], isLoading, error, refetch } = useMediaQuery()
  const uploadMutation = useUploadMediaMutation()
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side file boundaries
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_SIZE) {
      setUploadError("حجم الملف يتجاوز الحد المسموح به (10 ميجابايت).")
      return
    }

    const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"]
    if (!ALLOWED.includes(file.type)) {
      setUploadError("نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, SVG, PDF")
      return
    }

    uploadMutation.mutate(file, {
      onError: (err) => {
        setUploadError(err instanceof Error ? err.message : "فشل رفع الملف")
      },
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">مستودع الوسائط</h1>

      <div className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-8 text-center bg-[var(--color-card-soft)]">
        <div className="text-[14px] font-bold text-[var(--color-ink)]">اسحب الصور والملفات هنا أو اختر من جهازك</div>
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          الحد الأقصى: 10 ميجابايت (الامتدادات المدعومة: JPG, PNG, WebP, SVG, PDF)
        </p>

        {uploadError && (
          <div role="alert" className="mt-3 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-xl py-2 px-3 max-w-[400px] mx-auto">
            {uploadError}
          </div>
        )}

        <label className="mt-4 inline-flex items-center gap-2 bg-[var(--color-ink)] text-white text-[12px] font-bold px-5 py-2.5 rounded-full cursor-pointer hover:opacity-90 transition-opacity">
          {uploadMutation.isPending ? "جار الرفع..." : "اختيار ملف"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
            className="hidden"
            disabled={uploadMutation.isPending}
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
        <h2 className="text-[14px] font-bold text-[var(--color-ink)] mb-4">الملفات المرفوعة</h2>

        {isLoading ? (
          <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">
            <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
            جار تحميل الوسائط...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-[12px] text-red-600">
            تعذر تحميل قائمة الوسائط.
            <button onClick={() => refetch()} className="mr-2 underline font-bold">إعادة المحاولة</button>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-8 text-[12px] text-[var(--color-text-faint)]">
            لا توجد وسائط مرفوعة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {media.map((item) => (
              <div key={item.id} className="border border-[var(--color-border)] rounded-xl p-3 flex flex-col items-center justify-center text-center bg-white">
                <div className="size-16 rounded-lg bg-[var(--color-card-soft)] grid place-items-center text-[18px]">
                  {item.mime.includes("svg") ? "🎨" : item.mime.includes("pdf") ? "📄" : "🖼️"}
                </div>
                <div className="text-[12px] font-bold text-[var(--color-ink)] mt-2 truncate w-full" title={item.name}>
                  {item.name}
                </div>
                <div className="text-[10px] text-[var(--color-text-faint)] mt-1">
                  {(item.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
