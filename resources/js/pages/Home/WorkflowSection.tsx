import { Icon, type IconName } from "@/components/ui/Icon"
import { Link } from "react-router-dom"

export function WorkflowSection() {
  return (
    <section data-motion-group className="page-container page-container--wide page-section">
      <div className="grid lg:grid-cols-[minmax(0,520px)_1fr] gap-6 sm:gap-8 items-start">
        {/* Left */}
        <div>
          <div className="eyebrow">منهجية العمل</div>
          <h2 data-motion="rise" className="mt-4 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[var(--color-ink)]">
            من الفكرة إلى الإطلاق
            <br />
            في ثلاث خطوات.
          </h2>
          <p className="mt-3 text-[14px] leading-[26px] text-[var(--color-text-muted)] max-w-[480px]">منهجية واضحة، تواصل شفاف، وتسليم مرحلي — ترى التقدم كل أسبوع، لا مفاجآت في النهاية.</p>
          <div className="brand-workflow mt-8 divide-y divide-[var(--color-border)]">
            <svg className="brand-workflow-track" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true"><path data-motion="draw" d="M1 0 V100" pathLength="1" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            {[
              { n: "01", t: "نحلل ونخطط", d: "ورشة اكتشاف، تحليل متطلبات، وخارطة طريق تقنية مع تقدير زمني وتكلفة شفافة.", dark: true },
              { n: "02", t: "نصمم ونطوّر", d: "تصميم UX/UI ثم تطوير رشيق (Agile) مع نسخ تجريبية تراها وتجربها أسبوعياً.", dark: false },
              { n: "03", t: "نطلق وندعم", d: "إطلاق آمن، تدريب لفريقك، ودعم مستمر وتطوير إضافي حسب نمو أعمالك.", dark: false },
            ].map((s, index) => (
              <div key={s.n} data-motion="rise" data-motion-delay={index * 240} className="flex gap-4 py-5">
                <span className={`size-10 shrink-0 grid place-items-center text-[12px] font-semibold font-mono ${s.dark ? "bg-[var(--color-ink)] text-white" : "border border-[var(--color-ink)] text-[var(--color-ink)]"}`}>{s.n}</span>
                <div>
                  <div className="text-[14px] font-bold text-[var(--color-ink)]">{s.t}</div>
                  <div className="text-[12.5px] leading-[23px] text-[var(--color-text-muted)] mt-1">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Roadmap mock */}
        <div data-motion="rise" data-motion-delay="160" className="border border-[var(--color-ink)] overflow-hidden">
          <div className="flex items-center justify-between px-5 h-[48px] bg-white border-b border-[var(--color-border)]">
            <span className="text-[12px] font-bold text-[var(--color-ink)]">خارطة طريق — نظام إدارة المبيعات</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--color-success)] text-[11px] font-semibold">
              <span className="size-1.5 rounded-full bg-[var(--color-success)]" /> قيد التطوير
            </span>
          </div>
          <div className="p-5 space-y-3">
            {[
              { icon: "mail", bg: "var(--color-accent)", title: "تحليل المتطلبات", sub: "ورشة اكتشاف + وثيقة SRS", time: "الأسبوع 1" },
              { icon: "code", bg: "var(--color-ink)", title: "تصميم وتطوير", sub: "Figma → Next.js / Laravel", time: "الأسابيع 2-6" },
              { icon: "launch", bg: "var(--color-accent-purple)", title: "اختبار وإطلاق", sub: "QA + نشر سحابي + تدريب", time: "الأسبوع 7" },
            ].map((f, index) => (
              <div key={f.title} data-motion="rise" data-motion-delay={200 + index * 240} className="flex items-center gap-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
                <span className="size-10 shrink-0 grid place-items-center text-white" style={{ background: f.bg }}>
                  <Icon name={f.icon as IconName} size={21} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-[var(--color-ink)]">{f.title}</div>
                  <div className="text-[11px] text-[var(--color-text-muted)]">{f.sub}</div>
                </div>
                <span className="text-[10px] font-semibold font-mono text-[var(--color-text-faint)] shrink-0">{f.time}</span>
                <span className="text-[var(--color-text-faint)] text-[14px]">›</span>
              </div>
            ))}
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="w-px h-4 bg-[var(--color-border)]" />
              <span className="text-[var(--color-text-faint)]">↓</span>
              <span className="w-px h-4 bg-[var(--color-border)]" />
            </div>
            <Link to="/contact" className="flex items-center justify-center gap-2 border border-[var(--color-ink)] py-3.5 text-[12px] font-semibold hover:bg-[var(--color-ink)] hover:text-white transition-colors">
              <span>+</span> إضافة مرحلة جديدة
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
