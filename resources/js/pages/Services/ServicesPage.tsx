import { Link } from "react-router-dom"
import { PageHeader } from "@/components/layout/PageHeader"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"
import { CardSkeleton } from "@/components/ui/Skeleton"

export function ServicesPage() {
  const { data: apiServices, isLoading } = useServicesQuery()
  const SERVICES = apiServices && apiServices.length > 0 ? apiServices : SEED_SERVICES

  const web = SERVICES.find((s) => s.slug === "web")
  const cloud = SERVICES.find((s) => s.slug === "cloud")
  const middle = SERVICES.filter((s) => s.slug !== "web" && s.slug !== "cloud")
  const screenFor = (slug: string) => (slug === "cloud" ? "crm" : "business")

  const ServiceBody = ({ service }: { service: (typeof SERVICES)[number] }) => (
    <>
      {service.slug === "web" && <p className="da-kicker">الأكثر طلبًا</p>}
      {service.slug === "erp" && <p className="da-kicker">لأعمال أكثر كفاءة</p>}
      <h2 style={{ marginTop: 8 }}>{service.title}</h2>
      <p className="da-lede">{service.desc}</p>
      {service.detail && <p className="da-lede">{service.detail}</p>}
      {service.bullets && <ul>{service.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
      {service.tech && service.tech.length > 0 && <p className="da-lede">{service.tech.join(" · ")}</p>}
      <Link to={`/services/${service.slug}`} className="btn btn-ink brand-cta" style={{ marginTop: 14 }}>اكتشف الخدمة</Link>
    </>
  )

  return (
    <div className="da-page">
      <PageHeader
        eyebrow="خدماتنا"
        title={
          <>
            كل ما تحتاجه لبناء
            <br />
            منتجك الرقمي المتكامل.
          </>
        }
        description="نغطي دورة التطوير البرمجي كاملة: تحليل، تصميم، برمجة، إطلاق، وصيانة مستمرة. فريق واحد، عقد واضح، ومسؤولية تنفيذية مباشرة."
      />

      {isLoading ? (
        <div className="da-grid-2">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {web && (
            <article className="da-panel da-feature da-card" style={{ marginTop: 28 }}>
              <ServiceBody service={web} />
              <figure>
                <img className="da-screen" src={`/images/screens/${screenFor(web.slug)}.webp`} alt="نموذج واجهة إدارة الأعمال: مؤشرات الأداء ومخطط الإيرادات والطلبات" />
                <figcaption className="da-lede">إدارة الأعمال والمبيعات</figcaption>
              </figure>
            </article>
          )}
          <div className="da-grid-2">
            {middle.map((service) => (
              <article key={service.slug} className={`da-panel da-card${service.slug === "erp" ? " pop" : ""}`}>
                <ServiceBody service={service} />
              </article>
            ))}
          </div>
          {cloud && (
            <article id="tech" className="da-panel da-feature da-card da-span" style={{ marginTop: 16 }}>
              <ServiceBody service={cloud} />
              <img className="da-screen" src="/images/screens/crm.webp" alt="نموذج نظام خدمة العملاء: المحادثات والطلبات والمساعد الذكي" />
            </article>
          )}
        </>
      )}

      <div data-motion-group style={{ marginTop: 48 }}>
        <h3 className="text-[28px] font-semibold text-[var(--color-ink)]">منهجية العمل وتسليم المشاريع</h3>
        <div className="da-grid-4">
          {[
            { n: "01", t: "استكشاف وتحليل", d: "نفهم نموذج عملك، جمهورك المستهدف، وميزانيتك بدقة في ورشة عمل متخصصة." },
            { n: "02", t: "تصميم واجهات وتجربة UX", d: "مخططات هيكلية وتصميم تفاعلي متكامل جاهز للمعاينة قبل كتابة أي سطر كود." },
            { n: "03", t: "تطوير برمجي مرن Agile", d: "برمجة بنية متينة واختبارات آلية مع تسليم نسخة تجريبية حية للمعاينة أسبوعياً." },
            { n: "04", t: "إطلاق وضمان ودعم", d: "نشر على خوادم سحابية آمنة، تدريب فريقك، ودعم فني وصيانة مجانية لمدة 30 يوماً." },
          ].map((s) => (
            <article key={s.n} className="da-step">
              <div className="num">{s.n}</div>
              <div className="text-[14px] font-bold text-[var(--color-ink)] mt-2">{s.t}</div>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
