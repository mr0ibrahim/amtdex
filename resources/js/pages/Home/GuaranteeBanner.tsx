import { Icon } from "@/components/ui/Icon"
export function GuaranteeBanner() {
  return (
    <section className="mx-auto max-w-[1280px] xl:max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center gap-4" style={{ background: "var(--gradient-primary)" }}>
      <span className="size-12 rounded-full bg-[var(--color-gold)] grid place-items-center text-[18px] shrink-0"><Icon name="check" size={16} /></span>
      <div className="flex-1 min-w-0">
        <div className="text-white text-[14px] font-bold">ضمان AMTDEX — اذا لم نسلم حسب الاتفاق، نعيد الدفعة الاخيرة كاملة.</div>
        <div className="text-white/60 text-[11px] mt-1">مكتوب في العقد. ثقة نبنيها بالافعال، لا الشعارات.</div>
      </div>
      <a href="#pricing" onClick={(e)=>{e.preventDefault();document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})}} className="shrink-0 bg-white text-[var(--color-ink)] text-[12px] font-bold px-5 py-3 rounded-full hover:bg-white/90 transition-colors">اقرأ الضمان ←</a>
    </section>
  )
}
