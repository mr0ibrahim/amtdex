const STEPS = [
  { n: "01", t: "نفهم", d: "نستمع لفكرتك ونحدّد احتياجات المشروع." },
  { n: "02", t: "نخطط", d: "نرتّب المتطلبات ونختار الحل التقني المناسب." },
  { n: "03", t: "نصمّم ونبرمج", d: "نحوّل الخطة إلى واجهة وتجربة تعمل." },
  { n: "04", t: "نختبر", d: "نراجع التفاصيل ونتأكد من جاهزية الحل." },
  { n: "05", t: "نطلق ونبقى معك", d: "بعد الإطلاق تبدأ الصيانة والدعم والتحديثات." },
]

/** The same five published steps, pinned as a track on wide screens. */
export function PinnedTimeline() {
  return (
    <section className="pin-timeline" data-pin-timeline aria-labelledby="pin-timeline-title">
      <div className="pin-timeline-head page-container page-container--wide">
        <p className="eyebrow">من الفكرة إلى الإنجاز</p>
        <h2 id="pin-timeline-title">كيف نعمل</h2>
        <p>خمس خطوات، بالترتيب الذي نعمل به.</p>
        <div className="pin-progress" aria-hidden="true"><span data-pin-progress /></div>
      </div>
      <div className="pin-track" data-pin-track>
        {STEPS.map((step) => (
          <article key={step.n} className="premium-card pin-card"><span>{step.n}</span><h3>{step.t}</h3><p>{step.d}</p></article>
        ))}
      </div>
    </section>
  )
}
