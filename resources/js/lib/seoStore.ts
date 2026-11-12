import { useSyncExternalStore } from "react"

export type SeoEntry = {
  path: string // e.g. "/" or "/services/web"
  title: string
  description: string
  canonical?: string
  ogImage?: string
  og_image?: string
  noindex?: boolean
  jsonLd?: string // raw JSON string
}

const KEY = "amtdex_seo"

const SEED: SeoEntry[] = [
  { path: "/", title: "AMTDEX SOFT — امتدكس سوفت", description: "هندسة الفكرة قبل برمجتها. من الفكرة إلى التنفيذ." },
  { path: "/services", title: "ماذا نقدم؟ — AMTDEX SOFT", description: "مواقع، تطبيقات، متاجر، أنظمة إدارة، تسويق، هوية بصرية، وحماية المواقع والأنظمة." },
  { path: "/about", title: "من نحن — امتدكس سوفت", description: "نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو." },
  { path: "/contact", title: "تواصل معنا — AMTDEX SOFT", description: "اليمن - إب. Info@amtdex.com. +967 784 440 429." },
  { path: "/quote", title: "اطلب عرض سعر — AMTDEX SOFT", description: "أخبرنا عن فكرتك ونعود إليك." },
]

function load(): SeoEntry[] {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) as SeoEntry[] } catch {}
  return SEED
}
function save(v: SeoEntry[]) { localStorage.setItem(KEY, JSON.stringify(v)); listeners.forEach((cb) => cb()) }
const listeners = new Set<() => void>()
function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb) }

export function getSeo(): SeoEntry[] { return load() }
export function upsertSeo(e: SeoEntry) {
  const arr = load()
  const idx = arr.findIndex((x) => x.path === e.path)
  if (idx >= 0) arr[idx] = e
  else arr.push(e)
  save(arr)
}
export function deleteSeo(path: string) { save(load().filter((x) => x.path !== path)) }
export function useSeo(): SeoEntry[] { return useSyncExternalStore(subscribe, load, () => SEED) }
export function resetSeo() { localStorage.removeItem(KEY); listeners.forEach((cb) => cb()) }

/** @deprecated Prefer live /sitemap.xml from the server. Kept for local settings export only. */
export function generateSitemap(base = "https://amtdex.com"): string {
  const entries = load().filter((e) => !e.noindex)
  const urls = entries.map((e) => `  <url><loc>${base}${e.path}</loc><changefreq>weekly</changefreq></url>`).join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}

/** @deprecated Prefer live /robots.txt from the server. Kept for local settings export only. */
export function generateRobots(base = "https://amtdex.com"): string {
  return `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /login\nSitemap: ${base}/sitemap.xml`
}
