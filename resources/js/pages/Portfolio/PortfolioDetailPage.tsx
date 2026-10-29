import { Icon } from "@/components/ui/Icon"
import { Link, useParams } from "react-router-dom"
import { useProjects } from "@/lib/contentStore"

export function PortfolioDetailPage() {
  const { slug } = useParams()
  const PROJECTS = useProjects()
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

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/portfolio" className="text-[12px] font-medium text-black/40 hover:text-black">
        ← كل الأعمال
      </Link>
      <div className="mt-4 rounded-[28px] overflow-hidden border border-black/5 bg-white">
        <div className="h-[280px] sm:h-[340px] relative" style={{ background: p.color }}>
          <div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(800px 400px at 60% 20%, ${p.accent}, transparent 60%)` }} />
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
            <div className="text-white/60 text-[11px] tracking-wide">
              {p.cat} • {p.year}
            </div>
            <h1 className="text-white text-[26px] sm:text-[36px] font-bold leading-tight mt-2 max-w-[720px]">{p.title}</h1>
            <div className="text-white/70 text-[12px] mt-2">العميل: {p.client} — {p.summary}</div>
            <div className="mt-4 flex gap-1.5 flex-wrap">
              {p.stack.map((s) => (
                <span key={s} className="text-[11px] px-3 py-1 rounded-full bg-white text-black font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8 grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
          <div>
            <h3 className="text-[14px] font-bold">التحدي</h3>
            <p className="mt-2 text-[13px] leading-7 text-black/60">
              العميل احتاج منصة سريعة، آمنة، وقابلة للتوسع مع تكامل دفع وشحن وتتبع. بنينا حلاً مخصصاً على Laravel كـ API و Next.js للواجهة مع نشر على AWS.
            </p>
            <h3 className="mt-6 text-[14px] font-bold">ما بنيناه</h3>
            <ul className="mt-2 space-y-2">
              {["واجهة سريعة (LCP < 1.2s)", "لوحة تحكم Filament لإدارة كل شيء", "API موثق + Webhooks", "دفع: مدى، STC Pay، أبل باي", "مراقبة ونسخ احتياطي يومي"].map((x) => (
                <li key={x} className="flex gap-2 text-[13px] text-black/70">
                  <span className="text-emerald-500"><Icon name="check" size={16} /></span>
                  {x}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-[14px] font-bold">النتيجة</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { v: "+40%", l: "أسرع" },
                { v: "2.1×", l: "تحويل أعلى" },
                { v: "99.9%", l: "توفر" },
              ].map((x) => (
                <div key={x.l} className="bg-[var(--color-bg)] border border-black/5 rounded-2xl p-4 text-center">
                  <div className="text-[20px] font-bold">{x.v}</div>
                  <div className="text-[11px] text-black/40 mt-1">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[var(--color-bg)] border border-black/5 rounded-2xl p-5">
              <div className="text-[12px] font-bold">تفاصيل المشروع</div>
              <div className="mt-3 space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-black/40">العميل</span>
                  <span className="font-medium">{p.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/40">السنة</span>
                  <span className="font-medium">{p.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/40">المدة</span>
                  <span className="font-medium">8 أسابيع</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/40">الفريق</span>
                  <span className="font-medium">5 أشخاص</span>
                </div>
              </div>
            </div>
            <Link to="/quote" className="w-full inline-flex justify-center bg-[var(--color-ink)] text-white rounded-full py-3 text-[13px] font-semibold hover:bg-black transition-colors">
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
