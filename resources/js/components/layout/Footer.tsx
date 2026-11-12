import { Link } from "react-router-dom"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"
import { getBlogUrl, getMainUrl, isBlogSubdomain } from "@/lib/subdomain"
import { pageIsListed, useCms, useCopy } from "@/cms/useCms"

export function Footer({ onToast }: { onToast: (m: string) => void }) {
  const onBlog = isBlogSubdomain()
  const { pages } = useCms()
  const blurb = useCopy("footer.blurb", "نحن شركة برمجيات وتقنية معلومات، نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو.")
  const city = useCopy("footer.city", "اليمن - إب")
  const shown = (path: string) => pageIsListed(pages, path, false)
  const { data: apiServices } = useServicesQuery()
  const services = (apiServices && apiServices.length > 0) ? apiServices : SEED_SERVICES

  const columns = [
    {
      title: "الخدمات",
      links: shown("/services") ? services.map((s) => ({ label: s.title, to: `/services/${s.slug}` })) : [],
    },
    {
      title: "الشركة",
      links: [
        { label: "من نحن", to: "/about" },
        { label: "الأعمال", to: "/portfolio" },
        { label: "تواصل", to: "/contact" },
      ].filter((link) => shown(link.to)),
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
        { label: "ابدأ مشروعك", to: "/quote" },
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
                  AMTDEX SOFT
                </a>
              ) : (
                <Link to="/" className="font-display font-semibold text-[18px] text-[var(--color-ink)]">
                  AMTDEX SOFT
                </Link>
              )}
            </div>
            <p className="mt-4 text-[13px] leading-7 text-[var(--color-text-muted)] max-w-[260px]">
              {blurb}
            </p>
            <div className="mt-5 flex gap-4">
              {["X", "in"].map((s) => (
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
              <a
                href="https://www.instagram.com/amtdex/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-[12px] font-semibold tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"
              >
                ig
              </a>
            </div>
            <div className="mt-4 text-[11px] text-[var(--color-text-faint)] leading-5">
              <div>{city}</div>
              <div dir="ltr" className="text-left">
                Info@amtdex.com • +967 784 440 429 • +967 784 440 428
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
          <span>© 2026 AMTDEX SOFT — جميع الحقوق محفوظة. اليمن - إب.</span>
        </div>
      </div>
    </footer>
  )
}
