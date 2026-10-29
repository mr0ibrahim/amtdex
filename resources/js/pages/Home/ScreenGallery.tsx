import { useGalleryMotion } from "@/hooks/useGalleryMotion"

const screens = [
  { id: "business", title: "إدارة الأعمال والمبيعات", alt: "نموذج واجهة إدارة الأعمال: مؤشرات الأداء ومخطط الإيرادات والطلبات" },
  { id: "shop", title: "التجارة الإلكترونية", alt: "نموذج متجر إلكتروني: البحث والتصنيفات وبطاقات المنتجات" },
  { id: "projects", title: "إدارة المشاريع والمهام", alt: "نموذج تطبيق إدارة المشاريع: نسب الإنجاز ومهام الفريق" },
  { id: "wallet", title: "المحافظ والمدفوعات", alt: "نموذج محفظة رقمية: الرصيد والتحويلات وسجل العمليات" },
  { id: "health", title: "الحجوزات والخدمات", alt: "نموذج تطبيق حجز طبي: الأطباء والمواعيد المتاحة" },
  { id: "crm", title: "خدمة العملاء", alt: "نموذج نظام خدمة العملاء: المحادثات والطلبات والمساعد الذكي" },
]

export function ScreenGallery() {
  const ref = useGalleryMotion()
  return (
    <section ref={ref} className="screen-gallery" aria-labelledby="screen-gallery-title">
      <div className="screen-gallery-heading">
        <span>واجهات تصنع الفرق</span>
        <h2 id="screen-gallery-title">من فكرتك، إلى تجربة متكاملة.</h2>
        <p>متاجر، تطبيقات، وأنظمة أعمال — نصمّم لكل منتج واجهة تخدم مستخدميه، وتعبّر عن هويته.</p>
      </div>
      <div className="screen-gallery-window">
        <div className="screen-gallery-stage">
          {[[0, 1, 2, 0, 1], [3, 4, 5, 3, 4]].map((row, rowIndex) => (
            <div className="screen-gallery-row" key={rowIndex}>
              {row.map((index, position) => {
                const screen = screens[index]
                const duplicate = position > 2
                return (
                  <figure className="screen-gallery-card" key={`${screen.id}-${position}`} aria-hidden={duplicate || undefined}>
                    <div className="screen-gallery-image">
                      <img src={`/images/screens/${screen.id}.webp`} srcSet={`/images/screens/${screen.id}-480.webp 480w, /images/screens/${screen.id}.webp 960w`} sizes="(max-width: 767px) 44vw, (max-width: 1428px) 21vw, 300px" alt={duplicate ? "" : screen.alt} width={960} height={2027} loading="lazy" decoding="async" />
                    </div>
                    <figcaption>{screen.title}</figcaption>
                  </figure>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="screen-gallery-note">نماذج واجهات توضيحية لحلول يمكننا تطويرها، وليست لقطات من مشاريع عملاء.</p>
    </section>
  )
}
