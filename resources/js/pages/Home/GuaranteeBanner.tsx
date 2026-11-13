import { PublicLink as Link } from "@/cms/PublicLink"
import { Icon } from "@/components/ui/Icon"

export function GuaranteeBanner() {
  return (
    <section data-motion-group className="page-container page-container--wide guarantee-section" aria-labelledby="guarantee-title">
      <div data-motion="rise" className="guarantee-card">
        <div className="guarantee-art" aria-hidden="true"><div className="contract-sheet contract-back" /><div className="contract-sheet contract-front" data-tilt><span>AMTDEX</span><div className="guarantee-seal"><Icon name="shield" size={44} /></div><strong>التزامنا مكتوب.</strong><i /><i /><i /><span className="contract-signature">AMTDEX / GUARANTEE</span></div><span className="guarantee-art-note">ثقة تبدأ باتفاق واضح</span></div>
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
