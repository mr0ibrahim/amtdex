import { Icon } from "@/components/ui/Icon"

export function OrbitSection() {
  return (
    <section data-motion-group className="page-container page-container--wide page-section border-y border-[var(--color-border)]">
      <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
        <div data-motion="rise">
          <div className="eyebrow">تقنياتنا تدور حول عملك — لا العكس</div>
          <h2 className="mt-4 text-[28px] sm:text-[36px] font-semibold leading-[1.25]">من الفكرة الى الـ API في اسابيع</h2>
          <p className="mt-3 text-[14px] leading-7 text-[var(--color-text-muted)]">نختار التقنية حسب مشكلتك — لا نفرض ما نعرفه فقط.</p>
          <ul className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {["Next.js", "Laravel", "Flutter", "PostgreSQL", "AWS"].map((item) => (
              <li key={item} className="py-2.5 font-mono text-[13px]">{item}</li>
            ))}
          </ul>
        </div>
        <div className="brand-core size-[140px] mx-auto grid place-items-center border border-[var(--color-ink)] bg-[var(--color-ink)]">
          <svg className="brand-core-orbits" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle className="orbit-track" cx="50" cy="50" r="43" />
            <path data-motion="draw" data-motion-delay="200" pathLength="1" d="M7 50 A43 43 0 0 1 93 50" stroke="currentColor" strokeWidth="1.5" />
            <path data-motion="draw" data-motion-delay="650" pathLength="1" d="M93 50 A43 43 0 0 1 7 50" stroke="currentColor" strokeWidth="1.5" />
            <circle data-motion="signal" data-motion-delay="1450" cx="7" cy="50" r="3" fill="currentColor" />
            <circle data-motion="signal" data-motion-delay="1000" cx="93" cy="50" r="3" fill="currentColor" />
          </svg>
          <span className="text-white text-[12px] font-semibold tracking-[0.14em]">AMTDEX</span>
        </div>
        <div data-motion="rise" data-motion-delay="200">
          <div className="text-[12px] font-semibold text-[var(--color-text-muted)]">ما نقدمه لك</div>
          <ul className="mt-4 space-y-4">
            {[
              "تسليم مرحلي — ترى كل اسبوع",
              "كود نظيف وموثق",
              "ضمان 90 يوم مجانا",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14px] font-semibold">
                <Icon name="check" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
