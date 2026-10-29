import { Link } from "react-router-dom"

export function SpotlightSection() {
  return (
    <section className="mx-auto max-w-[1280px] xl:max-w-[1440px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 bg-white border-y border-[var(--color-border)]">
      <div className="grid lg:grid-cols-[minmax(0,560px)_1fr] gap-5 items-start">
        <div>
          <div className="text-[11px] font-bold text-[var(--color-primary)]">قصة نجاح — من ورشة الى منصة</div>
          <h2 className="mt-3 text-[22px] sm:text-[28px] leading-[1.2] sm:leading-[34px] font-bold text-[var(--color-ink)]">“AMTDEX لم تبن لنا نظاما،<br />بنت لنا قدرة على النمو.”</h2>
          <p className="mt-3 text-[13px] leading-[23px] text-[var(--color-text-muted)]">نخبة كانت تدير 3 انظمة منفصلة. اليوم منصة واحدة تخدم فرعين وتستعد للثالث — بلا اعادة بناء.</p>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-[var(--color-card-soft)] rounded-xl p-3"><div className="text-[16px] sm:text-[18px] font-bold text-[var(--color-primary)]">60%+</div><div className="text-[10px] text-[var(--color-text-muted)] mt-1">نمو المبيعات</div></div>
            <div className="bg-[var(--color-card-soft)] rounded-xl p-3"><div className="text-[16px] sm:text-[18px] font-bold text-[var(--color-primary)]">18 ساعة</div><div className="text-[10px] text-[var(--color-text-muted)] mt-1">توفير اسبوعي</div></div>
            <div className="bg-[var(--color-card-soft)] rounded-xl p-3"><div className="text-[16px] sm:text-[18px] font-bold text-[var(--color-primary)]">10 اسابيع</div><div className="text-[10px] text-[var(--color-text-muted)] mt-1">من الفكرة للاطلاق</div></div>
          </div>
          <Link to="/portfolio" className="mt-5 inline-flex items-center gap-2 bg-[var(--color-ink)] text-white text-[12px] font-bold px-5 py-2.5 rounded-full hover:bg-black transition-colors">اقرأ دراسة الحالة كاملة ←</Link>
        </div>
        <div className="bg-[var(--color-card-soft)] rounded-2xl border border-[var(--color-border)] overflow-hidden flex flex-col h-[280px] sm:h-[320px]">
          <div className="flex items-center gap-1.5 px-3.5 h-9 bg-white border-b border-[var(--color-border)] shrink-0">
            <span className="size-2 rounded-full bg-[#FF5F56]" /><span className="size-2 rounded-full bg-[#FFBD2E]" /><span className="size-2 rounded-full bg-[#27C93F]" />
            <span className="ml-2 text-[11px] font-semibold text-[var(--color-text-muted)]">nukhba.sa — قبل / بعد</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="bg-[#FFF0EB] border border-[var(--color-outline-peach)] rounded-xl p-3 flex flex-col gap-2">
              <div className="text-[10px] font-bold text-[#FF5F56] text-center">قبل — 3 انظمة</div>
              <div className="h-10 bg-white border border-[var(--color-outline-peach)] rounded-lg" /><div className="h-10 bg-white border border-[var(--color-outline-peach)] rounded-lg" /><div className="h-10 bg-white border border-[var(--color-outline-peach)] rounded-lg" />
            </div>
            <div className="bg-[var(--color-success-bg)] border border-[#B8E6C8] rounded-xl p-3 flex flex-col gap-2">
              <div className="text-[10px] font-bold text-[var(--color-success)] text-center">بعد — منصة واحدة</div>
              <div className="flex-1 bg-[var(--color-primary)] rounded-lg grid place-items-center"><span className="text-white text-[11px] font-bold">AMTDEX Platform</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
