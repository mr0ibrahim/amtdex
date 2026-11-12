import { Icon } from "@/components/ui/Icon"
import { useState } from "react"
import { TEAM as FALLBACK_TEAM } from "@/data/site"
import { useTeamQuery, useFaqsQuery } from "@/lib/queries"

export function AboutPage() {
  const [open, setOpen] = useState<number | null>(0)
  const { data: apiTeam } = useTeamQuery()
  const { data: apiFaqs } = useFaqsQuery()

  const defaultFaqs = [
    { q: "كم يستغرق بناء النظام؟", a: "المتاجر والأنظمة البسيطة 3-6 أسابيع، والأنظمة المؤسسية 8-16 أسبوع حسب النطاق. نعطيك خطة زمنية دقيقة بعد ورشة الاكتشاف." },
    { q: "هل تربطون أنظمتي الحالية؟", a: "نعم — نربط أنظمة ERP/CRM الحالية عبر APIs و Webhooks، ونحافظ على بياناتك دون انقطاع." },
    { q: "هل الكود والبيانات ملكي؟", a: "نعم 100% — الكود المصدري وقاعدة البيانات ملكك بالكامل، نسلّمها على GitHub خاص بك." },
    { q: "ماذا عن الدعم بعد الإطلاق؟", a: "ضمان 90 يوم، ودعم فني عربي 24/7، وتحديثات دورية — نرافقك بعد الإطلاق، لا نتركك." },
  ]

  const allFaqs = (apiFaqs && apiFaqs.length > 0)
    ? apiFaqs.map((f: any) => ({ q: f.question, a: f.answer }))
    : defaultFaqs

  const team = (apiTeam && apiTeam.length > 0)
    ? apiTeam.map((m: any) => {
        const name = m.name || m.n || ""
        return {
          n: name,
          r: m.role || m.r || "",
          i: name.slice(0, 1) || m.i || "أ",
          avatar: m.avatar,
        }
      })
    : FALLBACK_TEAM

  return (
    <div>
      <div data-motion-group className="page-container page-section">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div>
            <div className="eyebrow">من نحن</div>
            <h1 data-motion="rise" data-motion-delay="120" className="mt-4 text-[36px] sm:text-[56px] font-semibold leading-[1.15] text-[var(--color-ink)]">
              امتدكس سوفت
              <br />
              للبرمجيات وتقنية المعلومات والأنظمة.
            </h1>
            <p className="mt-4 text-[14px] leading-7 text-[var(--color-text-muted)] max-w-[560px]">
              نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو. نرحّب بكم في امتدكس سوفت، حيث تلتقي الأفكار بالتقنية، وتتحول الطموحات إلى مشاريع قابلة للتحقيق.
            </p>
            <p className="mt-4 text-[14px] leading-7 text-[var(--color-text-muted)] max-w-[560px]">
              <span className="font-bold text-[var(--color-ink)]">رؤيتنا.</span> أن نكون شريكًا تقنيًا موثوقًا يساعد الأفراد والشركات على تحويل أفكارهم إلى مشاريع رقمية ناجحة، ونساهم في تطوير قطاع التقنية في اليمن والمنطقة.
            </p>
            <p className="mt-4 text-[14px] leading-7 text-[var(--color-text-muted)] max-w-[560px]">
              <span className="font-bold text-[var(--color-ink)]">رسالتنا.</span> تقديم حلول برمجية وتقنية مبتكرة تساعد عملاءنا على تطوير أعمالهم، وتحسين كفاءتهم، وبناء حضور رقمي قوي من خلال الجودة والابتكار والالتزام.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "2026", l: "سنة التأسيس" },
                { v: "+120", l: "مشروع" },
                { v: "12", l: "عضو فريق" },
              ].map((x) => (
                <div key={x.l} className="border-t border-[var(--color-ink)] pt-3">
                  <div className="text-[20px] font-bold text-[var(--color-ink)]">{x.v}</div>
                  <div className="text-[11px] text-[var(--color-text-faint)] mt-1">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div data-motion="rise" data-motion-delay="180" className="bg-[var(--color-ink)] text-white p-6 sm:p-8">
            <div className="text-[11px] tracking-[0.16em] text-white/40 font-semibold">قيمنا</div>
            <ul className="mt-4 space-y-4">
              {[
                { t: "الجودة", d: "نلتزم بتقديم حلول عالية الجودة." },
                { t: "الابتكار", d: "نسعى دائمًا لتقديم أفكار وحلول مبتكرة." },
                { t: "الشفافية", d: "نبني علاقات واضحة وصادقة مع عملائنا." },
                { t: "الاحترافية", d: "نعمل بمعايير مهنية عالية." },
                { t: "الالتزام", d: "نحترم الوقت والاتفاقيات." },
                { t: "تطوير الأعمال", d: "نساعد عملاءنا على النمو والتوسع." },
              ].map((v) => (
                <li key={v.t} className="flex gap-3">
                  <span className="mt-1 text-[var(--color-gold)] shrink-0"><Icon name="check" size={16} /></span>
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
          <div className="da-people mt-6">
            {team.map((m: any) => (
              <div key={m.n} className="border-t border-[var(--color-ink)] pt-4">
                {m.avatar ? (
                  <img src={m.avatar} alt={m.n} className="size-12 object-cover border border-[var(--color-border)]" />
                ) : (
                  <span className="size-12 bg-[var(--color-ink)] text-white grid place-items-center text-[16px] font-semibold">{m.i}</span>
                )}
                <div className="mt-3 text-[13px] font-bold text-[var(--color-ink)]">{m.n}</div>
                <div className="text-[11px] text-[var(--color-text-faint)]">{m.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ — خلفية var(--color-beige) مثل المرجع + رسائل محسنة */}
      <div id="faq" className="page-container py-12 grid lg:grid-cols-[minmax(0,360px)_1fr] gap-8 items-start">
        <div>
          <div className="text-[11px] font-bold tracking-[0.6px] text-[var(--color-primary)]">الأسئلة الشائعة</div>
          <h2 className="mt-2 text-[34px] leading-[39px] font-bold tracking-[-0.5px] text-[var(--color-ink)]">
            كل ما تريد
            <br />
            معرفته.
          </h2>
          <p className="mt-3 text-[13px] leading-6 text-[var(--color-text-muted)]">لم تجد إجابتك؟ تحدث مع مهندس حلول خلال دقائق.</p>
          <a href="mailto:Info@amtdex.com" className="btn btn-line brand-cta mt-6">
            <Icon name="mail" size={16} /> تواصل معنا الآن
          </a>
        </div>
        <div className="space-y-2.5">
          {allFaqs.map((f, i) => {
            const panelId = `faq-panel-${i}`
            const btnId = `faq-btn-${i}`
            const isOpen = open === i
            return (
              <div key={f.q} className="da-faq">
                <button
                  id={btnId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
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
