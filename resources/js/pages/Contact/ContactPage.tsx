import { useState } from "react"
import { Container } from "@/components/layout/Container"
import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { Icon, type IconName } from "@/components/ui/Icon"
import { Input, Textarea, Select } from "@/components/ui/Input"
import { API } from "@/lib/api"
import { contactSchema, zodErrors } from "@/lib/schemas"
import { addLead } from "@/lib/leadStore"

export function ContactPage({ onToast }: { onToast: (m: string) => void }) {
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const contacts: Array<{ label: string; value: string; href?: string; icon: IconName; ltr?: boolean }> = [
    { label: "البريد الإلكتروني", value: "Info@amtdex.com", href: "mailto:Info@amtdex.com", icon: "mail", ltr: true },
    { label: "اتصل بنا", value: "+967 784 440 429", href: "tel:+967784440429", icon: "phone", ltr: true },
    { label: "رقم التواصل الآخر", value: "+967 784 440 428", href: "tel:+967784440428", icon: "phone", ltr: true },
    { label: "إنستغرام", value: "@amtdex", href: "https://www.instagram.com/amtdex/", icon: "instagram", ltr: true },
    { label: "مقرّنا", value: "اليمن - إب", icon: "mapPin" },
  ]
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    setSuccess(false)
    setServerError(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    const vals: Record<string, string> = {}
    fd.forEach((v, k) => (vals[k] = String(v).trim()))
    const parsed = contactSchema.safeParse(vals)
    if (!parsed.success) {
      const nextErrors = zodErrors(parsed)
      setErrors(nextErrors)
      const field = form.elements.namedItem(Object.keys(nextErrors)[0])
      if (field instanceof HTMLElement) field.focus()
      return
    }
    setErrors({})
    setSending(true)
    try {
      await API.contact(fd)
      addLead({ id: Date.now().toString(), name: vals.name, email: vals.email, phone: vals.phone, subject: vals.subject, message: vals.message, status: "جديد", createdAt: new Date().toISOString(), source: "contact", meta: {} })
      setSuccess(true)
      onToast("تم إرسال رسالتك بنجاح — سنرد عليك خلال ساعات العمل")
      form.reset()
    } catch (err: any) {
      setServerError(err?.response?.data?.message || err?.message || "تعذّر إرسال الرسالة. حاول مرة أخرى أو تواصل معنا عبر واتساب.")
    } finally {
      setSending(false)
    }
  }
  return (
    <Container className="contact-page">
      <header data-motion-group className="contact-page-hero">
        <div>
          <span className="contact-eyebrow"><span /> تواصل مع AMTDEX</span>
          <h1 data-motion="rise">لنتحدث عن<br />مشروعك القادم.</h1>
          <p>لديك فكرة أو سؤال؟ اكتب لنا ما تحتاجه، أو اختر وسيلة التواصل التي تناسبك. سنساعدك على تحديد الخطوة التالية بوضوح.</p>
        </div>
        <div className="contact-hero-art" data-motion="vector"><BrandArtwork kind="contact" /></div>
      </header>
      <div className="contact-page-grid">
        <form onSubmit={handleSubmit} noValidate className="contact-form-card" aria-labelledby="contact-form-title" aria-busy={sending}>
          <div className="contact-form-heading"><span className="contact-form-symbol"><Icon name="pen" size={21} /></span><div><h2 id="contact-form-title">أرسل رسالتك</h2><p>تفاصيل بسيطة تساعدنا على فهم احتياجك.</p></div></div>
          {success && <div className="contact-feedback contact-feedback-success" role="status"><Icon name="check" size={20} /><div><strong>وصلتنا رسالتك بنجاح.</strong><p>شكرًا لتواصلك. سنرد عليك خلال ساعات العمل.</p></div></div>}
          {serverError && <div className="contact-feedback contact-feedback-error" role="alert"><Icon name="alertCircle" size={20} /><p>{serverError}</p></div>}
          <div className="contact-fields">
            <div className="contact-field-pair">
              <Input id="c-name" name="name" label="الاسم الكامل" required autoComplete="name" placeholder="اسمك الكامل" error={errors.name} />
              <Input id="c-email" name="email" type="email" inputMode="email" label="البريد الإلكتروني" required autoComplete="email" placeholder="you@example.com" dir="ltr" error={errors.email} />
            </div>
            <div className="contact-field-pair">
              <Input id="c-phone" name="phone" type="tel" inputMode="tel" label="رقم الجوال" required autoComplete="tel" placeholder="+967 7XX XXX XXX" dir="ltr" error={errors.phone} />
              <Select id="c-subject" name="subject" label="كيف يمكننا مساعدتك؟" defaultValue="" error={errors.subject}>
                <option value="" disabled>اختر موضوعًا (اختياري)</option>
                <option value="web">موقع أو متجر إلكتروني</option><option value="mobile">تطبيق جوال</option><option value="erp">نظام لإدارة الأعمال</option><option value="consultation">استشارة تقنية</option><option value="other">استفسار آخر</option>
              </Select>
            </div>
            <Textarea id="c-message" name="message" label="رسالتك" required rows={5} placeholder="ما الذي تريد تطويره؟ أخبرنا بفكرتك أو اكتب سؤالك هنا..." error={errors.message} />
            <div className="contact-submit-row"><span>الحقول المعلّمة بـ * مطلوبة.</span><button type="submit" disabled={sending} className="contact-submit">{sending ? <>جارٍ الإرسال… <span className="contact-spinner" aria-hidden="true" /></> : <>إرسال الرسالة <Icon name="arrowUpLeft" size={19} /></>}</button></div>
          </div>
        </form>
        <aside className="contact-channels" aria-label="وسائل التواصل المباشر">
          <a href="https://wa.me/967784440429" target="_blank" rel="noreferrer" className="contact-whatsapp-card"><span className="contact-channel-icon"><Icon name="phone" size={24} /></span><div><small>تفضّل محادثة مباشرة؟</small><strong>تحدث معنا عبر واتساب</strong><span>أخبرنا بفكرتك وابدأ الحوار.</span></div><Icon name="arrowUpLeft" size={20} /></a>
          <section className="contact-details-card"><h2>اختر طريقتك للتواصل</h2><div className="contact-method-list">{contacts.map(item => {
            const content = <><span className="contact-method-icon"><Icon name={item.icon} size={19} /></span><span className="contact-method-copy"><small>{item.label}</small><strong dir={item.ltr ? "ltr" : undefined}>{item.value}</strong></span>{item.href && <Icon name="arrowUpLeft" size={15} />}</>
            return item.href ? <a key={item.label} href={item.href} target={item.href.startsWith("https:") ? "_blank" : undefined} rel={item.href.startsWith("https:") ? "noreferrer" : undefined} className="contact-method">{content}</a> : <div key={item.label} className="contact-method">{content}</div>
          })}</div></section>
          <section className="contact-hours"><Icon name="clock" size={19} /><div><h2>ساعات العمل والرد</h2><p>السبت — الخميس<br /><bdi>9:00 ص — 6:00 م</bdi> · توقيت مكة</p><small>خارج ساعات العمل، اترك رسالتك وسنراجعها عند عودتنا.</small></div></section>
        </aside>
      </div>
    </Container>
  )
}
