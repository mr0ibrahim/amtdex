import { useSection } from "@/cms/useCms"
import { BrandArtwork, type ArtworkKind } from "@/components/ui/BrandArtwork"

export function WorkflowSection() {
  const fields = useSection("workflow").fields
  return (
    <section data-motion-group className="home-workflow workflow-steps-only page-container page-container--wide page-section">
      <div className="grid gap-6">
        {/* Left */}
        <div>
          <div className="eyebrow">{fields.kicker}</div>
          <h2 data-motion="rise" className="mt-4 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[var(--color-ink)]">
            {fields.title}
          </h2>
          <p className="mt-3 text-[14px] leading-[26px] text-[var(--color-text-muted)] max-w-[480px]">{fields.lede}</p>
          <div className="workflow-progress" aria-hidden="true"><span data-progress /></div>
          <div className="process-viewport" data-process-viewport><div className="da-steps" data-process-track>
            {[
              { n: "01", t: "نفهم", d: "نفهم فكرتك واحتياجات مشروعك." },
              { n: "02", t: "نخطط", d: "نخطط للحل التقني المناسب لك." },
              { n: "03", t: "نصمّم ونبرمج", d: "نصمم ونبرمج مشروعك باحترافية." },
              { n: "04", t: "نختبر", d: "نختبر الحل ونتأكد من جاهزيته." },
              { n: "05", t: "نطلق", d: "نساعدك على إطلاق مشروعك وتطويره." },
            ].map((s, index) => (
              <article key={s.n} data-motion="rise" data-motion-delay={index * 140} className="da-step process-card">
                <div className="process-card-top"><span className="num">{s.n}</span><span className="process-card-line" /></div>
                <BrandArtwork kind={(["contact", "plan", "web", "shield", "launch"] as ArtworkKind[])[index]} />
                <b className="block mt-2">{fields[`step${index+1}_title`] || s.t}</b>
                <p>{fields[`step${index+1}_description`] || s.d}</p>
              </article>
            ))}
          </div></div>
        </div>


      </div>
    </section>
  )
}
