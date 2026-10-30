import { Icon } from "@/components/ui/Icon"
import { Link, useParams } from "react-router-dom"
import { useProjects } from "@/lib/contentStore"
import { useProjectsQuery } from "@/lib/queries"

const DEFAULT_DELIVERABLES = [
  "واجهة سريعة (LCP < 1.2s)",
  "لوحة تحكم Filament لإدارة كل شيء",
  "API موثق + Webhooks",
  "دفع: مدى، STC Pay، أبل باي",
  "مراقبة ونسخ احتياطي يومي",
]

const DEFAULT_METRICS = [
  { v: "+40%", l: "أسرع" },
  { v: "2.1×", l: "تحويل أعلى" },
  { v: "99.9%", l: "توفر" },
]

export function PortfolioDetailPage() {
  const { slug } = useParams()
  const { data: apiProjects } = useProjectsQuery()
  const fallbackProjects = useProjects()
  const PROJECTS = (apiProjects && apiProjects.length > 0) ? apiProjects : fallbackProjects
  const p = PROJECTS.find((x) => x.slug === slug)

  if (!p)
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-[24px] font-bold">المشروع غير موجود</h1>
        <Link to="/portfolio" className="mt-4 inline-flex text-[13px] font-semibold underline">
          العودة للأعمال ←
        </Link>
      </div>
    )

  const deliverables = p.deliverables && p.deliverables.length > 0 ? p.deliverables : DEFAULT_DELIVERABLES
  const metrics = p.metrics && p.metrics.length > 0 ? p.metrics : DEFAULT_METRICS
  const challenge = p.challenge || "العميل احتاج منصة سريعة، آمنة، وقابلة للتوسع مع تكامل دفع وشحن وتتبع. بنينا حلاً مخصصاً على Laravel كـ API و Next.js للواجهة مع نشر على AWS."
  const duration = p.duration || "8 أسابيع"
  const teamSize = p.team_size || "5 أشخاص"

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/portfolio" className="text-[12px] font-medium text-black/40 hover:text-black">
        ← كل الأعمال
      </Link>
      <div className="mt-4 rounded-[28px] overflow-hidden border border-black/5 bg-white shadow-sm">
        {/* Hero Section */}
        <div className="min-h-[300px] sm:min-h-[360px] relative overflow-hidden flex flex-col justify-end" style={{ background: p.cover_image ? "#0E2A47" : p.color }}>
          {p.cover_image && (
            <img
              src={p.cover_image}
              alt={p.cover_image_alt || p.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
            />
          )}
          <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(800px 400px at 60% 20%, ${p.accent}, transparent 70%)` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end">
            <div className="text-white/80 text-[11px] tracking-wide font-medium">
              {p.cat} • {p.year}
            </div>
            <h1 className="text-white text-[26px] sm:text-[38px] font-bold leading-tight mt-2 max-w-[760px]">{p.title}</h1>
            <div className="text-white/85 text-[13px] mt-2 max-w-[680px]">العميل: <strong className="text-white font-semibold">{p.client}</strong> — {p.summary}</div>
            <div className="mt-4 flex gap-1.5 flex-wrap">
              {p.stack.map((s) => (
                <span key={s} className="text-[11px] px-3 py-1 rounded-full bg-white/95 text-black font-semibold shadow-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
          <div>
            <h3 className="text-[15px] font-bold text-[var(--color-ink)]">التحدي</h3>
            <p className="mt-2 text-[13px] leading-7 text-black/70 whitespace-pre-line">
              {challenge}
            </p>

            <h3 className="mt-6 text-[15px] font-bold text-[var(--color-ink)]">ما بنيناه (Deliverables)</h3>
            <ul className="mt-2 space-y-2">
              {deliverables.map((x) => (
                <li key={x} className="flex gap-2.5 text-[13px] text-black/80 items-start">
                  <span className="text-emerald-500 mt-0.5 shrink-0"><Icon name="check" size={16} /></span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-[15px] font-bold text-[var(--color-ink)]">النتائج والمؤشرات (Key Metrics)</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {metrics.map((x) => (
                <div key={x.l} className="bg-[var(--color-bg)] border border-black/5 rounded-2xl p-4 text-center">
                  <div className="text-[20px] font-bold text-[var(--color-ink)]">{x.v}</div>
                  <div className="text-[11px] text-black/50 mt-1 font-medium">{x.l}</div>
                </div>
              ))}
            </div>

            {/* Gallery Section if available */}
            {p.gallery && p.gallery.length > 0 && (
              <div className="mt-8 pt-8 border-t border-black/5">
                <h3 className="text-[15px] font-bold text-[var(--color-ink)] mb-4">معرض لقطات المشروع</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {p.gallery.map((imgUrl, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-black/10 shadow-sm aspect-video bg-gray-100 group">
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
            <div className="bg-[var(--color-bg)] border border-black/5 rounded-2xl p-5">
              <div className="text-[13px] font-bold text-[var(--color-ink)]">تفاصيل دراسة الحالة</div>
              <div className="mt-4 space-y-2.5 text-[12px]">
                <div className="flex justify-between items-center border-b border-black/5 pb-2">
                  <span className="text-black/50">العميل</span>
                  <span className="font-semibold text-[var(--color-ink)]">{p.client}</span>
                </div>
                <div className="flex justify-between items-center border-b border-black/5 pb-2">
                  <span className="text-black/50">السنة</span>
                  <span className="font-semibold text-[var(--color-ink)]">{p.year}</span>
                </div>
                <div className="flex justify-between items-center border-b border-black/5 pb-2">
                  <span className="text-black/50">المدة الزمنية</span>
                  <span className="font-semibold text-[var(--color-ink)]">{duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/50">حجم فريق العمل</span>
                  <span className="font-semibold text-[var(--color-ink)]">{teamSize}</span>
                </div>
              </div>
            </div>

            {p.project_url && (
              <a
                href={p.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white rounded-full py-3 text-[13px] font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <span>زيارة المشروع الحي</span>
                <span dir="ltr">↗</span>
              </a>
            )}

            <Link to="/quote" className="w-full inline-flex justify-center bg-[var(--color-ink)] text-white rounded-full py-3 text-[13px] font-semibold hover:bg-black transition-colors shadow-sm">
              اطلب مشروعاً مشابهاً ←
            </Link>
            <Link to="/contact" className="w-full inline-flex justify-center bg-white border border-black/10 rounded-full py-3 text-[13px] font-medium hover:bg-black hover:text-white transition-colors">
              تحدث معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
