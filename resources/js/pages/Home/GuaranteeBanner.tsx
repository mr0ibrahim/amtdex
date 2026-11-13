import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { PublicLink as Link } from "@/cms/PublicLink"
import { Icon } from "@/components/ui/Icon"

export function GuaranteeBanner() {
  return (
    <section data-motion-group className="page-container page-container--wide guarantee-section" aria-labelledby="guarantee-title">
      <div data-motion="rise" className="guarantee-card">
        <div className="guarantee-art" data-motion="vector"><BrandArtwork kind="shield" /></div>
        <div className="guarantee-copy">
          <span className="guarantee-label">التزام موثّق في العقد</span>
          <h2 id="guarantee-title">ضمان AMTDEX</h2>
          <p>إذا لم نسلّم حسب الاتفاق، نعيد الدفعة الأخيرة كاملة.</p>
          <span className="guarantee-note">مكتوب في العقد. ثقة نبنيها بالأفعال، لا الشعارات.</span>
        </div>
        <Link to="/contact" className="guarantee-action brand-cta">تواصل معنا <Icon name="arrowUpLeft" size={18} /></Link>
      </div>
    </section>
  )
}
