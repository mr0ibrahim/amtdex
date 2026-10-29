import { useState, useTransition } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Seo } from "@/components/Seo"
import { getBlogUrl } from "@/lib/subdomain"
import type { BlogPost, BlogCategory } from "@/types/blog"

export function BlogHomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const category = searchParams.get("category") ?? ""
  const tag = searchParams.get("tag") ?? ""
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "")
  const [, startTransition] = useTransition()

  // Queries
  const { data: postsRes, isLoading } = useQuery({
    queryKey: ["blog-posts", { page, category, tag, q: searchParams.get("q") ?? "" }],
    queryFn: () =>
      BlogAPI.getPosts({
        page,
        category: category || undefined,
        tag: tag || undefined,
        q: searchParams.get("q") || undefined,
        per_page: 9,
      }),
  })

  const { data: featuredRes } = useQuery({
    queryKey: ["blog-featured"],
    queryFn: () => BlogAPI.getPosts({ featured: true, per_page: 1 }),
  })

  const { data: categoriesRes } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => BlogAPI.getCategories(),
  })

  const { data: settingsRes } = useQuery({
    queryKey: ["blog-settings"],
    queryFn: () => BlogAPI.getSettings(),
  })

  const featuredPost = featuredRes?.data?.[0]
  const posts = postsRes?.data ?? []
  const meta = postsRes?.meta
  const categories = categoriesRes?.data ?? []
  const settings = settingsRes?.settings

  const handleCategorySelect = (catSlug: string) => {
    startTransition(() => {
      const next = new URLSearchParams(searchParams)
      if (!catSlug) next.delete("category")
      else next.set("category", catSlug)
      next.set("page", "1")
      setSearchParams(next)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      const next = new URLSearchParams(searchParams)
      if (searchInput.trim()) next.set("q", searchInput.trim())
      else next.delete("q")
      next.set("page", "1")
      setSearchParams(next)
    })
  }

  const handleClearFilter = () => {
    setSearchInput("")
    startTransition(() => {
      setSearchParams({})
    })
  }

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const next = new URLSearchParams(searchParams)
      next.set("page", String(newPage))
      setSearchParams(next)
      window.scrollTo({ top: 380, behavior: "smooth" })
    })
  }

  // Schema.org
  const blogUrl = getBlogUrl("/")
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: settings?.blog_title ?? "المدونة التقنية — Amtdex",
    description: settings?.blog_description ?? "مقالات وأدلة عملية في هندسة البرمجيات والذكاء الاصطناعي.",
    url: blogUrl,
    publisher: {
      "@type": "Organization",
      name: "Amtdex",
      url: "https://amtdex.com",
      logo: "https://amtdex.com/favicon.svg",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${blogUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <Seo
        title={settings?.blog_title ?? "المدونة التقنية"}
        description={settings?.blog_description}
        canonical={blogUrl}
        preloadImage={featuredPost?.cover_image ?? undefined}
        rssFeedUrl="/feed"
        jsonLd={jsonLd}
        breadcrumbs={[{ name: "الرئيسية", url: "https://amtdex.com" }, { name: "المدونة", url: blogUrl }]}
      />

      <div className="bg-[var(--color-bg)] min-h-screen">
        {/* Blog Header Hero */}
        <section className="relative overflow-hidden pt-12 pb-14 border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-card-soft)]/50 to-[var(--color-bg)]">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[var(--color-lavender)] text-[var(--color-primary)] border border-[var(--color-border)] mb-4">
                <span className="size-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                رؤى وأدلة تقنية متقدمة
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--color-ink)] tracking-tight leading-tight">
                {settings?.blog_title ?? "مدونة Amtdex التقنية"}
              </h1>
              <p className="mt-4 text-[15px] sm:text-[17px] text-[var(--color-text-muted)] leading-relaxed">
                {settings?.blog_description ?? "أفكار عملية وتجارب حية في هندسة البرمجيات، الذكاء الاصطناعي، والأنظمة السحابية — من واقع مشاريعنا الحقيقية."}
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="mt-8 flex items-center max-w-xl mx-auto bg-white border border-[var(--color-border)] rounded-full p-1.5 shadow-[var(--shadow-card)] focus-within:ring-2 focus-within:ring-[var(--color-primary-light)]/20 transition-all">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="ابحث في المقالات والتقنيات..."
                  className="flex-1 px-4 py-2 text-[14px] bg-transparent outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]"
                />
                <Button type="submit" size="sm" variant="primary">
                  بحث
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Post Hero Card (Only on Page 1 without query filters) */}
        {page === 1 && !category && !tag && !searchParams.get("q") && featuredPost && (
          <section className="py-10 bg-[var(--color-bg)]">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
              <Card hover padding="none" className="overflow-hidden border border-[var(--color-border)]">
                <div className="grid lg:grid-cols-[1.2fr_1fr] items-center">
                  <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-between h-full order-2 lg:order-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge variant="warning">⭐ مقال مميز</Badge>
                        {featuredPost.category && (
                          <span className="text-[12px] font-semibold text-[var(--color-primary-light)]">
                            {featuredPost.category.name}
                          </span>
                        )}
                        <span className="text-[12px] text-[var(--color-text-faint)]">•</span>
                        <span className="text-[12px] text-[var(--color-text-muted)]">
                          {featuredPost.reading_time_minutes} دقائق قراءة
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] leading-snug hover:text-[var(--color-primary-light)] transition-colors">
                        <Link to={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
                      </h2>
                      <p className="mt-3 text-[14px] sm:text-[15px] text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                        {featuredPost.summary}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {featuredPost.author?.avatar && (
                          <img
                            src={featuredPost.author.avatar}
                            alt={featuredPost.author.name}
                            className="size-10 rounded-full object-cover border border-[var(--color-border)]"
                            loading="eager"
                          />
                        )}
                        <div>
                          <div className="text-[13px] font-bold text-[var(--color-text)]">
                            {featuredPost.author?.name}
                          </div>
                          <div className="text-[11px] text-[var(--color-text-faint)]">
                            {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }) : ""}
                          </div>
                        </div>
                      </div>
                      <Link to={`/posts/${featuredPost.slug}`}>
                        <Button size="sm" variant="secondary">
                          اقرأ المقال ←
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full bg-[var(--color-card-soft)] order-1 lg:order-2">
                    <img
                      src={featuredPost.cover_image ?? "https://amtdex.com/images/screens/business.webp"}
                      alt={featuredPost.cover_image_alt ?? featuredPost.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Categories Bar & Articles Grid */}
        <section className="py-8">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCategorySelect("")}
                  className={`text-[13px] font-semibold px-4 py-2 rounded-full transition-all ${
                    !category
                      ? "bg-[var(--color-ink)] text-white shadow-[var(--shadow-card)]"
                      : "bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-lavender)]"
                  }`}
                >
                  الكل
                </button>
                {categories.map((cat: BlogCategory) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`text-[13px] font-semibold px-4 py-2 rounded-full transition-all ${
                      category === cat.slug
                        ? "bg-[var(--color-ink)] text-white shadow-[var(--shadow-card)]"
                        : "bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-lavender)]"
                    }`}
                  >
                    {cat.name}
                    {cat.published_posts_count !== undefined && (
                      <span className={`mr-1.5 text-[11px] ${category === cat.slug ? "opacity-75" : "text-[var(--color-text-faint)]"}`}>
                        ({cat.published_posts_count})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {(category || tag || searchParams.get("q")) && (
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="text-[12px] font-medium text-rose-600 hover:underline"
                >
                  ✕ مسح الفلاتر
                </button>
              )}
            </div>

            {/* Articles Grid */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-white border border-[var(--color-border)] rounded-[24px] p-5 h-96 flex flex-col justify-between">
                    <div className="bg-gray-200 h-44 rounded-xl mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-6 bg-gray-200 rounded w-5/6" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded mt-4" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[var(--color-border)] rounded-[24px]">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">لا توجد مقالات مطابقة</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  جرب تغيير كلمات البحث أو تصفح تصنيف آخر.
                </p>
                <Button onClick={handleClearFilter} size="sm" variant="secondary" className="mt-4">
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: BlogPost) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  → السابق
                </Button>
                {Array.from({ length: meta.last_page }).map((_, i) => {
                  const p = i + 1
                  if (
                    p === 1 ||
                    p === meta.last_page ||
                    (p >= page - 1 && p <= page + 1)
                  ) {
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`size-9 rounded-full text-[13px] font-bold transition-all ${
                          page === p
                            ? "bg-[var(--color-ink)] text-white shadow-[var(--shadow-card)]"
                            : "border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:bg-[var(--color-lavender)]"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  }
                  if (p === 2 && page > 3) return <span key={p} className="px-1 text-[var(--color-text-faint)]">...</span>
                  if (p === meta.last_page - 1 && page < meta.last_page - 2) return <span key={p} className="px-1 text-[var(--color-text-faint)]">...</span>
                  return null
                })}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= meta.last_page}
                  onClick={() => handlePageChange(page + 1)}
                >
                  التالي ←
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter / RSS Subscription CTA */}
        <section className="py-14 bg-[var(--color-card-soft)] border-t border-[var(--color-border)] mt-12">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-xl mx-auto">
              <span className="size-12 rounded-2xl bg-[var(--color-ink)] text-white grid place-items-center mx-auto text-xl mb-4 shadow-[var(--shadow-card)]">
                📡
              </span>
              <h3 className="text-2xl font-bold text-[var(--color-ink)]">
                تابع جديد التحليلات الهندسية
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                نشارك كل أسبوع دراسات حالة وأدلة كود حصرية مباشرة إلى بريدك أو عبر قارئ خلاصات RSS المفضل لديك.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/feed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold bg-[#F26522] text-white hover:opacity-90 shadow-[var(--shadow-card)] transition-opacity"
                >
                  خلاصة RSS Feed ↗
                </a>
                <Link to="/contact">
                  <Button variant="secondary" size="md">
                    استشارة هندسية لمشروعك
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Card hover padding="none" className="overflow-hidden flex flex-col justify-between bg-white border border-[var(--color-border)] group">
      <div>
        <Link to={`/posts/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-[var(--color-card-soft)]">
          <img
            src={post.cover_image ?? "https://amtdex.com/images/screens/projects.webp"}
            alt={post.cover_image_alt ?? post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {post.category && (
            <span className="absolute top-3 right-3 bg-[var(--color-ink)] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
              {post.category.name}
            </span>
          )}
        </Link>

        <div className="p-5">
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-faint)] mb-2.5">
            <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" }) : ""}</span>
            <span>•</span>
            <span>{post.reading_time_minutes} دقائق قراءة</span>
          </div>

          <h3 className="text-[17px] font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-primary-light)] transition-colors line-clamp-2">
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="mt-2 text-[13px] text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 border-t border-[var(--color-border)]/60 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 pt-3">
          {post.author?.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="size-7 rounded-full object-cover border border-[var(--color-border)]"
              loading="lazy"
            />
          )}
          <span className="text-[12px] font-medium text-[var(--color-text)]">
            {post.author?.name}
          </span>
        </div>
        <Link to={`/posts/${post.slug}`} className="text-[12px] font-bold text-[var(--color-primary-light)] group-hover:underline pt-3">
          قراءة المزيد ←
        </Link>
      </div>
    </Card>
  )
}
