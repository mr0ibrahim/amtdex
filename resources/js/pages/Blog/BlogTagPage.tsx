import { useTransition } from "react"
import { useParams, Link, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Seo } from "@/components/Seo"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getBlogUrl, isBlogSubdomain } from "@/lib/subdomain"
import type { BlogPost, BlogTag } from "@/types/blog"

export function BlogTagPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const [, startTransition] = useTransition()

  // Fetch posts by tag
  const { data: postsRes, isLoading: postsLoading } = useQuery({
    queryKey: ["blog-tag-posts", slug, page],
    queryFn: () => BlogAPI.getPosts({ tag: slug, page, per_page: 9 }),
    enabled: Boolean(slug),
  })

  const { data: tagsRes } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: () => BlogAPI.getTags(),
  })

  const tags = tagsRes?.data ?? []
  const currentTag = tags.find((t: BlogTag) => t.slug === slug)
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

  const tagName = currentTag?.name || slug || "وسم"
  const tagTitle = `مقالات وسم #${tagName}`
  const tagDesc = `تصفح كافة المقالات والدروس التقنية المرتبطة بوسم #${tagName} على مدونة Amtdex.`
  const canonicalUrl = getBlogUrl(`/tags/${slug}`)

  // Breadcrumb schema
  const schema: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: tagTitle,
      description: tagDesc,
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
          name: `#${tagName}`,
          item: canonicalUrl,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-ink)]">
      <Seo
        title={`${tagTitle} | مدونة Amtdex`}
        description={tagDesc}
        canonical={canonicalUrl}
        jsonLd={schema}
      />

      {/* Header Banner */}
      <section className="bg-white border-b border-[var(--color-border)] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Link to={isBlogSubdomain() ? "/" : getBlogUrl("/")} className="hover:text-[var(--color-primary)] transition-colors">
              المدونة
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">الوسوم</span>
            <span>/</span>
            <span className="text-[var(--color-primary)] font-semibold">#{tagName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-card-soft)] text-[var(--color-primary)] text-xs font-bold mb-3">
                <span>#</span>
                وسم مقالات
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-ink)] font-heading">
                #{tagName}
              </h1>
              <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-2xl mt-2 leading-relaxed">
                استكشف كافة المقالات والأفكار البرمجية المصنفة تحت هذا الوسم.
              </p>
            </div>

            {meta && (
              <div className="bg-[var(--color-bg-subtle)] px-4 py-3 rounded-2xl border border-[var(--color-border)] text-center shrink-0">
                <span className="text-2xl font-extrabold text-[var(--color-ink)] block font-mono">
                  {meta.total}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">مقال مرتبط</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white rounded-3xl border border-[var(--color-border)] p-5 space-y-4">
                <div className="h-44 bg-[var(--color-border)] rounded-2xl" />
                <div className="h-5 bg-[var(--color-border)] rounded w-3/4" />
                <div className="h-4 bg-[var(--color-border)] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[var(--color-border)] max-w-lg mx-auto space-y-4">
            <span className="text-4xl">🏷️</span>
            <h2 className="text-lg font-bold text-[var(--color-ink)]">لا توجد مقالات مرتبطة بهذا الوسم</h2>
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
                  className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white hover:shadow-md transition-all flex flex-col justify-between"
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
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-card-soft)] text-[var(--color-primary)] font-bold text-xl">
                        Amtdex
                      </div>
                    )}
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {post.category && (
                        <span className="text-xs font-bold text-[var(--color-primary)] mb-1 block">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-[var(--color-ink)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                        <Link to={isBlogSubdomain() ? `/posts/${post.slug}` : getBlogUrl(`/posts/${post.slug}`)}>
                          {post.title}
                        </Link>
                      </h3>
                      {post.summary && (
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-2 leading-relaxed">
                          {post.summary}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--color-ink)] group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        قراءة المقال ←
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        {post.reading_time} د قراءة
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
