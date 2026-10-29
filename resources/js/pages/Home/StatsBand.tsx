export function StatsBand() {
  const stats = [
    { value: "+120", label: "مشروع برمجي مسلّم", sub: "من المتاجر إلى الأنظمة المؤسسية" },
    { value: "24/7", label: "سنوات خبرة", sub: "فريق هندسي متخصص" },
    { value: "98%", label: "رضا العملاء", sub: "تسليم في الوقت وبجودة عالية" },
    { value: "4.9/5", label: "تقييم رضا العملاء", sub: "من 2,400+ مراجعة" },
  ]

  return (
    <section className="mx-auto max-w-[1280px] xl:max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8" style={{ background: "var(--gradient-primary)" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-y divide-white/10 lg:divide-y-0 lg:divide-x lg:divide-x-reverse">
        {stats.map((s) => (
          <div key={s.label} className="px-4 sm:px-6 py-5 sm:py-4 even:border-r lg:even:border-r-0 border-white/10 flex flex-col items-center lg:items-start text-center lg:text-right">
            <div className="text-white text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-none">{s.value}</div>
            <div className="text-white text-[11px] sm:text-[12px] font-bold mt-1.5">{s.label}</div>
            <div className="text-white/55 text-[10px] sm:text-[11px] mt-1 leading-snug">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
