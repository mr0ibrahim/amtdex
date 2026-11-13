import { useSection } from "@/cms/useCms"
import { useState } from "react"
const screens = [
  { id: "projects", title: "إدارة المشاريع والمهام", alt: "نموذج تطبيق إدارة المشاريع: نسب الإنجاز ومهام الفريق" },
  { id: "health", title: "الحجوزات والخدمات", alt: "نموذج تطبيق حجز طبي: الأطباء والمواعيد المتاحة" },
  { id: "crm", title: "خدمة العملاء", alt: "نموذج نظام خدمة العملاء: المحادثات والطلبات والمساعد الذكي" },
]

export function ScreenGallery() {
  const fields = useSection("gallery").fields
  const [active, setActive] = useState(0)
  return (
    <section data-motion-group className="screen-gallery" aria-labelledby="screen-gallery-title">
      <div data-motion="rise" className="screen-gallery-heading">
        <span>{fields.kicker}</span>
        <h2 id="screen-gallery-title">{fields.title}</h2>
        <p>{fields.lede}</p>
      </div>
      <div className="screen-gallery-window">
        <div className="screen-gallery-stage">
          {screens.map((screen, index) => (
            <figure data-motion="screen" data-motion-delay={index * 120} className="screen-gallery-card" data-active={active === index} key={screen.id}>
              <button type="button" className="screen-select" aria-pressed={active === index} aria-label={`عرض ${screen.title}`} onClick={() => setActive(index)} onPointerEnter={event => { if (event.pointerType === "mouse") setActive(index) }}>
              <div className="screen-gallery-image">
                <img
                  src={`/images/screens/${screen.id}.webp`}
                  srcSet={`/images/screens/${screen.id}-480.webp 480w, /images/screens/${screen.id}.webp 960w`}
                  sizes="(max-width: 700px) 82vw, (max-width: 1024px) 42vw, 33vw"
                  alt={screen.alt}
                  width={960}
                  height={2027}
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                />
              </div>
              <span className="screen-caption"><span>0{index + 1}</span>{screen.title}<span aria-hidden="true">↗</span></span>
              </button>
            </figure>
          ))}
        </div>
      </div>
      <p className="screen-gallery-note">نماذج واجهات توضيحية لحلول يمكننا تطويرها، وليست لقطات من مشاريع عملاء.</p>
    </section>
  )
}
