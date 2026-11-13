import { BrandArtwork, type ArtworkKind } from "@/components/ui/BrandArtwork"
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
  const screenFor = (slug: string) => (slug === "cloud" ? "crm" : "projects")

  const ServiceBody = ({ service }: { service: (typeof SERVICES)[number] }) => (
    <div className="service-copy">
      <div className="service-vector" data-motion="vector"><BrandArtwork kind={({ web: "web", security: "shield", mobile: "launch", cloud: "systems" } as Record<string,ArtworkKind>)[service.slug] || "systems"} /></div>
      {service.slug === "web" && <p className="da-kicker">الأكثر طلبًا</p>}
      {service.slug === "erp" && <p className="da-kicker">لأعمال أكثر كفاءة</p>}
      <h2 style={{ marginTop: 8 }}>{service.title}</h2>
      <p className="da-lede">{service.desc}</p>
      {service.detail && <p className="da-lede">{service.detail}</p>}
      {service.bullets && <ul>{service.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
      {service.tech && service.tech.length > 0 && <p className="da-lede">{service.tech.join(" · ")}</p>}
      <Link to={`/services/${service.slug}`} className="btn btn-ink brand-cta" style={{ marginTop: 14 }}>اكتشف الخدمة</Link>
    </div>
  )

  return (
    <div className="da-page">
      <PageHeader artwork="web"
        eyebrow="خدماتنا"
        title={
          <>
            ماذا نقدم؟
          </>
        }
        description="نساعد الأفراد والشركات على تطوير أعمالهم: مواقع، تطبيقات، متاجر، أنظمة، تسويق، هوية، وحماية."
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
                <img className="da-screen" src={`/images/screens/${screenFor(web.slug)}.webp`} alt="نموذج واجهة إدارة المشاريع: نسب الإنجاز ومهام الفريق" />
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
            { n: "01", t: "نفهم", d: "نفهم فكرتك واحتياجات مشروعك." },
            { n: "02", t: "نخطط", d: "نخطط للحل التقني المناسب لك." },
            { n: "03", t: "نصمّم ونبرمج", d: "نصمم ونبرمج مشروعك باحترافية." },
            { n: "04", t: "نختبر", d: "نختبر الحل ونتأكد من جاهزيته." },
            { n: "05", t: "نطلق", d: "نساعدك على إطلاق مشروعك وتطويره." },
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
