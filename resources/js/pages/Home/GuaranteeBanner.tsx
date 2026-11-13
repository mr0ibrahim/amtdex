import { useSection } from "@/cms/useCms"
import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { PublicLink as Link } from "@/cms/PublicLink"
import { Icon } from "@/components/ui/Icon"

export function GuaranteeBanner() {
  const fields = useSection("guarantee").fields
  return (
    <section data-motion-group className="page-container page-container--wide guarantee-section" aria-labelledby="guarantee-title">
      <div data-motion="rise" className="guarantee-card">
        <div className="guarantee-art" data-motion="vector"><BrandArtwork kind="shield" /></div>
        <div className="guarantee-copy">
          <span className="guarantee-label">{fields.kicker}</span>
          <h2 id="guarantee-title">{fields.title}</h2>
          <p>{fields.lede}</p>
          <span className="guarantee-note">{fields.note}</span>
        </div>
        <Link to="/contact" className="guarantee-action brand-cta">{fields.cta} <Icon name="arrowUpLeft" size={18} /></Link>
      </div>
    </section>
  )
}
