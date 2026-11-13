import { BlogArticleCard } from "./BlogArticleCard"
import { useEffect, useTransition } from "react"
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Seo } from "@/components/Seo"
import { Button } from "@/components/ui/Button"
import { getBlogUrl, isBlogSubdomain } from "@/lib/subdomain"
import type { BlogPost, BlogCategory } from "@/types/blog"

export function BlogCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const [, startTransition] = useTransition()

  const { data: categoryRes, isLoading: postsLoading, isError } = useQuery({
    queryKey: ["blog-category", slug, page],
    queryFn: () => BlogAPI.getCategory(slug!, page),
    enabled: Boolean(slug),
  })

  useEffect(() => {
    if (!categoryRes?.redirect || !categoryRes.target) return
    const targetSlug = categoryRes.target.replace(/^\/?categories\//, "").replace(/\/$/, "")
    if (!targetSlug || targetSlug === slug) return
    navigate(isBlogSubdomain() ? `/categories/${targetSlug}` : getBlogUrl(`/categories/${targetSlug}`), {
      replace: true,
    })
  }, [categoryRes, navigate, slug])

  const currentCategory = categoryRes?.category
  const posts = categoryRes?.posts ?? []
  const meta = categoryRes?.meta

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const next = new URLSearchParams(searchParams)
      next.set("page", String(newPage))
      setSearchParams(next)
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  const categoryTitle = currentCategory?.meta_title || currentCategory?.name || slug || "التصنيف"
  const categoryDesc =
    currentCategory?.meta_description ||
    currentCategory?.description ||
    `أحدث المقالات التقنية والشروحات ضمن تصنيف ${currentCategory?.name || slug}.`
  const canonicalUrl = currentCategory?.canonical_url || getBlogUrl(`/categories/${slug}`)
  const schema = categoryRes?.json_ld

  return (
    <div data-motion-group className="blog-surface min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-ink)]">
      <Seo
        title={`${categoryTitle} | مدونة Amtdex`}
        description={categoryDesc}
        canonical={canonicalUrl}
        jsonLd={schema}
        noindex={Boolean(currentCategory?.noindex)}
      />

      <section className="bg-white border-b border-[var(--color-border)] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Link to={isBlogSubdomain() ? "/" : getBlogUrl("/")} className="hover:text-[var(--color-primary)] transition-colors">
              المدونة
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">التصنيفات</span>
            <span>/</span>
            <span className="text-[var(--color-primary)] font-semibold">{currentCategory?.name || slug}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-card-soft)] text-[var(--color-primary)] text-xs font-bold mb-3">
                تصنيف مقالات
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-ink)] font-heading">
                {currentCategory?.name || slug}
              </h1>
              {currentCategory?.description && (
                <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-2xl mt-2 leading-relaxed">
                  {currentCategory.description}
                </p>
              )}
            </div>

            {meta && (
              <div className="bg-[var(--color-bg-subtle)] px-4 py-3 rounded-2xl border border-[var(--color-border)] text-center shrink-0">
                <span className="text-2xl font-extrabold text-[var(--color-ink)] block font-mono">{meta.total}</span>
                <span className="text-xs text-[var(--color-text-muted)]">مقال منشور</span>
              </div>
            )}
          </div>

          {currentCategory?.children && currentCategory.children.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <span className="text-xs font-bold text-[var(--color-text-muted)]">التصنيفات الفرعية:</span>
              {currentCategory.children.map((child: BlogCategory) => (
                <Link
                  key={child.id}
                  to={isBlogSubdomain() ? `/categories/${child.slug}` : getBlogUrl(`/categories/${child.slug}`)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-subtle)] hover:bg-[var(--color-card-soft)] hover:text-[var(--color-primary)] transition-colors border border-[var(--color-border)]"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-3xl border border-[var(--color-border)] p-5 space-y-4">
                <div className="h-44 bg-[var(--color-border)] rounded-2xl" />
                <div className="h-5 bg-[var(--color-border)] rounded w-3/4" />
                <div className="h-4 bg-[var(--color-border)] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[var(--color-border)] max-w-lg mx-auto space-y-4">
            <h2 className="text-lg font-bold text-[var(--color-ink)]">تعذر تحميل التصنيف</h2>
            <Link to={isBlogSubdomain() ? "/" : getBlogUrl("/")}>
              <Button className="mt-2 text-xs rounded-xl">العودة للمدونة</Button>
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[var(--color-border)] max-w-lg mx-auto space-y-4">
            <h2 className="text-lg font-bold text-[var(--color-ink)]">لا توجد مقالات في هذا التصنيف حالياً</h2>
            <p className="text-xs text-[var(--color-text-muted)]">تابعنا قريباً، نقوم بإعداد مقالات قيمة ضمن هذا التخصص.</p>
            <Link to={isBlogSubdomain() ? "/" : getBlogUrl("/")}>
              <Button className="mt-2 text-xs rounded-xl">العودة لكافة المقالات</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: BlogPost) => (
                <BlogArticleCard key={post.id} post={post} />
              ))}
            </div>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="rounded-xl text-xs">
                  السابق
                </Button>
                {Array.from({ length: meta.last_page }).map((_, idx) => {
                  const p = idx + 1
                  return (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === page ? "primary" : "outline"}
                      onClick={() => handlePageChange(p)}
                      className="w-9 h-9 rounded-xl text-xs font-semibold"
                    >
                      {p}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.last_page}
                  onClick={() => handlePageChange(page + 1)}
                  className="rounded-xl text-xs"
                >
                  التالي
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
