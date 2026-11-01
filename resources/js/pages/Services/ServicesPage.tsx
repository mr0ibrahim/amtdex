import { ServiceCard } from "@/components/ui/ServiceCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"
import { CardSkeleton } from "@/components/ui/Skeleton"

export function ServicesPage() {
  const { data: apiServices, isLoading } = useServicesQuery()
  const SERVICES = (apiServices && apiServices.length > 0) ? apiServices : SEED_SERVICES

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SectionLabel>خدماتنا</SectionLabel>
      <h1 className="mt-3 text-[32px] sm:text-[44px] font-bold tracking-tight text-[var(--color-ink)] leading-tight">
        كل ما تحتاجه لبناء
        <br />
        منتجك الرقمي المتكامل.
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-muted)] max-w-[560px]">
        نغطي دورة التطوير البرمجي كاملة: تحليل، تصميم، برمجة، إطلاق، وصيانة مستمرة. فريق واحد، عقد واضح، ومسؤولية تنفيذية مباشرة.
      </p>

      {/* Services Grid with Loading Skeletons */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} detailed />
          ))
        )}
      </div>

      {/* How We Work Section */}
      <div className="mt-12 bg-white border border-[var(--color-border)] rounded-[28px] p-6 sm:p-8 shadow-sm">
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
            <div key={s.n} className="border-r border-[var(--color-border)] pr-4 first:border-0">
              <div className="text-[28px] font-bold tracking-tight text-[var(--color-primary-light)]/20 font-mono">
                {s.n}
              </div>
              <div className="text-[14px] font-bold text-[var(--color-ink)] mt-1">{s.t}</div>
              <div className="text-[12.5px] leading-relaxed text-[var(--color-text-muted)] mt-1.5">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
