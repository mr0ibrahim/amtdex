import { Icon } from "@/components/ui/Icon"
import { Link, useParams } from "react-router-dom"
import { PROJECTS as SEED_PROJECTS } from "@/data/projects"
import { useProjectsQuery } from "@/lib/queries"
import { Skeleton } from "@/components/ui/Skeleton"

const DEFAULT_DELIVERABLES = [
  "واجهة مستخدم فائقة السرعة ومتجاوبة تماماً (LCP < 1.2s)",
  "لوحة تحكم إدارية متكاملة للتحكم بجميع تفاصيل النظام والبيانات",
  "واجهات برمجة API موثقة بالكامل + تكامل Webhooks",
  "تكامل بوابات الدفع الإلكتروني المعتمدة (مدى، فيزا، أبل باي)",
  "مراقبة سحابية على مدار الساعة ونسخ احتياطي يومي مشفر",
]

const DEFAULT_METRICS = [
  { v: "+40%", l: "أسرع في التصفح والإنجاز" },
  { v: "2.1×", l: "معدل تحويل وتفاعل أعلى" },
  { v: "99.9%", l: "استقرار وتوفر مستمر" },
]

export function PortfolioDetailPage() {
  const { slug } = useParams()
  const { data: apiProjects, isLoading } = useProjectsQuery()
  const PROJECTS = (apiProjects && apiProjects.length > 0) ? apiProjects : SEED_PROJECTS
  const p = PROJECTS.find((x) => x.slug === slug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-[320px] w-full rounded-[28px]" />
        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!p) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="size-16 rounded-full bg-rose-50 text-rose-500 grid place-items-center mx-auto mb-4">
          <Icon name="close" size={28} />
        </div>
        <h1 className="text-[24px] font-bold text-[var(--color-ink)]">المشروع غير موجود</h1>
        <p className="text-[14px] text-[var(--color-text-muted)] mt-2">
          ربما تم نقل دراسة الحالة أو تغيير الرابط. تفضل بالاطلاع على بقية أعمالنا.
        </p>
        <Link
          to="/portfolio"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-bold hover:bg-[var(--color-primary-light)] transition-colors"
        >
          ← العودة لكافة الأعمال
        </Link>
      </div>
    )
  }

  const deliverables = p.deliverables && p.deliverables.length > 0 ? p.deliverables : DEFAULT_DELIVERABLES
  const metrics = p.metrics && p.metrics.length > 0 ? p.metrics : DEFAULT_METRICS
  const challenge =
    p.challenge ||
    "احتاج العميل إلى منصة رقمية حديثة، آمنة، وعالية الأداء مع تكامل متقدم لبوابات الدفع وإدارة الطلبات وتتبع العمليات لحظياً. قمنا بهندسة وتطوير بنية سحابية متينة تمكّن النظام من التوسع السلس ومواكبة نمو الأعمال بدون أي تعطل."
  const duration = p.duration || "8 أسابيع"
  const teamSize = p.team_size || "5 مهندسين ومصممين"

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/portfolio"
        className="text-[12px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] inline-flex items-center gap-1 transition-colors"
      >
        ← العودة لقائمة المشاريع والأعمال
      </Link>

      <div className="mt-4 rounded-[28px] overflow-hidden border border-[var(--color-border)] bg-white shadow-sm">
        {/* Hero Section */}
        <div
          className="min-h-[300px] sm:min-h-[380px] relative overflow-hidden flex flex-col justify-end"
          style={{ background: p.cover_image ? "#0E2A47" : p.color }}
        >
          {p.cover_image && (
            <img
              src={p.cover_image}
              alt={p.cover_image_alt || p.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
            />
          )}
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: `radial-gradient(800px 400px at 60% 20%, ${p.accent}, transparent 70%)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end">
            <div className="text-white/80 text-[11.5px] tracking-wide font-bold">
              {p.cat} • {p.year}
            </div>
            <h1 className="text-white text-[28px] sm:text-[40px] font-bold leading-tight mt-2 max-w-[760px]">
              {p.title}
            </h1>
            <div className="text-white/85 text-[13.5px] mt-2 max-w-[680px]">
              العميل: <strong className="text-white font-bold">{p.client}</strong> — {p.summary}
            </div>
            <div className="mt-4 flex gap-1.5 flex-wrap">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="text-[11px] px-3 py-1 rounded-full bg-white/95 text-black font-semibold shadow-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
          <div>
            <h3 className="text-[16px] font-bold text-[var(--color-ink)]">التحدي ومتطلبات العمل</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-line">
              {challenge}
            </p>

            <h3 className="mt-7 text-[16px] font-bold text-[var(--color-ink)]">ما قمنا ببنائه وتسليمه (Deliverables)</h3>
            <ul className="mt-3 space-y-2.5">
              {deliverables.map((x) => (
                <li key={x} className="flex gap-2.5 text-[13px] text-[var(--color-ink)] items-start">
                  <span className="text-emerald-500 mt-0.5 shrink-0">
                    <Icon name="check" size={16} />
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-7 text-[16px] font-bold text-[var(--color-ink)]">النتائج والمؤشرات الملموسة</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {metrics.map((x) => (
                <div
                  key={x.l}
                  className="bg-[var(--color-card-soft)]/50 border border-[var(--color-border)] rounded-2xl p-4 text-center"
                >
                  <div className="text-[22px] font-bold font-mono text-[var(--color-primary)]">{x.v}</div>
                  <div className="text-[11.5px] text-[var(--color-text-muted)] mt-1 font-semibold">{x.l}</div>
                </div>
              ))}
            </div>

            {/* Gallery Section if available */}
            {p.gallery && p.gallery.length > 0 && (
              <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
                <h3 className="text-[16px] font-bold text-[var(--color-ink)] mb-4">معرض لقطات من واجهات المشروع</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {p.gallery.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm aspect-video bg-gray-100 group"
                    >
                      <img
                        src={imgUrl}
                        alt={`${p.title} - صورة ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[var(--color-card-soft)]/40 border border-[var(--color-border)] rounded-2xl p-5">
              <div className="text-[14px] font-bold text-[var(--color-ink)]">ملخص بيانات دراسة الحالة</div>
              <div className="mt-4 space-y-3 text-[12.5px]">
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2.5">
                  <span className="text-[var(--color-text-muted)]">العميل</span>
                  <span className="font-bold text-[var(--color-ink)]">{p.client}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2.5">
                  <span className="text-[var(--color-text-muted)]">سنة الإطلاق</span>
                  <span className="font-bold font-mono text-[var(--color-ink)]">{p.year}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2.5">
                  <span className="text-[var(--color-text-muted)]">المدة الزمنية</span>
                  <span className="font-bold text-[var(--color-ink)]">{duration}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2.5">
                  <span className="text-[var(--color-text-muted)]">فريق العمل</span>
                  <span className="font-bold text-[var(--color-ink)]">{teamSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-muted)]">التصنيف</span>
                  <span className="font-bold text-[var(--color-primary)]">{p.cat}</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-ink)] text-white rounded-2xl p-6 text-center shadow-md">
              <h4 className="text-[16px] font-bold">هل لديك فكرة مشروع مشابه؟</h4>
              <p className="text-[12.5px] text-white/70 mt-2 leading-relaxed">
                دعنا ندرس متطلباتك ونقدم لك عرضاً فنياً ومالياً مخصصاً لمشروعك.
              </p>
              <Link
                to={`/quote?service=${encodeURIComponent(p.title)}`}
                className="mt-4 inline-block w-full py-3 px-4 rounded-full bg-[var(--color-primary)] text-white font-bold text-[12.5px] hover:bg-[var(--color-primary-light)] transition-colors"
              >
                اطلب مشروعك الآن ←
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
