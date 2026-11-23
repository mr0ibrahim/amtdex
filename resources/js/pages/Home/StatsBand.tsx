import { Icon, type IconName } from "@/components/ui/Icon"
export function StatsBand() {
  const stats = [
    { value: "+120", count: "120", prefix: "+", suffix: "", label: "مشروع برمجي مسلّم", sub: "من المتاجر إلى الأنظمة المؤسسية" },
    { value: "24/7", count: "24", prefix: "", suffix: "/7", label: "دعم فني", sub: "فريق متاح على مدار الساعة" },
    { value: "98%", count: "98", prefix: "", suffix: "%", label: "رضا العملاء", sub: "تسليم في الوقت وبجودة عالية" },
    { value: "عام كامل", count: "", prefix: "", suffix: "", label: "صيانة مجانية", sub: "إصلاح ومتابعة بعد الإطلاق" },
  ]

  return (
    <section data-motion-group className="reference-stats page-container page-container--wide">
      <div className="reference-stats-inner grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, index) => (
          <div
            key={s.label}
            data-motion="rise"
            data-motion-delay={index * 120}
            className="px-4 sm:px-6 py-8 border-b lg:border-b-0 border-[var(--color-border)] odd:border-e"
          >
            <span className="stat-vector"><Icon name={(["launch", "clock", "chart", "shield"] as IconName[])[index]} size={23} /></span>
            <div className="font-display text-[32px] sm:text-[44px] font-semibold leading-none text-[var(--color-ink)]" data-count={s.count || undefined} data-count-prefix={s.prefix} data-count-suffix={s.suffix}>{s.value}</div>
            <div className="mt-3 text-[13px] font-semibold">{s.label}</div>
            <div className="mt-1 text-[12px] leading-5 text-[var(--color-text-muted)]">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
