import { Link } from "react-router-dom"
import { Seo } from "@/components/Seo"
import { Icon, type IconName } from "@/components/ui/Icon"
import { whatsappUrl } from "@/lib/site"

const destinations: { to: string; title: string; text: string; icon: IconName }[] = [
  { to: "/services", title: "الخدمات", text: "المواقع، التطبيقات والأنظمة", icon: "web" },
  { to: "/portfolio", title: "أعمالنا", text: "مشاريع نفّذناها", icon: "chart" },
  { to: "/contact", title: "تواصل معنا", text: "نردّ على استفسارك", icon: "mail" },
]

export function NotFoundPage() {
  return (
    <div className="page-container not-found">
      <Seo title="الصفحة غير موجودة" noindex nofollow />
      <div className="not-found-card geo-card" data-geo="orbit">
        <p className="not-found-code" aria-hidden="true">404</p>
        <h1>الصفحة غير موجودة</h1>
        <p className="not-found-text">الرابط الذي فتحته غير صحيح أو أن الصفحة نُقلت. يمكنك المتابعة من أحد هذه الأماكن.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-ink brand-cta">العودة للرئيسية<Icon name="actionArrow" size={17} /></Link>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn btn-line brand-cta"><Icon name="whatsapp" size={17} />واتساب</a>
        </div>
      </div>
      <nav className="not-found-links" aria-label="صفحات مقترحة">
        {destinations.map(item => (
          <Link key={item.to} to={item.to} className="geo-card">
            <span className="not-found-icon"><Icon name={item.icon} size={22} /></span>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
