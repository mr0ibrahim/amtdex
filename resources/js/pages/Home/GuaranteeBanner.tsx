import { Link } from "react-router-dom"

export function GuaranteeBanner() {
  return (
    <section data-motion-group className="da-band">
      <div className="page-container page-container--wide py-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <span className="font-display text-[13px] font-semibold tracking-[0.14em] text-[var(--color-text-muted)]">الضمان</span>
        <div data-motion="rise" className="flex-1">
          <div className="text-[16px] font-semibold">ضمان AMTDEX — اذا لم نسلم حسب الاتفاق، نعيد الدفعة الاخيرة كاملة.</div>
          <div className="text-[13px] text-[var(--color-text-muted)] mt-1">مكتوب في العقد. ثقة نبنيها بالافعال، لا الشعارات.</div>
        </div>
        <Link to="/pricing" className="btn btn-line brand-cta shrink-0">اقرأ الضمان</Link>
      </div>
    </section>
  )
}
