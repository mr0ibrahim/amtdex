import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toast"
import { getBlogUrl } from "@/lib/subdomain"
import type { BlogCategory, BlogTag, BlogComment, BlogRedirect, BlogSettings } from "@/types/blog"
import { PostsManager } from "./PostsManager"

type BlogTab = "posts" | "categories" | "tags" | "comments" | "redirects" | "settings"

export function DashboardBlogPage({ onToast }: { onToast?: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState<BlogTab>("posts")
  const toast = useToast()

  const notify = (msg: string) => {
    toast.show(msg)
    onToast?.(msg)
  }

  const { data: statsRes } = useQuery({
    queryKey: ["admin-blog-stats"],
    queryFn: () => BlogAPI.getAdminStats(),
  })

  const stats = statsRes?.stats

  const tabs: Array<{ id: BlogTab; label: string; count?: number | string }> = [
    { id: "posts", label: "المقالات", count: stats?.total_posts },
    { id: "categories", label: "التصنيفات", count: stats?.categories_count },
    { id: "tags", label: "الوسوم", count: stats?.tags_count },
    {
      id: "comments",
      label: "التعليقات",
      count: stats?.pending_comments ? stats.pending_comments : undefined,
    },
    { id: "redirects", label: "تحويلات 301" },
    { id: "settings", label: "إعدادات SEO" },
  ]

  return (
    <div className="space-y-5">
      {toast.el}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[var(--color-ink)] tracking-tight">إدارة المدونة</h1>
            <Badge className="bg-[var(--color-card-soft)] text-[var(--color-primary)] border-none text-[10px] font-bold">
              مركز النشر
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed max-w-[560px]">
            أنشئ المقالات، راجعها، وانشرها بخطوات واضحة مع أدوات التصنيفات والتعليقات وتحسين الظهور.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <a
            href={getBlogUrl("/")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border border-[var(--color-border)] hover:bg-[var(--color-lavender)] text-[var(--color-ink)]"
          >
            زيارة المدونة
          </a>
          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-ink)] text-white"
          >
            إدارة ونشر المقالات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { label: "إجمالي المقالات", value: stats?.total_posts ?? 0, sub: `${stats?.published_posts ?? 0} منشور` },
          { label: "المشاهدات", value: (stats?.total_views ?? 0).toLocaleString("ar-EG"), sub: "تحديث حي" },
          { label: "تعليقات معلّقة", value: stats?.pending_comments ?? 0, sub: "تتطلب مراجعة" },
          {
            label: "تصنيفات / وسوم",
            value: `${stats?.categories_count ?? 0} / ${stats?.tags_count ?? 0}`,
            sub: "هيكل المحتوى",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3.5 sm:p-4">
            <span className="text-[10px] sm:text-[11px] text-[var(--color-text-faint)] block">{card.label}</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] font-mono block mt-1">{card.value}</span>
            <span className="text-[10px] text-[var(--color-text-muted)] mt-1 block">{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="dash-tabs" role="tablist" aria-label="أقسام إدارة المدونة">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
            className={`dash-tab${activeTab === t.id ? " is-active" : ""}`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === t.id ? "bg-white/20" : "bg-black/5"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "posts" && <PostsManager onNotify={notify} />}
      {activeTab === "categories" && <CategoriesTab onNotify={notify} />}
      {activeTab === "tags" && <TagsTab onNotify={notify} />}
      {activeTab === "comments" && <CommentsTab onNotify={notify} />}
      {activeTab === "redirects" && <RedirectsTab onNotify={notify} />}
      {activeTab === "settings" && <SettingsTab onNotify={notify} />}
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
              className="p-4 bg-white border border-[var(--color-border)] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-[var(--color-ink)]">{c.name}</h4>
                <p className="text-[11px] text-[var(--color-text-faint)] font-mono break-all">/categories/{c.slug}</p>
                {c.description && <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{c.description}</p>}
              </div>
              <button
                onClick={() => {
                  if (confirm(`حذف تصنيف "${c.name}"؟`)) deleteMutation.mutate(c.id)
                }}
                className="text-rose-600 border border-rose-200 rounded-xl px-3 py-2 text-xs font-bold w-full sm:w-auto"
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
        className="flex flex-col sm:flex-row gap-2 max-w-md"
      >
        <input
          type="text"
          required
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="أدخل اسم وسم جديد (مثال: React, Docker)..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none"
        />
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          size="sm"
          className="bg-[var(--color-ink)] text-white text-xs font-bold rounded-xl w-full sm:w-auto"
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
      <div className="dash-tabs">
        {["all", "pending", "approved", "spam"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`dash-tab${filterStatus === s ? " is-active" : ""}`}
          >
            {s === "all" ? "الكل" : s === "pending" ? "المعلقة" : s === "approved" ? "المعتمدة" : "مزعجة (Spam)"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-[var(--color-text-faint)]">جارٍ التحميل...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center bg-[var(--color-bg-subtle)] rounded-2xl border text-xs text-[var(--color-text-muted)]">
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
          <div className="py-8 text-center bg-[var(--color-bg-subtle)] rounded-2xl border text-xs text-[var(--color-text-muted)]">
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
