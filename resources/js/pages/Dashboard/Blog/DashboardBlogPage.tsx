import { lazy, Suspense, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { QueryError } from "@/components/ui/QueryError"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toast"
import { getBlogUrl } from "@/lib/subdomain"

const PostsManager = lazy(() => import("./PostsManager").then(m => ({ default: m.PostsManager })))
const CategoriesTab = lazy(() => import("./CategoriesTab").then(m => ({ default: m.CategoriesTab })))
const TagsTab = lazy(() => import("./TagsTab").then(m => ({ default: m.TagsTab })))
const CommentsTab = lazy(() => import("./CommentsTab").then(m => ({ default: m.CommentsTab })))
const RedirectsTab = lazy(() => import("./RedirectsTab").then(m => ({ default: m.RedirectsTab })))
const SettingsTab = lazy(() => import("./SettingsTab").then(m => ({ default: m.SettingsTab })))

type BlogTab = "posts" | "categories" | "tags" | "comments" | "redirects" | "settings"

export function DashboardBlogPage({ onToast }: { onToast?: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState<BlogTab>("posts")
  const toast = useToast()

  const notify = (msg: string) => {
    if (onToast) onToast(msg)
    else toast.show(msg)
  }

  const { data: statsRes, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ["admin-blog-stats"],
    queryFn: () => BlogAPI.getAdminStats(),
  })

  const stats = statsRes?.stats
  const count = (value: number | undefined) => value == null ? "—" : Number(value).toLocaleString("ar-EG")

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
    <div className="dash-blog-page space-y-5">
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

      <QueryError error={statsError} onRetry={() => { void refetchStats() }} />
      <div className="dash-blog-stats grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { label: "إجمالي المقالات", value: count(stats?.total_posts), sub: `${count(stats?.published_posts)} منشور` },
          { label: "المشاهدات", value: count(stats?.total_views), sub: "تحديث حي" },
          { label: "تعليقات معلّقة", value: count(stats?.pending_comments), sub: "تتطلب مراجعة" },
          {
            label: "تصنيفات / وسوم",
            value: `${count(stats?.categories_count)} / ${count(stats?.tags_count)}`,
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

      <Suspense fallback={<p role="status">جار تحميل القسم...</p>}>
      {activeTab === "posts" && <PostsManager onNotify={notify} />}
      {activeTab === "categories" && <CategoriesTab onNotify={notify} />}
      {activeTab === "tags" && <TagsTab onNotify={notify} />}
      {activeTab === "comments" && <CommentsTab onNotify={notify} />}
      {activeTab === "redirects" && <RedirectsTab onNotify={notify} />}
      {activeTab === "settings" && <SettingsTab onNotify={notify} />}
      </Suspense>
    </div>
  )
}
