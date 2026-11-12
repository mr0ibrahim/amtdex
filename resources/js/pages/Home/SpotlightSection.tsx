import { PublicLink as Link } from "@/cms/PublicLink"

export function SpotlightSection() {
  return (
    <section data-motion-group className="page-container page-container--wide page-section">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-10 items-start">
        <div>
          <div className="eyebrow">قصة نجاح — من ورشة الى منصة</div>
          <h2 data-motion="rise" data-motion-delay="120" className="mt-4 text-[28px] sm:text-[36px] leading-[1.3] font-semibold">
            “AMTDEX لم تبن لنا نظاما، بنت لنا قدرة على النمو.”
          </h2>
          <p data-motion="rise" data-motion-delay="220" className="mt-4 text-[15px] leading-8 text-[var(--color-text-muted)] max-w-[36rem]">
            نخبة كانت تدير 3 انظمة منفصلة. اليوم منصة واحدة تخدم فرعين وتستعد للثالث — بلا اعادة بناء.
          </p>
          <dl data-motion="rise" data-motion-delay="320" className="mt-8 grid grid-cols-3 border-t border-[var(--color-ink)]">
            {[
              ["60%+", "نمو المبيعات"],
              ["18 ساعة", "توفير اسبوعي"],
              ["10 اسابيع", "من الفكرة للاطلاق"],
            ].map(([value, label]) => (
              <div key={label} className="pt-4 pe-3">
                <dt className="font-display text-[22px] font-semibold">{value}</dt>
                <dd className="mt-1 text-[12px] text-[var(--color-text-muted)]">{label}</dd>
              </div>
            ))}
          </dl>
          <Link to="/portfolio" className="btn btn-ink brand-cta mt-8">اقرأ دراسة الحالة كاملة</Link>
        </div>
        <div data-motion="rise" data-motion-delay="180" className="border border-[var(--color-ink)] min-h-[280px] grid grid-cols-2">
          <div className="p-5 border-l border-[var(--color-border)]">
            <div className="text-[11px] font-semibold text-[var(--color-text-muted)]">قبل — 3 انظمة</div>
            <div className="mt-6 space-y-3">
              <div className="h-10 border border-[var(--color-border)]" />
              <div className="h-10 border border-[var(--color-border)]" />
              <div className="h-10 border border-[var(--color-border)]" />
            </div>
          </div>
          <div className="p-5 bg-[var(--color-ink)] text-white flex flex-col">
            <div className="text-[11px] font-semibold text-white/60">بعد — منصة واحدة</div>
            <div className="mt-auto text-[20px] font-semibold leading-snug">AMTDEX<br />Platform</div>
            <div className="mt-2 text-[12px] text-white/60">nukhba.sa</div>
          </div>
        </div>
      </div>
    </section>
  )
}
