import { useEffect, useMemo, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Seo } from "@/components/Seo"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toast"
import { getBlogUrl, isBlogSubdomain } from "@/lib/subdomain"
import type { BlogPost, BlogComment } from "@/types/blog"

interface HeadingItem {
  id: string
  text: string
  level: number
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()

  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeHeadingId, setActiveHeadingId] = useState<string>("")
  const [tocOpen, setTocOpen] = useState(false)

  // Comment Form State
  const [commentName, setCommentName] = useState("")
  const [commentEmail, setCommentEmail] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [commentSuccess, setCommentSuccess] = useState(false)

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)))
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch Post
  const {
    data: postResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => BlogAPI.getPostBySlug(slug!),
    enabled: Boolean(slug),
  })

  const post = postResponse?.data || postResponse?.post
  const relatedPosts = postResponse?.related ?? []

  // Extract headings from HTML content and generate IDs
  const { headings, processedHtml } = useMemo(() => {
    if (!post?.content) return { headings: [], processedHtml: "" }

    const raw = post.content
    const items: HeadingItem[] = []
    let counter = 0

    // Match <h2> and <h3> tags
    const htmlWithIds = raw.replace(
      /<h([23])([^>]*)>(.*?)<\/h\1>/gi,
      (_match: string, level: string, attrs: string, text: string) => {
        counter++
        const cleanText = text.replace(/<[^>]+>/g, "").trim()
        const id = `heading-${counter}-${cleanText.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")}`
        items.push({
          id,
          text: cleanText,
          level: parseInt(level, 10),
        })
        return `<h${level}${attrs} id="${id}" class="scroll-mt-28">${text}</h${level}>`
      }
    )

    return { headings: items, processedHtml: htmlWithIds }
  }, [post?.content])

  // Track active heading for TOC
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -60% 0px" }
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  // Submit Comment Mutation
  const commentMutation = useMutation({
    mutationFn: (data: { author_name: string; author_email: string; content: string }) => {
      return BlogAPI.createComment(post!.slug, data)
    },
    onSuccess: () => {
      setCommentSuccess(true)
      setCommentName("")
      setCommentEmail("")
      setCommentContent("")
      toast.show("شكراً لك! تم استلام تعليقك وسينشر فور مراجعته.")
      queryClient.invalidateQueries({ queryKey: ["blog-post", slug] })
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "عذراً، حدث خطأ أثناء إرسال التعليق. يرجى المحاولة لاحقاً."
      toast.show(message)
    },
  })

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentName.trim() || !commentEmail.trim() || !commentContent.trim()) {
      toast.show("يرجى ملء جميع الحقول المطلوبة.")
      return
    }
    commentMutation.mutate({
      author_name: commentName.trim(),
      author_email: commentEmail.trim(),
      content: commentContent.trim(),
    })
  }

  // Social Share Handlers
  const currentUrl = typeof window !== "undefined" ? window.location.href : getBlogUrl(`/posts/${slug}`)

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentUrl)
      toast.show("تم نسخ رابط المقال إلى الحافظة بنجاح!")
    }
  }

  const handleShare = (platform: "x" | "wa" | "li" | "tg") => {
    const text = encodeURIComponent(post?.title ?? "")
    const url = encodeURIComponent(currentUrl)
    let shareUrl = ""

    switch (platform) {
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case "wa":
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
        break
      case "li":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case "tg":
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
        break
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  // Formatted date in Arabic
  const formattedDate = useMemo(() => {
    if (!post?.published_at) return ""
    try {
      return new Date(post.published_at).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return post.published_at.substring(0, 10)
    }
  }, [post?.published_at])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-subtle,#FAF8F6)] py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-[var(--color-border,#E2E0DF)] rounded-full" />
          <div className="h-10 w-3/4 bg-[var(--color-border,#E2E0DF)] rounded-2xl" />
          <div className="h-5 w-1/2 bg-[var(--color-border,#E2E0DF)] rounded-lg" />
          <div className="h-96 w-full bg-[var(--color-border,#E2E0DF)] rounded-3xl" />
          <div className="space-y-3 pt-6">
            <div className="h-4 w-full bg-[var(--color-border,#E2E0DF)] rounded" />
            <div className="h-4 w-5/6 bg-[var(--color-border,#E2E0DF)] rounded" />
            <div className="h-4 w-4/6 bg-[var(--color-border,#E2E0DF)] rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-subtle,#FAF8F6)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4 rounded-3xl border-[var(--color-border,#E2E0DF)]">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-card-soft,#F4EAF7)] text-[var(--color-primary,#281071)] text-2xl font-bold">
            404
          </div>
          <h1 className="text-xl font-bold text-[var(--color-ink,#16064F)] font-heading">
            المقال غير موجود أو تم نقله
          </h1>
          <p className="text-sm text-[var(--color-text-muted,#605856)]">
            قد يكون المقال قيد المراجعة أو تم تحديث رابطه الدائم.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => {
                if (isBlogSubdomain()) {
                  navigate("/")
                } else {
                  window.location.href = getBlogUrl("/")
                }
              }}
              className="w-full bg-[var(--color-ink,#16064F)] text-white hover:bg-[var(--color-primary,#281071)]"
            >
              العودة إلى المدونة
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Schema.org Article / BlogPosting
  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary || post.meta_description,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonical_url || currentUrl,
    },
    author: {
      "@type": "Person",
      name: post.author?.name || "فريق Amtdex التقني",
      url: post.author?.social_links?.twitter || currentUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Amtdex",
      logo: {
        "@type": "ImageObject",
        url: "https://amtdex.com/logo.png",
      },
    },
    articleSection: post.category?.name,
    keywords: post.tags?.map((t: { name: string }) => t.name).join(", "),
  }

  // FAQ Schema if provided
  const faqSchema: Record<string, unknown> | undefined =
    post.faq_schema && post.faq_schema.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq_schema.map((item: { question: string; answer: string }) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : undefined

  // Breadcrumbs Schema
  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: getBlogUrl("/"),
      },
      ...(post.category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: post.category.name,
              item: getBlogUrl(`/categories/${post.category.slug}`),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: currentUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: post.title,
              item: currentUrl,
            },
          ]),
    ],
  }

  const postCanonical = post.canonical_url || getBlogUrl(`/posts/${post.slug}`)

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle,#FAF8F6)] text-[var(--color-ink,#16064F)] relative selection:bg-[var(--color-gold,#FFBF08)] selection:text-[var(--color-ink,#16064F)]">
      {/* Dynamic SEO Tags */}
      <Seo
        title={`${post.meta_title || post.title} | مدونة Amtdex`}
        description={post.meta_description || post.summary || post.title}
        canonical={postCanonical}
        ogImage={post.og_image || post.cover_image || undefined}
        ogType="article"
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at || undefined}
        authorName={post.author?.name}
        section={post.category?.name}
        tags={post.tags?.map((t: { name: string }) => t.name)}
        jsonLd={[articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]}
        preloadImage={post.cover_image || undefined}
        noindex={Boolean(post.noindex)}
      />

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/5">
        <div
          className="h-full bg-gradient-to-l from-[var(--color-gold,#FFBF08)] to-[var(--color-primary,#281071)] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {toast.el}

      {/* Article Header & Hero Section */}
      <header className="pt-8 pb-10 border-b border-[var(--color-border,#E2E0DF)] bg-white/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--color-text-muted,#605856)] flex-wrap">
            <Link
              to={isBlogSubdomain() ? "/" : getBlogUrl("/")}
              className="hover:text-[var(--color-primary,#281071)] transition-colors font-medium flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              المدونة
            </Link>
            <span>/</span>
            {post.category && (
              <>
                <Link
                  to={isBlogSubdomain() ? `/categories/${post.category.slug}` : getBlogUrl(`/categories/${post.category.slug}`)}
                  className="hover:text-[var(--color-primary,#281071)] transition-colors font-medium"
                >
                  {post.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[var(--color-ink,#16064F)] font-semibold truncate max-w-[200px] sm:max-w-[320px]">
              {post.title}
            </span>
          </nav>

          {/* Category Badge & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.category && (
              <Badge className="bg-[var(--color-card-soft,#F4EAF7)] text-[var(--color-primary,#281071)] hover:bg-[var(--color-lavender,#E9DDF4)] border-none px-3.5 py-1 text-xs font-semibold rounded-full">
                {post.category.name}
              </Badge>
            )}
            <span className="text-xs text-[var(--color-text-muted,#605856)] flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.reading_time} دقيقة قراءة
            </span>
            <span className="text-xs text-[var(--color-text-muted,#605856)] flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
            <span className="text-xs text-[var(--color-text-muted,#605856)] flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views_count.toLocaleString("ar-EG")} مشاهدة
            </span>
          </div>

          {/* Main H1 Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-ink,#16064F)] leading-[1.3] mb-5 tracking-tight font-heading">
            {post.title}
          </h1>

          {/* Summary / Lead paragraph */}
          {post.summary && (
            <p className="text-base sm:text-lg text-[var(--color-text-muted,#605856)] leading-relaxed mb-6 font-normal">
              {post.summary}
            </p>
          )}

          {/* Author info & Quick share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border,#E2E0DF)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[var(--color-primary,#281071)] text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden ring-2 ring-white">
                {post.author?.avatar ? (
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                ) : post.author?.name ? (
                  post.author.name.substring(0, 2)
                ) : (
                  "AM"
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-ink,#16064F)] leading-tight">
                  {post.author?.name || "فريق Amtdex التقني"}
                </p>
                <p className="text-xs text-[var(--color-text-muted,#605856)]">
                  {post.author?.bio || "هندسة البرمجيات والحلول الرقمية المتطورة"}
                </p>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-1.5 bg-[var(--color-bg-subtle,#FAF8F6)] p-1 rounded-xl border border-[var(--color-border,#E2E0DF)]">
              <button
                onClick={() => handleShare("wa")}
                title="مشاركة عبر واتساب"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#25D366] hover:bg-white transition-all shadow-none hover:shadow-xs"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.449.741.964 1.2 1.054.94 1.299 1.036 1.487 1.122.188.087.298.072.41-.058.112-.13.477-.557.604-.748.127-.19.255-.16.425-.097.17.063 1.085.511 1.272.604.187.093.312.14.358.217.046.077.046.446-.098.851z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("x")}
                title="مشاركة عبر X"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-ink,#16064F)] hover:bg-white transition-all shadow-none hover:shadow-xs"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("li")}
                title="مشاركة عبر LinkedIn"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0A66C2] hover:bg-white transition-all shadow-none hover:shadow-xs"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.54a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
                </svg>
              </button>
              <button
                onClick={handleCopyLink}
                title="نسخ الرابط"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted,#605856)] hover:text-[var(--color-ink,#16064F)] hover:bg-white transition-all shadow-none hover:shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content (8 cols on LG) */}
          <article className="lg:col-span-8 space-y-8">
            {/* Cover Image */}
            {post.cover_image && (
              <figure className="relative rounded-3xl overflow-hidden shadow-sm border border-[var(--color-border,#E2E0DF)] bg-white aspect-video max-h-[480px]">
                <img
                  src={post.cover_image}
                  alt={post.cover_image_alt || post.title}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
                {post.cover_image_alt && (
                  <figcaption className="text-center text-xs text-[var(--color-text-muted,#605856)] py-2 bg-white/90 border-t border-[var(--color-border,#E2E0DF)]">
                    {post.cover_image_alt}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Mobile Collapsible TOC */}
            {headings.length > 0 && (
              <div className="lg:hidden bg-white rounded-2xl p-4 border border-[var(--color-border,#E2E0DF)]">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className="w-full flex items-center justify-between text-sm font-bold text-[var(--color-ink,#16064F)]"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--color-primary,#281071)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    فهرس محتويات المقال
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${tocOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {tocOpen && (
                  <ul className="mt-3 space-y-2 pt-3 border-t border-[var(--color-border,#E2E0DF)] text-xs">
                    {headings.map((h) => (
                      <li key={h.id} style={{ paddingRight: `${(h.level - 2) * 14}px` }}>
                        <a
                          href={`#${h.id}`}
                          onClick={() => setTocOpen(false)}
                          className={`block py-1 hover:text-[var(--color-primary,#281071)] transition-colors ${
                            activeHeadingId === h.id ? "text-[var(--color-primary,#281071)] font-bold" : "text-[var(--color-text-muted,#605856)]"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Rendered Article HTML Body */}
            <div
              className="prose prose-lg max-w-none text-[var(--color-ink,#16064F)] leading-relaxed space-y-6 
              [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[var(--color-ink,#16064F)] [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:font-heading [&>h2]:border-b [&>h2]:border-[var(--color-border,#E2E0DF)] [&>h2]:pb-2
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[var(--color-primary,#281071)] [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:font-heading
              [&>p]:text-[var(--color-ink,#16064F)] [&>p]:text-base [&>p]:sm:text-lg [&>p]:leading-[1.8] [&>p]:font-normal
              [&>ul]:list-disc [&>ul]:pr-6 [&>ul]:space-y-2 [&>ul]:text-base
              [&>ol]:list-decimal [&>ol]:pr-6 [&>ol]:space-y-2 [&>ol]:text-base
              [&>blockquote]:border-r-4 [&>blockquote]:border-[var(--color-gold,#FFBF08)] [&>blockquote]:bg-[var(--color-card-soft,#F4EAF7)]/60 [&>blockquote]:p-4 [&>blockquote]:rounded-r-xl [&>blockquote]:my-6 [&>blockquote]:italic
              [&>pre]:bg-[var(--color-ink,#16064F)] [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-2xl [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:text-sm [&>pre]:font-mono
              [&>code]:bg-[var(--color-lavender,#E9DDF4)]/60 [&>code]:text-[var(--color-primary,#281071)] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-sm [&>code]:font-mono
              [&>img]:rounded-2xl [&>img]:shadow-sm [&>img]:my-6 [&>img]:w-full [&>img]:border [&>img]:border-[var(--color-border,#E2E0DF)]
              [&>table]:w-full [&>table]:border-collapse [&>table]:my-6 [&>table]:text-sm
              [&>table_th]:border [&>table_th]:border-[var(--color-border,#E2E0DF)] [&>table_th]:bg-[var(--color-card-soft,#F4EAF7)] [&>table_th]:p-3 [&>table_th]:text-right
              [&>table_td]:border [&>table_td]:border-[var(--color-border,#E2E0DF)] [&>table_td]:p-3
              [&>a]:text-[var(--color-primary,#281071)] [&>a]:underline [&>a]:font-medium hover:[&>a]:text-[var(--color-gold,#FFBF08)]"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-[var(--color-border,#E2E0DF)]">
                <h3 className="text-xs font-bold text-[var(--color-text-muted,#605856)] mb-3 uppercase tracking-wider">
                  الوسوم المرتبطة
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: { id: number; name: string; slug: string }) => (
                    <Link
                      key={tag.id}
                      to={isBlogSubdomain() ? `/tags/${tag.slug}` : getBlogUrl(`/tags/${tag.slug}`)}
                      className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-[var(--color-border,#E2E0DF)] text-[var(--color-ink,#16064F)] hover:border-[var(--color-primary,#281071)] hover:text-[var(--color-primary,#281071)] transition-colors"
                    >
                      <span>#</span>
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Accordion Section if available */}
            {post.faq_schema && post.faq_schema.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--color-border,#E2E0DF)] space-y-4">
                <h2 className="text-xl font-bold text-[var(--color-ink,#16064F)] font-heading flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--color-gold,#FFBF08)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  الأسئلة الشائعة حول المقال
                </h2>
                <div className="divide-y divide-[var(--color-border,#E2E0DF)]">
                  {post.faq_schema.map((item: { question: string; answer: string }, idx: number) => (
                    <details key={idx} className="group py-4">
                      <summary className="flex justify-between items-center font-semibold text-[var(--color-ink,#16064F)] cursor-pointer list-none text-base">
                        <span>{item.question}</span>
                        <span className="transition group-open:rotate-180 text-[var(--color-primary,#281071)]">
                          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <p className="text-sm text-[var(--color-text-muted,#605856)] mt-3 leading-relaxed">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Author Profile Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--color-border,#E2E0DF)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary,#281071)] text-white flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden shadow-xs">
                {post.author?.avatar ? (
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                ) : post.author?.name ? (
                  post.author.name.substring(0, 2)
                ) : (
                  "AM"
                )}
              </div>
              <div className="space-y-2 text-center sm:text-right flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-[var(--color-ink,#16064F)] font-heading">
                    عن الكاتب: {post.author?.name || "فريق Amtdex التقني"}
                  </h3>
                  {post.author?.social_links && (
                    <div className="flex items-center justify-center sm:justify-end gap-2">
                      {post.author.social_links.twitter && (
                        <a
                          href={post.author.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-[var(--color-bg-subtle,#FAF8F6)] flex items-center justify-center text-[var(--color-text-muted,#605856)] hover:text-[var(--color-primary,#281071)] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                      {post.author.social_links.github && (
                        <a
                          href={post.author.social_links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-[var(--color-bg-subtle,#FAF8F6)] flex items-center justify-center text-[var(--color-text-muted,#605856)] hover:text-[var(--color-primary,#281071)] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                          </svg>
                        </a>
                      )}
                      {post.author.social_links.linkedin && (
                        <a
                          href={post.author.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-[var(--color-bg-subtle,#FAF8F6)] flex items-center justify-center text-[var(--color-text-muted,#605856)] hover:text-[var(--color-primary,#281071)] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.54a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text-muted,#605856)] leading-relaxed">
                  {post.author?.bio || "مهندس في Amtdex متخصص في هندسة التطبيقات الحديثة، الحلول السحابية، واستراتيجيات الـ SEO التقنية المتقدمة."}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            {post.allow_comments && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--color-border,#E2E0DF)] space-y-8">
                <div className="flex items-center justify-between border-b border-[var(--color-border,#E2E0DF)] pb-4">
                  <h3 className="text-xl font-bold text-[var(--color-ink,#16064F)] font-heading flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--color-primary,#281071)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    التعليقات والمناقشة ({post.comments?.filter((c: BlogComment) => c.status === "approved").length ?? 0})
                  </h3>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {post.comments && post.comments.filter((c: BlogComment) => c.status === "approved").length > 0 ? (
                    post.comments
                      .filter((c: BlogComment) => c.status === "approved")
                      .map((comm: BlogComment) => (
                        <div key={comm.id} className="p-4 rounded-2xl bg-[var(--color-bg-subtle,#FAF8F6)] border border-[var(--color-border,#E2E0DF)] space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[var(--color-lavender,#E9DDF4)] text-[var(--color-primary,#281071)] flex items-center justify-center font-bold text-xs">
                                {comm.author_name.substring(0, 2)}
                              </div>
                              <span className="text-sm font-bold text-[var(--color-ink,#16064F)]">
                                {comm.author_name}
                              </span>
                            </div>
                            <span className="text-xs text-[var(--color-text-muted,#605856)]">
                              {comm.created_at ? new Date(comm.created_at).toLocaleDateString("ar-SA") : ""}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--color-ink,#16064F)] leading-relaxed pr-10">
                            {comm.content}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-[var(--color-text-muted,#605856)] text-center py-4">
                      لا توجد تعليقات بعد. كن أول من يشارك رأيه حول هذا المقال!
                    </p>
                  )}
                </div>

                {/* Comment Submission Form */}
                <form onSubmit={handleCommentSubmit} className="pt-6 border-t border-[var(--color-border,#E2E0DF)] space-y-4">
                  <h4 className="text-base font-bold text-[var(--color-ink,#16064F)]">
                    أضف تعليقك
                  </h4>

                  {commentSuccess && (
                    <div className="p-4 rounded-2xl bg-[#E8F8F0] border border-[#A6E9C7] text-[#1E7E4B] text-xs font-semibold">
                      تم إرسال تعليقك بنجاح! سيتم نشره فور مراجعته من قبل فريق الإشراف.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-ink,#16064F)] mb-1">
                        الاسم <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="اسمك الكامل"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border,#E2E0DF)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#281071)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-ink,#16064F)] mb-1">
                        البريد الإلكتروني <span className="text-red-500">*</span> (لن يُنشر)
                      </label>
                      <input
                        type="email"
                        required
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border,#E2E0DF)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#281071)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink,#16064F)] mb-1">
                      التعليق <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="اكتب تعليقك هنا بأدب وموضوعية..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border,#E2E0DF)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#281071)] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={commentMutation.isPending}
                    className="bg-[var(--color-ink,#16064F)] hover:bg-[var(--color-primary,#281071)] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    {commentMutation.isPending ? "جارٍ الإرسال..." : "إرسال التعليق للمراجعة"}
                  </Button>
                </form>
              </section>
            )}
          </article>

          {/* Sticky Sidebar on Desktop (4 cols on LG) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Desktop Table of Contents */}
            {headings.length > 0 && (
              <div className="hidden lg:block sticky top-24 bg-white rounded-3xl p-6 border border-[var(--color-border,#E2E0DF)] shadow-xs">
                <h3 className="text-sm font-bold text-[var(--color-ink,#16064F)] mb-4 flex items-center gap-2 font-heading">
                  <svg className="w-4 h-4 text-[var(--color-primary,#281071)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  محتويات المقال
                </h3>
                <nav className="max-h-[60vh] overflow-y-auto space-y-1.5 text-xs pr-1 scrollbar-thin">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      style={{ paddingRight: `${(h.level - 2) * 12}px` }}
                      className={`block py-1.5 px-2 rounded-lg transition-colors leading-snug ${
                        activeHeadingId === h.id
                          ? "bg-[var(--color-card-soft,#F4EAF7)] text-[var(--color-primary,#281071)] font-bold"
                          : "text-[var(--color-text-muted,#605856)] hover:text-[var(--color-ink,#16064F)] hover:bg-[var(--color-bg-subtle,#FAF8F6)]"
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Newsletter Subscription Box */}
            <div className="bg-gradient-to-br from-[var(--color-ink,#16064F)] to-[var(--color-primary,#281071)] text-white rounded-3xl p-6 space-y-4">
              <span className="text-2xl">📬</span>
              <h4 className="text-base font-bold font-heading">
                النشرة الهندسية الأسبوعية
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                انضم إلى نخبة المهندسين والتقنيين ليصلك أحدث المقالات والتحليلات المتعمقة مباشرةً إلى بريدك.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); toast.show("شكراً لاشتراكك في نشرة Amtdex!"); }} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="بريدك الإلكتروني"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold,#FFBF08)]"
                />
                <Button
                  type="submit"
                  className="w-full bg-[var(--color-gold,#FFBF08)] text-[var(--color-ink,#16064F)] hover:bg-yellow-400 font-bold text-xs py-2 rounded-xl"
                >
                  اشتراك مجاني
                </Button>
              </form>
            </div>

            {/* RSS Feed Card */}
            <div className="bg-white rounded-3xl p-6 border border-[var(--color-border,#E2E0DF)] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--color-ink,#16064F)]">موجز الأخبار RSS</p>
                <p className="text-[11px] text-[var(--color-text-muted,#605856)]">تابع التحديثات عبر قارئ RSS</p>
              </div>
              <a
                href="/feed"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[var(--color-card-soft,#F4EAF7)] text-[var(--color-primary,#281071)] flex items-center justify-center hover:bg-[var(--color-lavender,#E9DDF4)] transition-colors"
                title="تغذية RSS"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
                </svg>
              </a>
            </div>
          </aside>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--color-border,#E2E0DF)] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--color-ink,#16064F)] font-heading">
                مقالات ذات صلة قد تهمك
              </h2>
              <Link
                to={isBlogSubdomain() ? "/" : getBlogUrl("/")}
                className="text-xs font-bold text-[var(--color-primary,#281071)] hover:underline flex items-center gap-1"
              >
                تصفح كافة المقالات
                <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rel: BlogPost) => (
                <Card
                  key={rel.id}
                  className="group overflow-hidden rounded-3xl border border-[var(--color-border,#E2E0DF)] bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <Link
                    to={isBlogSubdomain() ? `/posts/${rel.slug}` : getBlogUrl(`/posts/${rel.slug}`)}
                    className="block aspect-video overflow-hidden bg-gray-100 relative"
                  >
                    {rel.cover_image ? (
                      <img
                        src={rel.cover_image}
                        alt={rel.cover_image_alt || rel.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-card-soft,#F4EAF7)] text-[var(--color-primary,#281071)] font-bold text-xl">
                        Amtdex
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {rel.category && (
                        <span className="text-[11px] font-bold text-[var(--color-primary,#281071)] mb-1 block">
                          {rel.category.name}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-[var(--color-ink,#16064F)] line-clamp-2 group-hover:text-[var(--color-primary,#281071)] transition-colors">
                        <Link to={isBlogSubdomain() ? `/posts/${rel.slug}` : getBlogUrl(`/posts/${rel.slug}`)}>
                          {rel.title}
                        </Link>
                      </h3>
                      {rel.summary && (
                        <p className="text-xs text-[var(--color-text-muted,#605856)] line-clamp-2 mt-1 leading-relaxed">
                          {rel.summary}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[var(--color-border,#E2E0DF)] flex items-center justify-between text-[11px] text-[var(--color-text-muted,#605856)]">
                      <span>{rel.reading_time} دقيقة قراءة</span>
                      <span className="font-semibold text-[var(--color-ink,#16064F)] group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                        قراءة المقال ←
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
