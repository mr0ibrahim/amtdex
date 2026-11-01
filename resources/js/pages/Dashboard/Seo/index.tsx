import { useState } from "react"
import { useSeoQuery, useUpsertSeoMutation, useDeleteSeoMutation, useUploadMediaMutation } from "@/lib/queries"
import { generateRobots, generateSitemap, getSeo } from "@/lib/seoStore"
import type { SeoEntry } from "@/lib/seoStore"

export function SeoPage() {
  const { data: rawEntries = [], isLoading, error, refetch } = useSeoQuery()
  const entries = (rawEntries && rawEntries.length > 0) ? rawEntries : getSeo()
  const upsertMutation = useUpsertSeoMutation()
  const deleteMutation = useDeleteSeoMutation()
  const uploadMutation = useUploadMediaMutation()

  const [editing, setEditing] = useState<SeoEntry | null>(null)
  const [showSitemap, setShowSitemap] = useState(false)
  const [uploading, setUploading] = useState(false)

  const copy = async (txt: string) => {
    await navigator.clipboard.writeText(txt)
    alert("تم النسخ بنجاح ✓")
  }

  const handleOgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editing) return

    setUploading(true)
    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setUploading(false)
        const uploadedUrl = res?.url || res?.data?.url
        if (uploadedUrl) {
          setEditing({ ...editing, og_image: uploadedUrl, ogImage: uploadedUrl })
        }
      },
      onError: (err: any) => {
        setUploading(false)
        alert(err?.message || "فشل رفع الصورة")
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[18px] font-bold text-[var(--color-ink)]">إدارة محركات البحث (SEO)</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSitemap((v) => !v)}
            className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-1.5 rounded-full hover:bg-[var(--color-lavender)] transition-colors"
          >
            sitemap / robots
          </button>
          <button
            onClick={() => setEditing({ path: "", title: "", description: "", og_image: "" })}
            className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-4 py-2 rounded-full hover:bg-black transition-colors"
          >
            + مسار جديد
          </button>
        </div>
      </div>

      {showSitemap && (
        <div className="space-y-3">
          <div className="bg-[var(--color-ink)] text-white rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">sitemap.xml</span>
              <button onClick={() => copy(generateSitemap())} className="text-[11px] font-bold bg-white text-black px-3 py-1 rounded-full hover:bg-white/90">
                نسخ
              </button>
            </div>
            <pre className="mt-2 text-[10px] leading-4 whitespace-pre-wrap break-all font-mono">{generateSitemap()}</pre>
          </div>
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">robots.txt</span>
              <button onClick={() => copy(generateRobots())} className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-1 rounded-full hover:bg-[var(--color-lavender)]">
                نسخ
              </button>
            </div>
            <pre className="mt-2 text-[11px] leading-5 whitespace-pre-wrap font-mono">{generateRobots()}</pre>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-[12px] flex items-center justify-between">
          <span>يتم عرض إعدادات SEO من التخزين المحلي الاحتياطي لتعذر الاتصال المباشر.</span>
          <button onClick={() => refetch()} className="font-bold underline hover:text-amber-900">
            إعادة المحاولة
          </button>
        </div>
      )}

      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {isLoading && entries.length === 0 ? (
          <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">
            <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
            جار تحميل إعدادات SEO...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-[var(--color-card-soft)] text-[11px] text-[var(--color-text-faint)]">
                <tr>
                  <th className="text-right px-4 py-3">المسار</th>
                  <th className="text-right px-4 py-3">صورة OG</th>
                  <th className="text-right px-4 py-3">العنوان</th>
                  <th className="text-right px-4 py-3">الوصف</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-[var(--color-text-faint)]">
                      لا توجد مسارات مسجلة حالياً.
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => {
                    const og = e.og_image || e.ogImage
                    return (
                      <tr key={e.path} className="border-t border-[var(--color-border)] hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-mono text-[11px]">
                          {e.path}{" "}
                          {e.noindex && (
                            <span className="mr-1 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                              noindex
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {og ? (
                            <img
                              src={og}
                              alt=""
                              className="size-8 rounded-lg object-cover border border-black/10"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">لا توجد</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold text-[var(--color-ink)]">{e.title}</td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)] line-clamp-1 max-w-[280px]">
                          {e.description}
                        </td>
                        <td className="px-4 py-3 flex gap-1.5 justify-end">
                          <button
                            onClick={() =>
                              setEditing({
                                ...e,
                                og_image: og || "",
                              })
                            }
                            className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-1 rounded-full hover:bg-[var(--color-lavender)] transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`حذف إعدادات SEO للمسار ${e.path}؟`)) {
                                deleteMutation.mutate(e.path)
                              }
                            }}
                            className="text-[11px] font-bold text-red-600 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SEO Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-2xl max-w-[540px] w-full p-6 space-y-4 shadow-2xl border border-[var(--color-border)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <h3 className="text-[15px] font-bold text-[var(--color-ink)]">
                {editing.path ? "تعديل إعدادات SEO للمسار" : "إضافة مسار جديد لمحركات البحث"}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                المسار (Path) <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="/services/web أو /about"
                value={editing.path}
                dir="ltr"
                onChange={(e) => setEditing({ ...editing, path: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] font-mono outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                عنوان الصفحة (Meta Title) <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="عنوان الصفحة يظهر في نتائج بحث جوجل"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                الوصف (Meta Description) <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="وصف جذاب ودقيق للمحتوى (بين 120 إلى 160 حرف)..."
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-20 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                صورة المشاركة الاجتماعية (Open Graph Image)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  placeholder="https://... أو اضغط رفع صورة"
                  value={editing.og_image || editing.ogImage || ""}
                  dir="ltr"
                  onChange={(e) =>
                    setEditing({ ...editing, og_image: e.target.value, ogImage: e.target.value })
                  }
                  className="flex-1 border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] font-mono outline-none focus:border-[var(--color-primary)]"
                />
                <label className="shrink-0 inline-flex items-center justify-center bg-[var(--color-lavender)] text-[var(--color-primary)] text-[11px] font-bold px-3 py-2 rounded-xl cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  {uploading ? "جار الرفع..." : "رفع صورة 📤"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploading}
                    onChange={handleOgUpload}
                  />
                </label>
              </div>
              {(editing.og_image || editing.ogImage) && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-[var(--color-card-soft)] rounded-xl border border-[var(--color-border)]">
                  <img
                    src={editing.og_image || editing.ogImage}
                    alt="معاينة"
                    className="h-12 w-20 object-cover rounded-lg border border-black/10"
                  />
                  <div className="text-[11px] text-[var(--color-text-muted)] truncate flex-1">
                    معاينة صورة المشاركة على فيسبوك وتويتر وواتساب
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, og_image: "", ogImage: "" })}
                    className="text-[11px] text-red-600 font-bold hover:underline"
                  >
                    إزالة
                  </button>
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-[12px] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={!!editing.noindex}
                onChange={(e) => setEditing({ ...editing, noindex: e.target.checked })}
                className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
              />
              <span>تفعيل noindex (حجب الصفحة عن الأرشفة في محركات البحث)</span>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 border border-[var(--color-border)] rounded-full text-[12px] font-medium hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={upsertMutation.isPending}
                onClick={() => {
                  upsertMutation.mutate(editing, {
                    onSuccess: () => setEditing(null),
                  })
                }}
                className="px-6 py-2 bg-[var(--color-ink)] text-white rounded-full text-[12px] font-bold hover:bg-black transition-colors"
              >
                {upsertMutation.isPending ? "جار الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
