import { Icon } from "@/components/ui/Icon"
import { Input, Textarea } from "@/components/ui/Input"
import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { API } from "@/lib/api"
import { quoteSchema, zodErrors } from "@/lib/schemas"
import { addLead } from "@/lib/leadStore"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"

export function QuotePage({ onToast }: { onToast: (m: string) => void }) {
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get("service")

  const { data: apiServices } = useServicesQuery()
  const servicesList = (apiServices && apiServices.length > 0) ? apiServices : SEED_SERVICES

  const [step, setStep] = useState(1)
  const [data, setData] = useState<Record<string, string>>({
    service: preselectedService ?? "",
    budget: "",
    timeline: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({})
  const nav = useNavigate()

  useEffect(() => {
    if (preselectedService && !data.service) {
      setData((prev) => ({ ...prev, service: preselectedService }))
      // If service is preselected from pricing or service card, auto advance to budget step
      setStep(2)
    }
  }, [preselectedService])

  const next = () => setStep((s) => Math.min(3, s + 1))
  const canNext = step === 1 ? !!data.service : step === 2 ? !!data.budget && !!data.timeline : true

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const fd = new FormData(e.currentTarget)
    const payload: Record<string, unknown> = { ...data }
    fd.forEach((v, k) => (payload[k] = String(v)))

    const parsed = quoteSchema.safeParse(payload)
    if (!parsed.success) {
      setQuoteErrors(zodErrors(parsed))
      return
    }

    setQuoteErrors({})
    setIsSubmitting(true)

    try {
      await API.quote(payload)
      addLead({
        id: Date.now().toString(),
        name: String(payload.name ?? ""),
        email: String(payload.email ?? ""),
        phone: String(payload.phone ?? ""),
        message: String(payload.details ?? payload.message ?? "—"),
        status: "جديد",
        createdAt: new Date().toISOString(),
        source: "quote",
        meta: {
          service: String(payload.service ?? ""),
          budget: String(payload.budget ?? ""),
          timeline: String(payload.timeline ?? ""),
        },
      })
      onToast("تم استلام طلبك بنجاح — سنرسل لك عرض السعر وخطة العمل خلال 24 ساعة ✨")
      nav("/contact")
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "تعذر إرسال الطلب، يرجى التحقق من الاتصال والمحاولة مجدداً."
      setServerError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container page-container--narrow py-8 sm:py-12">
      <Link to="/" className="text-[12px] font-medium text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
        ← العودة للرئيسية
      </Link>
      <h1 className="mt-3 text-[28px] sm:text-[36px] font-bold tracking-tight text-[var(--color-ink)]">
        اطلب عرض سعر مخصص
      </h1>
      <p className="mt-2 text-[14px] text-[var(--color-text-muted)] leading-relaxed">
        3 خطوات بسيطة — نقدّر متطلبات مشروعك بدقة ونرسل لك نطاق عمل واضحاً وتكلفة محددة خلال 24 ساعة.
      </p>

      {/* Steps Indicator */}
      <div className="mt-8 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <span
              className={`size-8 rounded-full grid place-items-center text-[12px] font-bold border transition-colors ${
                step >= n
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                  : "bg-white border-[var(--color-border)] text-[var(--color-text-muted)]"
              }`}
            >
              {n}
            </span>
            <span
              className={`text-[12px] font-semibold ${
                step >= n ? "text-[var(--color-ink)]" : "text-[var(--color-text-muted)]/60"
              }`}
            >
              {n === 1 ? "نوع الخدمة" : n === 2 ? "الميزانية والوقت" : "بيانات التواصل"}
            </span>
            {n < 3 && (
              <span
                className={`flex-1 h-0.5 mx-2 rounded-full ${
                  step > n ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="mt-8 bg-white border border-[var(--color-border)] rounded-[28px] p-6 sm:p-8 shadow-[var(--shadow-card)]">
        {serverError && (
          <div role="alert" className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-[13px] text-rose-800 flex items-center gap-2.5">
            <Icon name="alertCircle" size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Step 1: Services */}
        {step === 1 && (
          <div>
            <h2 className="text-[16px] font-bold text-[var(--color-ink)]">ما نوع الخدمة أو المنظومة التي تحتاجها؟</h2>
            <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
              اختر الخدمة الأقرب لاحتياجك — يمكنك توضيح كافة التفاصيل الإضافية في الخطوة الأخيرة
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3.5">
              {servicesList.map((s: any) => {
                const isSelected = data.service === s.slug || data.service === s.title
                const descText = s.desc || s.description || ""
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, service: s.slug }))}
                    className={`text-right p-4 rounded-2xl border text-[13px] transition-all ${
                      isSelected
                        ? "bg-[var(--color-ink)] text-white border-[var(--color-primary-light)] ring-2 ring-[var(--color-primary-light)]/30 shadow-md"
                        : "bg-white border-[var(--color-border)] hover:border-[var(--color-primary-light)]/40 hover:bg-[var(--color-card-soft)]/20"
                    }`}
                  >
                    <span className="font-bold flex items-center gap-3">
                      <Icon name={s.icon} size={22} /> {s.title}
                    </span>
                    <span className={`block text-[11.5px] mt-1.5 leading-relaxed ${isSelected ? "text-slate-300" : "text-[var(--color-text-muted)]"}`}>
                      {descText.slice(0, 65)}...
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Budget & Timeline */}
        {step === 2 && (
          <div className="space-y-7">
            <div>
              <h2 className="text-[16px] font-bold text-[var(--color-ink)]">الميزانية التقريبية المتوقعة</h2>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-1">تساعدنا الميزانية في اقتراح الحل المعماري الأنسب لمشروعك</p>
              <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {["أقل من 10 آلاف ر.س", "10K — 30K ر.س", "30K — 80K ر.س", "أكثر من 80K ر.س"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, budget: b }))}
                    className={`py-3.5 px-3 rounded-2xl border text-[12.5px] font-bold transition-all text-center ${
                      data.budget === b
                        ? "bg-[var(--color-ink)] text-white border-[var(--color-primary)] shadow-sm"
                        : "bg-white border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-primary-light)]/40 hover:bg-[var(--color-card-soft)]/20"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[16px] font-bold text-[var(--color-ink)]">الجدول الزمني المستهدف للإطلاق</h2>
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: "urgent", label: "مستعجل — خلال أسبوعين" },
                  { id: "flexible", label: "مرن — خلال شهر" },
                  { id: "planned", label: "مخطط — 2 إلى 3 أشهر" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, timeline: t.label }))}
                    className={`py-3.5 px-4 rounded-2xl border text-[12.5px] font-bold transition-all ${
                      data.timeline === t.label
                        ? "bg-[var(--color-ink)] text-white border-[var(--color-primary)] shadow-sm"
                        : "bg-white border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-primary-light)]/40 hover:bg-[var(--color-card-soft)]/20"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact Info & Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-[16px] font-bold text-[var(--color-ink)]">بيانات التواصل وتفاصيل المشروع</h2>
            <p className="text-[12px] text-[var(--color-text-muted)]">
              سنستخدم هذه البيانات لإرسال مسودة العرض والتواصل معك عبر الواتساب أو البريد.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <Input id="q-name" name="name" label="الاسم الكامل" required placeholder="محمد أحمد" error={quoteErrors.name} />
              <Input
                id="q-email"
                name="email"
                type="email"
                label="البريد الإلكتروني"
                required
                placeholder="name@company.com"
                dir="ltr"
                error={quoteErrors.email}
              />
            </div>

            <Input
              id="q-phone"
              name="phone"
              label="رقم الجوال / الواتساب"
              required
              placeholder="+966 50 123 4567"
              dir="ltr"
              error={quoteErrors.phone}
            />

            <Textarea
              id="q-details"
              name="details"
              label="تفاصيل ونبذة عن فكرة المشروع"
              required
              rows={4}
              placeholder="اشرح لنا طبيعة المشروع، الميزات المطلوبة، وأي روابط أو منصات ملهمة..."
              error={quoteErrors.details}
            />

            <input type="hidden" name="service" value={data.service} />
            <input type="hidden" name="budget" value={data.budget} />
            <input type="hidden" name="timeline" value={data.timeline} />
          </div>
        )}

        {/* Navigation & Submission */}
        <div className="mt-8 pt-5 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-full border border-[var(--color-border)] text-[13px] font-bold text-[var(--color-ink)] hover:bg-[var(--color-card-soft)] transition-colors"
            >
              ← رجوع
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              className="px-8 py-3.5 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-bold hover:bg-[var(--color-primary-light)] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              متابعة الخطوة التالية ←
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-full bg-[var(--color-ink)] text-white text-[13px] font-bold hover:bg-[var(--color-primary)] transition-all shadow-md disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ إرسال الطلب...
                </>
              ) : (
                "إرسال طلب عرض السعر الآن ←"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
