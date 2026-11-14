import { CapabilityRibbon, FloatingCapabilities, TechnologyMarquee } from "@/components/ui/ReferenceMotion"
import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { type ReactNode } from "react"
import { PublicLink as Link } from "@/cms/PublicLink"
import { ProductScene } from "./ProductScene"
import { Icon } from "@/components/ui/Icon"
import { ServiceCollection } from "@/components/ui/ServiceCollection"
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
  const order = ["hero", "intro", "services", "gallery", "stats", "workflow", "testimonials", "guarantee", "contact"]
  const gate = (id: string, node: ReactNode) => {
    const section = homeSections.find(section => section.id === id)
    if (section && !section.visible && !staff) return null
    return <div style={{ order: order.indexOf(id) }} className={section && !section.visible ? "home-hidden-preview" : undefined}>{node}</div>
  }
  return <div className="home-stack reference-home">
    {gate("hero", <>
      <section data-motion-group className="page-container page-container--wide da-hero reference-hero">
        <FloatingCapabilities />
        <div><div className="da-hero-copy">
          <p className="da-kicker">{hero.kicker}</p>
          <h1>{hero.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
          <p className="reference-hero-description">{hero.lede}</p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-ink brand-cta">{hero.cta}<Icon name="launch" size={17} /></Link>
            <Link to="/portfolio" className="btn btn-line brand-cta"><Icon name="play" size={15} />{hero.cta2}</Link>
          </div>
          <TechnologyMarquee />
        </div></div>
      </section>
      <CapabilityRibbon />
    </>)}
    {gate("intro", <section className="reference-intro page-container page-container--wide page-section" aria-labelledby="reference-intro-title" data-motion-group>
      <div className="reference-intro-copy">
        <span className="reference-section-label"><Icon name="sparkles" size={16} /> تعرّف على امتدكس سوفت</span>
        <h2 id="reference-intro-title" data-motion="rise">نفهم الفكرة.<br /><em>ونبني ما تحتاجه.</em></h2>
        <p>نطوّر المواقع والتطبيقات وأنظمة الأعمال حول احتياج مشروعك. نبدأ بفهم التفاصيل، ونربط التصميم بالتطوير لنصل إلى تجربة واضحة وسهلة الاستخدام.</p>
        <ul className="reference-intro-benefits"><li><Icon name="check" size={17} /> تصميم يعكس هويتك</li><li><Icon name="check" size={17} /> تجربة تناسب الهاتف وسطح المكتب</li><li><Icon name="check" size={17} /> تطوير قابل للنمو</li></ul>
        <Link to="/about" className="btn btn-ink">تعرّف علينا<Icon name="arrowLeft" size={18} /></Link>
      </div>
      <ProductScene />
    </section>)}
    {gate("services", <section className="reference-services-section page-section" aria-labelledby="home-services-title" data-motion-group>
      <div className="page-container page-container--wide">
        <header className="reference-section-heading"><span className="reference-section-label">حلول لمشروعك</span><h2 id="home-services-title">كل ما تحتاجه<br className="reference-mobile-break" /> <em>لتجربة رقمية أفضل.</em></h2><p>اختر ما يناسب احتياجك، ودعنا نبني التفاصيل معك.</p></header>
        <ServiceCollection limit={6} />
        <div className="reference-section-action"><Link to="/services" className="btn btn-line">استعرض جميع الخدمات<Icon name="arrowLeft" size={18} /></Link></div>
      </div>
    </section>)}
    {gate("gallery", <><ExperienceStudio /><ScreenGallery /></>)}
    {gate("stats", <StatsBand />)}
    {gate("workflow", <WorkflowSection />)}
    {gate("testimonials", <section data-motion-group className="page-container page-container--wide page-section home-testimonials"><header className="reference-section-heading"><span className="reference-section-label">الثقة تصنع الفرق</span><h2>تجارب يرويها <em>عملاؤنا.</em></h2></header><Testimonials /></section>)}
    {gate("guarantee", <GuaranteeBanner />)}
    {gate("contact", <section data-motion-group className="page-container page-container--wide contact-news-section" aria-labelledby="contact-news-title">
      <div className="contact-news-card contact-only-card">
        <div className="contact-art" data-motion="vector"><BrandArtwork kind="contact" /></div>
        <div className="contact-news-copy"><span className="contact-news-eyebrow">خطوتك القادمة تبدأ هنا</span><h2 id="contact-news-title" data-motion="rise">عندك فكرة؟<br />لنحوّلها إلى مشروع.</h2><p className="contact-news-lede">أخبرنا بما تحتاجه، ولنناقش معًا الخطوة التالية.</p><div className="contact-news-actions"><Link to="/quote" className="contact-news-primary brand-cta">ابدأ مشروعك<Icon name="actionArrow" size={18} /></Link><Link to="/contact" className="contact-news-secondary">تحدث معنا<Icon name="actionArrow" size={18} /></Link></div></div>
      </div>
    </section>)}
  </div>
}
