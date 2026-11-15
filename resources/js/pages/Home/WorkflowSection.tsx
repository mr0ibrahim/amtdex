const steps = [
  { title: "نفهم", description: "نستمع لفكرتك ونحدّد احتياجات المشروع." },
  { title: "نخطط", description: "نرتّب المتطلبات ونختار الحل التقني المناسب." },
  { title: "نصمّم ونبرمج", description: "نحوّل الخطة إلى واجهة وتجربة تعمل." },
  { title: "نختبر", description: "نراجع التفاصيل ونتأكد من جاهزية الحل." },
  { title: "نطلق ونبقى معك", description: "بعد الإطلاق تبدأ الصيانة والدعم والتحديثات." },
]

export function WorkflowSection() {
  return <section data-motion-group className="reference-workflow page-section" aria-labelledby="reference-workflow-title">
    <div className="page-container page-container--wide">
      <header className="reference-section-heading"><span className="reference-section-label">آلية العمل</span><h2 id="reference-workflow-title" data-motion="rise">من الفكرة إلى الإطلاق<br /><em>في خمس خطوات واضحة.</em></h2><p>مسار منظّم، تعرف فيه أين وصل مشروعك وما الخطوة التالية.</p></header>
      <ol className="reference-workflow-grid">{steps.map((step, index) => <li key={step.title} className="geo-card" data-motion="rise" data-motion-delay={index * 120}><span className="reference-workflow-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    </div>
  </section>
}
