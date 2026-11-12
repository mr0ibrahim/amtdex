import { PageHeader } from "@/components/layout/PageHeader"
import { PublicLink as Link } from "@/cms/PublicLink"

const VALUES = [
  { n: "01", t: "الجودة", d: "نلتزم بتقديم حلول عالية الجودة." },
  { n: "02", t: "الابتكار", d: "نسعى دائمًا لتقديم أفكار وحلول مبتكرة." },
  { n: "03", t: "الشفافية", d: "نبني علاقات واضحة وصادقة مع عملائنا." },
  { n: "04", t: "الاحترافية", d: "نعمل بمعايير مهنية عالية." },
  { n: "05", t: "الالتزام", d: "نحترم الوقت والاتفاقيات." },
  { n: "06", t: "تطوير الأعمال", d: "نساعد عملاءنا على النمو والتوسع." },
]

const STEPS = [
  "نفهم فكرتك واحتياجات مشروعك.",
  "نخطط للحل التقني المناسب لك.",
  "نصمم ونبرمج مشروعك باحترافية.",
  "نختبر الحل ونتأكد من جاهزيته.",
  "نساعدك على إطلاق مشروعك وتطويره.",
]

export function AboutPage() {
  return (
    <div className="da-page">
      <PageHeader
        eyebrow="من نحن"
        title={<>امتدكس سوفت<br />للبرمجيات وتقنية المعلومات والأنظمة.</>}
        description="نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو."
      />

      <div className="da-grid-2" data-motion-group>
        <div data-motion="rise" className="da-panel">
          <p className="da-kicker">من نحن</p>
          <p className="da-lede">
            نرحّب بكم في امتدكس سوفت للبرمجيات وتقنية المعلومات والأنظمة، حيث تلتقي الأفكار بالتقنية، وتتحول الطموحات إلى مشاريع قابلة للتحقيق.
          </p>
          <p className="da-lede" style={{ marginTop: 12 }}>
            نؤمن أن لكل فكرة طموحة طريقًا يمكن أن يتحقق إذا وجدت الشريك المناسب الذي يفهمها، يطوّرها، ويحوّلها إلى واقع عملي.
          </p>
          <p className="da-lede" style={{ marginTop: 12 }}>
            نحن شركة برمجيات وتقنية معلومات، نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو.
          </p>
          <p className="da-lede" style={{ marginTop: 12 }}>
            هذه ليست مجرد بداية شركة، بل بداية رحلة نسعى من خلالها إلى تقديم حلول تقنية تساعد الأفراد والشركات على بناء مشاريعهم وتطوير أعمالهم بثقة واحترافية.
          </p>
        </div>
        <aside data-motion="rise" data-motion-delay="120" className="da-panel">
          <p className="da-kicker">من الفكرة إلى التنفيذ</p>
          <h2 style={{ marginTop: 12 }}>هندسة الفكرة قبل برمجتها.</h2>
          <p className="da-lede" style={{ marginTop: 12 }}>اليمن - إب</p>
          <Link to="/contact" className="btn btn-gold brand-cta" style={{ marginTop: 18 }}>تواصل معنا</Link>
        </aside>
      </div>

      <div className="da-grid-2" style={{ marginTop: 28 }}>
        <article className="da-panel">
          <p className="da-kicker">رؤيتنا</p>
          <p className="da-lede" style={{ marginTop: 10 }}>
            أن نكون شريكًا تقنيًا موثوقًا يساعد الأفراد والشركات على تحويل أفكارهم إلى مشاريع رقمية ناجحة، ونساهم في تطوير قطاع التقنية في اليمن والمنطقة.
          </p>
        </article>
        <article className="da-panel">
          <p className="da-kicker">رسالتنا</p>
          <p className="da-lede" style={{ marginTop: 10 }}>
            تقديم حلول برمجية وتقنية مبتكرة تساعد عملاءنا على تطوير أعمالهم، وتحسين كفاءتهم، وبناء حضور رقمي قوي من خلال الجودة والابتكار والالتزام.
          </p>
        </article>
      </div>

      <div style={{ marginTop: 48 }}>
        <h2 className="text-[28px] font-semibold text-[var(--color-ink)]">قيمنا</h2>
        <div className="da-grid-2" style={{ marginTop: 16 }}>
          {VALUES.map((value) => (
            <article key={value.n} className="da-panel">
              <div className="da-step"><div className="num">{value.n}</div></div>
              <h3 style={{ marginTop: 10 }}>{value.t}</h3>
              <p className="da-lede">{value.d}</p>
            </article>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <h2 className="text-[28px] font-semibold text-[var(--color-ink)]">من الفكرة إلى الإنجاز</h2>
        <div className="da-grid-4" style={{ marginTop: 16 }}>
          {STEPS.map((step, index) => (
            <article key={step} className="da-step">
              <div className="num">0{index + 1}</div>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
