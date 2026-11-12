import { Icon, type IconName } from "@/components/ui/Icon"
import { Link } from "react-router-dom"

export function WorkflowSection() {
  return (
    <section data-motion-group className="page-container page-container--wide page-section">
      <div className="grid gap-6">
        {/* Left */}
        <div>
          <div className="eyebrow">منهجية العمل</div>
          <h2 data-motion="rise" className="mt-4 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[var(--color-ink)]">
            من الفكرة إلى الإطلاق
            <br />
            في ثلاث خطوات.
          </h2>
          <p className="mt-3 text-[14px] leading-[26px] text-[var(--color-text-muted)] max-w-[480px]">منهجية واضحة، تواصل شفاف، وتسليم مرحلي — ترى التقدم كل أسبوع، لا مفاجآت في النهاية.</p>
          <div className="da-steps">
            {[
              { n: "01", t: "نحلل ونخطط", d: "ورشة اكتشاف، تحليل متطلبات، وخارطة طريق تقنية مع تقدير زمني وتكلفة شفافة." },
              { n: "02", t: "نصمم ونطوّر", d: "تصميم UX/UI ثم تطوير رشيق (Agile) مع نسخ تجريبية تراها وتجربها أسبوعياً." },
              { n: "03", t: "نطلق وندعم", d: "إطلاق آمن، تدريب لفريقك، ودعم مستمر وتطوير إضافي حسب نمو أعمالك." },
            ].map((s, index) => (
              <article key={s.n} data-motion="rise" data-motion-delay={index * 140} className="da-step">
                <span className="num">{s.n}</span>
                <b className="block mt-2">{s.t}</b>
                <p>{s.d}</p>
              </article>
            ))}
          </div>
        </div>

        <div data-motion="rise" data-motion-delay="160" className="da-app overflow-hidden">
          <div className="flex items-center justify-between px-5 h-[48px] bg-white border-b border-[var(--color-border)]">
            <span className="text-[12px] font-bold text-[var(--color-ink)]">خارطة طريق — نظام إدارة المبيعات</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--color-success)] text-[11px] font-semibold">
              <span className="size-1.5 rounded-full bg-[var(--color-success)]" /> قيد التطوير
            </span>
          </div>
          <div className="p-5 space-y-3">
            {[
              { icon: "mail", bg: "var(--color-accent)", fg: "#16064F", title: "تحليل المتطلبات", sub: "ورشة اكتشاف + وثيقة SRS", time: "الأسبوع 1" },
              { icon: "code", bg: "var(--color-brand)", fg: "#F6F3EC", title: "تصميم وتطوير", sub: "Figma → Next.js / Laravel", time: "الأسابيع 2-6" },
              { icon: "launch", bg: "var(--color-brand)", fg: "#F6F3EC", title: "اختبار وإطلاق", sub: "QA + نشر سحابي + تدريب", time: "الأسبوع 7" },
            ].map((f, index) => (
              <div key={f.title} data-motion="rise" data-motion-delay={200 + index * 240} className="flex items-center gap-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
                <span className="size-10 shrink-0 grid place-items-center" style={{ background: f.bg, color: f.fg }}>
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
