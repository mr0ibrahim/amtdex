import { useSection } from "@/cms/useCms"

const STEPS = [
  "نفهم فكرتك واحتياجات مشروعك.",
  "نخطط للحل التقني المناسب لك.",
  "نصمم ونبرمج مشروعك باحترافية.",
  "نختبر الحل ونتأكد من جاهزيته.",
  "نساعدك على إطلاق مشروعك وتطويره.",
]

export function WorkflowSection() {
  const fields = useSection("workflow").fields
  const title = fields.title || "خمس خطوات\nمن الفكرة إلى الإنجاز."

  return (
    <section data-motion-group className="page-container page-container--wide page-section">
      <div className="eyebrow">{fields.kicker || "من الفكرة إلى الإنجاز"}</div>
      <h2 data-motion="rise" className="mt-4 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[var(--color-ink)]">
        {title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
      </h2>
      <div className="da-steps">
        {STEPS.map((step, index) => (
          <article key={step} data-motion="rise" data-motion-delay={index * 100} className="da-step">
            <span className="num">0{index + 1}</span>
            <p className="mt-2">{step}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
