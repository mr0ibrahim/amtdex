import { Icon } from "@/components/ui/Icon"
import { Link, useParams } from "react-router-dom"
import { useServices } from "@/lib/contentStore"
import { useServicesQuery } from "@/lib/queries"

export function ServiceDetailPage() {
  const { slug } = useParams()
  const { data: apiServices } = useServicesQuery()
  const fallbackServices = useServices()
  const SERVICES = (apiServices && apiServices.length > 0) ? apiServices : fallbackServices
  const s = SERVICES.find((x) => x.slug === slug)

  if (!s)
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-[24px] font-bold">الخدمة غير موجودة</h1>
        <Link to="/services" className="mt-4 inline-flex text-[13px] font-semibold underline">
          العودة للخدمات ←
        </Link>
      </div>
    )

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/services" className="text-[12px] font-medium text-black/40 hover:text-black">
        ← كل الخدمات
      </Link>
      <div className="mt-4 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <div>
          <div className="size-12 rounded-2xl bg-[var(--color-ink)] text-white grid place-items-center text-[18px]"><Icon name={s.icon} size={24} /></div>
          <h1 className="mt-4 text-[32px] sm:text-[44px] font-bold tracking-[-0.04em] leading-tight">{s.title}</h1>
          <p className="mt-3 text-[14px] leading-7 text-black/60 max-w-[560px]">{s.detail}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {s.tech.map((t) => (
              <span key={t} className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white border border-black/10">
                {t}
              </span>
            ))}
          </div>
          <ul className="mt-6 space-y-2">
            {s.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 text-[13px]">
                <span className="size-5 rounded-full bg-[var(--color-ink)] text-white grid place-items-center text-[10px]"><Icon name="check" size={14} /></span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/quote" className="bg-[var(--color-ink)] text-white px-7 py-3 rounded-full text-[13px] font-semibold hover:bg-black transition-colors">
              اطلب هذه الخدمة ←
            </Link>
            <Link to="/portfolio" className="bg-white border border-black/10 px-6 py-3 rounded-full text-[13px] font-medium hover:bg-black hover:text-white transition-colors">
              شاهد أعمال مشابهة
            </Link>
          </div>
          <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-[12px] leading-5 text-amber-900">
            <span className="font-bold flex items-center gap-3">Laravel Ready:</span> هذه الخدمة تُسلّم مع لوحة تحكم Filament + API موثق (OpenAPI) جاهز للاستهلاك من التطبيق أو الواجهة.
          </div>
        </div>
        <div className="bg-white border border-black/5 rounded-[24px] p-6">
          <h3 className="text-[14px] font-bold">ماذا ستحصل</h3>
          <ul className="mt-4 space-y-3">
            {["تحليل متطلبات ووثيقة نطاق", "تصميم UI/UX كامل (Figma)", "كود مصدري على GitHub خاص", "لوحة تحكم لإدارة المحتوى", "نشر واستضافة + SSL", "دعم وصيانة بعد الإطلاق"].map((x) => (
              <li key={x} className="flex gap-2 text-[13px] text-black/70">
                <span className="text-emerald-500 mt-0.5"><Icon name="check" size={14} /></span>
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 rounded-2xl bg-[var(--color-bg)] border border-black/5">
            <div className="text-[11px] font-bold">مدة التنفيذ</div>
            <div className="text-[13px] text-black/60 mt-1">2 — 6 أسابيع حسب النطاق</div>
            <div className="text-[11px] font-bold mt-3">يبدأ من</div>
            <div className="text-[18px] font-bold mt-1">﷼ 4,900</div>
          </div>
        </div>
      </div>
    </div>
  )
}
