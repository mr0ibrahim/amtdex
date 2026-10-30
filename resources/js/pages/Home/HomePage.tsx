import { useState } from "react"
import { useBrandMotion } from "@/hooks/useBrandMotion"
import { ScreenGallery } from "./ScreenGallery"
import { Link } from "react-router-dom"
import { ServiceCard } from "@/components/ui/ServiceCard"
import { Icon } from "@/components/ui/Icon"
import { Testimonials } from "./Testimonials"
import { API } from "@/lib/api"
import { newsletterSchema, zodErrors } from "@/lib/schemas"
import { addLead } from "@/lib/leadStore"
import { useServices } from "@/lib/contentStore"
import { LOGOS } from "@/data/site"
import { useClientsQuery } from "@/lib/queries"
import { FinalCTA } from "@/pages/Home/FinalCTA"
import { GuaranteeBanner } from "@/pages/Home/GuaranteeBanner"
import { OrbitSection } from "@/pages/Home/OrbitSection"
import { SpotlightSection } from "@/pages/Home/SpotlightSection"
import { StatsBand } from "@/pages/Home/StatsBand"
import { WorkflowSection } from "@/pages/Home/WorkflowSection"

export function HomePage({ onToast }: { onToast: (m: string) => void }) {
  const services = useServices()
  const { data: dbClients } = useClientsQuery()
  const motionRef = useBrandMotion()
  const [email, setEmail] = useState("")
  const [err, setErr] = useState("")

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
    <div ref={motionRef} className="brand-motion">
      {/* HERO — R2: gradient uses var(--gradient-hero), responsive container */}
      <section data-motion-group className="mx-auto max-w-[1280px] xl:max-w-[1440px] px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 pb-10" style={{ background: "var(--gradient-hero)" }}>
        <div className="grid lg:grid-cols-[minmax(0,600px)_1fr] gap-6 sm:gap-8 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EEF3FF] border border-[var(--color-outline-peach)] rounded-full px-3 py-1.5 text-[11px] font-semibold text-[var(--color-primary)]">
              <span className="size-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              AMTDEX — شريكك للتحول الرقمي والحلول البرمجية
              <span className="text-[var(--color-primary)]"><Icon name="sparkles" size={14} /></span>
            </div>
            <h1 data-motion="rise" className="mt-5 text-[32px] sm:text-[48px] lg:text-[58px] leading-[1.15] sm:leading-[67px] font-bold tracking-[-0.8px] text-[var(--color-ink)]">
              نحوّل أفكارك
              <br />
              إلى برمجيات تنمو.
            </h1>
            <p data-motion="rise" data-motion-delay="140" className="mt-4 text-[15px] leading-7 text-[var(--color-text-muted)] max-w-[500px]">شركة برمجيات يمنية نطوّر أنظمة مخصصة، تطبيقات جوال، ومنصات سحابية — من الفكرة إلى الإطلاق والدعم، بجودة مؤسسية وسرعة تنفيذ.</p>
            <div data-motion="rise" data-motion-delay="260" className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/quote" className="brand-cta inline-flex items-center gap-2.5 text-white font-bold text-[15px] px-5 sm:px-7 py-3 sm:py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_8px_20px_rgba(40,16,113,0.25)]" style={{ background: "var(--gradient-primary)" }}>
                اطلب استشارة مجانية
                <span className="size-[26px] rounded-full bg-white text-[var(--color-primary)] grid place-items-center text-[14px]">←</span>
              </Link>
              <Link to="/portfolio" className="inline-flex items-center gap-2 bg-white border border-[var(--color-border)] font-semibold text-[13.5px] px-[22px] py-[15px] rounded-full hover:bg-[var(--color-lavender)] transition-colors shadow-[0_4px_12px_rgba(7,11,26,0.04)]">
                <span className="text-[14px]"><Icon name="play" size={15} /></span> استعرض أعمالنا
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3.5 pt-3.5">
              <div className="flex -space-x-2 space-x-reverse">
                <img src="https://i.pravatar.cc/80?img=12" alt="عميل" width={32} height={32} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="size-8 rounded-full border-2 border-white object-cover" />
                <img src="https://i.pravatar.cc/80?img=33" alt="عميل" width={32} height={32} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="size-8 rounded-full border-2 border-white object-cover" />
                <span className="size-8 rounded-full bg-[var(--color-ink)] border-2 border-white grid place-items-center text-[9px] font-bold text-white">+2k</span>
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-amber-400" aria-label="5 نجوم">{Array.from({ length: 5 }, (_, i) => <Icon key={i} name="star" size={12} fill="currentColor" />)}</div>
                <div className="text-[12px] font-medium text-[var(--color-text-muted)]">4.9/5 من 300+ عميل في الخليج يثقون بنا</div>
              </div>
            </div>
          </div>

          {/* Visual — dashboard mockup R1: F0EDE7 stats, floating code, Live badge / Orbs */}
          <div className="relative">
            {/* Orbs */}
            <div className="hidden lg:block absolute -top-10 -right-10 size-[280px] bg-[var(--color-primary)]/[0.06] blur-[20px] rounded-full pointer-events-none" />
            <div className="hidden lg:block absolute top-10 right-10 size-[200px] bg-[var(--color-primary)]/[0.04] blur-[15px] rounded-full pointer-events-none" />

            {/* Live Badge */}
            <div data-motion="signal" data-motion-delay="1500" className="hidden sm:flex absolute -top-3 left-6 z-10 items-center gap-2 bg-white border border-[var(--color-border)] rounded-full px-3 py-2 shadow-[0_8px_16px_rgba(7,11,26,0.08)]">
              <span className="size-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span className="text-[11px] font-bold text-[var(--color-ink)]">النظام مباشر الآن</span>
              <span className="bg-[var(--color-success-bg)] text-[var(--color-success)] text-[10px] font-bold px-2 py-0.5 rounded-full">1.2k+ مستخدم</span>
            </div>

            <div data-motion="rise" data-motion-delay="180" className="relative bg-white rounded-[24px] border border-[var(--color-border)] shadow-[0_24px_48px_rgba(7,11,26,0.1)] overflow-hidden mt-4">
              <div className="h-[43px] flex items-center justify-between px-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="size-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="size-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-white border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-[11px] font-bold text-[var(--color-ink)]">لوحة التحكم</span>
                  <span className="text-[11px] text-[var(--color-text-muted)] px-2">التحليلات</span>
                  <span className="text-[11px] text-[var(--color-text-muted)] px-2">الأتمتة</span>
                </div>
                <span className="text-[var(--color-text-faint)] text-[16px]">⋯</span>
              </div>
              <div className="grid sm:grid-cols-[179px_1fr] min-h-0 sm:min-h-[380px]">
                <div className="hidden sm:flex flex-col gap-1 p-4 bg-[var(--color-bg)] border-l border-[var(--color-border)]">
                  <div className="text-[10px] font-bold tracking-[0.5px] text-[var(--color-text-faint)] text-right">المشاريع</div>
                  <div className="mt-1 flex items-center gap-2.5 bg-[var(--color-ink)] text-white rounded-[10px] px-2.5 py-2.5">
                    <span className="size-2 rounded-full bg-[var(--color-accent)]" />
                    <span className="text-[12px] font-semibold">لوحة المبيعات</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-2 text-[var(--color-text-muted)] text-[12px]">
                    <span className="size-2 rounded-full bg-[var(--color-text-muted)]" />
                    تحليل العملاء
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-2 text-[var(--color-text-muted)] text-[12px]">
                    <span className="size-2 rounded-full bg-[var(--color-text-muted)]" />
                    حملات التسويق
                  </div>
                  <div className="flex-1" />
                  <div className="bg-[var(--color-primary)] rounded-2xl p-3.5">
                    <div className="text-white text-[11px] font-bold">الخطة الاحترافية</div>
                    <div className="text-white/90 text-[11px] leading-[15px] mt-1">احصل على تحليلات متقدمة بلا حدود</div>
                    <div className="mt-2 bg-white text-[var(--color-primary)] text-[11px] font-bold text-center py-2 rounded-full">ترقية الآن</div>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-4 bg-white">
                  <div className="grid grid-cols-3 gap-3">
                    <div data-motion="signal" data-motion-delay="400" className="bg-[var(--color-beige)] border border-[var(--color-border)] rounded-2xl p-3.5">
                      <div className="text-[11px] font-semibold text-[var(--color-text-muted)]">الإيرادات</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[18px] font-extrabold text-[var(--color-ink)]">﷼ 284,500</span>
                        <span className="bg-[var(--color-success-bg)] text-[var(--color-success)] text-[10px] font-bold px-2 py-1 rounded-full">+12.4%</span>
                      </div>
                    </div>
                    <div data-motion="signal" data-motion-delay="510" className="bg-[var(--color-beige)] border border-[var(--color-border)] rounded-2xl p-3.5">
                      <div className="text-[11px] font-semibold text-[var(--color-text-muted)]">العملاء</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[18px] font-extrabold text-[var(--color-ink)]">1,842</span>
                        <span className="bg-[var(--color-success-bg)] text-[var(--color-success)] text-[10px] font-bold px-2 py-1 rounded-full">+8.1%</span>
                      </div>
                    </div>
                    <div data-motion="signal" data-motion-delay="620" className="bg-[var(--color-beige)] border border-[var(--color-border)] rounded-2xl p-3.5">
                      <div className="text-[11px] font-semibold text-[var(--color-text-muted)]">المهام</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[18px] font-extrabold text-[var(--color-ink)]">96%</span>
                        <span className="bg-[var(--color-success-bg)] text-[var(--color-success)] text-[10px] font-bold px-2 py-1 rounded-full">مكتملة</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[var(--color-ink)]">نمو المبيعات — آخر 6 أشهر</span>
                      <span className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
                        <span className="size-2 rounded-full bg-[var(--color-primary)]" /> الإيرادات
                      </span>
                    </div>
                    <div className="mt-4 flex items-end gap-2 h-[88px]">
                      {[
                        { h: 40, label: "ينا" },
                        { h: 68, label: "فبر" },
                        { h: 52, label: "مار" },
                        { h: 88, label: "أبر" },
                        { h: 72, label: "ماي" },
                        { h: 88, label: "يون", active: true },
                      ].map((b, index) => (
                        <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5">
                          <div data-motion="bar" data-motion-delay={650 + index * 100} className={`w-full rounded-t-lg ${b.active ? "bg-[var(--color-primary)]" : "bg-[var(--color-ink)] opacity-[0.12]"}`} style={{ height: b.h }} />
                          <span className="text-[10px] text-[var(--color-text-faint)]">{b.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Code */}
            <div data-motion="rise" data-motion-delay="1750" className="hidden sm:flex absolute -left-2 bottom-6 z-10 flex-col gap-1.5 bg-[var(--color-ink)] border border-[var(--color-border-strong)] rounded-[14px] p-3 w-[200px] shadow-[0_12px_24px_rgba(7,11,26,0.2)]">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-[#FF5F56]" />
                  <span className="size-1.5 rounded-full bg-[#FFBD2E]" />
                  <span className="size-1.5 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[9px] font-mono text-[var(--color-text-faint)]">api.ts</span>
              </div>
              <div className="text-[10px] font-mono font-semibold text-white">await amtdex.deploy()</div>
              <div className="text-[9px] font-mono text-[#7DD3A0]">✓ Deployed in 1.2s — Live</div>
            </div>
          </div>
        </div>

        {/* R1: Logos Band — opacity 0.18 + gradient */}
        <div className="mt-10 border-y border-[var(--color-border)] py-6 bg-gradient-to-l from-white to-[var(--color-bg)]">
          <div className="text-[11px] tracking-[0.4px] text-[var(--color-text-faint)] font-semibold text-center">شركاؤنا في التحول الرقمي — من صنعاء إلى المنطقة</div>
          <div className="mt-3 flex flex-wrap justify-between gap-4">
            {(dbClients && dbClients.length > 0 ? dbClients : LOGOS).map((l: any, idx: number) => (
              <span key={typeof l === "string" ? l : (l.id || idx)} className="text-[14px] font-extrabold tracking-[-0.5px] text-[var(--color-ink)] opacity-[0.18] inline-flex items-center gap-1.5">
                {typeof l === "string" ? l : (l.logo ? <img src={l.logo} alt={l.name} className="h-5 inline-block opacity-60 grayscale" /> : l.name)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* R1 Sections — 8 أقسام مرجعية مدمجة بنفس الترتيب الاستراتيجي */}
      <StatsBand />
      <ScreenGallery />
      <SpotlightSection />
      <WorkflowSection />
      <OrbitSection />

      <GuaranteeBanner />

      {/* Services preview — محدث بهوية R2 */}
      <section className="mx-auto max-w-[1280px] xl:max-w-[1440px] px-4 sm:px-6 lg:px-10 py-10 sm:py-16" style={{ background: "var(--gradient-card)" }}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-bold tracking-[0.6px] text-[var(--color-primary)]">لماذا AMTDEX</div>
            <div className="mt-2 w-10 h-0.5 bg-[var(--color-primary)] rounded-full" />
            <h2 className="mt-3 text-[28px] sm:text-[38px] leading-[1.15] sm:leading-[44px] font-bold tracking-[-0.5px] text-[var(--color-ink)]">
              حلول برمجية
              <br />
              مصممة لنموك.
            </h2>
          </div>
          <div className="max-w-[360px]">
            <p className="text-[14px] leading-[26px] text-[var(--color-text-muted)]">لا نبيع قوالب جاهزة. نحلل عملك، نصمم الحل، ونبنيه ليخدمك لسنوات — آمن، قابل للتوسع، وسهل الاستخدام.</p>
            <Link to="/services" className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-ink)] hover:text-[var(--color-primary)] transition-colors">
              تعرّف على خدماتنا ←
            </Link>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {services.slice(0, 4).map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
        <div className="mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="bg-[var(--color-ink)] text-white rounded-[28px] p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute -right-20 -top-20 size-[280px] bg-white/10 blur-[50px] rounded-full pointer-events-none" />
            <div className="relative">
              <span className="inline-flex text-[10px] tracking-[0.18em] font-semibold text-white/50 border border-white/10 rounded-full px-3 py-1">جاهز للربط مع Laravel</span>
              <h3 className="mt-4 text-[22px] sm:text-[26px] font-bold leading-tight">
                واجهات جاهزة،
                <br />
                بنية API نظيفة.
              </h3>
              <p className="mt-3 text-[13px] leading-6 text-white/60 max-w-[420px]">
                كل فورم يحمل <code className="bg-white/10 px-1.5 py-0.5 rounded text-white">name</code> صحيح، وكل استدعاء API موثق في <code className="bg-white/10 px-1.5 py-0.5 rounded text-white">src/lib/api.ts</code> — بدّل الرابط واربط Laravel Sanctum مباشرة.
              </p>
              <Link to="/dashboard" className="mt-6 inline-flex bg-white text-black font-semibold text-[13px] px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
                استعرض لوحة التحكم التجريبية ←
              </Link>
            </div>
          </div>
          <Testimonials />
        </div>
      </section>

      <FinalCTA onToast={onToast} />

      {/* CTA + newsletter */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="bg-[var(--color-ink)] rounded-[32px] p-6 sm:p-10 lg:p-12 overflow-hidden relative">
          <div className="absolute -left-20 -bottom-20 size-[420px] bg-white/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <h2 className="text-white text-[28px] sm:text-[36px] font-bold tracking-[-0.04em] leading-tight">
                عندك فكرة؟
                <br />
                نحوّلها لمنتج.
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-white/60 max-w-[460px]">احجز استشارة مجانية 30 دقيقة — نرسم خارطة طريق، نقدّر التكلفة، ونبدأ خلال أيام.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/quote" className="bg-white text-black font-semibold text-[13px] px-7 py-3 rounded-full hover:bg-white/90 transition-colors">
                  اطلب عرض سعر ←
                </Link>
                <Link to="/contact" className="border border-white/15 text-white font-medium text-[13px] px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors">
                  تحدث معنا
                </Link>
              </div>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-white/40">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> رد خلال ساعات
                </span>
                <span>•</span>
                <span>استشارة مجانية</span>
                <span>•</span>
                <span>عقد واضح</span>
              </div>
            </div>
            <form onSubmit={handleSub} noValidate className="bg-white rounded-[20px] p-5 sm:p-6">
              <div className="text-[12px] font-bold">نشرة Amtdex</div>
              <div className="text-[11px] text-[var(--color-text-faint)] mt-1">نصائح تقنية، قصص مشاريع، وعروض — رسالة واحدة أسبوعياً.</div>
              <label htmlFor="home-email" className="sr-only">
                البريد الإلكتروني
              </label>
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
                className={`mt-4 w-full bg-[var(--color-bg)] border rounded-full px-4 py-3 text-[13px] outline-none placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-ink)]/20 ${err ? "border-red-400" : "border-[var(--color-border)]"}`}
              />
              {err && (
                <p id="home-email-err" role="alert" className="mt-2 text-[11px] text-red-500">
                  {err}
                </p>
              )}
              <button type="submit" className="mt-3 w-full text-white rounded-full py-3 text-[13px] font-semibold hover:opacity-90 transition-opacity" style={{ background: "var(--gradient-primary)" }}>
                اشتراك
              </button>
              <p className="mt-2 text-[10px] text-center text-[var(--color-text-faint)]">POST /api/newsletter — جاهز للربط مع Laravel</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
