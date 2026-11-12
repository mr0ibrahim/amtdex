import type { BlogCategory, BlogPost, BlogTag } from "@/types/blog"
import { publicKeywords } from "@/lib/seoKeywords"
import { resolveMediaUrl } from "./mediaUpload"

export const SCHEMA_TYPE_OPTIONS = [
  { value: "BlogPosting", label: "BlogPosting — مقال مدونة" },
  { value: "Article", label: "Article — مقال عام" },
  { value: "NewsArticle", label: "NewsArticle — خبر" },
  { value: "TechArticle", label: "TechArticle — مقال تقني" },
] as const

export type SchemaTypeOption = (typeof SCHEMA_TYPE_OPTIONS)[number]["value"]

const ORG_NAME = "Amtdex"
const ORG_LOGO = "https://amtdex.com/logo.png"
const SITE_URL = "https://amtdex.com"
const DEFAULT_BLOG_BASE = "https://blog.amtdex.com"
const DEFAULT_OG = "https://amtdex.com/images/screens/projects.webp"

export type SchemaPreviewInput = {
  form: Partial<BlogPost>
  faqList: { question: string; answer: string }[]
  category?: BlogCategory | null
  tags?: BlogTag[]
  blogBaseUrl?: string
}

function absoluteUrl(value: string | null | undefined, blogBase: string, slug: string): string {
  const trimmed = (value ?? "").trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const cleanSlug = (slug || "example-post").replace(/^\/+|\/+$/g, "")
  return `${blogBase}/posts/${cleanSlug}`
}

function toIso(value?: string | null): string {
  if (!value) return new Date().toISOString()
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

/**
 * Client-side mirror of BlogJsonLdBuilder::forPost for live editor preview.
 */
export function buildPostSchemaPreview(input: SchemaPreviewInput): Record<string, unknown>[] {
  const blogBase = (input.blogBaseUrl || DEFAULT_BLOG_BASE).replace(/\/$/, "")
  const form = input.form
  const slug = (form.slug || "").trim() || "example-post"
  const canonical = absoluteUrl(form.canonical_url, blogBase, slug)
  const schemaType = SCHEMA_TYPE_OPTIONS.some((o) => o.value === form.schema_type)
    ? (form.schema_type as SchemaTypeOption)
    : "BlogPosting"

  const headline = (form.meta_title || form.title || "عنوان المقال").trim()
  const description = (form.meta_description || form.summary || form.title || "").trim()
  const image = resolveMediaUrl((form.og_image || form.cover_image || DEFAULT_OG).trim())
  const datePublished = toIso(form.published_at || form.created_at)
  const dateModified = toIso(form.updated_at || form.published_at || form.created_at)
  const authorName = form.author?.name || "فريق Amtdex التقني"
  const authorUrl =
    form.author?.social_links?.twitter ||
    form.author?.social_links?.linkedin ||
    SITE_URL

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline,
    description,
    image: [image],
    datePublished,
    dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      logo: {
        "@type": "ImageObject",
        url: ORG_LOGO,
      },
    },
    url: canonical,
    inLanguage: "ar",
  }

  if (input.category?.name) {
    article.articleSection = input.category.name
  }

  const keywordNames = publicKeywords({
    seo_keywords: form.seo_keywords,
    focus_keyword: form.focus_keyword,
    tags: input.tags ?? form.tags,
  })
  if (keywordNames.length) {
    article.keywords = keywordNames.join(", ")
  }

  const breadcrumbItems: Record<string, unknown>[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "المدونة",
      item: `${blogBase}/`,
    },
  ]

  if (input.category?.slug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: input.category.name,
      item: `${blogBase}/categories/${input.category.slug}`,
    })
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: form.title || headline,
      item: canonical,
    })
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: form.title || headline,
      item: canonical,
    })
  }

  const graph: Record<string, unknown>[] = [
    article,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: ORG_LOGO,
      },
      sameAs: ["https://www.instagram.com/amtdex/"],
    },
  ]

  const faqEntities = input.faqList
    .map((f) => ({
      question: f.question.trim(),
      answer: f.answer.trim(),
    }))
    .filter((f) => f.question && f.answer)
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    }))

  if (faqEntities.length) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntities,
    })
  }

  return graph
}

export function schemaPreviewCanonical(input: SchemaPreviewInput): string {
  const blogBase = (input.blogBaseUrl || DEFAULT_BLOG_BASE).replace(/\/$/, "")
  const slug = (input.form.slug || "").trim() || "example-post"
  return absoluteUrl(input.form.canonical_url, blogBase, slug)
}
