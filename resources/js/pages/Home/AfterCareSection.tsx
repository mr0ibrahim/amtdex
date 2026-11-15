import { Link } from "react-router-dom"
import { Icon, type IconName } from "@/components/ui/Icon"

const services: { icon: IconName; title: string; text: string; badge?: string }[] = [
  { icon: "wrench", title: "صيانة مجانية", text: "صيانة شاملة لمشروعك طوال السنة الأولى، بلا أي تكلفة إضافية.", badge: "عام كامل" },
  { icon: "headset", title: "خدمة عملاء مستمرة", text: "فريق دعم عربي يرد على استفساراتك ويتابع طلباتك على مدار الساعة.", badge: "24/7" },
  { icon: "shield", title: "إصلاح المشاكل", text: "أي خلل يظهر بعد الإطلاق نعالجه بسرعة، ونخبرك بما تم خطوة بخطوة." },
  { icon: "refresh", title: "تحديثات مستمرة", text: "نضيف التحديثات والتحسينات ليبقى مشروعك مواكبًا لنمو عملك." },
]

/** What the client keeps getting after delivery: the reason the relationship does not end at launch. */
export function AfterCareSection() {
  return (
    <section data-motion-group className="aftercare page-section" aria-labelledby="aftercare-title">
      <div className="page-container page-container--wide">
        <header className="reference-section-heading">
          <span className="reference-section-label">ما بعد التسليم</span>
          <h2 id="aftercare-title">خدمتنا لا تنتهي عند الإطلاق،<br /><em>بل تبدأ معه.</em></h2>
          <p>نبقى مع مشروعك بعد تسليمه: نصونه، نصلح ما يطرأ عليه، ونضيف ما يحتاجه لينمو.</p>
        </header>
        <ul className="aftercare-grid">
          {services.map((service, index) => (
            <li key={service.title} className="geo-card aftercare-card" data-geo={["orbit", "wave", "grid", "poly"][index]}>
              <span className="aftercare-icon"><Icon name={service.icon} size={24} /></span>
              {service.badge && <span className="aftercare-badge">{service.badge}</span>}
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </li>
          ))}
        </ul>
        <p className="aftercare-note">
          <span>كل مشروع نسلّمه يبدأ معه عام كامل من الصيانة المجانية.</span>
          <Link to="/quote" className="btn btn-ink brand-cta">ابدأ مشروعك<Icon name="actionArrow" size={17} /></Link>
        </p>
      </div>
    </section>
  )
}
