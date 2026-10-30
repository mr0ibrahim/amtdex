import { ServiceCard } from "@/components/ui/ServiceCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { useServices } from "@/lib/contentStore"
import { useServicesQuery } from "@/lib/queries"

export function ServicesPage() {
  const { data: apiServices } = useServicesQuery()
  const fallbackServices = useServices()
  const SERVICES = (apiServices && apiServices.length > 0) ? apiServices : fallbackServices
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SectionLabel>خدماتنا</SectionLabel>
      <h1 className="mt-3 text-[32px] sm:text-[44px] font-bold tracking-[-0.04em] leading-tight">
        كل ما تحتاجه لبناء
        <br />
        منتجك الرقمي.
      </h1>
      <p className="mt-3 text-[14px] leading-6 text-black/50 max-w-[560px]">نغطي الدورة كاملة: تحليل، تصميم، برمجة، إطلاق، وصيانة. فريق واحد، عقد واحد، ومسؤولية واحدة.</p>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((s) => (
          <ServiceCard key={s.slug} service={s} detailed />
        ))}
      </div>
      <div className="mt-8 bg-white border border-black/5 rounded-[28px] p-6 sm:p-8">
        <h3 className="text-[16px] font-bold">كيف نعمل</h3>
        <div className="mt-6 grid sm:grid-cols-4 gap-6">
          {[
            { n: "01", t: "استكشاف", d: "نفهم هدفك، جمهورك، وميزانيتك — في جلسة واحدة." },
            { n: "02", t: "تصميم", d: "خرائط، وايرفريم، وتصميم نهائي قابل للنقر." },
            { n: "03", t: "بناء", d: "تطوير بنظام Agile مع نسخة تجريبية كل أسبوع." },
            { n: "04", t: "إطلاق", d: "نشر، تدريب، ودعم مستمر مع ضمان." },
          ].map((s) => (
            <div key={s.n} className="border-r border-black/5 pr-4 first:border-0">
              <div className="text-[28px] font-bold tracking-tight text-black/10">{s.n}</div>
              <div className="text-[13px] font-bold mt-1">{s.t}</div>
              <div className="text-[12px] leading-5 text-black/50 mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
