import { Link } from "react-router-dom"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"
import { getBlogUrl, getMainUrl, isBlogSubdomain } from "@/lib/subdomain"
import { pageIsListed, useCms, useCopy } from "@/cms/useCms"

export function Footer({ onToast }: { onToast: (m: string) => void }) {
  const onBlog = isBlogSubdomain()
  const { pages, staff } = useCms()
  const blurb = useCopy("footer.blurb", "حلول برمجية متكاملة — من الفكرة للكود للإطلاق. نبني مواقع، تطبيقات، وأنظمة أعمال بمعايير عالمية.")
  const city = useCopy("footer.city", "صنعاء — الجمهورية اليمنية")
  const shown = (path: string) => pageIsListed(pages, path, staff)
  const { data: apiServices } = useServicesQuery()
  const services = (apiServices && apiServices.length > 0) ? apiServices : SEED_SERVICES

  const columns = [
    {
      title: "الخدمات",
      links: services.map((s) => ({ label: s.title, to: `/services/${s.slug}` })),
    },
    {
      title: "الشركة",
      links: [
        { label: "من نحن", to: "/about" },
        { label: "الأعمال", to: "/portfolio" },
        { label: "الأسعار", to: "/pricing" },
        { label: "تواصل", to: "/contact" },
        { label: "لوحة التحكم", to: "/dashboard" },
      ].filter((link) => link.to === "/dashboard" || shown(link.to)),
    },
    {
      title: "الموارد",
      links: [
        { label: "المدونة التقنية", href: onBlog ? "/" : getBlogUrl("/") },
        { label: "الأسئلة الشائعة", to: "/about#faq" },
        { label: "سياسة الخصوصية", to: "/contact" },
        { label: "الشروط", to: "/contact" },
        { label: "API Docs", to: "/services" },
        { label: "الحالة", to: "/" },
      ].filter((link) => shown(link.to ?? "/blog")),
    },
    {
      title: "تواصل سريع",
      links: [
        { label: "اطلب عرض سعر", to: "/quote" },
        { label: "واتساب", to: "/contact" },
        { label: "حجز استشارة", to: "/contact" },
      ].filter((link) => shown(link.to)),
    },
  ]

  return (
    <footer className="border-t border-[var(--color-ink)] bg-[var(--color-bg)]">
      <div className="page-container page-container--wide py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="size-2 bg-[var(--color-gold)]" aria-hidden />
              {onBlog ? (
                <a href={getMainUrl("/")} className="font-display font-semibold text-[18px] text-[var(--color-ink)]">
                  AMTDEX
                </a>
              ) : (
                <Link to="/" className="font-display font-semibold text-[18px] text-[var(--color-ink)]">
                  AMTDEX
                </Link>
              )}
            </div>
            <p className="mt-4 text-[13px] leading-7 text-[var(--color-text-muted)] max-w-[260px]">
              {blurb}
            </p>
            <div className="mt-5 flex gap-4">
              {["X", "in", "ig"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onToast(s)}
                  aria-label={s}
                  className="text-[12px] font-semibold tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-4 text-[11px] text-[var(--color-text-faint)] leading-5">
              <div>{city}</div>
              <div dir="ltr" className="text-left">
                hello@amtdex.com • +966 50 000 0000
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-[12px] font-bold text-[var(--color-text)]">{col.title}</div>
              <ul className="mt-3 space-y-2">
                {col.links.map((l: { label: string; to?: string; href?: string }) => {
                  if (l.href) {
                    return (
                      <li key={l.label}>
                        <a href={l.href} className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                          {l.label}
                        </a>
                      </li>
                    )
                  }

                  const targetPath = l.to ?? "/"
                  if (onBlog) {
                    return (
                      <li key={l.label}>
                        <a href={getMainUrl(targetPath)} className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                          {l.label}
                        </a>
                      </li>
                    )
                  }

                  return (
                    <li key={l.label}>
                      <Link to={targetPath} className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--color-text-faint)]">
          <span>© 2026 Amtdex — جميع الحقوق محفوظة. صُنع في صنعاء.</span>
          <span className="flex items-center gap-2">
            واجهات أمامية جاهزة للربط مع Laravel · API READY
          </span>
        </div>
      </div>
    </footer>
  )
}
