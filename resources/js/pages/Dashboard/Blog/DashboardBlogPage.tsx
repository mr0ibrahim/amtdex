import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toast"
import { getBlogUrl } from "@/lib/subdomain"
import type { BlogPost, BlogCategory, BlogTag, BlogComment, BlogRedirect, BlogSettings } from "@/types/blog"

type BlogTab = "posts" | "categories" | "tags" | "comments" | "redirects" | "settings"

export function DashboardBlogPage({ onToast }: { onToast?: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState<BlogTab>("posts")
  const toast = useToast()

  const notify = (msg: string) => {
    toast.show(msg)
    onToast?.(msg)
  }

  // ── Queries ──
  const { data: statsRes } = useQuery({
    queryKey: ["admin-blog-stats"],
    queryFn: () => BlogAPI.getAdminStats(),
  })

  const stats = statsRes?.stats

  return (
    <div className="space-y-6">
      {toast.el}

      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--color-ink)]">إدارة المدونة والمقالات</h1>
            <Badge className="bg-[var(--color-card-soft)] text-[var(--color-primary)] border-none text-[11px] font-bold">
              SEO Engine
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            التحكم الكامل بالمقالات، التصنيفات، التعليقات، مؤشرات الـ SEO والتحويلات 301 على السب دومين.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getBlogUrl("/")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[var(--color-border)] hover:bg-[var(--color-lavender)] text-[var(--color-ink)] transition-colors"
          >
            <span>زيارة المدونة</span>
            <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
          <span className="text-[11px] text-[var(--color-text-faint)] block">إجمالي المقالات</span>
          <span className="text-2xl font-bold text-[var(--color-ink)] font-mono block mt-1">
            {stats?.total_posts ?? 6}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {stats?.published_posts ?? 6} منشور
          </span>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
          <span className="text-[11px] text-[var(--color-text-faint)] block">المشاهدات الكلية</span>
          <span className="text-2xl font-bold text-[var(--color-ink)] font-mono block mt-1">
            {stats?.total_views?.toLocaleString("ar-EG") ?? "4,320"}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] mt-1 block">تحديث حي</span>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
          <span className="text-[11px] text-[var(--color-text-faint)] block">تعليقات بانتظار المراجعة</span>
          <span className="text-2xl font-bold text-amber-600 font-mono block mt-1">
            {stats?.pending_comments ?? 0}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] mt-1 block">تتطلب الموافقة</span>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
          <span className="text-[11px] text-[var(--color-text-faint)] block">التصنيفات والوسوم</span>
          <span className="text-2xl font-bold text-[var(--color-primary)] font-mono block mt-1">
            {(stats?.categories_count ?? 4) + " / " + (stats?.tags_count ?? 6)}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] mt-1 block">تصنيف / وسم</span>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "posts", label: "المقالات", count: stats?.total_posts },
          { id: "categories", label: "التصنيفات", count: stats?.categories_count },
          { id: "tags", label: "الوسوم", count: stats?.tags_count },
          { id: "comments", label: "التعليقات", count: stats?.pending_comments ? `(${stats.pending_comments})` : undefined },
          { id: "redirects", label: "تحويلات 301" },
          { id: "settings", label: "إعدادات المدونة والـ SEO" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as BlogTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === t.id
                ? "bg-[var(--color-ink)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-lavender)] hover:text-[var(--color-ink)]"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === t.id ? "bg-white/20 text-white" : "bg-black/5"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Tab View */}
      {activeTab === "posts" && <PostsTab onNotify={notify} />}
      {activeTab === "categories" && <CategoriesTab onNotify={notify} />}
      {activeTab === "tags" && <TagsTab onNotify={notify} />}
      {activeTab === "comments" && <CommentsTab onNotify={notify} />}
      {activeTab === "redirects" && <RedirectsTab onNotify={notify} />}
      {activeTab === "settings" && <SettingsTab onNotify={notify} />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 1) POSTS TAB
// ─────────────────────────────────────────────────────────
function PostsTab({ onNotify }: { onNotify: (m: string) => void }) {
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

  const handleEdit = (p: BlogPost) => {
    setEditingPost(p)
    setIsEditorOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في المقالات..."
            className="px-3.5 py-2 rounded-xl border border-[var(--color-border)] text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-white focus:outline-none"
          >
            <option value="all">كافة الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="scheduled">مجدول</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>

        <Button
          onClick={handleNewPost}
          size="sm"
          className="w-full sm:w-auto bg-[var(--color-ink)] hover:bg-[var(--color-primary)] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5"
        >
          <span>+ كتابة مقال جديد</span>
        </Button>
      </div>

      {/* Posts Table */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-[var(--color-text-faint)]">جارٍ تحميل المقالات...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center bg-[var(--color-bg-subtle,#FAF8F6)] rounded-2xl border border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
          لا توجد مقالات مطابقة للبحث أو الفلتر.
        </div>
      ) : (
        <div className="overflow-x-auto border border-[var(--color-border)] rounded-2xl">
          <table className="w-full text-right text-xs">
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
              {posts.map((p: BlogPost) => (
                <tr key={p.id} className="hover:bg-[var(--color-card-soft)]/40 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-[var(--color-ink)] truncate">{p.title}</div>
                    <div className="text-[11px] text-[var(--color-text-faint)] truncate font-mono">
                      /posts/{p.slug}
                    </div>
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
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : p.status === "draft"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.status === "published" ? "منشور" : p.status === "draft" ? "مسودة" : p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{p.views_count.toLocaleString("ar-EG")}</td>
                  <td className="py-3 px-4 text-[var(--color-text-muted)]">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString("ar-SA") : "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <a
                        href={getBlogUrl(`/posts/${p.slug}`)}
                        target="_blank"
                        rel="noreferrer"
                        title="معاينة"
                        className="p-1 rounded-lg hover:bg-gray-100 text-[var(--color-text-muted)]"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleEdit(p)}
                        title="تعديل المقال"
                        className="p-1 rounded-lg hover:bg-gray-100 text-[var(--color-primary)] font-bold"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف مقال "${p.title}"؟`)) {
                            deleteMutation.mutate(p.id)
                          }
                        }}
                        title="حذف"
                        className="p-1 rounded-lg hover:bg-red-50 text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && editingPost && (
        <ArticleEditorModal
          initialData={editingPost}
          onClose={() => {
            setIsEditorOpen(false)
            setEditingPost(null)
          }}
          onSaved={() => {
            setIsEditorOpen(false)
            setEditingPost(null)
            onNotify("تم حفظ المقال بنجاح.")
            queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
          }}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 2) ARTICLE EDITOR MODAL WITH SERP PREVIEW & SEO CHECKLIST
// ─────────────────────────────────────────────────────────
function ArticleEditorModal({
  initialData,
  onClose,
  onSaved,
}: {
  initialData: Partial<BlogPost>
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<Partial<BlogPost>>(initialData)
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>(
    initialData.faq_schema ?? []
  )

  const { data: categoriesRes } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => BlogAPI.getAdminCategories(),
  })
  const categories = categoriesRes?.data ?? []

  const saveMutation = useMutation({
    mutationFn: (payload: Partial<BlogPost>) => {
      const dataToSave = { ...payload, faq_schema: faqList }
      if (dataToSave.id) {
        return BlogAPI.updateAdminPost(dataToSave.id, dataToSave)
      }
      return BlogAPI.createAdminPost(dataToSave)
    },
    onSuccess: () => {
      onSaved()
    },
  })

  // SEO Scores & Checklist
  const focusKey = form.focus_keyword?.trim().toLowerCase() ?? ""
  const titleHasKey = focusKey ? form.title?.toLowerCase().includes(focusKey) : false
  const slugHasKey = focusKey ? form.slug?.toLowerCase().includes(focusKey) : false
  const summaryHasKey = focusKey ? form.summary?.toLowerCase().includes(focusKey) : false
  const titleLength = form.meta_title ? form.meta_title.length : form.title?.length ?? 0
  const descLength = form.meta_description ? form.meta_description.length : form.summary?.length ?? 0

  const handleAddFaq = () => {
    setFaqList([...faqList, { question: "", answer: "" }])
  }

  const handleUpdateFaq = (idx: number, field: "question" | "answer", val: string) => {
    const next = [...faqList]
    next[idx][field] = val
    setFaqList(next)
  }

  const handleRemoveFaq = (idx: number) => {
    setFaqList(faqList.filter((_, i) => i !== idx))
  }

  const autoGenerateSlug = () => {
    if (!form.title) return
    const s = form.title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setForm({ ...form, slug: s })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-[var(--color-border)] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-card-soft)]">
          <h2 className="text-base font-bold text-[var(--color-ink)]">
            {form.id ? `تعديل مقال: ${form.title}` : "إنشاء مقال تقني جديد"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[var(--color-ink)] flex items-center justify-center font-bold text-sm hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-[var(--color-ink)] mb-1">
                عنوان المقال <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={form.title ?? ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: هندسة النظم السحابية المقاومة للأعطال"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
                <Button
                  type="button"
                  onClick={autoGenerateSlug}
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-[11px] whitespace-nowrap"
                >
                  توليد الرابط (Slug)
                </Button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--color-ink)] mb-1">
                الرابط الدائم (Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.slug ?? ""}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="cloud-architecture-guide"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-mono focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--color-ink)] mb-1">التصنيف</label>
              <select
                value={form.category_id ?? ""}
                onChange={(e) => setForm({ ...form, category_id: e.target.value ? parseInt(e.target.value, 10) : null })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              >
                <option value="">بدون تصنيف</option>
                {categories.map((c: BlogCategory) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[var(--color-ink)] mb-1">حالة النشر</label>
              <select
                value={form.status ?? "draft"}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              >
                <option value="draft">مسودة (Draft)</option>
                <option value="published">منشور للعامة (Published)</option>
                <option value="scheduled">مجدول (Scheduled)</option>
                <option value="archived">مؤرشف (Archived)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[var(--color-ink)] mb-1">صورة الغلاف (URL)</label>
              <input
                type="url"
                value={form.cover_image ?? ""}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                placeholder="https://amtdex.com/images/screens/..."
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-bold text-[var(--color-ink)] mb-1">
              ملخص المقال (Excerpt)
            </label>
            <textarea
              rows={2}
              value={form.summary ?? ""}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="فقرة تعريفية سريعة تظهر في بطاقات المدونة ونتائج البحث..."
              className="w-full px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
            />
          </div>

          {/* Content Body Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-[var(--color-ink)]">
                محتوى المقال (HTML / Markdown) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1">
                {[
                  { tag: "<h2>عنوان فرعي</h2>\n", label: "H2" },
                  { tag: "<h3>عنوان ثانوي</h3>\n", label: "H3" },
                  { tag: "<blockquote>اقتباس ملهم</blockquote>\n", label: "Quote" },
                  { tag: "<pre><code>// كود برمجي\n</code></pre>\n", label: "Code" },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => setForm({ ...form, content: (form.content ?? "") + "\n" + btn.tag })}
                    className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[10px] font-mono"
                  >
                    +{btn.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={12}
              required
              value={form.content ?? ""}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="اكتب المحتوى بتنسيق HTML أو نص منسق..."
              className="w-full px-4 py-3 rounded-2xl border border-[var(--color-border)] text-xs font-mono leading-relaxed focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>

          {/* SEO & SERP PREVIEW BOX */}
          <div className="bg-[var(--color-bg-subtle,#FAF8F6)] rounded-2xl p-4 border border-[var(--color-border)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                معاينة نتيجة جوجل الحية (Live SERP Preview)
              </span>
              <span className="text-[10px] text-[var(--color-text-faint)]">Google Desktop & Mobile</span>
            </div>

            {/* Simulated Google Search Result */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 max-w-xl space-y-1">
              <div className="text-[11px] text-gray-600 flex items-center gap-1 font-sans">
                <span className="w-4 h-4 rounded-full bg-[var(--color-ink)] text-white text-[9px] flex items-center justify-center font-bold">A</span>
                <span className="font-medium">amtdex.com</span>
                <span>› posts › {form.slug || "example-post"}</span>
              </div>
              <h4 className="text-[15px] text-[#1a0dab] font-normal hover:underline cursor-pointer truncate">
                {form.meta_title || form.title || "عنوان المقال كما يظهر في محركات البحث"}
              </h4>
              <p className="text-[12px] text-[#4d5156] line-clamp-2 leading-relaxed">
                {form.meta_description || form.summary || "الوصف المختصر للمقال الذي سيقرأه الزائر في صفحة نتائج بحث جوجل لجذبه للنقر..."}
              </p>
            </div>

            {/* Keyword & Meta inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الكلمة المفتاحية المستهدفة (Focus Keyword)
                </label>
                <input
                  type="text"
                  value={form.focus_keyword ?? ""}
                  onChange={(e) => setForm({ ...form, focus_keyword: e.target.value })}
                  placeholder="مثال: واجهات RTL"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  عنوان الـ SEO المخصص (Meta Title)
                  <span className={`mr-2 font-normal ${titleLength > 60 ? "text-red-500" : "text-emerald-600"}`}>
                    ({titleLength} / 60 حرف)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.meta_title ?? ""}
                  onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                  placeholder="إذا تُرك فارغاً يُستخدم عنوان المقال"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  وصف الـ SEO المخصص (Meta Description)
                  <span className={`mr-2 font-normal ${descLength > 160 ? "text-red-500" : "text-emerald-600"}`}>
                    ({descLength} / 160 حرف)
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={form.meta_description ?? ""}
                  onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                  placeholder="إذا تُرك فارغاً يُستخدم ملخص المقال"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                />
              </div>
            </div>

            {/* SEO Checklist */}
            {focusKey && (
              <div className="pt-2 border-t border-[var(--color-border)] flex flex-wrap gap-3 text-[11px]">
                <span className={titleHasKey ? "text-emerald-600 font-bold" : "text-red-500"}>
                  {titleHasKey ? "✓" : "✗"} الكلمة في العنوان
                </span>
                <span className={slugHasKey ? "text-emerald-600 font-bold" : "text-red-500"}>
                  {slugHasKey ? "✓" : "✗"} الكلمة في الرابط (Slug)
                </span>
                <span className={summaryHasKey ? "text-emerald-600 font-bold" : "text-red-500"}>
                  {summaryHasKey ? "✓" : "✗"} الكلمة في الملخص
                </span>
              </div>
            )}
          </div>

          {/* FAQ SCHEMA BUILDER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--color-ink)]">
                الأسئلة الشائعة للمقال (FAQ Schema Rich Results)
              </span>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-[11px] font-bold text-[var(--color-primary)] hover:underline"
              >
                + إضافة سؤال وإجابة
              </button>
            </div>

            {faqList.map((faq, i) => (
              <div key={i} className="p-3 bg-[var(--color-bg-subtle,#FAF8F6)] rounded-xl border border-[var(--color-border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px] text-[var(--color-ink)]">سؤال #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(i)}
                    className="text-red-500 text-[10px] hover:underline"
                  >
                    حذف
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleUpdateFaq(i, "question", e.target.value)}
                  placeholder="نص السؤال..."
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs outline-none"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleUpdateFaq(i, "answer", e.target.value)}
                  placeholder="نص الإجابة الشاملة..."
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-card-soft)] flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl text-xs"
          >
            إلغاء
          </Button>

          <Button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(form)}
            className="bg-[var(--color-ink)] hover:bg-[var(--color-primary)] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
          >
            {saveMutation.isPending ? "جارٍ الحفظ..." : "حفظ ونشر المقال"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 3) CATEGORIES TAB
// ─────────────────────────────────────────────────────────
function CategoriesTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [desc, setDesc] = useState("")

  const { data: categoriesRes, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => BlogAPI.getAdminCategories(),
  })
  const categories = categoriesRes?.data ?? []

  const saveMutation = useMutation({
    mutationFn: (payload: Partial<BlogCategory>) => BlogAPI.saveCategory(payload),
    onSuccess: () => {
      onNotify("تم حفظ التصنيف بنجاح.")
      setName("")
      setSlug("")
      setDesc("")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteCategory(id),
    onSuccess: () => {
      onNotify("تم حذف التصنيف.")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const s = slug.trim() || name.trim().toLowerCase().replace(/[\s\W-]+/g, "-")
    saveMutation.mutate({ name: name.trim(), slug: s, description: desc.trim() })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white p-5 rounded-2xl border border-[var(--color-border)] space-y-3 h-fit">
        <h3 className="font-bold text-xs text-[var(--color-ink)]">إضافة تصنيف جديد</h3>
        <div>
          <label className="block text-[11px] font-semibold mb-1">اسم التصنيف</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!slug) setSlug(e.target.value.toLowerCase().replace(/[\s\W-]+/g, "-"))
            }}
            placeholder="مثال: هندسة البيانات"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">الرابط (Slug)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="data-engineering"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs font-mono outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">الوصف</label>
          <textarea
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none resize-none"
          />
        </div>
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          size="sm"
          className="w-full bg-[var(--color-ink)] text-white font-bold rounded-xl text-xs py-2"
        >
          {saveMutation.isPending ? "جارٍ الإضافة..." : "إضافة التصنيف"}
        </Button>
      </form>

      {/* List */}
      <div className="md:col-span-2 space-y-2">
        {isLoading ? (
          <div className="text-xs text-[var(--color-text-faint)] py-6 text-center">جارٍ التحميل...</div>
        ) : categories.length === 0 ? (
          <div className="text-xs text-[var(--color-text-muted)] py-6 text-center">لا توجد تصنيفات.</div>
        ) : (
          categories.map((c: BlogCategory) => (
            <div
              key={c.id}
              className="p-4 bg-white border border-[var(--color-border)] rounded-2xl flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-xs text-[var(--color-ink)]">{c.name}</h4>
                <p className="text-[11px] text-[var(--color-text-faint)] font-mono">/categories/{c.slug}</p>
                {c.description && <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{c.description}</p>}
              </div>
              <button
                onClick={() => {
                  if (confirm(`حذف تصنيف "${c.name}"؟`)) deleteMutation.mutate(c.id)
                }}
                className="text-red-500 hover:text-red-700 text-xs font-bold"
              >
                حذف
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 4) TAGS TAB
// ─────────────────────────────────────────────────────────
function TagsTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [tagName, setTagName] = useState("")

  const { data: tagsRes, isLoading } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => BlogAPI.getAdminTags(),
  })
  const tags = tagsRes?.data ?? []

  const saveMutation = useMutation({
    mutationFn: (name: string) =>
      BlogAPI.saveTag({
        name,
        slug: name.toLowerCase().trim().replace(/[\s\W-]+/g, "-"),
      }),
    onSuccess: () => {
      onNotify("تم إضافة الوسم بنجاح.")
      setTagName("")
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteTag(id),
    onSuccess: () => {
      onNotify("تم حذف الوسم.")
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] })
    },
  })

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (tagName.trim()) saveMutation.mutate(tagName.trim())
        }}
        className="flex gap-2 max-w-md"
      >
        <input
          type="text"
          required
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="أدخل اسم وسم جديد (مثال: React, Docker)..."
          className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none"
        />
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          size="sm"
          className="bg-[var(--color-ink)] text-white text-xs font-bold rounded-xl"
        >
          إضافة وسم
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 pt-2">
        {isLoading ? (
          <div className="text-xs text-[var(--color-text-faint)]">جارٍ التحميل...</div>
        ) : tags.length === 0 ? (
          <div className="text-xs text-[var(--color-text-muted)]">لا توجد وسوم مسجلة.</div>
        ) : (
          tags.map((t: BlogTag) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[var(--color-border)] text-xs text-[var(--color-ink)]"
            >
              <span>#{t.name}</span>
              <button
                onClick={() => {
                  if (confirm(`حذف وسم "${t.name}"؟`)) deleteMutation.mutate(t.id)
                }}
                className="text-red-400 hover:text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 5) COMMENTS TAB
// ─────────────────────────────────────────────────────────
function CommentsTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState("all")

  const { data: commentsRes, isLoading } = useQuery({
    queryKey: ["admin-comments", filterStatus],
    queryFn: () => BlogAPI.getAdminComments({ status: filterStatus !== "all" ? filterStatus : undefined }),
  })

  const comments = commentsRes?.data ?? []

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" | "spam" }) =>
      BlogAPI.updateCommentStatus(id, status),
    onSuccess: () => {
      onNotify("تم تحديث حالة التعليق.")
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteComment(id),
    onSuccess: () => {
      onNotify("تم حذف التعليق.")
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] })
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {["all", "pending", "approved", "spam"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              filterStatus === s ? "bg-[var(--color-ink)] text-white" : "bg-white border text-[var(--color-text-muted)]"
            }`}
          >
            {s === "all" ? "الكل" : s === "pending" ? "المعلقة" : s === "approved" ? "المعتمدة" : "مزعجة (Spam)"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-[var(--color-text-faint)]">جارٍ التحميل...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center bg-[var(--color-bg-subtle,#FAF8F6)] rounded-2xl border text-xs text-[var(--color-text-muted)]">
          لا توجد تعليقات في هذه القائمة.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c: BlogComment) => (
            <div key={c.id} className="p-4 bg-white border border-[var(--color-border)] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[var(--color-ink)]">{c.author_name}</span>
                  <span className="text-[11px] text-[var(--color-text-faint)] font-mono">({c.author_email})</span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      c.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : c.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {c.status !== "approved" && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: c.id, status: "approved" })}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      موافقة
                    </button>
                  )}
                  {c.status !== "spam" && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: c.id, status: "spam" })}
                      className="text-amber-600 font-bold hover:underline"
                    >
                      Spam
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("حذف هذا التعليق نهائياً؟")) deleteMutation.mutate(c.id)
                    }}
                    className="text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </div>
              <p className="text-xs text-[var(--color-ink)] leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 6) REDIRECTS TAB (301)
// ─────────────────────────────────────────────────────────
function RedirectsTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [source, setSource] = useState("")
  const [target, setTarget] = useState("")

  const { data: redirectsRes, isLoading } = useQuery({
    queryKey: ["admin-redirects"],
    queryFn: () => BlogAPI.getAdminRedirects(),
  })
  const redirects = redirectsRes?.data ?? []

  const saveMutation = useMutation({
    mutationFn: (data: { source_path: string; target_path: string; status_code: number }) =>
      BlogAPI.saveRedirect(data),
    onSuccess: () => {
      onNotify("تم إضافة التحويل 301 بنجاح.")
      setSource("")
      setTarget("")
      queryClient.invalidateQueries({ queryKey: ["admin-redirects"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteRedirect(id),
    onSuccess: () => {
      onNotify("تم حذف التحويل.")
      queryClient.invalidateQueries({ queryKey: ["admin-redirects"] })
    },
  })

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (source.trim() && target.trim()) {
            saveMutation.mutate({ source_path: source.trim(), target_path: target.trim(), status_code: 301 })
          }
        }}
        className="p-4 bg-white border border-[var(--color-border)] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
      >
        <div>
          <label className="block text-[11px] font-bold mb-1">المسار القديم (Source)</label>
          <input
            type="text"
            required
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="/posts/old-slug"
            className="w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold mb-1">المسار الجديد (Target)</label>
          <input
            type="text"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="/posts/new-slug"
            className="w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none"
          />
        </div>
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          size="sm"
          className="bg-[var(--color-ink)] text-white text-xs font-bold rounded-xl py-2"
        >
          + إضافة تحويل 301
        </Button>
      </form>

      <div className="space-y-2">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-[var(--color-text-faint)]">جارٍ التحميل...</div>
        ) : redirects.length === 0 ? (
          <div className="py-8 text-center bg-[var(--color-bg-subtle,#FAF8F6)] rounded-2xl border text-xs text-[var(--color-text-muted)]">
            لا توجد تحويلات مخصصة مسجلة حالياً.
          </div>
        ) : (
          redirects.map((r: BlogRedirect) => (
            <div key={r.id} className="p-3 bg-white border rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-red-500">{r.source_path}</span>
                <span className="text-gray-400">→</span>
                <span className="text-emerald-600 font-bold">{r.target_path}</span>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  {r.status_code} ({r.hits} نقرة)
                </span>
              </div>
              <button
                onClick={() => {
                  if (confirm("حذف هذا التحويل؟")) deleteMutation.mutate(r.id)
                }}
                className="text-red-400 hover:text-red-600 font-bold"
              >
                حذف
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 7) SETTINGS TAB
// ─────────────────────────────────────────────────────────
function SettingsTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const { data: settingsRes, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => BlogAPI.getAdminSettings(),
  })

  const [form, setForm] = useState<Partial<BlogSettings>>({})

  // Sync state once loaded
  const current = { ...settingsRes?.settings, ...form }

  const saveMutation = useMutation({
    mutationFn: (data: Partial<BlogSettings>) => BlogAPI.updateAdminSettings(data),
    onSuccess: () => {
      onNotify("تم حفظ إعدادات المدونة بنجاح.")
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] })
      queryClient.invalidateQueries({ queryKey: ["blog-settings"] })
    },
  })

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-[var(--color-text-faint)]">جارٍ تحميل الإعدادات...</div>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        saveMutation.mutate(current)
      }}
      className="max-w-2xl bg-white p-6 rounded-2xl border border-[var(--color-border)] space-y-4 text-xs"
    >
      <div>
        <label className="block font-bold text-[var(--color-ink)] mb-1">اسم المدونة الرئيسي</label>
        <input
          type="text"
          value={current.blog_title ?? ""}
          onChange={(e) => setForm({ ...form, blog_title: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none"
        />
      </div>

      <div>
        <label className="block font-bold text-[var(--color-ink)] mb-1">السب دومين المخصص</label>
        <input
          type="text"
          value={current.blog_subdomain ?? "blog.amtdex.com"}
          onChange={(e) => setForm({ ...form, blog_subdomain: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-mono outline-none"
        />
      </div>

      <div>
        <label className="block font-bold text-[var(--color-ink)] mb-1">وصف السيو العام للمدونة (Meta Description)</label>
        <textarea
          rows={3}
          value={current.blog_description ?? ""}
          onChange={(e) => setForm({ ...form, blog_description: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none resize-none"
        />
      </div>

      <div>
        <label className="block font-bold text-[var(--color-ink)] mb-1">عدد المقالات لكل صفحة</label>
        <input
          type="number"
          min={3}
          max={30}
          value={current.posts_per_page ?? 9}
          onChange={(e) => setForm({ ...form, posts_per_page: parseInt(e.target.value, 10) })}
          className="w-32 px-3.5 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none"
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="comments_auto"
          checked={Boolean(current.comments_auto_approve)}
          onChange={(e) => setForm({ ...form, comments_auto_approve: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="comments_auto" className="font-semibold text-[var(--color-ink)]">
          الموافقة التلقائية على التعليقات دون مراجعة يدوية
        </label>
      </div>

      <div className="pt-4 border-t border-[var(--color-border)]">
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="bg-[var(--color-ink)] hover:bg-[var(--color-primary)] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
        >
          {saveMutation.isPending ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </form>
  )
}
