import { ScreenImage } from "@/components/ui/ScreenImage"
import { useState } from "react"
const screens = [
  { id: "projects", title: "إدارة المشاريع والمهام", alt: "نموذج تطبيق إدارة المشاريع: نسب الإنجاز ومهام الفريق" },
  { id: "health", title: "الحجوزات والخدمات", alt: "نموذج تطبيق حجز طبي: الأطباء والمواعيد المتاحة" },
  { id: "crm", title: "خدمة العملاء", alt: "نموذج نظام خدمة العملاء: المحادثات والطلبات والمساعد الذكي" },
]

export function ScreenGallery() {
  const [active, setActive] = useState(0)
  return (
    <section data-motion-group className="screen-gallery" aria-labelledby="screen-gallery-title">
      <div data-motion="rise" className="screen-gallery-heading">
        <span>واجهات تصنع الفرق</span>
        <h2 id="screen-gallery-title">من فكرتك، إلى تجربة متكاملة.</h2>
        <p>متاجر، تطبيقات، وأنظمة أعمال — نصمّم لكل منتج واجهة تخدم مستخدميه، وتعبّر عن هويته.</p>
      </div>
      <div className="screen-gallery-window">
        <div className="screen-gallery-stage">
          {screens.map((screen, index) => (
            <figure data-motion="screen" data-motion-delay={index * 120} className="screen-gallery-card" data-active={active === index} key={screen.id}>
              <button type="button" className="screen-select" aria-pressed={active === index} aria-label={`عرض ${screen.title}`} onClick={() => setActive(index)} onPointerEnter={event => { if (event.pointerType === "mouse") setActive(index) }}>
              <div className="screen-gallery-image">
                <ScreenImage
                  screen={screen.id}
                  sizes="(max-width: 639px) 85vw, (max-width: 1023px) 42vw, 45vw"
                  alt={screen.alt}
                  width={960}
                  height={2027}
                  loading="lazy"
                  fetchPriority="low"
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
