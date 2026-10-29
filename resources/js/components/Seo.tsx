import { Helmet } from "react-helmet-async"

type SeoProps = {
  title: string
  description?: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const SITE = "https://amtdex.ye"
const DEFAULT_OG = `${SITE}/og-default.png`

export function Seo({ title, description, canonical, noindex, ogImage, jsonLd }: SeoProps) {
  const url = canonical ?? (typeof window !== "undefined" ? window.location.href : SITE)
  const desc = description ?? "Amtdex — شركة يمنية للحلول البرمجية: مواقع، تطبيقات، ERP/CRM، ذكاء اصطناعي."
  return (
    <Helmet>
      <title>{title} | Amtdex</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage ?? DEFAULT_OG} />
      <meta property="og:locale" content="ar_YE" />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}</script>
      )}
    </Helmet>
  )
}
