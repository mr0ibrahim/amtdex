import { ServiceCard } from "@/components/ui/ServiceCard"
import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"
import { CardSkeleton } from "@/components/ui/Skeleton"

export function ServicesPage() {
  const { data: apiServices, isLoading } = useServicesQuery()
  const SERVICES = apiServices && apiServices.length > 0 ? apiServices : SEED_SERVICES

  return (
    <Container className="py-8 sm:py-12">
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

      <div data-motion-group className="mt-12 grid md:grid-cols-2 gap-x-8 gap-y-6">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          SERVICES.map((s, index) => (
            <div key={s.slug} data-motion="rise" data-motion-delay={(index % 2) * 140} className={index === 0 ? "md:col-span-2" : undefined}>
              <ServiceCard service={s} detailed />
            </div>
          ))
        )}
      </div>

      <div data-motion-group className="mt-16 border-t border-[var(--color-ink)] pt-10">
        <h3 className="text-[18px] font-bold text-[var(--color-ink)]">منهجية العمل وتسليم المشاريع</h3>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              n: "01",
              t: "استكشاف وتحليل",
              d: "نفهم نموذج عملك، جمهورك المستهدف، وميزانيتك بدقة في ورشة عمل متخصصة.",
            },
            {
              n: "02",
              t: "تصميم واجهات وتجربة UX",
              d: "مخططات هيكلية وتصميم تفاعلي متكامل جاهز للمعاينة قبل كتابة أي سطر كود.",
            },
            {
              n: "03",
              t: "تطوير برمجي مرن Agile",
              d: "برمجة بنية متينة واختبارات آلية مع تسليم نسخة تجريبية حية للمعاينة أسبوعياً.",
            },
            {
              n: "04",
              t: "إطلاق وضمان ودعم",
              d: "نشر على خوادم سحابية آمنة، تدريب فريقك، ودعم فني وصيانة مجانية لمدة 30 يوماً.",
            },
          ].map((s) => (
            <div key={s.n} data-motion="rise" data-motion-delay={Number(s.n) * 80} className="border-e border-[var(--color-border)] pe-4 last:border-e-0">
              <div className="text-[28px] font-bold tracking-tight text-[var(--color-primary-light)]/20 font-mono">{s.n}</div>
              <div className="text-[14px] font-bold text-[var(--color-ink)] mt-1">{s.t}</div>
              <div className="text-[12.5px] leading-relaxed text-[var(--color-text-muted)] mt-1.5">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
