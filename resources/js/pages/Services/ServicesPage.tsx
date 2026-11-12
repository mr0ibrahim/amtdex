import { Link } from "react-router-dom"
import { PageHeader } from "@/components/layout/PageHeader"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"

const REAL_SLUGS = new Set(SEED_SERVICES.map((service) => service.slug))

export function ServicesPage() {
  const { data: apiServices } = useServicesQuery()
  const fromApi = (apiServices ?? []).filter((service) => REAL_SLUGS.has(service.slug))
  const SERVICES = fromApi.length > 0 ? fromApi : SEED_SERVICES

  return (
    <div className="da-page">
      <PageHeader
        eyebrow="ماذا نقدم؟"
        title={<>تصميم وبرمجة وحلول رقمية<br />لمشروعك.</>}
        description="نساعد الأفراد والشركات على تطوير أعمالهم: مواقع، تطبيقات، متاجر، أنظمة، تسويق، هوية، وحماية."
      />

      <div className="da-grid-2">
          {SERVICES.map((service) => (
            <article key={service.slug} className="da-panel da-card">
              <h2 style={{ marginTop: 8 }}>{service.title}</h2>
              <p className="da-lede">{service.desc}</p>
              {(service.bullets ?? []).length > 0 && (
                <ul>{service.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
              )}
              <Link to={`/services/${service.slug}`} className="btn btn-ink brand-cta" style={{ marginTop: 14 }}>اكتشف الخدمة</Link>
            </article>
          ))}
      </div>

      <div style={{ marginTop: 48 }}>
        <h3 className="text-[28px] font-semibold text-[var(--color-ink)]">من الفكرة إلى الإنجاز</h3>
        <div className="da-grid-4">
          {[
            "نفهم فكرتك واحتياجات مشروعك.",
            "نخطط للحل التقني المناسب لك.",
            "نصمم ونبرمج مشروعك باحترافية.",
            "نختبر الحل ونتأكد من جاهزيته.",
            "نساعدك على إطلاق مشروعك وتطويره.",
          ].map((step, index) => (
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
