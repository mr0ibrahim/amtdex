import { useState } from "react"
import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { Icon, type IconName } from "@/components/ui/Icon"
import { Input, Textarea, Select } from "@/components/ui/Input"
import { API } from "@/lib/api"
import { contactSchema, zodErrors } from "@/lib/schemas"
import { addLead } from "@/lib/leadStore"

export function ContactPage({ onToast }: { onToast: (m: string) => void }) {
  const [sending, setSending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const contacts: Array<{ l: string; v: string; href?: string; icon: IconName }> = [
    { l: "البريد الإلكتروني", v: "hello@amtdex.com", href: "mailto:hello@amtdex.com", icon: "mail" },
    { l: "الجوال / الواتساب", v: "+966 50 000 0000", href: "https://wa.me/966500000000", icon: "phone" },
    { l: "المقر الرئيسي", v: "صنعاء — حدة، برج الأعمال", icon: "mapPin" },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const form = e.currentTarget
    const fd = new FormData(form)
    const vals: Record<string, string> = {}
    fd.forEach((v, k) => (vals[k] = String(v).trim()))

    const parsed = contactSchema.safeParse(vals)
    if (!parsed.success) {
      setErrors(zodErrors(parsed))
      return
    }

    setErrors({})
    setSending(true)

    try {
      await API.contact(fd)
      addLead({
        id: Date.now().toString(),
        name: vals.name,
        email: vals.email,
        phone: vals.phone,
        subject: vals.subject,
        message: vals.message,
        status: "جديد",
        createdAt: new Date().toISOString(),
        source: "contact",
        meta: {},
      })
      onToast("تم إرسال رسالتك بنجاح — سنرد عليك خلال ساعات العمل ✉")
      form.reset()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "تعذر إرسال الرسالة، يرجى التأكد من اتصال الإنترنت والمحاولة مجدداً."
      setServerError(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <Container className="py-8 sm:py-16">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
        <div>
          <PageHeader
            eyebrow="تواصل معنا"
            title={
              <>
                لنتحدث عن
                <br />
                مشروعك التقني القادم.
              </>
            }
            description="يسعدنا الإجابة عن استفساراتك وتقديم استشارة أولية مجانية لمشروعك البرمجي، ومساعدتك في اختيار التقنيات والحلول المعمارية الأنسب."
          />

          <div className="mt-8 space-y-3.5">
            {contacts.map((c) => (
              <div
                key={c.l}
                className="bg-white border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm hover:border-[var(--color-primary-light)]/40 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <span className="size-10 rounded-xl bg-[var(--color-card-soft)] text-[var(--color-primary)] grid place-items-center shrink-0">
                    <Icon name={c.icon} size={18} />
                  </span>
                  <div>
                    <div className="text-[11.5px] text-[var(--color-text-muted)] font-medium">{c.l}</div>
                    <div className="text-[13.5px] font-bold text-[var(--color-ink)] mt-0.5" dir={c.v.startsWith("+") ? "ltr" : undefined}>
                      {c.v}
                    </div>
                  </div>
                </div>
                {c.href && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] font-bold px-4 py-2 rounded-full bg-[var(--color-lavender)]/60 text-[var(--color-ink)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                  >
                    تواصل
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-[var(--color-ink)] text-white p-6 shadow-md">
            <div className="flex items-center gap-2 text-[13px] font-bold text-amber-300">
              <Icon name="clock" size={16} />
              ساعات العمل والرد
            </div>
            <div className="text-[12.5px] text-white/80 mt-2">السبت — الخميس: 9:00 ص — 6:00 م (توقيت مكة)</div>
            <div className="text-[11.5px] text-white/50 mt-1.5 leading-relaxed">
              خارج أوقات العمل: يمكنك ترك رسالتك وسيتواصل معك مهندس النظم خلال 12 ساعة كحد أقصى.
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-[var(--color-border)] rounded-[28px] p-6 sm:p-8 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[var(--color-ink)]">أرسل استفسارك</h2>
            <span className="text-[11px] text-[var(--color-text-muted)]">الرد خلال ساعات العمل</span>
          </div>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
            املأ النموذج أدناه وسيقوم فريق الدعم الفني والمبيعات بالتواصل معك مباشرة.
          </p>

          {serverError && (
            <div role="alert" className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-[12.5px] text-rose-800 flex items-center gap-2">
              <Icon name="alertCircle" size={16} />
              <span>{serverError}</span>
            </div>
          )}

          <div className="mt-6 grid gap-4">
            <Input
              id="c-name"
              name="name"
              label="الاسم الكامل"
              required
              autoComplete="name"
              placeholder="أحمد محمد"
              error={errors.name}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="c-email"
                name="email"
                type="email"
                label="البريد الإلكتروني"
                required
                autoComplete="email"
                placeholder="name@company.com"
                dir="ltr"
                error={errors.email}
              />
              <Input
                id="c-phone"
                name="phone"
                type="tel"
                label="رقم الجوال"
                required
                autoComplete="tel"
                placeholder="+966 50 123 4567"
                dir="ltr"
                error={errors.phone}
              />
            </div>

            <Select id="c-subject" name="subject" label="موضوع الاستفسار" defaultValue="">
              <option value="" disabled>
                اختر مجال المشروع أو الاستفسار
              </option>
              <option value="web">تطوير منصة ويب أو متجر إلكتروني</option>
              <option value="mobile">تطبيقات الهواتف الذكية (iOS & Android)</option>
              <option value="erp">أنظمة إدارة الموارد السحابية (ERP & CRM)</option>
              <option value="consultation">استشارة فنية وهندسة برمجيات</option>
              <option value="other">استفسار عام آخر</option>
            </Select>

            <Textarea
              id="c-message"
              name="message"
              label="تفاصيل الرسالة"
              required
              rows={4}
              placeholder="أخبرنا عن فكرتك، الميزات الرئيسية المطلوبة، والموعد المستهدف للإطلاق..."
              error={errors.message}
            />

            <button
              type="submit"
              disabled={sending}
              className="mt-2 w-full bg-[var(--color-primary)] text-white rounded-full py-3.5 px-6 text-[13px] font-bold hover:bg-[var(--color-primary-light)] transition-all shadow-md disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ إرسال الرسالة...
                </>
              ) : (
                "إرسال الرسالة الآن ←"
              )}
            </button>
          </div>
        </form>
      </div>
    </Container>
  )
}
