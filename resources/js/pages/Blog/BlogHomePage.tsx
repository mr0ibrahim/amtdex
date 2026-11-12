import "../../../css/blog-prose.css"
import { useEffect, useState, useTransition } from "react"
import { useDebouncedValue } from "@/routing/search"
import { highlightMatch } from "@/search/arabic"
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
  const debouncedQuery = useDebouncedValue(searchInput, 200)
  const [, startTransition] = useTransition()

  // Queries
  const { data: postsRes, isLoading, isFetching } = useQuery({
    queryKey: ["blog-posts", { page, category, tag, q: debouncedQuery.trim() }],
    queryFn: ({ signal }) =>
      BlogAPI.getPosts({
        page,
        category: category || undefined,
        tag: tag || undefined,
        q: debouncedQuery.trim() || undefined,
        per_page: 9,
        signal,
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

  useEffect(() => {
    const current = searchParams.get("q") ?? ""
    if (debouncedQuery.trim() === current) return
    startTransition(() => {
      const next = new URLSearchParams(searchParams)
      if (debouncedQuery.trim()) next.set("q", debouncedQuery.trim())
      else next.delete("q")
      next.set("page", "1")
      setSearchParams(next)
    })
  }, [debouncedQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

  // Prefer server-generated Organization + WebSite JSON-LD from Laravel.
  const blogUrl = getBlogUrl("/")
  const jsonLd =
    settingsRes?.json_ld && settingsRes.json_ld.length > 0
      ? settingsRes.json_ld
      : {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: settings?.blog_title ?? "المدونة التقنية — Amtdex",
          description:
            settings?.blog_description ?? "مقالات وأدلة عملية في هندسة البرمجيات والذكاء الاصطناعي.",
          url: blogUrl,
          publisher: {
            "@type": "Organization",
            name: "Amtdex",
            url: "https://amtdex.com",
            logo: { "@type": "ImageObject", url: "https://amtdex.com/logo.png" },
          },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${blogUrl}?q={search_term_string}`,
            },
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
        <section data-motion-group className="pt-14 pb-12 border-b border-[var(--color-border)]">
          <div className="page-container page-container--wide">
            <div className="max-w-3xl">
              <span className="eyebrow">رؤى وأدلة تقنية متقدمة</span>
              <h1 data-motion="rise" data-motion-delay="120" className="mt-4 text-3xl sm:text-5xl font-semibold text-[var(--color-ink)] leading-[1.2]">
                {settings?.blog_title ?? "مدونة Amtdex التقنية"}
              </h1>
              <p className="mt-4 text-[15px] sm:text-[17px] text-[var(--color-text-muted)] leading-relaxed">
                {settings?.blog_description ?? "أفكار عملية وتجارب حية في هندسة البرمجيات، الذكاء الاصطناعي، والأنظمة السحابية — من واقع مشاريعنا الحقيقية."}
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} role="search" className="blog-search mt-8">
                <input
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchInput("")
                  }}
                  placeholder="ابحث في المقالات والتقنيات..."
                  aria-label="ابحث في المقالات والتقنيات"
                  className="px-4 py-2 text-[14px] bg-[var(--input-bg)] text-[var(--input-text)] outline-none placeholder:text-[var(--placeholder)]"
                />
                <Button type="submit" size="sm" variant="primary">
                  بحث
                </Button>
              </form>
              {isFetching && searchInput.trim() && (
                <p className="mt-2 text-[12px] text-[var(--color-text-muted)]" role="status">جار البحث...</p>
              )}
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
                      src={featuredPost.cover_image ?? "https://amtdex.com/images/screens/projects.webp"}
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
                  className="blog-clear-filters text-[12px] font-medium hover:underline"
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
              <div>
                <div className="da-blog-empty">
                  <h3 className="text-lg font-bold text-[var(--color-ink)]">لا توجد مقالات مطابقة</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    جرب تغيير كلمات البحث أو تصفح تصنيف آخر.
                  </p>
                  <Button onClick={handleClearFilter} size="sm" variant="secondary" className="mt-4">
                    إعادة تعيين الفلاتر
                  </Button>
                </div>
                <div className="da-template" aria-hidden="true">
                  <p className="da-kicker">قالب العرض — ليس مقالاً منشوراً</p>
                  <p className="mt-2 text-[13px] text-[var(--color-text-muted)]">يُستخدم هذا الشكل عندما تُنشر مقالات من لوحة المدونة. الكلمات أدناه أسماء حقول، وليست عناوين مقالات.</p>
                  <div className="da-post-skel" style={{ marginTop: 16 }}>
                    <div className="da-cover">غلاف المقال</div>
                    <div>
                      <div className="text-[12px] text-[var(--color-text-faint)]">التصنيف</div>
                      <div className="mt-1 font-bold">عنوان المقال</div>
                      <div className="mt-1 text-[13px] text-[var(--color-text-muted)]">الملخص</div>
                      <div className="mt-3 text-[13px] font-bold">اقرأ المقال</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: BlogPost) => (
                  <PostCard key={post.id} post={post} query={debouncedQuery} />
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold bg-[#461667] text-[#F8F2FB] hover:opacity-90 shadow-[var(--shadow-card)] transition-opacity"
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

function PostCard({ post, query = "" }: { post: BlogPost; query?: string }) {
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
            <Link to={`/posts/${post.slug}`}>{highlightMatch(post.title, query)}</Link>
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
