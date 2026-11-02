import { useState } from "react"
import { useMediaQuery, useUploadMediaMutation, useDeleteMediaMutation } from "@/lib/queries"

export function MediaPage() {
  const { data: media = [], isLoading, error, refetch } = useMediaQuery()
  const uploadMutation = useUploadMediaMutation()
  const deleteMutation = useDeleteMediaMutation()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  const handleCopy = async (id: string, url: string) => {
    try {
      const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`
      await navigator.clipboard.writeText(fullUrl)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      alert("تعذر نسخ الرابط إلى الحافظة")
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الملف "${name}" نهائياً من التخزين؟`)) {
      deleteMutation.mutate(id, {
        onError: (err: any) => alert(err?.message || "فشل حذف الملف"),
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-[18px] font-extrabold text-[var(--color-ink)]">مستودع الوسائط</h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">ارفع الصور والملفات وانسخ روابطها للنشر.</p>
        </div>
        <span className="text-[11px] text-[var(--color-text-faint)]">إجمالي الملفات: {media.length}</span>
      </div>

      <div className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-5 sm:p-8 text-center bg-[var(--color-card-soft)]">
        <div className="text-[13px] sm:text-[14px] font-bold text-[var(--color-ink)]">اسحب الصور والملفات هنا أو اختر من جهازك</div>
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)] leading-relaxed">
          الحد الأقصى: 10 ميجابايت — JPG, PNG, WebP, SVG, PDF
        </p>

        {uploadError && (
          <div role="alert" className="mt-3 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-xl py-2 px-3 max-w-[400px] mx-auto">
            {uploadError}
          </div>
        )}

        <label className="mt-4 inline-flex items-center gap-2 bg-[var(--color-ink)] text-white text-[12px] font-bold px-5 py-2.5 rounded-full cursor-pointer hover:bg-black transition-colors">
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
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {media.map((item) => {
              const isImage = item.mime.startsWith("image/") && !item.mime.includes("svg")
              const isSvg = item.mime.includes("svg")
              const isPdf = item.mime.includes("pdf")

              return (
                <div
                  key={item.id}
                  className="group relative border border-[var(--color-border)] rounded-2xl p-3 flex flex-col justify-between bg-white hover:border-[var(--color-primary)] hover:shadow-md transition-all"
                >
                  {/* Thumbnail / Icon */}
                  <div className="w-full h-28 rounded-xl bg-[var(--color-card-soft)] overflow-hidden flex items-center justify-center border border-black/5 relative">
                    {isImage || isSvg ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          (e.target as HTMLElement).style.display = "none"
                        }}
                      />
                    ) : isPdf ? (
                      <div className="text-center p-2">
                        <span className="text-3xl">📄</span>
                        <div className="text-[10px] font-bold text-red-600 mt-1">PDF</div>
                      </div>
                    ) : (
                      <span className="text-3xl">📁</span>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-black text-white text-[10px] size-6 rounded-full grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="فتح في نافذة جديدة"
                    >
                      ↗
                    </a>
                  </div>

                  {/* Info */}
                  <div className="mt-2.5 w-full">
                    <div className="text-[12px] font-bold text-[var(--color-ink)] truncate w-full" title={item.name}>
                      {item.name}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[var(--color-text-faint)] mt-1 font-mono">
                      <span>{(item.size / 1024).toFixed(1)} KB</span>
                      <span className="truncate max-w-[80px]">{item.mime.split("/")[1]?.toUpperCase() || ""}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2 border-t border-[var(--color-border)] flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.url)}
                      className={`flex-1 text-[10.5px] font-bold py-1 px-2 rounded-lg border transition-colors ${
                        copiedId === item.id
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : "border-[var(--color-border)] hover:bg-[var(--color-lavender)] text-[var(--color-ink)]"
                      }`}
                    >
                      {copiedId === item.id ? "تم النسخ ✓" : "نسخ الرابط"}
                    </button>
                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-[11px] text-red-600 hover:bg-red-50 p-1 rounded-lg border border-transparent hover:border-red-200 transition-colors"
                      title="حذف الملف"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
