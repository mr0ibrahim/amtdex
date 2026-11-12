const screens = [
  { id: "business", title: "إدارة الأعمال والمبيعات", alt: "نموذج واجهة إدارة الأعمال: مؤشرات الأداء ومخطط الإيرادات والطلبات" },
  { id: "shop", title: "التجارة الإلكترونية", alt: "نموذج متجر إلكتروني: البحث والتصنيفات وبطاقات المنتجات" },
  { id: "projects", title: "إدارة المشاريع والمهام", alt: "نموذج تطبيق إدارة المشاريع: نسب الإنجاز ومهام الفريق" },
  { id: "wallet", title: "المحافظ والمدفوعات", alt: "نموذج محفظة رقمية: الرصيد والتحويلات وسجل العمليات" },
  { id: "health", title: "الحجوزات والخدمات", alt: "نموذج تطبيق حجز طبي: الأطباء والمواعيد المتاحة" },
  { id: "crm", title: "خدمة العملاء", alt: "نموذج نظام خدمة العملاء: المحادثات والطلبات والمساعد الذكي" },
]

export function ScreenGallery() {
  return (
    <section className="screen-gallery" aria-labelledby="screen-gallery-title">
      <div className="screen-gallery-heading">
        <span>واجهات تصنع الفرق</span>
        <h2 id="screen-gallery-title">من فكرتك، إلى تجربة متكاملة.</h2>
        <p>متاجر، تطبيقات، وأنظمة أعمال — نصمّم لكل منتج واجهة تخدم مستخدميه، وتعبّر عن هويته.</p>
      </div>
      <div className="screen-gallery-window">
        <div className="screen-gallery-stage">
          {screens.map((screen) => (
            <figure className="screen-gallery-card" key={screen.id}>
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
              <figcaption>{screen.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <p className="screen-gallery-note">نماذج واجهات توضيحية لحلول يمكننا تطويرها، وليست لقطات من مشاريع عملاء.</p>
    </section>
  )
}
