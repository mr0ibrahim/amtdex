import { useTransition } from "react"
import { useParams, Link, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Seo } from "@/components/Seo"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getBlogUrl, isBlogSubdomain } from "@/lib/subdomain"
import type { BlogPost, BlogCategory } from "@/types/blog"

export function BlogCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const [, startTransition] = useTransition()

  // Fetch category & posts in category
  const { data: postsRes, isLoading: postsLoading } = useQuery({
    queryKey: ["blog-category-posts", slug, page],
    queryFn: () => BlogAPI.getPosts({ category: slug, page, per_page: 9 }),
    enabled: Boolean(slug),
  })

  const { data: categoriesRes } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => BlogAPI.getCategories(),
  })

  const categories = categoriesRes?.data ?? []
  const currentCategory = categories.find((c: BlogCategory) => c.slug === slug)
  const posts = postsRes?.data ?? []
  const meta = postsRes?.meta

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
  const canonicalUrl = getBlogUrl(`/categories/${slug}`)

  // Schema.org CollectionPage & BreadcrumbList
  const schema: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: categoryTitle,
      description: categoryDesc,
      url: canonicalUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "المدونة",
          item: getBlogUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: currentCategory?.name || slug,
          item: canonicalUrl,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle,#FAF8F6)] text-[var(--color-ink,#16064F)]">
      <Seo
        title={`${categoryTitle} | مدونة Amtdex`}
        description={categoryDesc}
        canonical={canonicalUrl}
        jsonLd={schema}
      />

      {/* Header Banner */}
      <section className="bg-white border-b border-[var(--color-border,#E2E0DF)] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--color-text-muted,#605856)]">
            <Link to={isBlogSubdomain() ? "/" : getBlogUrl("/")} className="hover:text-[var(--color-primary,#281071)] transition-colors">
              المدونة
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink,#16064F)] font-semibold">التصنيفات</span>
            <span>/</span>
            <span className="text-[var(--color-primary,#281071)] font-semibold">{currentCategory?.name || slug}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-card-soft,#F4EAF7)] text-[var(--color-primary,#281071)] text-xs font-bold mb-3">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                تصنيف مقالات
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-ink,#16064F)] font-heading">
                {currentCategory?.name || slug}
              </h1>
              {currentCategory?.description && (
                <p className="text-sm sm:text-base text-[var(--color-text-muted,#605856)] max-w-2xl mt-2 leading-relaxed">
                  {currentCategory.description}
                </p>
              )}
            </div>

            {meta && (
              <div className="bg-[var(--color-bg-subtle,#FAF8F6)] px-4 py-3 rounded-2xl border border-[var(--color-border,#E2E0DF)] text-center shrink-0">
                <span className="text-2xl font-extrabold text-[var(--color-ink,#16064F)] block font-mono">
                  {meta.total}
                </span>
                <span className="text-xs text-[var(--color-text-muted,#605856)]">مقال منشور</span>
              </div>
            )}
          </div>

          {/* Subcategories if any */}
          {currentCategory?.children && currentCategory.children.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <span className="text-xs font-bold text-[var(--color-text-muted,#605856)]">التصنيفات الفرعية:</span>
              {currentCategory.children.map((child: BlogCategory) => (
                <Link
                  key={child.id}
                  to={isBlogSubdomain() ? `/categories/${child.slug}` : getBlogUrl(`/categories/${child.slug}`)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-subtle,#FAF8F6)] hover:bg-[var(--color-card-soft,#F4EAF7)] hover:text-[var(--color-primary,#281071)] transition-colors border border-[var(--color-border,#E2E0DF)]"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-3xl border border-[var(--color-border,#E2E0DF)] p-5 space-y-4">
                <div className="h-44 bg-[var(--color-border,#E2E0DF)] rounded-2xl" />
                <div className="h-5 bg-[var(--color-border,#E2E0DF)] rounded w-3/4" />
                <div className="h-4 bg-[var(--color-border,#E2E0DF)] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[var(--color-border,#E2E0DF)] max-w-lg mx-auto space-y-4">
            <span className="text-4xl">📂</span>
            <h2 className="text-lg font-bold text-[var(--color-ink,#16064F)]">لا توجد مقالات في هذا التصنيف حالياً</h2>
            <p className="text-xs text-[var(--color-text-muted,#605856)]">
              تابعنا قريباً، نقوم بإعداد مقالات قيمة ضمن هذا التخصص.
            </p>
            <Link to={isBlogSubdomain() ? "/" : getBlogUrl("/")}>
              <Button className="mt-2 text-xs rounded-xl">
                العودة لكافة المقالات
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: BlogPost) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden rounded-3xl border border-[var(--color-border,#E2E0DF)] bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <Link
                    to={isBlogSubdomain() ? `/posts/${post.slug}` : getBlogUrl(`/posts/${post.slug}`)}
                    className="block aspect-video overflow-hidden bg-gray-100 relative"
                  >
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.cover_image_alt || post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-card-soft,#F4EAF7)] text-[var(--color-primary,#281071)] font-bold text-xl">
                        Amtdex
                      </div>
                    )}
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted,#605856)] mb-2">
                        <span>{post.reading_time} دقيقة قراءة</span>
                        <span>•</span>
                        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("ar-SA") : ""}</span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--color-ink,#16064F)] line-clamp-2 group-hover:text-[var(--color-primary,#281071)] transition-colors leading-snug">
                        <Link to={isBlogSubdomain() ? `/posts/${post.slug}` : getBlogUrl(`/posts/${post.slug}`)}>
                          {post.title}
                        </Link>
                      </h3>
                      {post.summary && (
                        <p className="text-xs text-[var(--color-text-muted,#605856)] line-clamp-2 mt-2 leading-relaxed">
                          {post.summary}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border,#E2E0DF)] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--color-ink,#16064F)] group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                        قراءة المقال ←
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted,#605856)]">
                        {post.views_count.toLocaleString("ar-EG")} مشاهدة
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="rounded-xl text-xs"
                >
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
