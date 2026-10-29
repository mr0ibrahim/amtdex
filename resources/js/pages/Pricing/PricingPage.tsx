import { Icon } from "@/components/ui/Icon"
import { useState } from "react"
import { Link } from "react-router-dom"
import { PRICING } from "@/data/pricing"

export function PricingPage({ onToast }: { onToast: (m: string) => void }) {
  const [billing, setBilling] = useState<"once" | "monthly">("once")

  return (
    <div className="mx-auto max-w-[1440px] px-10 py-16 bg-white">
      <div className="text-center max-w-[640px] mx-auto">
        <div className="text-[11px] font-bold tracking-[0.6px] text-[var(--color-primary)]">باقات تناسب كل مرحلة</div>
        <h1 className="mt-2 text-[34px] leading-[41px] font-bold tracking-[-0.5px] text-[var(--color-ink)]">استثمار برمجي واضح ومرن</h1>
        <p className="mt-2 text-[13px] leading-[23px] text-[var(--color-text-muted)]">أسعار شفافة، عقود مرنة، ودفعات مرحلية مرتبطة بالتسليم — بدون تكاليف مخفية.</p>
        <div className="mt-6 inline-flex bg-[var(--color-beige)] border border-[var(--color-border)] p-1 rounded-full text-[12px] font-medium">
          <button onClick={() => setBilling("once")} className={`rounded-full px-[18px] py-2 transition-colors ${billing === "once" ? "bg-white shadow-sm border border-[var(--color-border)] text-[var(--color-ink)] font-bold" : "text-[var(--color-text-muted)]"}`}>
            شهري
          </button>
          <button onClick={() => setBilling("monthly")} className={`rounded-full px-[18px] py-2 flex items-center gap-1.5 transition-colors ${billing === "monthly" ? "bg-white shadow-sm border border-[var(--color-border)] text-[var(--color-ink)] font-bold" : "text-[var(--color-text-muted)] font-semibold"}`}>
            سنوي <span className="bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-full px-2 py-0.5 text-[10px] font-bold">خصم 20%</span>
          </button>
        </div>
      </div>
      <div className="mt-8 grid lg:grid-cols-3 gap-3.5 items-end">
        {PRICING.map((p) => (
          <div key={p.name} className={`rounded-[24px] border p-7 flex flex-col ${p.popular ? "bg-[var(--color-ink)] text-white border-[var(--color-primary)] border-2 shadow-[0_16px_32px_rgba(10,102,255,0.15)]" : "bg-white border-[var(--color-border)] shadow-[0_8px_20px_rgba(7,11,26,0.04)]"}`}>
            {p.popular && <span className="self-start text-[11px] font-bold bg-[var(--color-primary)] text-white rounded-full px-3 py-1"><Icon name="star" size={13} /> الأكثر طلباً</span>}
            <h3 className={`mt-3 text-[16px] font-extrabold ${p.popular ? "text-white" : "text-[var(--color-ink)]"}`}>{p.name}</h3>
            <div className={`text-[12px] ${p.popular ? "text-[var(--color-text-faint)]" : "text-[var(--color-text-muted)]"}`}>{p.popular ? "للشركات التي تريد نظاماً على مقاسها" : p.name === "الانطلاقة" ? "للمشاريع الناشئة والمتاجر" : "للمؤسسات والتحول الرقمي الشامل"}</div>
            <div className="mt-4 flex items-baseline gap-1">
              {p.price !== "حسب الطلب" && <span className={`text-[13px] font-bold ${p.popular ? "text-white" : "text-[var(--color-ink)]"}`}>﷼</span>}
              <span className={`text-[36px] font-bold tracking-[-0.5px] font-mono ${p.popular ? "text-white" : "text-[var(--color-ink)]"}`}>{p.price === "حسب الطلب" ? "مخصص" : p.price}</span>
              {p.price !== "حسب الطلب" && <span className={`text-[13px] ${p.popular ? "text-[var(--color-text-faint)]" : "text-[var(--color-text-muted)]"}`}>/شهر</span>}
            </div>
            <div className={`h-px my-4 ${p.popular ? "bg-[var(--color-border-strong)]" : "bg-[var(--color-border)]"}`} />
            <ul className="space-y-2.5 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[12.5px]">
                  <span className={`size-5 rounded-full grid place-items-center text-[10px] shrink-0 ${p.popular ? "bg-[var(--color-border-strong)] text-[#7DD3A0]" : "bg-[var(--color-beige)] text-[var(--color-ink)]"}`}><Icon name="check" size={16} /></span>
                  <span className={p.popular ? "text-[var(--color-border)]" : "text-[var(--color-ink)]"}>{String(f)}</span>
                </li>
              ))}
            </ul>
            <Link to="/quote" className={`mt-6 w-full text-center rounded-full py-3.5 text-[13px] font-bold transition-colors ${p.popular ? "bg-[var(--color-primary)] text-white hover:bg-[#0958CC]" : "bg-[var(--color-ink)] text-white hover:bg-black"}`}>
              {p.popular ? "ابدأ مشروعك" : p.cta}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white border border-[var(--color-border)] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-[13px] font-bold text-[var(--color-ink)]">تحتاج عرضاً مخصصاً؟</div>
          <div className="text-[12px] text-[var(--color-text-muted)] mt-1">نقدّر مشروعك خلال 24 ساعة مع نطاق واضح وتكلفة ثابتة.</div>
        </div>
        <button onClick={() => onToast("سيتم فتح نموذج العرض المخصص")} className="shrink-0 bg-[var(--color-ink)] text-white px-6 py-3 rounded-full text-[13px] font-semibold hover:bg-black transition-colors">
          اطلب تسعير مخصص ←
        </button>
      </div>
      <div className="mt-4 grid md:grid-cols-3 gap-3 text-[12px]">
        {[
          { t: "دفع آمن", d: "تحويل بنكي / مدى / تابي وتمارا" },
          { t: "ضمان", d: "30 يوم دعم مجاني بعد التسليم" },
          { t: "شفافية", d: "كود مصدري + توثيق كامل" },
        ].map((x) => (
          <div key={x.t} className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
            <div className="font-bold text-[var(--color-ink)]">{x.t}</div>
            <div className="text-[var(--color-text-muted)] mt-1">{x.d}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
