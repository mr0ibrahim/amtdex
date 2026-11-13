import { Icon } from "@/components/ui/Icon"
import { Link } from "react-router-dom"
import { SERVICES as SEED_SERVICES } from "@/data/services"
import { useServicesQuery } from "@/lib/queries"
import { getBlogUrl, getMainUrl, isBlogSubdomain } from "@/lib/subdomain"
import { pageIsListed, useCms, useCopy } from "@/cms/useCms"

export function Footer(_props: { onToast: (m: string) => void }) {
  const onBlog = isBlogSubdomain()
  const { pages } = useCms()
  const blurb = useCopy("footer.blurb", "نحن شركة برمجيات وتقنية معلومات، نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو.")
  const city = useCopy("footer.city", "اليمن - إب")
  const shown = (path: string) => pageIsListed(pages, path, false)
  const { data: apiServices } = useServicesQuery()
  const services = apiServices?.length ? apiServices : SEED_SERVICES
  const columns = [
    { title: "خدماتنا", links: shown("/services") ? services.map(s => ({ label: s.title, to: `/services/${s.slug}` })) : [] },
    { title: "اكتشف AMTDEX", links: [
      { label: "من نحن", to: "/about" },
      { label: "أعمالنا", to: "/portfolio" },
      { label: "ابدأ مشروعك", to: "/quote" },
      { label: "تواصل معنا", to: "/contact" },
      { label: "المدونة التقنية", to: "/blog", href: onBlog ? "/" : getBlogUrl("/") },
    ].filter(link => shown(link.to)) },
  ]
  const siteLink = (to: string, label: string, className?: string) => onBlog
    ? <a href={getMainUrl(to)} className={className}>{label}</a>
    : <Link to={to} className={className}>{label}</Link>

  return (
    <footer className="site-footer">
      <div className="page-container page-container--wide">
        <div className="footer-grid">
          <div className="footer-brand">
            {siteLink("/", "AMTDEX SOFT", "footer-wordmark")}
            <p>{blurb}</p>
            <a href="https://www.instagram.com/amtdex/" target="_blank" rel="noreferrer" className="footer-social"><Icon name="instagram" size={17} /> Instagram <Icon name="arrowUpLeft" size={15} /></a>
          </div>
          {columns.filter(col => col.links.length).map(col => (
            <nav key={col.title} aria-label={col.title} className="footer-nav">
              <h2>{col.title}</h2>
              <ul>{col.links.map((link: { label: string; to: string; href?: string }) => (
                <li key={link.label}>{link.href ? <a href={link.href}>{link.label}</a> : siteLink(link.to, link.label)}</li>
              ))}</ul>
            </nav>
          ))}
          <div className="footer-contact">
            <h2>بيانات التواصل</h2>
            <address>
              <div className="footer-contact-row"><span><Icon name="mail" size={15} /> البريد الإلكتروني</span><a href="mailto:Info@amtdex.com" dir="ltr">Info@amtdex.com</a></div>
              <div className="footer-contact-row"><span><Icon name="phone" size={15} /> أرقام التواصل</span><a href="tel:+967784440429" dir="ltr">+967 784 440 429</a><a href="tel:+967784440428" dir="ltr">+967 784 440 428</a></div>
              <div className="footer-contact-row"><span><Icon name="mapPin" size={15} /> مقرّنا</span><p>{city}</p></div>
            </address>
            <a className="footer-whatsapp" href="https://wa.me/967784440429" target="_blank" rel="noreferrer">تواصل عبر واتساب <Icon name="arrowUpLeft" size={16} /></a>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} AMTDEX SOFT. جميع الحقوق محفوظة.</span><span>{city}</span></div>
      </div>
    </footer>
  )
}
