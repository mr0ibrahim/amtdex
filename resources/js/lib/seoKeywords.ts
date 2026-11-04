/**
 * SEO keyword list shared by the editor and the public post meta tags.
 * Spaces belong inside a phrase. Commas (Latin `,` and Arabic `،`) and
 * newlines separate keywords.
 */

const KEYWORD_SEPARATOR = /[,،\n\r]+/u
const MAX_ITEMS = 40
const MAX_LENGTH = 120

export function normalizeKeyword(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

export function parseKeywordList(raw: string): string[] {
  return raw
    .split(KEYWORD_SEPARATOR)
    .map(normalizeKeyword)
    .filter(Boolean)
    .map((keyword) => (keyword.length > MAX_LENGTH ? keyword.slice(0, MAX_LENGTH) : keyword))
}

export function mergeKeywords(existing: string[], incoming: string[]): string[] {
  const seen = new Set(existing.map((keyword) => keyword.toLocaleLowerCase()))
  const next = [...existing]

  for (const item of incoming) {
    const keyword = normalizeKeyword(item)
    if (!keyword) continue
    const trimmed = keyword.length > MAX_LENGTH ? keyword.slice(0, MAX_LENGTH) : keyword
    const key = trimmed.toLocaleLowerCase()
    if (seen.has(key)) continue
    if (next.length >= MAX_ITEMS) break
    seen.add(key)
    next.push(trimmed)
  }

  return next
}

type KeywordSource = {
  seo_keywords?: string[] | null
  focus_keyword?: string | null
  tags?: { name?: string | null }[] | null
}

/** Keywords the editor should show. Tags are not copied into the field. */
export function editorKeywords(input: KeywordSource): string[] {
  if (Array.isArray(input.seo_keywords) && input.seo_keywords.length > 0) {
    return mergeKeywords([], input.seo_keywords)
  }

  if (input.focus_keyword?.trim()) {
    return mergeKeywords([], parseKeywordList(input.focus_keyword))
  }

  return []
}

/**
 * Keywords written to `<meta name="keywords">`.
 * Explicit SEO keywords win; otherwise the legacy focus keyword; otherwise tags.
 */
export function publicKeywords(input: KeywordSource): string[] {
  const edited = editorKeywords(input)
  if (edited.length > 0) return edited

  return mergeKeywords(
    [],
    (input.tags ?? []).map((tag) => tag.name ?? ""),
  )
}

/** Turn a stored media path into an absolute URL for og:image / twitter:image. */
export function toAbsoluteUrl(url: string | null | undefined): string {
  const value = (url ?? "").trim()
  if (!value) return ""
  if (/^(https?:|blob:|data:)/i.test(value)) return value
  if (value.startsWith("//")) {
    const protocol = typeof window !== "undefined" ? window.location.protocol : "https:"
    return `${protocol}${value}`
  }
  if (value.startsWith("/")) {
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : ""
    return origin ? `${origin}${value}` : value
  }
  return value
}

export function shareImageUrl(
  ogImage?: string | null,
  coverImage?: string | null,
): string | undefined {
  const absolute = toAbsoluteUrl(ogImage || coverImage || "")
  return absolute || undefined
}
