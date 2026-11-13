import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { type ReactNode } from "react"
import { PublicLink as Link } from "@/cms/PublicLink"
import { ProductScene } from "./ProductScene"
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

          <ProductScene />
        </div>
      </section>)}

      {gate("stats", <StatsBand />)}
      {gate("gallery", <><ExperienceStudio /><ScreenGallery /></>)}
      {gate("testimonials", <section data-motion-group className="page-container page-container--wide page-section home-testimonials"><Testimonials /></section>)}
      {gate("workflow", <WorkflowSection />)}
      {gate("guarantee", <GuaranteeBanner />)}

      {gate("contact", <section data-motion-group className="page-container page-container--wide contact-news-section" aria-labelledby="contact-news-title">
        <div className="contact-news-card contact-only-card">
          <div className="contact-art" data-motion="vector"><BrandArtwork kind="contact" /></div>
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
