import { type ReactNode } from "react"
import { PublicLink as Link } from "@/cms/PublicLink"
import { Icon } from "@/components/ui/Icon"
import { Testimonials } from "./Testimonials"
import { GuaranteeBanner } from "@/pages/Home/GuaranteeBanner"
import { ExperienceStudio } from "./ExperienceStudio"
import { ScreenGallery } from "./ScreenGallery"
import { useCms, useSection } from "@/cms/useCms"
import { StatsBand } from "@/pages/Home/StatsBand"
import { WorkflowSection } from "@/pages/Home/WorkflowSection"

export function HomePage(_props: { onToast: (m: string) => void }) {
  const { homeSections, staff } = useCms()
  const hero = useSection("hero").fields
  const gate = (id: string, node: ReactNode) => {
    const index = homeSections.findIndex((section) => section.id === id)
    const section = homeSections[index]
    if (section && !section.visible && !staff) return null
    return <div style={{ order: ["hero", "stats", "gallery", "testimonials", "workflow", "guarantee", "contact"].indexOf(id) }} className={section && !section.visible ? "home-hidden-preview" : undefined}>{node}</div>
  }

  return (
    <div className="home-stack">
      {gate("hero", <section data-motion-group className="page-container page-container--wide da-hero">
        <div>
          <div className="da-hero-copy">
            <p data-motion="rise" className="da-kicker">{hero.kicker}</p>
            <h1 data-motion="reveal" data-motion-delay="140" className="mt-4 text-[34px] sm:text-[68px] leading-[1.15] font-semibold text-[var(--color-ink)]">
              {hero.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
            </h1>
            <p data-motion="rise" data-motion-delay="280" className="mt-4 text-[16px] leading-8 text-[var(--color-text-muted)] max-w-[34rem]">
              {hero.lede}
            </p>
            <div data-motion="rise" data-motion-delay="420" className="hero-actions">
              <Link to="/contact" className="btn btn-ink brand-cta">{hero.cta}</Link>
              <Link to="/portfolio" className="btn btn-line brand-cta">
                <Icon name="play" size={14} /> {hero.cta2}
              </Link>
            </div>
            <p data-motion="rise" data-motion-delay="560" className="da-proof text-[13px] text-[var(--color-text-muted)]">
              <span className="text-[var(--color-gold)]">★★★★★</span> {hero.proof}
            </p>
          </div>

          <div className="hero-product-scene">
            <div className="hero-product-label"><span /> من الفكرة إلى منتج يعمل <span aria-hidden="true">AMTDEX STUDIO ↗</span></div>
            <div data-motion="rise" data-motion-delay="200" className="da-app">
            <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
              <span className="text-[12px] font-semibold">لوحة التحكم</span>
              <span data-motion="signal" data-motion-delay="700" className="inline-flex items-center gap-2 text-[11px] font-semibold">
                <span className="status-dot" /> النظام مباشر الآن
              </span>
            </div>
            <div className="grid sm:grid-cols-[160px_1fr]">
              <div className="hidden sm:flex flex-col gap-1 p-4 border-l border-[var(--color-border)] bg-[var(--color-bg)]">
                <div className="text-[10px] font-semibold text-[var(--color-text-faint)]">المشاريع</div>
                <div className="mt-2 bg-[var(--color-ink)] text-white px-3 py-2 text-[12px] font-semibold">لوحة المبيعات</div>
                <div className="px-3 py-2 text-[12px] text-[var(--color-text-muted)]">تحليل العملاء</div>
                <div className="px-3 py-2 text-[12px] text-[var(--color-text-muted)]">حملات التسويق</div>
                <div className="mt-auto border border-[var(--color-border)] p-3 text-[11px] leading-5">
                  <div className="font-semibold text-[var(--color-ink)]">الخطة الاحترافية</div>
                  <div className="text-[var(--color-text-muted)] mt-1">احصل على تحليلات متقدمة بلا حدود</div>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex flex-col gap-4">
                <div className="da-metrics">
                  {[
                    ["الحالة", "مباشر", "الآن"],
                    ["العملاء", "1,842", "+8.1%"],
                    ["المهام", "96%", "مكتملة"],
                  ].map(([label, value, note], index) => (
                    <div key={label} data-motion="signal" data-motion-delay={400 + index * 110} className="bg-[var(--color-surface)] p-3">
                      <div className="text-[11px] text-[var(--color-text-muted)]">{label}</div>
                      <div className="mt-2 text-[16px] sm:text-[18px] font-semibold">{value}</div>
                      <div className="mt-1 text-[11px] text-[var(--color-success)]">{note}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold">نمو المبيعات — آخر 6 أشهر</span>
                    <span className="text-[var(--color-text-muted)]">الإيرادات</span>
                  </div>
                  <div className="mt-4 flex items-end gap-2 h-[96px]">
                    {[
                      { h: 40, label: "ينا" },
                      { h: 68, label: "فبر" },
                      { h: 52, label: "مار" },
                      { h: 88, label: "أبر" },
                      { h: 72, label: "ماي" },
                      { h: 88, label: "يون", active: true },
                    ].map((b, index) => (
                      <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5">
                        <div data-motion="bar" data-motion-delay={650 + index * 100} className={`w-full ${b.active ? "bg-[var(--color-ink)]" : "bg-[var(--color-ink)]/15"}`} style={{ height: b.h }} />
                        <span className="text-[10px] text-[var(--color-text-faint)]">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[12px] border-t border-[var(--color-border)] pt-3">
                  النظام يعمل الآن
                  <span className="block text-[var(--color-ink)] mt-1">مباشر وجاهز للاستخدام</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>)}

      {gate("stats", <StatsBand />)}
      {gate("gallery", <><ExperienceStudio /><ScreenGallery /></>)}
      {gate("testimonials", <section data-motion-group className="page-container page-container--wide page-section home-testimonials"><Testimonials /></section>)}
      {gate("workflow", <WorkflowSection />)}
      {gate("guarantee", <GuaranteeBanner />)}

      {gate("contact", <section data-motion-group className="page-container page-container--wide contact-news-section" aria-labelledby="contact-news-title">
        <div className="contact-news-card contact-only-card">
          <div className="contact-news-copy">
            <span className="contact-news-eyebrow">لنتحدث عن مشروعك القادم</span>
            <h2 id="contact-news-title" data-motion="rise">
              عندك فكرة؟ لنتحدث عنها.
            </h2>
            <p data-motion="rise" data-motion-delay="140" className="contact-news-lede">
              من الفكرة إلى التنفيذ. أخبرنا عن مشروعك وسنناقش معك الخطوة التالية.
            </p>
            <div data-motion="rise" data-motion-delay="260" className="contact-news-actions">
              <Link to="/quote" className="contact-news-primary brand-cta">ابدأ مشروعك <Icon name="arrowUpLeft" size={18} /></Link>
              <Link to="/contact" className="contact-news-secondary">تحدث معنا <Icon name="arrowUpLeft" size={18} /></Link>
            </div>
            <ul className="contact-news-proof" aria-label="مزايا التواصل"><li>رد خلال ساعات</li><li>استشارة مجانية</li><li>عقد واضح</li></ul>
          </div>

        </div>
      </section>)}
    </div>
  )
}
