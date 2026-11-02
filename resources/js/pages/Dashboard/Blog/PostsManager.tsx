import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { getBlogUrl } from "@/lib/subdomain"
import type { BlogPost } from "@/types/blog"
import { ArticleEditorModal } from "./editor/ArticleEditorModal"

function formatSeoPublishError(err: unknown): string {
  if (err instanceof ApiError && err.errors) {
    const messages = Object.values(err.errors).flat().filter(Boolean)
    if (messages.length) return messages.slice(0, 3).join(" — ")
  }
  if (err instanceof Error && err.message) return err.message
  return "تعذر إكمال العملية بسبب متطلبات SEO أو التحقق."
}

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
    onError: (err) => onNotify(formatSeoPublishError(err)),
  })

  const handleNewPost = () => {
    setEditingPost({
      title: "",
      slug: "",
      summary: "",
      content: "<h2>مقدمة</h2><p>اكتب هنا محتوى مقالك...</p>",
      status: "draft",
      allow_comments: true,
      robots_index: true,
      robots_follow: true,
      is_featured: false,
      og_type: "article",
      twitter_card: "summary_large_image",
      schema_type: "BlogPosting",
      faq_schema: [],
      tags: [],
    })
    setIsEditorOpen(true)
  }

  const handleEditPost = async (post: BlogPost) => {
    try {
      const res = await BlogAPI.getAdminPost(post.id)
      setEditingPost(res.post)
    } catch {
      setEditingPost(post)
    }
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
                      void handleEditPost(p)
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
                            void handleEditPost(p)
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
