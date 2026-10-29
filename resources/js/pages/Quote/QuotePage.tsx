import { Icon } from "@/components/ui/Icon"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API } from "@/lib/api"
import { quoteSchema, zodErrors } from "@/lib/schemas"
import { addLead } from "@/lib/leadStore"
import { SERVICES } from "@/data/services"

export function QuotePage({ onToast }: { onToast: (m: string) => void }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Record<string, string>>({ service: "", budget: "", timeline: "" })
  const nav = useNavigate()

  const next = () => setStep((s) => Math.min(3, s + 1))
  const canNext = step === 1 ? !!data.service : step === 2 ? !!data.budget && !!data.timeline : true

  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({})

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload: Record<string, unknown> = { ...data }
    fd.forEach((v, k) => payload[k] = String(v))

    const parsed = quoteSchema.safeParse(payload)
    if (!parsed.success) {
      setQuoteErrors(zodErrors(parsed))
      return
    }
    setQuoteErrors({})
    await API.quote(payload)
    addLead({ id: Date.now().toString(), name: String(payload.name ?? ""), email: String(payload.email ?? ""), phone: String(payload.phone ?? ""), message: String(payload.details ?? payload.message ?? "—"), status: "جديد", createdAt: new Date().toISOString(), source: "quote", meta: { service: String(payload.service ?? ""), budget: String(payload.budget ?? ""), timeline: String(payload.timeline ?? "") } })
    onToast("تم استلام طلبك — سنرسل عرض السعر خلال 24 ساعة ✨")
    nav("/contact")
  }

  return (
    <div className="mx-auto max-w-[840px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="text-[12px] font-medium text-black/40 hover:text-black">
        ← الرئيسية
      </Link>
      <h1 className="mt-3 text-[28px] sm:text-[36px] font-bold tracking-[-0.04em]">اطلب عرض سعر</h1>
      <p className="mt-2 text-[13px] text-black/50">3 خطوات سريعة — نقدّر مشروعك بدقة ونرسل نطاقاً وتكلفة ثابتة.</p>

      <div className="mt-6 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <span className={`size-7 rounded-full grid place-items-center text-[11px] font-bold border ${step >= n ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-white border-black/10 text-black/30"}`}>{n}</span>
            <span className={`text-[11px] font-medium ${step >= n ? "text-black" : "text-black/30"}`}>{n === 1 ? "الخدمة" : n === 2 ? "الميزانية والوقت" : "بياناتك"}</span>
            {n < 3 && <span className={`flex-1 h-px mx-2 ${step > n ? "bg-[var(--color-ink)]" : "bg-black/10"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="mt-8 bg-white border border-black/5 rounded-[24px] p-6 sm:p-7">
        {step === 1 && (
          <div>
            <h2 className="text-[14px] font-bold">ما الخدمة التي تحتاجها؟</h2>
            <p className="text-[11px] text-black/40 mt-1">اختر واحدة — يمكنك توضيح التفاصيل في الخطوة الأخيرة</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setData((d) => ({ ...d, service: s.slug }))}
                  className={`text-right p-4 rounded-2xl border text-[13px] transition-colors ${data.service === s.slug ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-[var(--color-bg)] border-black/5 hover:border-black/15"}`}
                >
                  <span className="font-bold flex items-center gap-3">
                    <Icon name={s.icon} size={24} /> {s.title}
                  </span>
                  <span className={`block text-[11px] mt-1 ${data.service === s.slug ? "text-white/60" : "text-black/40"}`}>{s.desc.slice(0, 60)}...</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[14px] font-bold">الميزانية التقريبية</h2>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["< 10K", "10K — 30K", "30K — 80K", "80K+"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, budget: b }))}
                    className={`py-3 rounded-full border text-[13px] font-medium ${data.budget === b ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-white border-black/10 hover:border-black/20"}`}
                  >
                    {b} ﷼
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-[14px] font-bold">الجدول الزمني</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {["مستعجل — أسبوعين", "مرن — شهر", "مخطط — 2-3 أشهر"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, timeline: t }))}
                    className={`py-3 rounded-full border text-[12px] font-medium ${data.timeline === t ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-white border-black/10 hover:border-black/20"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-[14px] font-bold">بياناتك — لنستخدمها للرد فقط</h2>
            {(quoteErrors.service || quoteErrors.budget || quoteErrors.timeline) && (
              <div role="alert" className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[12px] text-amber-900">
                {quoteErrors.service && <div>{quoteErrors.service}</div>}
                {quoteErrors.budget && <div>{quoteErrors.budget}</div>}
                {quoteErrors.timeline && <div>{quoteErrors.timeline}</div>}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="q-name" className="text-[12px] font-medium">
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  id="q-name"
                  name="name"
                  required
                  placeholder="اسمك الكامل"
                  aria-invalid={!!quoteErrors.name}
                  aria-describedby={quoteErrors.name ? "q-name-error" : undefined}
                  className={`mt-1.5 w-full bg-[var(--color-bg)] border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20 ${quoteErrors.name ? "border-red-400" : "border-black/10"}`}
                />
                {quoteErrors.name && (
                  <p id="q-name-error" role="alert" className="mt-1.5 text-[11px] text-red-500">
                    {quoteErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="q-email" className="text-[12px] font-medium">
                  البريد <span className="text-red-500">*</span>
                </label>
                <input
                  id="q-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  dir="ltr"
                  aria-invalid={!!quoteErrors.email}
                  aria-describedby={quoteErrors.email ? "q-email-error" : undefined}
                  className={`mt-1.5 w-full bg-[var(--color-bg)] border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20 ${quoteErrors.email ? "border-red-400" : "border-black/10"}`}
                />
                {quoteErrors.email && (
                  <p id="q-email-error" role="alert" className="mt-1.5 text-[11px] text-red-500">
                    {quoteErrors.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="q-phone" className="text-[12px] font-medium">
                الجوال
              </label>
              <input id="q-phone" name="phone" placeholder="+966 5x xxx xxxx" dir="ltr" className="mt-1.5 w-full bg-[var(--color-bg)] border border-black/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20" />
            </div>
            <div>
              <label htmlFor="q-details" className="text-[12px] font-medium">
                تفاصيل المشروع
              </label>
              <textarea id="q-details" name="details" rows={4} placeholder="صف فكرتك، الأهداف، وأي أمثلة مشابهة..." className="mt-1.5 w-full bg-[var(--color-bg)] border border-black/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20 resize-none" />
            </div>
            <input type="hidden" name="service" value={data.service} />
            <input type="hidden" name="budget" value={data.budget} />
            <input type="hidden" name="timeline" value={data.timeline} />
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="px-6 py-3 rounded-full border border-black/10 text-[13px] font-medium hover:bg-black hover:text-white transition-colors">
              رجوع
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="button" onClick={next} disabled={!canNext} className="px-7 py-3 rounded-full bg-[var(--color-ink)] text-white text-[13px] font-semibold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              التالي ←
            </button>
          ) : (
            <button type="submit" className="px-7 py-3 rounded-full bg-[var(--color-ink)] text-white text-[13px] font-semibold hover:bg-black transition-colors">
              إرسال الطلب — POST /api/quotes ←
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-[11px] text-black/30">واجهة فقط — سيتم ربطها مع Laravel عند الجاهزية</p>
      </form>
    </div>
  )
}
