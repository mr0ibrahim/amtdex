import { useRef, useState, type KeyboardEvent } from "react"
import { Icon, type IconName } from "@/components/ui/Icon"
import { PublicLink as Link } from "@/cms/PublicLink"

const experiences = [
  { id: "commerce", icon: "web", label: "متجر إلكتروني", title: "من أول زيارة، إلى أول طلب.", description: "رحلة شراء واضحة، عرض جذّاب للمنتجات، وإدارة تجمع تفاصيل متجرك في مكان واحد.", app: "متجر نُسق", metric: "المبيعات اليوم", value: "12,840", unit: "ر.س", labels: ["طلبات جديدة", "بانتظار الشحن", "تم التسليم"], values: ["24", "08", "16"], rows: ["مجموعة العناية اليومية", "حقيبة الأساسيات", "مجموعة السفر"], tag: "تجربة شراء متكاملة" },
  { id: "operations", icon: "erp", label: "نظام أعمال", title: "كل التفاصيل، في صورة واضحة.", description: "لوحة واحدة تجمع المشاريع والمهام؛ ليعرف فريقك ما التالي، وتتابع سير العمل بسهولة.", app: "مساحة الفريق", metric: "إنجاز المشروع", value: "84", unit: "%", labels: ["مهام مكتملة", "قيد التنفيذ", "مشاريع نشطة"], values: ["42", "12", "06"], rows: ["تصميم تجربة المستخدم", "تطوير لوحة الإدارة", "مراجعة النسخة التجريبية"], tag: "فريقك على المسار نفسه" },
  { id: "booking", icon: "clock", label: "منصة حجوزات", title: "موعد مناسب، بخطوات أقل.", description: "اختيار الخدمة والوقت وتأكيد الموعد، في تجربة بسيطة لعميلك وجدول واضح لفريقك.", app: "موعدك", metric: "المواعيد هذا الأسبوع", value: "128", unit: "موعد", labels: ["مؤكدة", "متاحة اليوم", "خدمات"], values: ["96", "08", "12"], rows: ["استشارة أولية · 09:00", "متابعة دورية · 10:30", "جلسة تعريفية · 12:00"], tag: "من الاختيار إلى التأكيد" },
] as const

export function ExperienceStudio() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const item = experiences[active]
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
    <section data-motion-group className="experience-studio page-container page-container--wide page-section" aria-labelledby="studio-title">
      <div className="studio-heading">
        <div data-motion="rise">
          <p className="studio-eyebrow"><span /> تفاصيل صغيرة. أثر كبير.</p>
          <h2 id="studio-title">منتجك القادم،<br /><em>أقرب مما تتخيّل.</em></h2>
        </div>
        <p data-motion="rise">لا تكتفِ بتخيّل الشكل النهائي.<br />استكشف نماذج لواجهات نبنيها حول احتياجات مشروعك.</p>
      </div>
      <div className="studio-tabs" role="tablist" aria-label="استكشف نوع الحل">
        {experiences.map((tab, index) => <button key={tab.id} ref={el => { tabs.current[index] = el }} id={`studio-tab-${tab.id}`} role="tab" type="button" aria-selected={active === index} aria-controls={`studio-panel-${tab.id}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}>
          <Icon name={tab.icon as IconName} size={18} />{tab.label}<span aria-hidden="true">0{index + 1}</span>
        </button>)}
      </div>
      <div key={item.id} id={`studio-panel-${item.id}`} role="tabpanel" aria-labelledby={`studio-tab-${item.id}`} tabIndex={0} className="studio-panel" data-motion-group>
        <div className="studio-story" data-motion="rise">
          <span className="studio-index" aria-hidden="true">0{active + 1}<span> / 03</span></span>
          <h3>{item.title}</h3><p>{item.description}</p>
          <ul><li><Icon name="check" size={16} /> تصميم يتكيّف مع كل شاشة</li><li><Icon name="check" size={16} /> تجربة تعكس هوية مشروعك</li></ul>
          <Link to="/quote" className="studio-link">لنصمّم مشروعك <Icon name="arrowUpLeft" size={20} /></Link>
          <small>واجهات توضيحية ببيانات تجريبية</small>
        </div>
        <div className="studio-scene">
          <div className="studio-browser" data-tilt>
            <div className="studio-browser-bar"><span className="studio-dots" aria-hidden="true"><i /><i /><i /></span><span>AMTDEX / PRODUCT PREVIEW</span><Icon name="shield" size={14} /></div>
            <div className="studio-app-bar"><strong><span className="studio-app-logo"><Icon name={item.icon as IconName} size={20} /></span>{item.app}</strong><span className="studio-avatar">ن</span></div>
            <div className="studio-app-body">
              <div className="studio-metric"><span>{item.metric}</span><strong>{item.value}<small>{item.unit}</small></strong><span className="studio-metric-note"><span /> نظرة سريعة على نشاطك</span>
                <div className="studio-chart" aria-hidden="true">{[30, 48, 38, 64, 50, 72, 62, 85, 74, 94, 83, 100].map((height, index) => <i key={index} data-motion="bar" data-motion-delay={index * 30} style={{ height: `${height}%` }} />)}</div>
              </div>
              <div className="studio-kpis">{item.labels.map((label, index) => <div key={label}><span>{label}</span><strong>{item.values[index]}</strong></div>)}</div>
              <div className="studio-list-heading"><strong>{active === 0 ? "آخر الطلبات" : active === 1 ? "مهام الفريق" : "جدول المواعيد"}</strong><span>نموذج توضيحي</span></div>
              <div className="studio-list">{item.rows.map((row, index) => <div key={row} data-motion="rise" data-motion-delay={index * 70}><span className="studio-row-icon"><Icon name={index === 0 ? "folder" : index === 1 ? "invoice" : "check"} size={16} /></span><span>{row}</span><span className="studio-row-status">{index === 1 ? "قيد التنفيذ" : "مكتمل"}</span></div>)}</div>
            </div>
          </div>
          <div className="studio-floating" data-parallax><span><Icon name="check" size={18} /></span><div><strong>{item.tag}</strong><small>مصمّمة لتسهيل كل خطوة</small></div></div>
        </div>
      </div>
      <div className="studio-footnote"><span>فكرة واضحة</span><i /><span>تصميم مدروس</span><i /><span>تجربة تستحق العودة</span></div>
    </section>
  )
}
