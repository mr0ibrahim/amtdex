import { Icon } from "@/components/ui/Icon"
import { useState } from "react"
import { TEAM } from "@/data/site"

export function AboutPage() {
  const [open, setOpen] = useState<number | null>(0)

  const faqs = [
    { q: "كم تستغرقون لتسليم موقع؟", a: "موقع تعريفي: 2 أسابيع. متجر/منصة: 4–8 أسابيع. نظام ERP: 8–16 أسبوع حسب النطاق." },
    { q: "هل تسلمون الكود المصدري؟", a: "نعم، 100% — على GitHub خاص بك مع توثيق ونشر." },
    { q: "هل تدعمون الاستضافة والصيانة؟", a: "نعم، باقات صيانة شهرية تشمل تحديثات، نسخ احتياطي، ومراقبة." },
    { q: "هل تعملون مع شركات خارج اليمن؟", a: "نعم، نعمل عن بُعد بكفاءة مع عملاء في الخليج والوطن العربي." },
  ]

  // R1 FAQ data — مطابق للمرجع (4 أسئلة جديدة)
  const faqData = [
    { q: "كم يستغرق بناء النظام؟", a: "المتاجر والأنظمة البسيطة 3-6 أسابيع، والأنظمة المؤسسية 8-16 أسبوع حسب النطاق. نعطيك خطة زمنية دقيقة بعد ورشة الاكتشاف." },
    { q: "هل تربطون أنظمتي الحالية؟", a: "نعم — نربط أنظمة ERP/CRM الحالية عبر APIs و Webhooks، ونحافظ على بياناتك دون انقطاع." },
    { q: "هل الكود والبيانات ملكي؟", a: "نعم 100% — الكود المصدري وقاعدة البيانات ملكك بالكامل، نسلّمها على GitHub خاص بك." },
    { q: "ماذا عن الدعم بعد الإطلاق؟", a: "ضمان 90 يوم، ودعم فني عربي 24/7، وتحديثات دورية — نرافقك بعد الإطلاق، لا نتركك." },
  ]
  // دمج الأسئلة القديمة مع الجديدة لإثراء الصفحة
  const allFaqs = [...faqData, ...faqs]

  return (
    <div className="bg-[var(--color-beige)]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div>
            <div className="text-[11px] font-bold tracking-[0.6px] text-[var(--color-primary)]">من نحن</div>
            <h1 className="mt-2 text-[32px] sm:text-[44px] font-bold tracking-[-0.04em] leading-tight text-[var(--color-ink)]">
              نبني برمجيات
              <br />
              تخدم الناس.
            </h1>
            <p className="mt-4 text-[14px] leading-7 text-[var(--color-text-muted)] max-w-[560px]">
              <span className="font-bold text-[var(--color-ink)]">Amtdex</span> وُلدت في صنعاء بهدف واحد: تحويل أفكار الشركات لمنتجات رقمية تعمل بكفاءة وتكبر معها. لا نبيع قوالب — نبني حلولاً مخصصة بمعايير عالمية وبفهم عميق للسوق اليمني والخليجي (أنظمة الفوترة، المدفوعات، وأكثر).
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "2026", l: "سنة التأسيس" },
                { v: "+120", l: "مشروع" },
                { v: "12", l: "عضو فريق" },
              ].map((x) => (
                <div key={x.l} className="bg-white border border-[var(--color-border)] rounded-2xl p-4 text-center">
                  <div className="text-[20px] font-bold text-[var(--color-ink)]">{x.v}</div>
                  <div className="text-[11px] text-[var(--color-text-faint)] mt-1">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[var(--color-ink)] text-white rounded-[28px] p-6 sm:p-8">
            <div className="text-[11px] tracking-[0.16em] text-white/40 font-semibold">قيمنا</div>
            <ul className="mt-4 space-y-4">
              {[
                { t: "الجودة أولاً", d: "كود نظيف، اختبارات، ومراجعة أقران — كل مرة." },
                { t: "السرعة بذكاء", d: "نسلم MVP سريعاً ثم نحسّن بناءً على بيانات حقيقية." },
                { t: "الشفافية", d: "تقرير أسبوعي، وصول للكود، ولا مفاجآت في الفاتورة." },
              ].map((v) => (
                <li key={v.t} className="flex gap-3">
                  <span className="size-7 rounded-full bg-white text-black grid place-items-center text-[10px] shrink-0 mt-0.5"><Icon name="check" size={16} /></span>
                  <div>
                    <div className="text-[13px] font-semibold">{v.t}</div>
                    <div className="text-[12px] leading-5 text-white/50 mt-1">{v.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-[20px] font-bold text-[var(--color-ink)]">الفريق</h2>
          <p className="text-[12px] text-[var(--color-text-faint)] mt-1">فريق صغير، خبرة كبيرة — نعمل كامتداد لفريقك.</p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM.map((m) => (
              <div key={m.n} className="bg-white border border-[var(--color-border)] rounded-[20px] p-5 text-center">
                <span className="size-12 rounded-full bg-[var(--color-ink)] text-white grid place-items-center text-[16px] font-bold mx-auto">{m.i}</span>
                <div className="mt-3 text-[13px] font-bold text-[var(--color-ink)]">{m.n}</div>
                <div className="text-[11px] text-[var(--color-text-faint)]">{m.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ — خلفية var(--color-beige) مثل المرجع + رسائل محسنة */}
      <div id="faq" className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        <div>
          <div className="text-[11px] font-bold tracking-[0.6px] text-[var(--color-primary)]">الأسئلة الشائعة</div>
          <h2 className="mt-2 text-[34px] leading-[39px] font-bold tracking-[-0.5px] text-[var(--color-ink)]">
            كل ما تريد
            <br />
            معرفته.
          </h2>
          <p className="mt-3 text-[13px] leading-6 text-[var(--color-text-muted)]">لم تجد إجابتك؟ تحدث مع مهندس حلول خلال دقائق.</p>
          <a href="mailto:hello@amtdex.com" className="mt-5 inline-flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-full px-5 py-3 text-[13px] font-bold text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors">
            <Icon name="mail" size={16} /> تواصل معنا الآن
          </a>
        </div>
        <div className="space-y-2.5">
          {allFaqs.map((f, i) => {
            const panelId = `faq-panel-${i}`
            const btnId = `faq-btn-${i}`
            const isOpen = open === i
            return (
              <div key={f.q} className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(7,11,26,0.04)]">
                <button
                  id={btnId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between gap-4 p-5 text-right"
                >
                  <span className="text-[13.5px] font-bold text-[var(--color-ink)]">{f.q}</span>
                  <span className={`size-7 rounded-full grid place-items-center text-[14px] shrink-0 transition-colors ${isOpen ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-beige)] text-[var(--color-ink)]"}`}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div id={panelId} role="region" aria-labelledby={btnId} className="px-5 pb-5 text-[12.5px] leading-[23px] text-[var(--color-text-muted)]" style={{ animation: "fadeIn 0.2s ease" }}>
                    {f.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
