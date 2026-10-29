import { Link } from "react-router-dom"
import { Icon } from "./Icon"
import type { Service } from "@/types/service"

export function ServiceCard({ service, detailed = false }: { service: Service; detailed?: boolean }) {
  return (
    <Link to={`/services/${service.slug}`} className={`service-card ${service.slug === "erp" ? "service-card-featured" : ""}`}>
      <div className="service-card-top">
        <span className="service-card-icon"><Icon name={service.icon} size={28} /></span>
        {service.slug === "web" && <span className="service-card-badge">الأكثر طلبًا</span>}
        {service.slug === "erp" && <span className="service-card-badge">لأعمال أكثر كفاءة</span>}
      </div>
      <h3>{service.title}</h3>
      <p>{service.desc}</p>
      {detailed && <ul>{service.bullets.map(item => <li key={item}><Icon name="check" size={15} /><span>{item}</span></li>)}</ul>}
      <div className="service-card-footer">
        <span>اكتشف الخدمة</span><span className="service-card-arrow"><Icon name="arrowUpLeft" size={19} /></span>
      </div>
    </Link>
  )
}
