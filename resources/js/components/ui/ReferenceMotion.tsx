import { Icon, type IconName } from "./Icon"

const capabilities = ["مواقع إلكترونية", "تطبيقات جوال", "أنظمة أعمال", "تجارب رقمية", "من الفكرة إلى التنفيذ"]

export function CapabilityRibbon() {
  return <div className="reference-ribbon" role="group" aria-label="خدماتنا">
    <p className="sr-only">{capabilities.join("، ")}</p>
    <div className="reference-ribbon-track" aria-hidden="true">
      {[0, 1].map(copy => <div className="reference-ribbon-copy" key={copy}>{capabilities.map(label => <span key={label}><Icon name="sparkles" size={16} />{label}</span>)}</div>)}
    </div>
  </div>
}

export function FloatingCapabilities() {
  return <div className="reference-floating" aria-hidden="true">
    {(["web", "mobile", "cloud", "code"] as IconName[]).map((name, index) => <span key={name} className={`reference-floating-item reference-floating-item-${index}`}><Icon name={name} size={23} /></span>)}
    <span className="reference-floating-note">نحوّل الأفكار إلى منتجات رقمية</span>
  </div>
}
