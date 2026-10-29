import { Link } from "react-router-dom"
import { SERVICES } from "@/data/services"

export function Footer({ onToast }: { onToast: (m: string) => void }) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-xl bg-[var(--color-ink)] text-white grid place-items-center text-[12px] font-bold">A</span>
              <span className="font-bold tracking-tight text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>
                amtdex
              </span>
            </div>
            <p className="mt-3 text-[12px] leading-6 text-[var(--color-text-muted)] max-w-[260px]">حلول برمجية متكاملة — من الفكرة للكود للإطلاق. نبني مواقع، تطبيقات، وأنظمة أعمال بمعايير عالمية.</p>
            <div className="mt-4 flex gap-2">
              {["𝕏", "in", "ig"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onToast(s)}
                  aria-label={s}
                  className="size-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] grid place-items-center text-[11px] font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-ink)] hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-4 text-[11px] text-[var(--color-text-faint)] leading-5">
              <div>صنعاء — الجمهورية اليمنية</div>
              <div dir="ltr" className="text-left">
                hello@amtdex.com • +966 50 000 0000
              </div>
            </div>
          </div>
          {[
            { title: "الخدمات", links: SERVICES.map((s) => ({ label: s.title, to: `/services/${s.slug}` })) },
            {
              title: "الشركة",
              links: [
                { label: "من نحن", to: "/about" },
                { label: "الأعمال", to: "/portfolio" },
                { label: "الأسعار", to: "/pricing" },
                { label: "تواصل", to: "/contact" },
                { label: "لوحة التحكم", to: "/dashboard" },
              ],
            },
            {
              title: "الموارد",
              links: [
                { label: "الأسئلة الشائعة", to: "/about#faq" },
                { label: "سياسة الخصوصية", to: "/contact" },
                { label: "الشروط", to: "/contact" },
                { label: "API Docs", to: "/services" },
                { label: "الحالة", to: "/" },
              ],
            },
            {
              title: "تواصل سريع",
              links: [
                { label: "اطلب عرض سعر", to: "/quote" },
                { label: "واتساب", to: "/contact" },
                { label: "حجز استشارة", to: "/contact" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-[12px] font-bold text-[var(--color-text)]">{col.title}</div>
              <ul className="mt-3 space-y-2">
                {col.links.map((l: { label: string; to: string }) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--color-text-faint)]">
          <span>© 2026 Amtdex — جميع الحقوق محفوظة. صُنع في صنعاء.</span>
          <span className="flex items-center gap-2">
            واجهات أمامية جاهزة للربط مع Laravel • <span className="px-2 py-1 rounded-full bg-[var(--color-ink)] text-white text-[10px]">API READY</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
