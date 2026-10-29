import { useState } from "react"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { API } from "@/lib/api"
import { contactSchema, zodErrors } from "@/lib/schemas"
import { addLead } from "@/lib/leadStore"

export function ContactPage({ onToast }: { onToast: (m: string) => void }) {
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const vals: Record<string, string> = {}
    fd.forEach((v, k) => vals[k] = String(v).trim())

    const parsed = contactSchema.safeParse(vals)
    if (!parsed.success) {
      setErrors(zodErrors(parsed))
      return
    }
    setErrors({})
    setSending(true)
    await API.contact(fd)
    addLead({ id: Date.now().toString(), name: vals.name, email: vals.email, phone: vals.phone, subject: vals.subject, message: vals.message, status: "جديد", createdAt: new Date().toISOString(), source: "contact", meta: {} })
    setSending(false)
    onToast("تم الإرسال — سنرد خلال ساعات ✉")
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SectionLabel>تواصل معنا</SectionLabel>
      <div className="mt-3 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        <div>
          <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.04em] leading-tight">
            لنتحدث عن
            <br />
            مشروعك القادم.
          </h1>
          <p className="mt-3 text-[14px] leading-6 text-black/50 max-w-[480px]">املأ النموذج أو راسلنا مباشرة — نرد خلال ساعات عمل. الاستشارة الأولى مجانية.</p>
          <div className="mt-6 space-y-3">
            {[
              { l: "البريد", v: "hello@amtdex.com", href: "mailto:hello@amtdex.com" },
              { l: "الهاتف / واتساب", v: "+966 50 000 0000", href: "https://wa.me/966500000000" },
              { l: "العنوان", v: "صنعاء — حدة، برج الأعمال" },
            ].map((c) => (
              <div key={c.l} className="bg-white border border-black/5 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-black/40 font-medium">{c.l}</div>
                  <div className="text-[13px] font-semibold mt-1" dir="ltr">
                    {c.v}
                  </div>
                </div>
                {c.href && (
                  <a href={c.href} className="text-[12px] font-medium px-4 py-2 rounded-full bg-[var(--color-ink)] text-white hover:bg-black transition-colors">
                    تواصل
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[var(--color-ink)] text-white p-5">
            <div className="text-[12px] font-bold">ساعات العمل</div>
            <div className="text-[12px] text-white/60 mt-1">السبت — الخميس: 9ص — 6م (Asia/Riyadh)</div>
            <div className="text-[11px] text-white/30 mt-2">خارج الأوقات: نرد عبر البريد خلال 12 ساعة</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-white border border-black/5 rounded-[24px] p-6 sm:p-7">
          <h2 className="text-[16px] font-bold">أرسل رسالة</h2>
          <p className="text-[11px] text-black/40 mt-1">POST /api/contact — جاهز للربط مع Laravel (مع CSRF + Validation)</p>
          <div className="mt-6 grid gap-4">
            <div>
              <label htmlFor="c-name" className="text-[12px] font-medium">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                id="c-name"
                name="name"
                autoComplete="name"
                placeholder="مثال: أحمد الغامدي"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "c-name-error" : undefined}
                className={`mt-1.5 w-full bg-[var(--color-bg)] border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20 ${errors.name ? "border-red-400" : "border-black/10"}`}
              />
              {errors.name && (
                <p id="c-name-error" role="alert" className="mt-1.5 text-[11px] text-red-500">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="c-email" className="text-[12px] font-medium">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  dir="ltr"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "c-email-error" : undefined}
                  className={`mt-1.5 w-full bg-[var(--color-bg)] border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20 ${errors.email ? "border-red-400" : "border-black/10"}`}
                />
                {errors.email && (
                  <p id="c-email-error" role="alert" className="mt-1.5 text-[11px] text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="c-phone" className="text-[12px] font-medium">
                  رقم الجوال
                </label>
                <input
                  id="c-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+966 5x xxx xxxx"
                  dir="ltr"
                  className="mt-1.5 w-full bg-[var(--color-bg)] border border-black/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="c-subject" className="text-[12px] font-medium">
                الموضوع
              </label>
              <select id="c-subject" name="subject" defaultValue="" className="mt-1.5 w-full bg-[var(--color-bg)] border border-black/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20">
                <option value="" disabled>
                  اختر موضوعاً
                </option>
                <option value="web">موقع / متجر</option>
                <option value="mobile">تطبيق جوال</option>
                <option value="erp">نظام ERP/CRM</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            <div>
              <label htmlFor="c-message" className="text-[12px] font-medium">
                الرسالة <span className="text-red-500">*</span>
              </label>
              <textarea
                id="c-message"
                name="message"
                rows={5}
                placeholder="احكِ لنا عن فكرتك، أهدافك، وميزانيتك التقريبية..."
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "c-message-error" : undefined}
                className={`mt-1.5 w-full bg-[var(--color-bg)] border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-black/20 resize-none ${errors.message ? "border-red-400" : "border-black/10"}`}
              />
              {errors.message && (
                <p id="c-message-error" role="alert" className="mt-1.5 text-[11px] text-red-500">
                  {errors.message}
                </p>
              )}
            </div>
            <button type="submit" disabled={sending} className="w-full bg-[var(--color-ink)] text-white rounded-full py-3.5 text-[13px] font-semibold hover:bg-black transition-colors disabled:opacity-60">
              {sending ? "جارٍ الإرسال..." : "إرسال الرسالة ←"}
            </button>
            <p className="text-center text-[11px] text-black/30">بالإرسال توافق على معالجة بياناتك للرد عليك فقط</p>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-[24px] overflow-hidden border border-black/5 bg-white">
        <div className="h-[220px] bg-[var(--color-ink)] relative grid place-items-center">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(600px 300px at 50% 30%, #7C5CFF, transparent 60%)" }} />
          <div className="relative text-center text-white">
            <div className="text-[22px]">📍</div>
            <div className="text-[13px] font-semibold mt-2">صنعاء — حدة</div>
            <div className="text-[11px] text-white/50 mt-1">خريطة تفاعلية — يمكن ربطها بـ Mapbox / Google Maps</div>
          </div>
        </div>
      </div>
    </div>
  )
}
