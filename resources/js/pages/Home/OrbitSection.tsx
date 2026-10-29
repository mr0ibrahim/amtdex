import { Icon } from "@/components/ui/Icon"
export function OrbitSection() {
  return (
    <section data-motion-group className="mx-auto max-w-[1280px] xl:max-w-[1440px] px-4 sm:px-6 lg:px-10 py-10 sm:py-12 bg-[var(--color-card-soft)] border-y border-[var(--color-border)]">
      <div className="text-center">
        <div className="text-[11px] font-bold text-[var(--color-primary-light)]">تقنياتنا تدور حول عملك — لا العكس</div>
        <h2 className="mt-2 text-[26px] sm:text-[32px] font-bold text-[var(--color-ink)] text-center">من الفكرة الى الـ API في اسابيع</h2>
      </div>
      <div className="mt-8 mx-auto max-w-[720px] flex flex-col sm:flex-row gap-3 items-center justify-center">
        <div data-motion="rise" data-motion-delay="0" className="w-full sm:w-[340px] bg-white rounded-2xl border border-[var(--color-border)] p-[18px]">
          <div className="text-[10px] font-bold tracking-[0.6px] text-[var(--color-text-faint)]">ما نستخدمه يوميا</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="bg-[var(--color-ink)] text-white text-[11px] font-bold font-mono px-3.5 py-2 rounded-full">Next.js</span>
            <span className="bg-[var(--color-ink)] text-white text-[11px] font-bold font-mono px-3.5 py-2 rounded-full">Laravel</span>
            <span className="bg-[var(--color-ink)] text-white text-[11px] font-bold font-mono px-3.5 py-2 rounded-full">Flutter</span>
            <span className="bg-[var(--color-ink)] text-white text-[11px] font-bold font-mono px-3.5 py-2 rounded-full">PostgreSQL</span>
            <span className="bg-[var(--color-ink)] text-white text-[11px] font-bold font-mono px-3.5 py-2 rounded-full">AWS</span>
          </div>
          <p className="mt-3 text-[12px] leading-5 text-[var(--color-text-muted)]">نختار التقنية حسب مشكلتك — لا نفرض ما نعرفه فقط.</p>
        </div>
        <div className="brand-core shrink-0 size-[90px] sm:size-[100px] rounded-full grid place-items-center shadow-[0_12px_24px_rgba(40,16,113,0.3)]" style={{ background: "var(--gradient-primary)" }}>
          <svg className="brand-core-orbits" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle className="orbit-track" cx="50" cy="50" r="43" />
            <path data-motion="draw" data-motion-delay="200" pathLength="1" d="M7 50 A43 43 0 0 1 93 50" stroke="currentColor" strokeWidth="1.5" />
            <path data-motion="draw" data-motion-delay="650" pathLength="1" d="M93 50 A43 43 0 0 1 7 50" stroke="currentColor" strokeWidth="1.5" />
            <circle data-motion="signal" data-motion-delay="1450" cx="7" cy="50" r="3" fill="currentColor" />
            <circle data-motion="signal" data-motion-delay="1000" cx="93" cy="50" r="3" fill="currentColor" />
          </svg>
          <span className="text-white text-[13px] font-extrabold">AMTDEX</span>
        </div>
        <div data-motion="rise" data-motion-delay="550" className="w-full sm:w-[340px] bg-white rounded-2xl border border-[var(--color-border)] p-[18px]">
          <div className="text-[10px] font-bold text-[var(--color-text-faint)]">ما نقدمه لك</div>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--color-ink)]"><span className="size-5 rounded-full bg-[var(--color-success-bg)] grid place-items-center text-[10px] text-[var(--color-success)]"><Icon name="check" size={16} /></span> تسليم مرحلي — ترى كل اسبوع</div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--color-ink)]"><span className="size-5 rounded-full bg-[var(--color-success-bg)] grid place-items-center text-[10px] text-[var(--color-success)]"><Icon name="check" size={16} /></span> كود نظيف وموثق</div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--color-ink)]"><span className="size-5 rounded-full bg-[var(--color-success-bg)] grid place-items-center text-[10px] text-[var(--color-success)]"><Icon name="check" size={16} /></span> ضمان 90 يوم مجانا</div>
          </div>
        </div>
      </div>
    </section>
  )
}
