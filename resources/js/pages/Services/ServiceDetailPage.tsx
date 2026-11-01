import { Icon } from "@/components/ui/Icon"
import { Link, useParams } from "react-router-dom"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"
import { Skeleton } from "@/components/ui/Skeleton"

export function ServiceDetailPage() {
  const { slug } = useParams()
  const { data: apiServices, isLoading } = useServicesQuery()
  const SERVICES = (apiServices && apiServices.length > 0) ? apiServices : SEED_SERVICES
  const s = SERVICES.find((x) => x.slug === slug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="space-y-4">
            <Skeleton className="size-12 rounded-2xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-[24px]" />
        </div>
      </div>
    )
  }

  if (!s) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="size-16 rounded-full bg-rose-50 text-rose-500 grid place-items-center mx-auto mb-4">
          <Icon name="close" size={28} />
        </div>
        <h1 className="text-[24px] font-bold text-[var(--color-ink)]">الخدمة غير موجودة</h1>
        <p className="text-[14px] text-[var(--color-text-muted)] mt-2">
          ربما تم نقل الصفحة أو تغيير الرابط. تفضل بالاطلاع على بقية خدماتنا.
        </p>
        <Link
          to="/services"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-bold hover:bg-[var(--color-primary-light)] transition-colors"
        >
          ← العودة لكافة الخدمات
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/services"
        className="text-[12px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] inline-flex items-center gap-1 transition-colors"
      >
        ← العودة لقائمة الخدمات
      </Link>
      <div className="mt-4 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <div>
          <div className="size-14 rounded-2xl bg-[var(--color-primary)] text-white grid place-items-center text-[22px] shadow-sm">
            <Icon name={s.icon} size={28} />
          </div>
          <h1 className="mt-4 text-[32px] sm:text-[44px] font-bold tracking-tight text-[var(--color-ink)] leading-tight">
            {s.title}
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-muted)] max-w-[560px]">
            {s.detail}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {s.tech.map((t) => (
              <span
                key={t}
                className="text-[11.5px] font-semibold px-3.5 py-1.5 rounded-full bg-[var(--color-card-soft)]/50 border border-[var(--color-border)] text-[var(--color-ink)]"
              >
                {t}
              </span>
            ))}
          </div>

          <ul className="mt-6 space-y-2.5">
            {s.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-[13px] text-[var(--color-ink)]">
                <span className="size-5 rounded-full bg-[var(--color-primary)] text-white grid place-items-center text-[10px] shrink-0">
                  <Icon name="check" size={12} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/quote?service=${encodeURIComponent(s.title)}`}
              className="bg-[var(--color-primary)] text-white px-7 py-3.5 rounded-full text-[13px] font-bold hover:bg-[var(--color-primary-light)] transition-all shadow-md"
            >
              اطلب هذه الخدمة الآن ←
            </Link>
            <Link
              to="/portfolio"
              className="bg-white border border-[var(--color-border)] px-6 py-3.5 rounded-full text-[13px] font-bold text-[var(--color-ink)] hover:bg-[var(--color-card-soft)] transition-colors"
            >
              شاهد أعمالاً مشابهة
            </Link>
          </div>

          <div className="mt-8 rounded-2xl bg-[var(--color-card-soft)]/60 border border-[var(--color-border)] p-4 text-[12.5px] leading-relaxed text-[var(--color-ink)] flex items-start gap-3">
            <span className="size-6 rounded-full bg-[var(--color-primary)] text-white grid place-items-center text-[12px] shrink-0 mt-0.5">
              <Icon name="sparkles" size={13} />
            </span>
            <div>
              <span className="font-bold">معايير التطوير المؤسسي:</span> نلتزم بتسليم كود مصدري نظيف، لوحة تحكم إدارية مرنة لإدارة المحتوى، وواجهات برمجة API موثقة بالكامل لسهولة الربط مع أي أنظمة أخرى.
            </div>
          </div>
        </div>

        {/* Deliverables Card */}
        <div className="bg-white border border-[var(--color-border)] rounded-[28px] p-6 sm:p-7 shadow-[var(--shadow-card)]">
          <h3 className="text-[15px] font-bold text-[var(--color-ink)]">ما ستحصل عليه مع الخدمة:</h3>
          <ul className="mt-4 space-y-3">
            {[
              "تحليل المتطلبات وهندسة معمارية واضحة للمشروع",
              "تصميم UI/UX كامل وتفاعلي عبر Figma",
              "كود مصدري كامل بنسبة 100% مع حقوق الملكية",
              "لوحة تحكم إدارية سهلة الاستخدام للتحكم بالمحتوى",
              "نشر سحابي آمن وتكوين شهادات الأمان SSL",
              "ضمان ودعم فني مجاني لمدة 30 يوماً بعد الإطلاق",
            ].map((x) => (
              <li key={x} className="flex gap-2.5 text-[13px] text-[var(--color-ink)]">
                <span className="text-emerald-500 mt-0.5 shrink-0">
                  <Icon name="check" size={15} />
                </span>
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-5 rounded-2xl bg-[var(--color-card-soft)]/50 border border-[var(--color-border)]">
            <div className="text-[11.5px] font-bold text-[var(--color-text-muted)]">مدة التنفيذ التقديرية</div>
            <div className="text-[14px] font-bold text-[var(--color-ink)] mt-1">2 — 6 أسابيع حسب النطاق</div>
            <div className="text-[11.5px] font-bold text-[var(--color-text-muted)] mt-3">يبدأ الاستثمار من</div>
            <div className="text-[20px] font-bold font-mono text-[var(--color-primary)] mt-0.5">4,900 ر.س</div>
          </div>
        </div>
      </div>
    </div>
  )
}
