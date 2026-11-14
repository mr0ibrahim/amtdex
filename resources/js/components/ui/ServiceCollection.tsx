import { PublicLink as Link } from "@/cms/PublicLink"
import { SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"
import { Icon } from "./Icon"

/** One card system for the homepage preview and the full service catalogue. */
export function ServiceCollection({ limit }: { limit?: number }) {
  const { data } = useServicesQuery()
  const services = data?.length ? data : SERVICES
  return <div className="reference-service-grid">
    {services.slice(0, limit).map(service => <Link key={service.slug} to={`/services/${service.slug}`} className="reference-service-card">
      <span className="reference-service-icon"><Icon name={service.icon} size={28} /></span>
      <h3>{service.title}</h3>
      <p>{service.desc}</p>
      <span className="reference-service-link">اكتشف الخدمة <Icon name="arrowLeft" size={18} /></span>
    </Link>)}
  </div>
}
