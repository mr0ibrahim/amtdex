import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { SearchSelect } from "@/components/ui/SearchSelect"
import { countryOptions, currencyOptions } from "@/data/selectOptions"
import { Icon } from "@/components/ui/Icon"
import { Input, Textarea } from "@/components/ui/Input"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { type CountryCode } from "@/lib/phone"
import { API } from "@/lib/api"
import { createQuoteSchema, zodErrors } from "@/lib/schemas"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"

/** Ready ranges exist where prices are normally quoted; any other currency uses an exact amount. */
const BUDGET_RANGES: Record<string, string[]> = {
  SAR: ["أقل من 5,000", "5,000 – 15,000", "15,000 – 40,000", "أكثر من 40,000"],
  USD: ["أقل من 1,500", "1,500 – 4,000", "4,000 – 10,000", "أكثر من 10,000"],
}
const BUDGET_OPEN = "لم أحدد بعد"

export function QuotePage({ onToast }: { onToast: (m: string) => void }) {
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get("service")

  const { data: apiServices } = useServicesQuery()
  const servicesList = (apiServices && apiServices.length > 0) ? apiServices : SEED_SERVICES

  const formRef = useRef<HTMLFormElement>(null)
  const pendingRef = useRef(false)
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("YE")
  const quoteSchema = createQuoteSchema(phoneCountry)
  const [step, setStep] = useState(1)
  // Several services can be requested together (a website and an app, say).
  const [services, setServices] = useState<string[]>(preselectedService ? [preselectedService] : [])
  const [data, setData] = useState<Record<string, string>>({
    budget: "",
    budgetChoice: "",
    budgetAmount: "",
    budgetCurrency: "SAR",
    timeline: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({})
  const nav = useNavigate()
  const service = services.join(", ")

  useEffect(() => {
    // Arriving from a service card: that service is already chosen, so start at the budget step.
    if (preselectedService) setStep(2)
  }, [preselectedService])

  const toggleService = (slug: string) => {
    setServices(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug])
    setQuoteErrors(previous => { const next = { ...previous }; delete next.service; return next })
  }
  /** A range, "not sure yet", or an exact amount. The amount field only ever holds digits. */
  const setBudget = (choice: string, currency = data.budgetCurrency, amount = data.budgetAmount) => {
    const digits = amount.replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x6f0)).replace(/[^0-9]/g, "").slice(0, 9)
    const ranged = BUDGET_RANGES[currency]
    // A range only exists in the currencies it was written for.
    const valid = choice === "custom" || choice === "open" || (ranged && ranged.includes(choice)) ? choice : ""
    const budget = valid === "custom" ? (Number(digits) > 0 ? `${digits} ${currency}` : "") : valid === "open" ? BUDGET_OPEN : valid ? `${valid} ${currency}` : ""
    setData(previous => ({ ...previous, budgetChoice: valid, budgetCurrency: currency, budgetAmount: digits, budget }))
    setQuoteErrors(previous => { const next = { ...previous }; delete next.budget; return next })
  }
  const next = () => setStep((s) => Math.min(3, s + 1))
  const canNext = step === 1 ? services.length > 0 : step === 2 ? !!data.timeline && !!data.budget : true

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pendingRef.current || step !== 3) return
    setServerError(null)

    const fd = new FormData(e.currentTarget)
    const payload: Record<string, unknown> = { ...data, service }
    fd.forEach((v, k) => (payload[k] = String(v)))

    const parsed = quoteSchema.safeParse(payload)
    if (!parsed.success) {
      const errors = zodErrors(parsed)
      setQuoteErrors(errors)
      if (errors.service) setStep(1)
      else if (errors.budget || errors.timeline) setStep(2)
      const first = e.currentTarget.elements.namedItem(Object.keys(errors)[0])
      if (first instanceof HTMLElement) first.focus()
      return
    }

    setQuoteErrors({})
    pendingRef.current = true
    setIsSubmitting(true)

    try {
      await API.quote(parsed.data)
      onToast("تم استلام طلبك. سنعود إليك.")
      nav("/contact")
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "تعذر إرسال الطلب، يرجى التحقق من الاتصال والمحاولة مجدداً."
      setServerError(msg)
    } finally {
      pendingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container page-container--narrow quote-page py-8 sm:py-12">
      <Link to="/" className="text-[12px] font-medium text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
        ← العودة للرئيسية
      </Link>
      <div className="quote-vector"><BrandArtwork kind="plan" /></div>
      <h1 className="mt-3 text-[28px] sm:text-[36px] font-bold tracking-tight text-[var(--color-ink)]">
        ابدأ مشروعك
      </h1>
      <p className="mt-2 text-[14px] text-[var(--color-text-muted)] leading-relaxed">
        أخبرنا عن فكرتك ونعود إليك.
      </p>

      <ol className="quote-steps" aria-label="خطوات طلب عرض السعر">
        {["نوع الخدمة", "الميزانية والوقت", "بيانات التواصل"].map((label, index) => {
          const number = index + 1
          return <li key={label} className={step === number ? "is-current" : step > number ? "is-complete" : ""} aria-current={step === number ? "step" : undefined}>
            <span className="quote-step-number" aria-hidden="true">{step > number ? <Icon name="check" size={16} /> : number}</span>
            <span className="quote-step-label">{label}</span>
            <span className="sr-only">{step > number ? "مكتملة" : step === number ? "الخطوة الحالية" : "خطوة قادمة"}</span>
          </li>
        })}
      </ol>

      <form ref={formRef} onSubmit={submit} noValidate aria-busy={isSubmitting} className="quote-form"
        onChange={event => {
          const field = event.target
          if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) || !field.name) return
          setData(previous => ({ ...previous, [field.name]: field.value }))
          if (!(field.name in quoteSchema.shape)) return
          const name = field.name as keyof typeof quoteSchema.shape
          if (!quoteErrors[name]) return
          const result = quoteSchema.shape[name].safeParse(field.value)
          setQuoteErrors(previous => { const next = { ...previous }; if (result.success) delete next[name]; else next[name] = result.error.issues[0].message; return next })
        }}>
        {serverError && (
          <div role="alert" className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-[13px] text-rose-800 flex items-center gap-2.5">
            <Icon name="alertCircle" size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Step 1: Services */}
        {step === 1 && (
          <div>
            <h2 className="text-[16px] font-bold text-[var(--color-ink)]">ما الخدمات التي تحتاجها؟</h2>
            <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
              يمكنك اختيار أكثر من خدمة، مثل موقع وتطبيق معًا. التفاصيل تكتبها في الخطوة الأخيرة.
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3.5" role="group" aria-label="الخدمات المطلوبة">
              {servicesList.map((s: any) => {
                const isSelected = services.includes(s.slug) || services.includes(s.title)
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => toggleService(s.slug)}
                    aria-pressed={isSelected}
                    className={`quote-choice quote-service text-right p-4 rounded-2xl border text-[13px] transition-all ${
                      isSelected
                        ? "bg-[var(--color-ink)] text-white border-[var(--color-primary-light)] ring-2 ring-[var(--color-primary-light)]/30 shadow-md"
                        : "bg-white border-[var(--color-border)] hover:border-[var(--color-primary-light)]/40 hover:bg-[var(--color-card-soft)]/20"
                    }`}
                  >
                    <span className="font-bold flex items-center gap-3">
                      <Icon name={s.icon} size={22} /> <span className="flex-1">{s.title}</span>
                      <span className="quote-check" aria-hidden="true">{isSelected && <Icon name="check" size={14} />}</span>
                    </span>
                    <span className={`block text-[11.5px] mt-1.5 leading-relaxed ${isSelected ? "text-slate-300" : "text-[var(--color-text-muted)]"}`}>
                      {s.desc || s.description || ""}
                    </span>
                  </button>
                )
              })}
            </div>
            {services.length > 1 && <p className="quote-selected-count" aria-live="polite">اخترت {services.length} خدمات</p>}
          </div>
        )}

        {/* Step 2: Budget & Timeline */}
        {step === 2 && (
          <div className="space-y-7">
            <section className="quote-budget-section" aria-labelledby="quote-budget-title">
              <h2 id="quote-budget-title">ما الميزانية التقريبية لمشروعك؟</h2>
              <p>اختر النطاق الأقرب. هذه ميزانيتك التقديرية وليست سعرًا نهائيًا للخدمة.</p>
              <div className="quote-currency" role="group" aria-label="عملة الميزانية">
                {Object.keys(BUDGET_RANGES).map(code => (
                  <button key={code} type="button" aria-pressed={data.budgetCurrency === code && data.budgetChoice !== "custom"} onClick={() => setBudget(data.budgetChoice === "custom" ? "" : data.budgetChoice, code)}>
                    {currencyOptions.find(option => option.value === code)?.label ?? code}
                  </button>
                ))}
              </div>
              <div className="quote-ranges" role="group" aria-label="نطاق الميزانية">
                {(BUDGET_RANGES[data.budgetCurrency] ?? BUDGET_RANGES.SAR).map(range => (
                  <button key={range} type="button" className="quote-choice" aria-pressed={data.budgetChoice === range} onClick={() => setBudget(range, BUDGET_RANGES[data.budgetCurrency] ? data.budgetCurrency : "SAR")}>
                    <bdi>{range}</bdi>
                  </button>
                ))}
                <button type="button" className="quote-choice" aria-pressed={data.budgetChoice === "open"} onClick={() => setBudget("open")}>{BUDGET_OPEN}</button>
                <button type="button" className="quote-choice" aria-pressed={data.budgetChoice === "custom"} onClick={() => setBudget("custom")}>مبلغ آخر</button>
              </div>
              {data.budgetChoice === "custom" && (
                <div className="quote-budget-fields">
                  <Input id="q-budget" label="المبلغ" inputMode="numeric" pattern="[0-9]*" autoComplete="off" dir="ltr" placeholder="مثال: 7500" value={data.budgetAmount}
                    onChange={event => setBudget("custom", data.budgetCurrency, event.target.value)}
                    // Only a filled-in amount can be wrong; an untouched field is not an error.
                    error={data.budgetAmount && !data.budget ? "يجب أن يكون المبلغ أكبر من صفر" : undefined} />
                  <SearchSelect id="q-currency" label="العملة" title="اختر العملة" searchPlaceholder="ابحث باسم العملة أو رمزها" options={currencyOptions} value={data.budgetCurrency} onChange={currency => setBudget("custom", currency)} />
                </div>
              )}
            </section>
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
                    aria-pressed={data.timeline === t.label}
                    className={`quote-choice py-3.5 px-4 rounded-2xl border text-[12.5px] font-bold transition-all ${
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
              <Input id="q-name" name="name" label="الاسم الكامل" required autoComplete="name" defaultValue={data.name ?? ""} placeholder="اكتب اسمك الكامل" error={quoteErrors.name} />
              <Input
                id="q-email"
                name="email"
                type="email"
                label="البريد الإلكتروني"
                required
                autoComplete="email" defaultValue={data.email ?? ""} placeholder="you@example.com"
                dir="ltr"
                error={quoteErrors.email}
              />
            </div>

            <div className="quote-phone-row">
              <SearchSelect id="q-country" label="الدولة / مفتاح الاتصال" title="اختر الدولة" searchPlaceholder="ابحث باسم الدولة أو مفتاحها" options={countryOptions} value={phoneCountry} onChange={code => {
                const country = code as CountryCode
                setPhoneCountry(country)
                const phone = formRef.current?.elements.namedItem("phone")
                if (!(phone instanceof HTMLInputElement) || !phone.value) return
                const result = createQuoteSchema(country).shape.phone.safeParse(phone.value)
                setQuoteErrors(previous => { const next = { ...previous }; if (result.success) delete next.phone; else next.phone = result.error.issues[0].message; return next })
              }} />
              <Input id="q-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" label="رقم الهاتف / الواتساب" required placeholder="اكتب رقم الهاتف" dir="ltr" defaultValue={data.phone ?? ""} error={quoteErrors.phone} />
              <p>اختر الدولة للرقم المحلي، أو أدخل رقمًا دوليًا يبدأ بـ + أو 00.</p>
            </div>

            <Textarea
              id="q-details"
              name="details"
              label="تفاصيل ونبذة عن فكرة المشروع"
              required
              rows={5}
              defaultValue={data.details ?? ""}
              placeholder="اشرح لنا طبيعة المشروع، الميزات المطلوبة، وأي روابط أو منصات ملهمة..."
              error={quoteErrors.details}
            />

            <input type="hidden" name="service" value={service} />
            <input type="hidden" name="budget" value={data.budget} />
            <input type="hidden" name="timeline" value={data.timeline} />
          </div>
        )}

        {/* Navigation & Submission */}
        <div className="quote-navigation">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={isSubmitting}
              className="quote-back"
            >
              <Icon name="arrowRight" size={18} /><span>رجوع</span>
            </button>
          ) : (
            <span className="quote-navigation-spacer" />
          )}

          {step < 3 ? (
            <button
              key="next"
              type="button"
              onClick={next}
              disabled={!canNext}
              className="quote-forward"
            >
              <span>الخطوة التالية</span><Icon name="arrowLeft" size={18} />
            </button>
          ) : (
            <button
              key="submit"
              type="submit"
              disabled={isSubmitting}
              className="quote-forward"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ إرسال الطلب...
                </>
              ) : (
                <><span>إرسال طلب عرض السعر</span><Icon name="arrowLeft" size={18} /></>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
