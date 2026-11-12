import { useState } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Icon } from "@/components/ui/Icon"
import { Input, Select, Textarea } from "@/components/ui/Input"
import { API } from "@/lib/api"

const PHONES = [
  { label: "+967 784 440 429", href: "tel:+967784440429" },
  { label: "+967 784 440 428", href: "tel:+967784440428" },
]

export function ContactPage({ onToast }: { onToast?: (m: string) => void }) {
  void onToast
  const email = "Info@amtdex.com"
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "web", message: "" })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    try {
      const body = new FormData()
      body.set("name", form.name)
      body.set("email", form.email)
      body.set("phone", form.phone)
      body.set("subject", form.subject)
      body.set("message", form.message)
      await API.contact(body)
      setSent(true)
    } catch {
      setError("تعذّر إرسال الرسالة. حاول مرة أخرى، أو راسلنا على واتساب.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="da-page">
      <PageHeader
        eyebrow="تواصل"
        title={<>لنبدأ<br />مشروعك.</>}
        description="من الفكرة إلى التنفيذ. راسلنا وسنعود إليك."
      />

      <div className="da-grid-2">
        <form onSubmit={submit} className="da-panel da-form">
          {sent ? (
            <div>
              <h2>وصلت رسالتك.</h2>
              <p className="da-lede">سنعود إليك على البريد أو الهاتف الذي كتبته.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <h2 className="text-[18px] font-bold text-[var(--color-ink)]">أرسل رسالتك</h2>
              <Input id="c-name" label="الاسم" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input id="c-email" type="email" label="البريد" required dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input id="c-phone" type="tel" label="الهاتف" required dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Select id="c-subject" label="الخدمة" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                <option value="web">تصميم وبرمجة المواقع</option>
                <option value="mobile">تطبيقات الجوال</option>
                <option value="stores">المتاجر الإلكترونية</option>
                <option value="admin-systems">أنظمة الإدارة</option>
                <option value="identity">الهوية البصرية</option>
                <option value="security">حماية المواقع والأنظمة</option>
              </Select>
              <Textarea id="c-message" label="الرسالة" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {error && <p role="alert" className="text-[13px] text-[var(--color-danger)]">{error}</p>}
              <button type="submit" disabled={sending} className="btn btn-ink brand-cta">{sending ? "جارٍ الإرسال" : "أرسل الرسالة"}</button>
            </div>
          )}
        </form>

        <aside style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <article className="da-panel">
            <p className="da-kicker">الهاتف وواتساب</p>
            {PHONES.map((phone) => (
              <a key={phone.href} href={phone.href} className="flex items-center gap-2 mt-3 font-semibold" dir="ltr">
                <Icon name="phone" size={16} /> {phone.label}
              </a>
            ))}
            <a href="https://wa.me/967784440429" className="btn btn-gold brand-cta" style={{ marginTop: 16 }}>واتساب</a>
          </article>
          <article className="da-panel">
            <p className="da-kicker">البريد</p>
            <a href={`mailto:${email}`} className="flex items-center gap-2 mt-3 font-semibold" dir="ltr">
              <Icon name="mail" size={16} /> {email}
            </a>
          </article>
          <article className="da-panel">
            <p className="da-kicker">الموقع</p>
            <p className="flex items-center gap-2 mt-3 font-semibold"><Icon name="mapPin" size={16} /> اليمن - إب</p>
          </article>
          <article className="da-panel">
            <p className="da-kicker">إنستغرام</p>
            <a href="https://www.instagram.com/amtdex/" className="mt-3 inline-flex font-semibold" dir="ltr">instagram.com/amtdex</a>
          </article>
        </aside>
      </div>
    </div>
  )
}
