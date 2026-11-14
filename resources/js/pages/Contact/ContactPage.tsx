import { useEffect, useRef, useState } from "react"
import { whatsappUrl } from "@/lib/site"
import { SearchSelect } from "@/components/ui/SearchSelect"
import { countryOptions } from "@/data/selectOptions"
import { Container } from "@/components/layout/Container"
import { BrandArtwork } from "@/components/ui/BrandArtwork"
import { Icon, type IconName } from "@/components/ui/Icon"
import { Input, Textarea } from "@/components/ui/Input"
import { API } from "@/lib/api"
import { createContactSchema, zodErrors } from "@/lib/schemas"
import { type CountryCode } from "@/lib/phone"

const subjectOptions = [
  { value: "web", label: "موقع أو متجر إلكتروني" },
  { value: "mobile", label: "تطبيق جوال" },
  { value: "erp", label: "نظام لإدارة الأعمال" },
  { value: "consultation", label: "استشارة تقنية" },
  { value: "other", label: "استفسار آخر" },
]

export function ContactPage({ onToast }: { onToast: (m: string) => void }) {
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("YE")
  const contactSchema = createContactSchema(phoneCountry)
  const formRef = useRef<HTMLFormElement>(null)
  const requestRef = useRef(false)
  const pendingFocusRef = useRef<string | null>(null)
  const [validFields, setValidFields] = useState<string[]>([])
  const [messageLength, setMessageLength] = useState(0)
  const requiredFields = ["name", "email", "phone", "message"] as const
  const updateField = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, showError: boolean) => {
    if (!(field.name in contactSchema.shape)) return
    const name = field.name as keyof typeof contactSchema.shape
    const value = field.value.trim()
    const result = contactSchema.shape[name].safeParse(value)
    if (name === "message") setMessageLength(field.value.length)
    setValidFields(previous => result.success && value ? [...new Set([...previous, name])] : previous.filter(item => item !== name))
    setErrors(previous => {
      if (!showError && !previous[name]) return previous
      const next = { ...previous }
      if (result.success) delete next[name]
      else next[name] = result.error.issues[0].message
      return next
    })
    setSuccess(false)
  }
  const completed = requiredFields.filter(name => validFields.includes(name)).length
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  useEffect(() => {
    if (sending || !pendingFocusRef.current) return
    const field = formRef.current?.elements.namedItem(pendingFocusRef.current)
    if (field instanceof HTMLElement) field.focus()
    pendingFocusRef.current = null
  }, [sending])
  const contacts: Array<{ label: string; value: string; href?: string; icon: IconName; ltr?: boolean }> = [
    { label: "البريد الإلكتروني", value: "info@amtdex.com", href: "mailto:info@amtdex.com", icon: "mail", ltr: true },
    { label: "اتصل بنا", value: "+967 784 440 429", href: "tel:+967784440429", icon: "phone", ltr: true },
    { label: "رقم التواصل الآخر", value: "+967 784 440 428", href: "tel:+967784440428", icon: "phone", ltr: true },
    { label: "إنستغرام", value: "@amtdex", href: "https://www.instagram.com/amtdex/", icon: "instagram", ltr: true },
    { label: "مقرّنا", value: "اليمن - إب", icon: "mapPin" },
  ]
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (requestRef.current) return
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
    requestRef.current = true
    setSending(true)
    Object.entries(parsed.data).forEach(([key, value]) => fd.set(key, value ?? ""))
    try {
      await API.contact(fd)
      setSuccess(true)
      onToast("تم إرسال رسالتك بنجاح — سنرد عليك خلال ساعات العمل")
      form.reset()
      setValidFields([])
      setMessageLength(0)
      setPhoneCountry("YE")
    } catch (err: unknown) {
      const failure = err as { errors?: Record<string, string[]>; message?: string }
      if (failure.errors) {
        const nextErrors = Object.fromEntries(Object.entries(failure.errors).map(([key, messages]) => [key, messages[0]]))
        setErrors(nextErrors)
        pendingFocusRef.current = Object.keys(nextErrors)[0] ?? null
      }
      setServerError(failure.message || "تعذّر إرسال الرسالة. حاول مرة أخرى أو تواصل معنا عبر واتساب.")
    } finally {
      requestRef.current = false
      setSending(false)
    }
  }
  return (
    <Container className="contact-page">
      <header data-motion-group className="contact-page-hero">
        <div>
          <span className="contact-eyebrow"><span /> تواصل مع AMTDEX SOFT</span>
          <h1 data-motion="rise">لنتحدث عن<br />مشروعك القادم.</h1>
          <div className="contact-hero-tag">فكرتك تبدأ بمحادثة <Icon name="sparkles" size={16} /></div>
          <p>لديك فكرة أو سؤال؟ اكتب لنا ما تحتاجه، أو اختر وسيلة التواصل التي تناسبك. سنساعدك على تحديد الخطوة التالية بوضوح.</p>
        </div>
        <div className="contact-hero-art" data-motion="vector"><span className="contact-art-orbit" aria-hidden="true" /><BrandArtwork kind="contact" /><span className="contact-art-note"><Icon name="code" size={18} /> من الفكرة إلى التنفيذ</span></div>
      </header>
      <div className="contact-page-grid">
        <form ref={formRef} onSubmit={handleSubmit}
          onBlur={event => { if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) updateField(event.target, true) }}
          onChange={event => { if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) updateField(event.target, false) }} noValidate className="contact-form-card" aria-labelledby="contact-form-title" aria-busy={sending}>
          <div className="contact-form-heading"><span className="contact-form-symbol"><Icon name="pen" size={21} /></span><div><h2 id="contact-form-title">أرسل رسالتك</h2><p>تفاصيل بسيطة تساعدنا على فهم احتياجك.</p></div></div>
          <div className="contact-form-progress"><div><span>لنبدأ بالتفاصيل</span><span>{completed} / 4 حقول مكتملة</span></div><div role="progressbar" aria-label="اكتمال البيانات المطلوبة" aria-valuemin={0} aria-valuemax={4} aria-valuenow={completed}><span style={{ width: `${completed * 25}%` }} /></div></div>
          {success && <div className="contact-feedback contact-feedback-success" role="status"><Icon name="check" size={20} /><div><strong>وصلتنا رسالتك بنجاح.</strong><p>شكرًا لتواصلك. سنرد عليك خلال ساعات العمل.</p></div></div>}
          {serverError && <div className="contact-feedback contact-feedback-error" role="alert"><Icon name="alertCircle" size={20} /><p>{serverError}</p></div>}
          <fieldset disabled={sending} className="contact-fields"><legend className="sr-only">بيانات التواصل والرسالة</legend>
            <div className="contact-field-pair">
              <Input id="c-name" name="name" label="الاسم الكامل" required autoComplete="name" placeholder="اسمك الكامل" error={errors.name} />
              <Input id="c-email" name="email" type="email" inputMode="email" label="البريد الإلكتروني" required autoComplete="email" placeholder="you@example.com" dir="ltr" error={errors.email} />
            </div>
            <div className="contact-field-pair">
              <div className="contact-phone-group">
                <SearchSelect id="c-phone-country" label="الدولة / مفتاح الاتصال" labelClassName="contact-country-label" title="اختر الدولة" searchPlaceholder="ابحث باسم الدولة أو مفتاحها" options={countryOptions} value={phoneCountry} onChange={code => {
                  const country = code as CountryCode
                  setPhoneCountry(country)
                  const field = formRef.current?.elements.namedItem("phone")
                  if (!(field instanceof HTMLInputElement) || !field.value.trim()) return
                  const result = createContactSchema(country).shape.phone.safeParse(field.value)
                  setErrors(previous => { const next = { ...previous }; if (result.success) delete next.phone; else next.phone = result.error.issues[0].message; return next })
                  setValidFields(previous => result.success ? [...new Set([...previous, "phone"])] : previous.filter(name => name !== "phone"))
                }} />
                <Input id="c-phone" name="phone" type="tel" inputMode="tel" label="رقم الهاتف" required autoComplete="tel" placeholder="اكتب رقم الهاتف" dir="ltr" error={errors.phone} />
                <p className="contact-phone-help">أدخل رقمًا محليًا للدولة المختارة، أو رقمًا دوليًا يبدأ بـ + أو 00.</p>
              </div>
              <SearchSelect id="c-subject" name="subject" label="كيف يمكننا مساعدتك؟" title="كيف يمكننا مساعدتك؟" placeholder="اختر موضوعًا (اختياري)" defaultValue="" error={errors.subject} options={subjectOptions} />
            </div>
            <div className="contact-message-wrap"><Textarea id="c-message" name="message" label="رسالتك" required rows={5} placeholder="ما الذي تريد تطويره؟ أخبرنا بفكرتك أو اكتب سؤالك هنا..." error={errors.message} /><div className="contact-message-hint"><span>10 أحرف على الأقل لتوضيح احتياجك.</span><span>{messageLength} حرفًا</span></div></div>
            <div className="contact-submit-row"><span>الحقول المعلّمة بـ * مطلوبة.</span><button type="submit" disabled={sending} className="contact-submit">{sending ? <>جارٍ الإرسال… <span className="contact-spinner" aria-hidden="true" /></> : <>إرسال الرسالة <Icon name="actionArrow" size={19} /></>}</button></div>
          </fieldset>
          <p className="contact-privacy"><Icon name="shield" size={16} /> نستخدم بياناتك للتواصل بشأن رسالتك.</p>
        </form>
        <aside className="contact-channels" aria-label="وسائل التواصل المباشر">
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="contact-whatsapp-card"><span className="contact-channel-icon"><Icon name="phone" size={24} /></span><div><small>تفضّل محادثة مباشرة؟</small><strong>تحدث معنا عبر واتساب</strong><span>أخبرنا بفكرتك وابدأ الحوار.</span></div><Icon name="actionArrow" size={20} /></a>
          <section className="contact-details-card"><span className="contact-card-kicker">نبقى على تواصل</span><h2>اختر طريقتك للتواصل</h2><div className="contact-method-list">{contacts.map(item => {
            const content = <><span className="contact-method-icon"><Icon name={item.icon} size={19} /></span><span className="contact-method-copy"><small>{item.label}</small><strong dir={item.ltr ? "ltr" : undefined}>{item.value}</strong></span>{item.href && <Icon name="actionArrow" size={15} />}</>
            return item.href ? <a key={item.label} href={item.href} target={item.href.startsWith("https:") ? "_blank" : undefined} rel={item.href.startsWith("https:") ? "noreferrer" : undefined} className="contact-method">{content}</a> : <div key={item.label} className="contact-method">{content}</div>
          })}</div></section>
          <section className="contact-next-card"><span className="contact-card-kicker">ما الخطوة التالية؟</span><h2>من رسالتك إلى خطة واضحة</h2><ol><li><span>01</span><div><strong>نفهم احتياجك</strong><p>نراجع الفكرة والتفاصيل التي شاركتها.</p></div></li><li><span>02</span><div><strong>نناقش الخيارات</strong><p>نتواصل معك لتحديد المتطلبات والخطوة القادمة.</p></div></li></ol></section>
          <section className="contact-hours"><Icon name="clock" size={19} /><div><h2>ساعات العمل والرد</h2><p>السبت — الخميس<br /><bdi>9:00 ص — 6:00 م</bdi> · توقيت مكة</p><small>خارج ساعات العمل، اترك رسالتك وسنراجعها عند عودتنا.</small></div></section>
        </aside>
      </div>
    </Container>
  )
}
