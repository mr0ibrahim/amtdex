import { CapabilityRibbon, TechnologyMarquee } from "@/components/ui/ReferenceMotion"
import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { type ReactNode } from "react"
import { PublicLink as Link } from "@/cms/PublicLink"
import { ProductScene } from "./ProductScene"
import { Icon } from "@/components/ui/Icon"
import { whatsappUrl } from "@/lib/site"
import { ServiceCollection } from "@/components/ui/ServiceCollection"
import { Testimonials } from "./Testimonials"
import { GuaranteeBanner } from "@/pages/Home/GuaranteeBanner"
import { ExperienceStudio } from "./ExperienceStudio"
import { useCms, useSection } from "@/cms/useCms"
import { StatsBand } from "@/pages/Home/StatsBand"
import { AfterCareSection } from "./AfterCareSection"
import { WorkflowSection } from "@/pages/Home/WorkflowSection"

export function HomePage(_props: { onToast: (m: string) => void }) {
  const { homeSections, staff } = useCms()
  const hero = useSection("hero").fields
  // Seven blocks: hero with the product scene, proof, services, work, process, voices, closing.
  const order = ["hero", "stats", "services", "gallery", "workflow", "aftercare", "testimonials", "guarantee", "contact"]
  // The product scene used to open the separate intro block; its visibility switch still applies.
  const intro = homeSections.find(section => section.id === "intro")
  const scene = !intro || intro.visible || staff
  const gate = (id: string, node: ReactNode) => {
    const section = homeSections.find(section => section.id === id)
    if (section && !section.visible && !staff) return null
    return <div style={{ order: order.indexOf(id) }} className={section && !section.visible ? "home-hidden-preview" : undefined}>{node}</div>
  }
  return <div className="home-stack reference-home">
    {gate("hero", <>
      <section data-motion-group className={`page-container page-container--wide da-hero reference-hero${scene ? " reference-hero--scene" : ""}`}>
        <div><div className="da-hero-copy">
          <p className="da-kicker">{hero.kicker}</p>
          <h1>{hero.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
          <p className="reference-hero-description">{hero.lede}</p>
          <div className="hero-actions">
            <Link to="/quote" className="btn btn-ink brand-cta">ابدأ مشروعك<Icon name="launch" size={17} /></Link>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn btn-line brand-cta"><Icon name="whatsapp" size={17} />واتساب</a>
          </div>
          <TechnologyMarquee />
        </div>{scene && <ProductScene />}</div>
      </section>
      <CapabilityRibbon />
    </>)}
    {gate("services", <section className="reference-services-section page-section" aria-labelledby="home-services-title" data-motion-group>
      <div className="page-container page-container--wide">
        <header className="reference-section-heading"><span className="reference-section-label">حلول لمشروعك</span><h2 id="home-services-title">كل ما تحتاجه<br className="reference-mobile-break" /> <em>لتجربة رقمية أفضل.</em></h2><p>اختر ما يناسب احتياجك، ودعنا نبني التفاصيل معك.</p></header>
        <ServiceCollection limit={6} />
        <div className="reference-section-action"><Link to="/services" className="btn btn-line">استعرض جميع الخدمات<Icon name="arrowLeft" size={18} /></Link></div>
      </div>
    </section>)}
    {gate("gallery", <ExperienceStudio />)}
    {gate("stats", <StatsBand />)}
    {gate("workflow", <WorkflowSection />)}
    {gate("aftercare", <AfterCareSection />)}
    {gate("testimonials", <section data-motion-group className="page-container page-container--wide page-section home-testimonials"><header className="reference-section-heading"><span className="reference-section-label">الثقة تصنع الفرق</span><h2>تجارب يرويها <em>عملاؤنا.</em></h2></header><Testimonials /></section>)}
    {gate("guarantee", <GuaranteeBanner />)}
    {gate("contact", <section data-motion-group className="page-container page-container--wide contact-news-section" aria-labelledby="contact-news-title">
      <div className="contact-news-card contact-only-card">
        <div className="contact-art" data-motion="vector"><BrandArtwork kind="contact" /></div>
        <div className="contact-news-copy"><span className="contact-news-eyebrow">خطوتك القادمة تبدأ هنا</span><h2 id="contact-news-title" data-motion="rise">عندك فكرة؟<br />لنحوّلها إلى مشروع.</h2><p className="contact-news-lede">أخبرنا بما تحتاجه، ولنناقش معًا الخطوة التالية.</p><div className="contact-news-actions"><Link to="/quote" className="contact-news-primary brand-cta">ابدأ مشروعك<Icon name="actionArrow" size={18} /></Link><a href={whatsappUrl()} target="_blank" rel="noreferrer" className="contact-news-secondary"><Icon name="whatsapp" size={18} />واتساب</a></div></div>
      </div>
    </section>)}
  </div>
}
