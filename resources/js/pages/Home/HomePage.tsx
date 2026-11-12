import { useState, type ReactNode } from "react"
import { PublicLink as Link } from "@/cms/PublicLink"
import { Icon } from "@/components/ui/Icon"
import { Marquee } from "@/components/ui/Marquee"
import { Testimonials } from "./Testimonials"
import { API } from "@/lib/api"
import { newsletterSchema, zodErrors } from "@/lib/schemas"
import { addLead } from "@/lib/leadStore"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { LOGOS } from "@/data/site"
import { useClientsQuery, useServicesQuery } from "@/lib/queries"
import { FinalCTA } from "@/pages/Home/FinalCTA"
import { GuaranteeBanner } from "@/pages/Home/GuaranteeBanner"
import { OrbitSection } from "@/pages/Home/OrbitSection"
import { ScreenGallery } from "./ScreenGallery"
import { useCms, useSection } from "@/cms/useCms"
import { SpotlightSection } from "@/pages/Home/SpotlightSection"
import { StatsBand } from "@/pages/Home/StatsBand"
import { WorkflowSection } from "@/pages/Home/WorkflowSection"

export function HomePage({ onToast }: { onToast: (m: string) => void }) {
  const { data: apiServices } = useServicesQuery()
  const services = (apiServices && apiServices.length > 0) ? apiServices : SEED_SERVICES
  const { data: dbClients } = useClientsQuery()
  const [email, setEmail] = useState("")
  const [err, setErr] = useState("")
  const logos = (dbClients && dbClients.length > 0 ? dbClients : LOGOS) as Array<string | { id?: string; name?: string; logo?: string }>
  const { homeSections, staff } = useCms()
  const hero = useSection("hero").fields
  const why = useSection("services").fields
  const news = useSection("newsletter").fields
  const band = useSection("marquee").fields
  const gate = (id: string, node: ReactNode) => {
    const index = homeSections.findIndex((section) => section.id === id)
    const section = homeSections[index]
    if (section && !section.visible && !staff) return null
    return <div style={{ order: index < 0 ? 0 : index }} className={section && !section.visible ? "home-hidden-preview" : undefined}>{node}</div>
  }

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = newsletterSchema.safeParse({ email })
    if (!parsed.success) {
      setErr(zodErrors(parsed).email ?? "بريد غير صالح")
      return
    }
    setErr("")
    API.newsletter(email).then(() => {
      addLead({ id: Date.now().toString(), name: email.split("@")[0], email, message: "اشتراك نشرة", status: "جديد", createdAt: new Date().toISOString(), source: "newsletter", meta: {} })
      onToast("تم الاشتراك — أهلاً بك في Amtdex ✨")
    })
    setEmail("")
  }

  return (
    <div className="home-stack">
      {gate("hero", <section data-motion-group className="page-container page-container--wide da-hero">
        <div>
          <div className="da-hero-copy">
            <p data-motion="rise" className="da-kicker">{hero.kicker}</p>
            <h1 data-motion="rise" data-motion-delay="140" className="mt-4 text-[34px] sm:text-[68px] leading-[1.15] font-semibold text-[var(--color-ink)]">
              {hero.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
            </h1>
            <p data-motion="rise" data-motion-delay="280" className="mt-4 text-[16px] leading-8 text-[var(--color-text-muted)] max-w-[34rem]">
              {hero.lede}
            </p>
            <div data-motion="rise" data-motion-delay="420" className="hero-actions">
              <Link to="/quote" className="btn btn-ink brand-cta">{hero.cta}</Link>
              <Link to="/portfolio" className="btn btn-line brand-cta">
                <Icon name="play" size={14} /> {hero.cta2}
              </Link>
            </div>
            <p data-motion="rise" data-motion-delay="560" className="da-proof text-[13px] text-[var(--color-text-muted)]">
              <span className="text-[var(--color-gold)]">★★★★★</span> {hero.proof}
            </p>
          </div>

          <div data-motion="rise" data-motion-delay="200" className="da-app">
            <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
              <span className="text-[12px] font-semibold">لوحة التحكم</span>
              <span data-motion="signal" data-motion-delay="700" className="inline-flex items-center gap-2 text-[11px] font-semibold">
                <span className="status-dot" /> النظام مباشر الآن
              </span>
            </div>
            <div className="grid sm:grid-cols-[160px_1fr]">
              <div className="hidden sm:flex flex-col gap-1 p-4 border-l border-[var(--color-border)] bg-[var(--color-bg)]">
                <div className="text-[10px] font-semibold text-[var(--color-text-faint)]">المشاريع</div>
                <div className="mt-2 bg-[var(--color-ink)] text-white px-3 py-2 text-[12px] font-semibold">لوحة المبيعات</div>
                <div className="px-3 py-2 text-[12px] text-[var(--color-text-muted)]">تحليل العملاء</div>
                <div className="px-3 py-2 text-[12px] text-[var(--color-text-muted)]">حملات التسويق</div>
                <div className="mt-auto border border-[var(--color-border)] p-3 text-[11px] leading-5">
                  <div className="font-semibold text-[var(--color-ink)]">الخطة الاحترافية</div>
                  <div className="text-[var(--color-text-muted)] mt-1">احصل على تحليلات متقدمة بلا حدود</div>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex flex-col gap-4">
                <div className="da-metrics">
                  {[
                    ["الإيرادات", "﷼ 284,500", "+12.4%"],
                    ["العملاء", "1,842", "+8.1%"],
                    ["المهام", "96%", "مكتملة"],
                  ].map(([label, value, note], index) => (
                    <div key={label} data-motion="signal" data-motion-delay={400 + index * 110} className="bg-[var(--color-surface)] p-3">
                      <div className="text-[11px] text-[var(--color-text-muted)]">{label}</div>
                      <div className="mt-2 text-[16px] sm:text-[18px] font-semibold">{value}</div>
                      <div className="mt-1 text-[11px] text-[var(--color-success)]">{note}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold">نمو المبيعات — آخر 6 أشهر</span>
                    <span className="text-[var(--color-text-muted)]">الإيرادات</span>
                  </div>
                  <div className="mt-4 flex items-end gap-2 h-[96px]">
                    {[
                      { h: 40, label: "ينا" },
                      { h: 68, label: "فبر" },
                      { h: 52, label: "مار" },
                      { h: 88, label: "أبر" },
                      { h: 72, label: "ماي" },
                      { h: 88, label: "يون", active: true },
                    ].map((b, index) => (
                      <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5">
                        <div data-motion="bar" data-motion-delay={650 + index * 100} className={`w-full ${b.active ? "bg-[var(--color-ink)]" : "bg-[var(--color-ink)]/15"}`} style={{ height: b.h }} />
                        <span className="text-[10px] text-[var(--color-text-faint)]">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[12px] border-t border-[var(--color-border)] pt-3">
                  النظام يعمل الآن
                  <span className="block text-[var(--color-ink)] mt-1">مباشر وجاهز للاستخدام</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>)}

      {gate("marquee", <section data-motion-group className="border-y border-[var(--color-border)]">
        <div className="page-container page-container--wide py-4 flex items-center justify-between gap-6">
          <p data-motion="fade" className="text-[12px] font-semibold text-[var(--color-text-muted)] shrink-0">{band.label}</p>
        </div>
        <Marquee label="أسماء الشركاء">
          {logos.map((l, idx) => {
            const key = typeof l === "string" ? l : (l.id || l.name || String(idx))
            const name = typeof l === "string" ? l : l.name
            return (
              <span key={key} className="marquee-item">
                {typeof l !== "string" && l.logo ? <img src={l.logo} alt={name || ""} className="h-5 inline-block" /> : name}
              </span>
            )
          })}
        </Marquee>
        <div className="h-6" />
        <Marquee label="الخدمات" duration={55}>
          {services.map((s) => (
            <span key={s.slug} className="marquee-item">{s.title}</span>
          ))}
        </Marquee>
        <div className="h-6" />
      </section>)}

      {gate("stats", <StatsBand />)}
      {gate("gallery", <ScreenGallery />)}
      {gate("spotlight", <SpotlightSection />)}
      {gate("workflow", <WorkflowSection />)}
      {gate("orbit", <OrbitSection />)}
      {gate("guarantee", <GuaranteeBanner />)}

      {gate("services", <section data-motion-group className="page-container page-container--wide page-section">
        <div className="grid lg:grid-cols-[1fr_18rem] gap-10 items-end border-b border-[var(--color-ink)] pb-8">
          <div>
            <div className="eyebrow">{why.kicker}</div>
            <h2 data-motion="rise" data-motion-delay="120" className="mt-4 text-[32px] sm:text-[44px] leading-[1.2] font-semibold">
              {why.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
            </h2>
          </div>
          <div data-motion="rise" data-motion-delay="240">
            <p className="text-[14px] leading-7 text-[var(--color-text-muted)]">{why.lede}</p>
            <Link to="/services" className="mt-4 inline-flex text-[13px] font-semibold border-b border-[var(--color-ink)] pb-0.5">{why.link}</Link>
          </div>
        </div>
        <div className="da-svc">
          {services.slice(0, 4).map((s, index) => (
            <Link key={s.slug} to={`/services/${s.slug}`} data-motion="rise" data-motion-delay={index * 120}>
              <span>
                <b>{s.title}</b>
                {s.slug === "web" && <small>الأكثر طلبًا</small>}
                {s.slug === "erp" && <small>لأعمال أكثر كفاءة</small>}
                <small>{s.desc}</small>
              </span>
              <span>اكتشف الخدمة</span>
            </Link>
          ))}
        </div>
        <div className="mt-12 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <div data-motion="rise" className="bg-[var(--color-ink)] text-white p-7 sm:p-9">
            <span className="text-[11px] tracking-[0.16em] text-white/60">من الفكرة إلى الإطلاق</span>
            <h3 className="mt-4 text-[28px] font-semibold leading-tight">
              تجربة واضحة،
              <br />
              من أول زيارة.
            </h3>
            <p className="mt-4 text-[14px] leading-7 text-white/70 max-w-[36rem]">
              نصمم الرحلة، نبني المنتج، ونسلّمه جاهزاً لفريقك — بمظهر ثابت وأداء يخدم عملاءك.
            </p>
          </div>
          <div data-motion="rise" data-motion-delay="160">
            <Testimonials />
          </div>
        </div>
      </section>)}

      {gate("cta", <FinalCTA onToast={onToast} />)}

      {gate("newsletter", <section data-motion-group className="page-container page-container--wide pb-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start border border-[var(--color-ink)] p-6 sm:p-10">
          <div>
            <h2 data-motion="rise" className="text-[32px] sm:text-[42px] font-semibold leading-[1.2]">
              {news.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
            </h2>
            <p data-motion="rise" data-motion-delay="140" className="mt-4 text-[15px] leading-8 text-[var(--color-text-muted)] max-w-[36rem]">
              {news.lede}
            </p>
            <div data-motion="rise" data-motion-delay="260" className="mt-6 flex flex-wrap gap-3">
              <Link to="/quote" className="btn btn-ink brand-cta">اطلب عرض سعر</Link>
              <Link to="/contact" className="btn btn-line brand-cta">تحدث معنا</Link>
            </div>
            <p className="mt-5 text-[12px] text-[var(--color-text-muted)]">رد خلال ساعات · استشارة مجانية · عقد واضح</p>
          </div>
          <form onSubmit={handleSub} noValidate data-motion="rise" data-motion-delay="180" className="border-t lg:border-t-0 lg:border-r border-[var(--color-border)] lg:pr-10 pt-8 lg:pt-0">
            <div className="text-[14px] font-semibold">نشرة Amtdex</div>
            <div className="text-[13px] text-[var(--color-text-muted)] mt-1 leading-6">نصائح تقنية، قصص مشاريع، وعروض — رسالة واحدة أسبوعياً.</div>
            <label htmlFor="home-email" className="sr-only">البريد الإلكتروني</label>
            <input
              id="home-email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (err) setErr("")
              }}
              placeholder="بريدك الإلكتروني"
              type="email"
              aria-invalid={!!err}
              aria-describedby={err ? "home-email-err" : undefined}
              className={`mt-5 w-full bg-[var(--input-bg)] text-[var(--input-text)] border px-3 py-3 text-[14px] outline-none placeholder:text-[var(--placeholder)] ${err ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
            />
            {err && (
              <p id="home-email-err" role="alert" className="mt-2 text-[12px] text-[var(--danger)]">{err}</p>
            )}
            <button type="submit" className="btn btn-ink brand-cta mt-5">اشتراك</button>
          </form>
        </div>
      </section>)}
    </div>
  )
}
