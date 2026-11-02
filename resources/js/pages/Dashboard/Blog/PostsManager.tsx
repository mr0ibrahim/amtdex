import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { API } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { getBlogUrl } from "@/lib/subdomain"
import type { BlogCategory, BlogPost } from "@/types/blog"

function statusLabel(status?: string) {
  if (status === "published") return "منشور"
  if (status === "draft") return "مسودة"
  if (status === "scheduled") return "مجدول"
  if (status === "archived") return "مؤرشف"
  return status || "—"
}

function statusClass(status?: string) {
  if (status === "published") return "bg-emerald-100 text-emerald-800"
  if (status === "draft") return "bg-amber-100 text-amber-800"
  if (status === "scheduled") return "bg-sky-100 text-sky-800"
  return "bg-gray-100 text-gray-700"
}

export function PostsManager({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const { data: postsRes, isLoading } = useQuery({
    queryKey: ["admin-posts", { search, status }],
    queryFn: () =>
      BlogAPI.getAdminPosts({
        search: search || undefined,
        status: status !== "all" ? status : undefined,
      }),
  })

  const posts = postsRes?.data ?? []

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteAdminPost(id),
    onSuccess: () => {
      onNotify("تم حذف المقال بنجاح.")
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: number; next: BlogPost["status"] }) =>
      BlogAPI.updateAdminPost(id, { status: next }),
    onSuccess: (_, vars) => {
      onNotify(vars.next === "published" ? "تم نشر المقال." : "تم تحديث حالة المقال.")
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
    },
  })

  const handleNewPost = () => {
    setEditingPost({
      title: "",
      slug: "",
      summary: "",
      content: "<h2>مقدمة</h2>\n<p>اكتب هنا محتوى مقالك...</p>",
      status: "draft",
      allow_comments: true,
      robots_index: true,
      robots_follow: true,
      og_type: "article",
      twitter_card: "summary_large_image",
      schema_type: "BlogPosting",
      faq_schema: [],
    })
    setIsEditorOpen(true)
  }

  const counts = useMemo(() => {
    const all = posts.length
    const published = posts.filter((p) => p.status === "published").length
    const drafts = posts.filter((p) => p.status === "draft").length
    return { all, published, drafts }
  }, [posts])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 w-full lg:max-w-2xl">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالعنوان أو الرابط..."
            className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-white focus:outline-none"
          >
            <option value="all">كل الحالات ({counts.all})</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="scheduled">مجدول</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>

        <Button
          onClick={handleNewPost}
          size="sm"
          className="w-full lg:w-auto bg-[var(--color-ink)] hover:bg-[var(--color-primary)] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          + مقال جديد
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="px-2.5 py-1 rounded-full bg-[var(--color-card-soft)] text-[var(--color-primary)] font-bold">
          منشور: {counts.published}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold">مسودة: {counts.drafts}</span>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-[var(--color-text-faint)]">جارٍ تحميل المقالات...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] space-y-3">
          <p>لا توجد مقالات مطابقة. ابدأ بإنشاء مقالك الأول.</p>
          <Button onClick={handleNewPost} size="sm" className="rounded-xl">
            كتابة مقال جديد
          </Button>
        </div>
      ) : (
        <>
          <div className="dash-mobile-cards">
            {posts.map((p) => (
              <article key={p.id} className="dash-post-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-[var(--color-ink)] leading-snug">{p.title}</h3>
                    <p className="mt-1 text-[11px] text-[var(--color-text-faint)] font-mono truncate">/posts/{p.slug}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusClass(p.status)}`}>
                    {statusLabel(p.status)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] text-[var(--color-text-muted)]">
                  {p.category && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-lavender)] text-[var(--color-primary)] font-semibold">
                      {p.category.name}
                    </span>
                  )}
                  <span>{p.views_count.toLocaleString("ar-EG")} مشاهدة</span>
                  <span>{p.published_at ? new Date(p.published_at).toLocaleDateString("ar-SA") : "غير منشور"}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost(p)
                      setIsEditorOpen(true)
                    }}
                    className="rounded-xl border border-[var(--color-border)] py-2 text-[11px] font-bold text-[var(--color-ink)]"
                  >
                    تعديل
                  </button>
                  {p.status !== "published" ? (
                    <button
                      type="button"
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: p.id, next: "published" })}
                      className="rounded-xl bg-[var(--color-ink)] text-white py-2 text-[11px] font-bold"
                    >
                      نشر الآن
                    </button>
                  ) : (
                    <a
                      href={getBlogUrl(`/posts/${p.slug}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-[var(--color-card-soft)] text-[var(--color-primary)] py-2 text-[11px] font-bold text-center"
                    >
                      معاينة
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`حذف مقال "${p.title}"؟`)) deleteMutation.mutate(p.id)
                    }}
                    className="col-span-2 rounded-xl border border-rose-200 text-rose-600 py-2 text-[11px] font-bold"
                  >
                    حذف المقال
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="dash-desktop-table overflow-x-auto border border-[var(--color-border)] rounded-2xl">
            <table className="w-full text-right text-xs min-w-[720px]">
              <thead className="bg-[var(--color-card-soft)] border-b border-[var(--color-border)] text-[var(--color-ink)] font-bold">
                <tr>
                  <th className="py-3 px-4">المقال</th>
                  <th className="py-3 px-4">التصنيف</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">المشاهدات</th>
                  <th className="py-3 px-4">تاريخ النشر</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-white">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--color-card-soft)]/40 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-[var(--color-ink)] truncate">{p.title}</div>
                      <div className="text-[11px] text-[var(--color-text-faint)] truncate font-mono">/posts/{p.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      {p.category ? (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--color-lavender)] text-[var(--color-primary)] font-semibold text-[10px]">
                          {p.category.name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusClass(p.status)}`}>
                        {statusLabel(p.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{p.views_count.toLocaleString("ar-EG")}</td>
                    <td className="py-3 px-4 text-[var(--color-text-muted)]">
                      {p.published_at ? new Date(p.published_at).toLocaleDateString("ar-SA") : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <a
                          href={getBlogUrl(`/posts/${p.slug}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-muted)]"
                        >
                          معاينة
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPost(p)
                            setIsEditorOpen(true)
                          }}
                          className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-primary)]"
                        >
                          تعديل
                        </button>
                        {p.status !== "published" && (
                          <button
                            type="button"
                            disabled={statusMutation.isPending}
                            onClick={() => statusMutation.mutate({ id: p.id, next: "published" })}
                            className="px-2.5 py-1 rounded-lg bg-[var(--color-ink)] text-white text-[11px] font-bold"
                          >
                            نشر
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`حذف مقال "${p.title}"؟`)) deleteMutation.mutate(p.id)
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isEditorOpen && editingPost && (
        <ArticleEditorModal
          initialData={editingPost}
          onClose={() => {
            setIsEditorOpen(false)
            setEditingPost(null)
          }}
          onSaved={(msg) => {
            setIsEditorOpen(false)
            setEditingPost(null)
            onNotify(msg)
            queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
            queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
          }}
        />
      )}
    </div>
  )
}

function ArticleEditorModal({
  initialData,
  onClose,
  onSaved,
}: {
  initialData: Partial<BlogPost>
  onClose: () => void
  onSaved: (msg: string) => void
}) {
  const [form, setForm] = useState<Partial<BlogPost>>(initialData)
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>(initialData.faq_schema ?? [])
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingInline, setUploadingInline] = useState(false)
  const [section, setSection] = useState<"content" | "seo" | "advanced">("content")

  const { data: categoriesRes } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => BlogAPI.getAdminCategories(),
  })
  const categories = categoriesRes?.data ?? []

  const saveMutation = useMutation({
    mutationFn: (payload: Partial<BlogPost>) => {
      const dataToSave = { ...payload, faq_schema: faqList }
      if (dataToSave.id) return BlogAPI.updateAdminPost(dataToSave.id, dataToSave)
      return BlogAPI.createAdminPost(dataToSave)
    },
    onSuccess: (_, vars) => {
      onSaved(vars.status === "published" ? "تم حفظ المقال ونشره بنجاح." : "تم حفظ المسودة بنجاح.")
    },
  })

  const focusKey = form.focus_keyword?.trim().toLowerCase() ?? ""
  const titleHasKey = focusKey ? form.title?.toLowerCase().includes(focusKey) : false
  const slugHasKey = focusKey ? form.slug?.toLowerCase().includes(focusKey) : false
  const summaryHasKey = focusKey ? form.summary?.toLowerCase().includes(focusKey) : false
  const titleLength = form.meta_title ? form.meta_title.length : form.title?.length ?? 0
  const descLength = form.meta_description ? form.meta_description.length : form.summary?.length ?? 0

  const autoGenerateSlug = () => {
    if (!form.title) return
    const s = form.title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setForm({ ...form, slug: s })
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const res = await API.media.upload(file)
      const url = res?.url || (res as any)?.data?.url
      if (url) {
        setForm((prev) => ({
          ...prev,
          cover_image: url,
          cover_image_alt: prev.cover_image_alt || file.name.split(".")[0],
        }))
      }
    } catch (err: any) {
      alert(err?.message || "فشل رفع صورة الغلاف")
    } finally {
      setUploadingCover(false)
    }
  }

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingInline(true)
    try {
      const res = await API.media.upload(file)
      const url = res?.url || (res as any)?.data?.url
      if (url) {
        const alt = file.name.split(".")[0]
        const snippet = `\n<figure class="my-6 text-center">\n  <img src="${url}" alt="${alt}" class="rounded-2xl max-w-full h-auto mx-auto border shadow-sm" loading="lazy" />\n  <figcaption class="text-xs text-gray-500 mt-2">${alt}</figcaption>\n</figure>\n`
        setForm((prev) => ({ ...prev, content: (prev.content ?? "") + snippet }))
      }
    } catch (err: any) {
      alert(err?.message || "فشل رفع الصورة")
    } finally {
      setUploadingInline(false)
    }
  }

  const saveAs = (status: BlogPost["status"]) => {
    if (!form.title?.trim() || !form.slug?.trim() || !form.content?.trim()) {
      alert("العنوان والرابط والمحتوى مطلوبة قبل الحفظ.")
      setSection("content")
      return
    }
    saveMutation.mutate({ ...form, status })
  }

  return (
    <div className="dash-editor-shell" role="dialog" aria-modal="true" aria-label="محرر المقال">
      <div className="dash-editor-panel">
        <div className="px-4 sm:px-6 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-card-soft)] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-[var(--color-ink)] truncate">
              {form.id ? `تعديل: ${form.title || "مقال"}` : "إنشاء مقال جديد"}
            </h2>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">اكتب المحتوى، راجع SEO، ثم احفظ كمسودة أو انشر مباشرة.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 shrink-0 rounded-full bg-white border border-[var(--color-border)] grid place-items-center text-sm font-bold"
            aria-label="إغلاق المحرر"
          >
            ✕
          </button>
        </div>

        <div className="px-4 sm:px-6 pt-3">
          <div className="dash-tabs">
            {[
              { id: "content", label: "1. المحتوى" },
              { id: "seo", label: "2. الظهور والـ SEO" },
              { id: "advanced", label: "3. متقدم" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSection(t.id as typeof section)}
                className={`dash-tab${section === t.id ? " is-active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {section === "content" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--color-ink)] mb-1">
                    عنوان المقال <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      value={form.title ?? ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="عنوان واضح وجذاب للمقال"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    />
                    <Button type="button" onClick={autoGenerateSlug} size="sm" variant="outline" className="rounded-xl text-[11px] whitespace-nowrap">
                      توليد الرابط
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-ink)] mb-1">
                    الرابط الدائم <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug ?? ""}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-mono focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-ink)] mb-1">التصنيف</label>
                  <select
                    value={form.category_id ?? ""}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value ? parseInt(e.target.value, 10) : null })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-white outline-none"
                  >
                    <option value="">بدون تصنيف</option>
                    {categories.map((c: BlogCategory) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--color-ink)] mb-1">صورة الغلاف</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={form.cover_image ?? ""}
                      onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                      placeholder="رابط الصورة أو ارفع من جهازك"
                      className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs font-mono outline-none"
                    />
                    <label className="inline-flex items-center justify-center bg-[var(--color-lavender)] text-[var(--color-primary)] text-xs font-bold px-3 py-2 rounded-xl cursor-pointer">
                      {uploadingCover ? "جار الرفع..." : "رفع غلاف"}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploadingCover} onChange={handleCoverUpload} />
                    </label>
                  </div>
                  {form.cover_image && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)]">
                      <img src={form.cover_image} alt="معاينة الغلاف" className="h-12 w-20 object-cover rounded-lg border" />
                      <button type="button" onClick={() => setForm({ ...form, cover_image: "" })} className="text-[11px] text-rose-600 font-bold">
                        إزالة
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--color-ink)] mb-1">ملخص المقال</label>
                <textarea
                  rows={2}
                  value={form.summary ?? ""}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <label className="font-bold text-[var(--color-ink)]">
                    المحتوى <span className="text-rose-500">*</span>
                  </label>
                  <label className="px-2.5 py-1 rounded-lg bg-[var(--color-lavender)] text-[10px] font-bold cursor-pointer">
                    {uploadingInline ? "جار الرفع..." : "إدراج صورة"}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploadingInline} onChange={handleInlineImageUpload} />
                  </label>
                </div>
                <textarea
                  rows={14}
                  required
                  value={form.content ?? ""}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-[var(--color-border)] text-xs font-mono leading-relaxed outline-none min-h-[220px]"
                />
              </div>
            </>
          )}

          {section === "seo" && (
            <div className="space-y-4">
              <div className="bg-[var(--color-bg-subtle)] rounded-2xl p-4 border border-[var(--color-border)] space-y-4">
                <div className="font-bold text-[var(--color-ink)]">معاينة نتيجة البحث</div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1">
                  <div className="text-[11px] text-gray-600">amtdex.com › posts › {form.slug || "example-post"}</div>
                  <h4 className="text-[15px] text-[#1a0dab] truncate">{form.meta_title || form.title || "عنوان المقال"}</h4>
                  <p className="text-[12px] text-[#4d5156] line-clamp-2">
                    {form.meta_description || form.summary || "الوصف المختصر الذي يظهر في نتائج البحث..."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">الكلمة المفتاحية</label>
                    <input
                      type="text"
                      value={form.focus_keyword ?? ""}
                      onChange={(e) => setForm({ ...form, focus_keyword: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Meta Title ({titleLength}/60)</label>
                    <input
                      type="text"
                      value={form.meta_title ?? ""}
                      onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold mb-1">Meta Description ({descLength}/160)</label>
                    <textarea
                      rows={2}
                      value={form.meta_description ?? ""}
                      onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none resize-none"
                    />
                  </div>
                </div>

                {focusKey && (
                  <div className="flex flex-wrap gap-3 text-[11px]">
                    <span className={titleHasKey ? "text-emerald-600 font-bold" : "text-rose-500"}>{titleHasKey ? "✓" : "✗"} في العنوان</span>
                    <span className={slugHasKey ? "text-emerald-600 font-bold" : "text-rose-500"}>{slugHasKey ? "✓" : "✗"} في الرابط</span>
                    <span className={summaryHasKey ? "text-emerald-600 font-bold" : "text-rose-500"}>{summaryHasKey ? "✓" : "✗"} في الملخص</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === "advanced" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-border)]">
                  <input
                    type="checkbox"
                    checked={!!form.allow_comments}
                    onChange={(e) => setForm({ ...form, allow_comments: e.target.checked })}
                  />
                  <span className="font-bold text-[var(--color-ink)]">السماح بالتعليقات</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-border)]">
                  <input type="checkbox" checked={!!form.robots_index} onChange={(e) => setForm({ ...form, robots_index: e.target.checked })} />
                  <span className="font-bold text-[var(--color-ink)]">فهرسة محركات البحث</span>
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-ink)]">أسئلة شائعة (FAQ Schema)</span>
                  <button type="button" onClick={() => setFaqList([...faqList, { question: "", answer: "" }])} className="text-[11px] font-bold text-[var(--color-primary)]">
                    + إضافة
                  </button>
                </div>
                {faqList.map((faq, i) => (
                  <div key={i} className="p-3 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px]">سؤال #{i + 1}</span>
                      <button type="button" onClick={() => setFaqList(faqList.filter((_, idx) => idx !== i))} className="text-rose-500 text-[10px]">
                        حذف
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const next = [...faqList]
                        next[i] = { ...next[i], question: e.target.value }
                        setFaqList(next)
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs outline-none"
                      placeholder="السؤال"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const next = [...faqList]
                        next[i] = { ...next[i], answer: e.target.value }
                        setFaqList(next)
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs outline-none resize-none"
                      placeholder="الإجابة"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="dash-editor-foot">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs order-3 sm:order-1 w-full sm:w-auto">
            إلغاء
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
            <Button
              type="button"
              variant="outline"
              disabled={saveMutation.isPending}
              onClick={() => saveAs("draft")}
              className="rounded-xl text-xs w-full sm:w-auto"
            >
              حفظ كمسودة
            </Button>
            <Button
              type="button"
              disabled={saveMutation.isPending}
              onClick={() => saveAs("published")}
              className="bg-[var(--color-ink)] hover:bg-[var(--color-primary)] text-white text-xs font-bold px-5 py-2.5 rounded-xl w-full sm:w-auto"
            >
              {saveMutation.isPending ? "جارٍ الحفظ..." : "نشر المقال الآن"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
