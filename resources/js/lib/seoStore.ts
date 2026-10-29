import { useSyncExternalStore } from "react"

export type SeoEntry = {
  path: string // e.g. "/" or "/services/web"
  title: string
  description: string
  canonical?: string
  ogImage?: string
  noindex?: boolean
  jsonLd?: string // raw JSON string
}

const KEY = "amtdex_seo"

const SEED: SeoEntry[] = [
  { path: "/", title: "الرئيسية", description: "Amtdex — شركة يمنية للحلول البرمجية: مواقع، تطبيقات، ERP/CRM، ذكاء اصطناعي." },
  { path: "/services", title: "الخدمات", description: "خدمات Amtdex: تطوير مواقع، تطبيقات، ERP، ذكاء اصطناعي، أمن سيبراني، سحابة." },
  { path: "/portfolio", title: "أعمالنا", description: "مختارات من مشاريع Amtdex — كل مشروع قصة نجاح." },
  { path: "/pricing", title: "الأسعار", description: "باقات Amtdex: الانطلاقة والنمو والمؤسسي — استثمار واضح ومرن." },
  { path: "/about", title: "من نحن", description: "Amtdex — نبني برمجيات تخدم الناس. فريق يمني في صنعاء." },
  { path: "/contact", title: "تواصل معنا", description: "تواصل مع Amtdex — صنعاء، حدة. نرد خلال ساعات." },
  { path: "/quote", title: "اطلب عرض سعر", description: "اطلب عرض سعر من Amtdex — 3 خطوات ونرسل تقدير خلال 24 ساعة." },
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

export function generateSitemap(base = "https://amtdex.ye"): string {
  const entries = load().filter((e) => !e.noindex)
  const urls = entries.map((e) => `  <url><loc>${base}${e.path}</loc><changefreq>weekly</changefreq></url>`).join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}
export function generateRobots(): string {
  return `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /login\nSitemap: https://amtdex.ye/sitemap.xml`
}
