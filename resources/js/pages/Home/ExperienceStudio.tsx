import { useSection } from "@/cms/useCms"
import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Icon, type IconName } from "@/components/ui/Icon"
import { PublicLink as Link } from "@/cms/PublicLink"

const experiences = [
  { id: "commerce", screen: "shop", icon: "web", label: "متجر إلكتروني", title: "من أول زيارة، إلى أول طلب.", description: "رحلة شراء واضحة، عرض جذّاب للمنتجات، وإدارة تجمع تفاصيل متجرك في مكان واحد.", app: "متجر نُسق", metric: "المبيعات اليوم", value: "12,840", unit: "ر.س", labels: ["طلبات جديدة", "بانتظار الشحن", "تم التسليم"], values: ["24", "08", "16"], rows: ["مجموعة العناية اليومية", "حقيبة الأساسيات", "مجموعة السفر"], tag: "تجربة شراء متكاملة" },
  { id: "operations", screen: "crm", icon: "erp", label: "نظام أعمال", title: "كل التفاصيل، في صورة واضحة.", description: "لوحة واحدة تجمع المشاريع والمهام؛ ليعرف فريقك ما التالي، وتتابع سير العمل بسهولة.", app: "مساحة الفريق", metric: "إنجاز المشروع", value: "84", unit: "%", labels: ["مهام مكتملة", "قيد التنفيذ", "مشاريع نشطة"], values: ["42", "12", "06"], rows: ["تصميم تجربة المستخدم", "تطوير لوحة الإدارة", "مراجعة النسخة التجريبية"], tag: "فريقك على المسار نفسه" },
  { id: "booking", screen: "health", icon: "clock", label: "منصة حجوزات", title: "موعد مناسب، بخطوات أقل.", description: "اختيار الخدمة والوقت وتأكيد الموعد، في تجربة بسيطة لعميلك وجدول واضح لفريقك.", app: "موعدك", metric: "المواعيد هذا الأسبوع", value: "128", unit: "موعد", labels: ["مؤكدة", "متاحة اليوم", "خدمات"], values: ["96", "08", "12"], rows: ["استشارة أولية · 09:00", "متابعة دورية · 10:30", "جلسة تعريفية · 12:00"], tag: "من الاختيار إلى التأكيد" },
] as const

export function ExperienceStudio() {
  const fields = useSection("gallery").fields
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const deck = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const item = experiences[active]
  const move = (step: number) => setActive(value => (value + step + experiences.length) % experiences.length)
  useEffect(() => {
    const root = deck.current
    if (!root || typeof window.matchMedia !== "function") return
    let cancelled = false
    let stop: (() => void) | undefined
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    void import("gsap").then(({ gsap }) => {
      if (cancelled) return
      const ctx = gsap.context(() => {})
      const animate = () => ctx.add(() => {
        root.querySelectorAll<HTMLElement>("[data-project-card]").forEach((card, index) => {
          const rank = (index - active + experiences.length) % experiences.length
          gsap.to(card, {
            x: [0, 46, -34][rank], y: [22, -12, -44][rank], rotation: [-6, 10, -15][rank],
            scale: [1, .94, .87][rank], zIndex: 3 - rank, opacity: 1,
            duration: reduced.matches ? 0 : .95, ease: "power3.inOut", overwrite: "auto",
          })
        })
      })
      animate()
      reduced.addEventListener("change", animate)
      stop = () => { reduced.removeEventListener("change", animate); ctx.kill(false) }
    }).catch(() => { /* Native controls and readable cards remain available. */ })
    return () => { cancelled = true; stop?.() }
  }, [active])
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (event.key === "ArrowLeft") next = (index + 1) % experiences.length
    else if (event.key === "ArrowRight") next = (index + experiences.length - 1) % experiences.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = experiences.length - 1
    else return
    event.preventDefault(); setActive(next); tabs.current[next]?.focus()
  }
  return (
    <section data-motion-group className="experience-studio motion-showcase page-container page-container--wide page-section" aria-labelledby="studio-title">
      <div className="studio-heading">
        <p className="studio-eyebrow"><span /> {fields.deck_kicker}</p>
        <h2 id="studio-title">{fields.deck_title}</h2>
        <p>{fields.deck_lede}</p>
      </div>
      <div className="project-showcase">
        <div className="project-showcase-copy">
          <span className="project-showcase-label">AMTDEX / DIGITAL EXPERIENCES</span>
          <div className="project-tabs" role="tablist" aria-label="استكشف نوع الحل" aria-orientation="horizontal">
            {experiences.map((tab, index) => <button key={tab.id} ref={el => { tabs.current[index] = el }} id={`studio-tab-${tab.id}`} role="tab" type="button" aria-selected={active === index} aria-controls={`studio-panel-${tab.id}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}>
              <span className="project-tab-icon"><Icon name={tab.icon as IconName} size={20} /></span><span>{tab.label}</span><small>0{index + 1}</small><span className="project-tab-line" aria-hidden="true" />
            </button>)}
          </div>
          <div key={item.id} id={`studio-panel-${item.id}`} role="tabpanel" aria-labelledby={`studio-tab-${item.id}`} tabIndex={0} className="project-copy-panel">
            <h3>{item.title}</h3><p>{item.description}</p>
            <div className="project-sample-metric"><span>{item.metric}</span><strong>{item.value}<small>{item.unit}</small></strong></div>
            <Link to="/quote" className="project-quote-link">لنصمّم مشروعك <Icon name="arrowUpLeft" size={19} /></Link>
            <small>نماذج واجهات ببيانات توضيحية</small>
          </div>
        </div>
        <div className="project-showcase-visual">
          <div ref={deck} className="project-deck-stage" aria-label="معرض بطاقات المشاريع، اسحب أفقيًا لتبديل النموذج" onPointerDown={event => { pointer.current = { x: event.clientX, y: event.clientY } }} onPointerCancel={() => { pointer.current = null }} onPointerUp={event => {
            const start = pointer.current; pointer.current = null
            if (!start) return
            const dx = event.clientX - start.x, dy = event.clientY - start.y
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx > 0 ? 1 : -1)
          }}>
            <div className="project-deck-orbit" aria-hidden="true" />
            {experiences.map((sample, index) => <div key={sample.id} data-project-card className={`project-deck-card project-deck-card-${sample.id}`} data-active={index === active} aria-hidden="true">
              <div className="project-card-top"><span><Icon name={sample.icon as IconName} size={18} />{sample.label}</span><span>AMTDEX</span></div>
              <div className="project-card-screen"><img src={`/images/screens/${sample.screen}-480.webp`} alt="" width={480} height={1014} loading="lazy" draggable={false} /></div>
              <div className="project-card-bottom"><span>{sample.app}<small>واجهة مصمّمة حول احتياجك</small></span><span className="project-card-seal"><Icon name="check" size={17} /></span></div>
            </div>)}
          </div>
          <div className="project-deck-controls"><button type="button" aria-label="النموذج السابق" onClick={() => move(-1)}><Icon name="arrowRight" size={20} /></button><span aria-live="polite" aria-atomic="true">0{active + 1} <i>/</i> 03</span><button type="button" aria-label="النموذج التالي" onClick={() => move(1)}><Icon name="arrowLeft" size={20} /></button></div>
          <p className="project-swipe-hint">اسحب البطاقات أو استخدم الأسهم</p>
        </div>
      </div>
    </section>
  )
}
