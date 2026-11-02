import { Link } from "react-router-dom"
import { Icon } from "@/components/ui/Icon"

export function GuaranteeBanner() {
  return (
    <section className="page-container page-container--wide py-6 flex flex-col sm:flex-row items-center gap-4 bg-gradient-primary">
      <span className="size-12 rounded-full bg-[var(--color-gold)] grid place-items-center text-[18px] shrink-0">
        <Icon name="check" size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-white text-[14px] font-bold">ضمان AMTDEX — اذا لم نسلم حسب الاتفاق، نعيد الدفعة الاخيرة كاملة.</div>
        <div className="text-white/60 text-[11px] mt-1">مكتوب في العقد. ثقة نبنيها بالافعال، لا الشعارات.</div>
      </div>
      <Link
        to="/pricing"
        className="shrink-0 bg-white text-[var(--color-ink)] text-[12px] font-bold px-5 py-3 rounded-full hover:bg-white/90 transition-colors"
      >
        اقرأ الضمان ←
      </Link>
    </section>
  )
}
