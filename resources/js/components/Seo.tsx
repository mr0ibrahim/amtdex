import { Helmet } from "react-helmet-async"

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface SeoProps {
  title: string
  description?: string
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
  ogImage?: string
  ogType?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  authorName?: string
  section?: string
  tags?: string[]
  twitterCard?: "summary" | "summary_large_image"
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  breadcrumbs?: BreadcrumbItem[]
  preloadImage?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  rssFeedUrl?: string
}

const DEFAULT_SITE = "https://amtdex.com"
const DEFAULT_OG = "https://amtdex.com/images/screens/projects.webp"

export function Seo({
  title,
  description,
  canonical,
  noindex = false,
  nofollow = false,
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authorName,
  section,
  tags,
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  breadcrumbs,
  preloadImage,
  jsonLd,
  rssFeedUrl,
}: SeoProps) {
  const url = canonical ?? (typeof window !== "undefined" ? window.location.href : DEFAULT_SITE)
  const desc = description ?? "Amtdex — شركة حلول برمجية متكاملة: مواقع، تطبيقات، أنظمة ERP، ذكاء اصطناعي وأمن سيبراني."
  const image = ogImage ?? DEFAULT_OG

  // Build robots content
  const robots = noindex
    ? nofollow
      ? "noindex, nofollow"
      : "noindex, follow"
    : nofollow
    ? "index, nofollow"
    : "index, follow"

  // Auto-generate BreadcrumbList JSON-LD if provided
  const schemaList: Record<string, unknown>[] = []

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemaList.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: b.name,
        item: b.url,
      })),
    })
  }

  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      schemaList.push(...jsonLd)
    } else {
      schemaList.push(jsonLd)
    }
  }

  return (
    <Helmet>
      {/* Title & Core Metadata */}
      <title>{title.includes("Amtdex") ? title : `${title} | Amtdex`}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={robots} />

      {/* LCP Image Preload */}
      {preloadImage && <link rel="preload" as="image" href={preloadImage} fetchPriority="high" />}

      {/* RSS Feed Alternate Link */}
      {rssFeedUrl && <link rel="alternate" type="application/rss+xml" title="خلاصة المدونة (RSS)" href={rssFeedUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content="Amtdex" />
      <meta property="og:locale" content="ar_AR" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Article Specific Open Graph */}
      {ogType === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === "article" && authorName && (
        <meta property="article:author" content={authorName} />
      )}
      {ogType === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {ogType === "article" &&
        tags?.map((t) => <meta key={t} property="article:tag" content={t} />)}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@amtdex" />
      <meta name="twitter:creator" content="@amtdex" />
      <meta name="twitter:title" content={twitterTitle ?? title} />
      <meta name="twitter:description" content={twitterDescription ?? desc} />
      <meta name="twitter:image" content={twitterImage ?? image} />

      {/* Schema.org JSON-LD */}
      {schemaList.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(schemaList.length === 1 ? schemaList[0] : schemaList)}
        </script>
      )}
    </Helmet>
  )
}
