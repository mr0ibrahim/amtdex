import { useState } from "react"
import { Link } from "react-router-dom"
import { SERVICES } from "@/data/services"

/** The published services, readable one at a time. */
export function ServicesShowcase() {
  const [active, setActive] = useState(0)
  const service = SERVICES[active] ?? SERVICES[0]
  return (
    <section className="page-container page-container--wide page-section" data-gsap-reveal aria-labelledby="showcase-title">
      <p className="eyebrow">ماذا نقدم؟</p>
      <h2 id="showcase-title" className="mt-3 text-[28px] sm:text-[40px] font-semibold leading-[1.2] text-[var(--color-ink)]">الخدمات العشر<br />في شاشة واحدة.</h2>
      <div className="showcase">
        <div className="showcase-list" role="tablist" aria-label="الخدمات">
          {SERVICES.map((item, index) => (
            <button key={item.slug} type="button" role="tab" id={`showcase-tab-${item.slug}`} aria-selected={index === active} aria-controls="showcase-panel" className={index === active ? "is-on" : undefined} onClick={() => setActive(index)}>
              <span>0{index + 1}</span>{item.title}
            </button>
          ))}
        </div>
        <article id="showcase-panel" role="tabpanel" aria-labelledby={`showcase-tab-${service.slug}`} className="premium-card showcase-panel" key={service.slug}>
          <p className="da-kicker">0{active + 1}</p>
          <h3>{service.title}</h3>
          <p>{service.desc}</p>
          {service.detail && <p>{service.detail}</p>}
          {service.bullets.length > 0 && <ul>{service.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
          <Link to={`/services/${service.slug}`} className="btn btn-ink brand-cta">اكتشف الخدمة</Link>
        </article>
      </div>
    </section>
  )
}
