export function StatsBand() {
  const stats = [
    { value: "+120", label: "مشروع برمجي مسلّم", sub: "من المتاجر إلى الأنظمة المؤسسية" },
    { value: "24/7", label: "سنوات خبرة", sub: "فريق هندسي متخصص" },
    { value: "98%", label: "رضا العملاء", sub: "تسليم في الوقت وبجودة عالية" },
    { value: "4.9/5", label: "تقييم رضا العملاء", sub: "من 2,400+ مراجعة" },
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
            <span className="stat-orbit" aria-hidden="true" />
            <div className="font-display text-[32px] sm:text-[44px] font-semibold leading-none text-[var(--color-ink)]">{s.value}</div>
            <div className="mt-3 text-[13px] font-semibold">{s.label}</div>
            <div className="mt-1 text-[12px] leading-5 text-[var(--color-text-muted)]">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
