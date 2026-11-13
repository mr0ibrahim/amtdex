import { Icon } from "@/components/ui/Icon"

/** Native UI layers, rather than a flattened hero illustration. */
export function ProductScene() {
  return (
    <div className="product-scene" data-scroll-composition aria-label="نموذج توضيحي لواجهة نظام أعمال">
      <div className="product-orbit product-orbit-one" aria-hidden="true" />
      <div className="product-orbit product-orbit-two" aria-hidden="true" />
      <div className="product-stack" data-stack>
        <div className="product-layer product-layer-back" data-stack-layer aria-hidden="true"><span>AMTDEX / DESIGN</span><Icon name="web" size={36} /></div>
        <div className="product-layer product-layer-mid" data-stack-layer aria-hidden="true"><span>AMTDEX / DEVELOP</span><Icon name="code" size={36} /></div>
        <div className="product-window" data-stack-layer>
          <div className="product-window-bar"><span className="product-window-dots" aria-hidden="true"><i /><i /><i /></span><span>AMTDEX WORKSPACE</span><Icon name="shield" size={14} /></div>
          <div className="product-window-content">
            <div className="product-welcome"><span>مساحة عملك</span><span className="product-avatar">A</span></div>
            <h2>كل مشروع.<br />صورة أوضح.</h2>
            <div className="product-chart" aria-hidden="true">{[28, 45, 34, 60, 48, 75, 63, 94, 80].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div>
            <div className="product-task"><span><Icon name="check" size={14} /></span><div><strong>تصميم تجربة المستخدم</strong><small>خطوة أقرب إلى الإطلاق</small></div><b>مكتمل</b></div>
          </div>
        </div>
      </div>
      <div className="product-badge product-badge-top" data-motion="rise" data-motion-delay="300"><span><Icon name="sparkles" size={18} /></span><div><strong>فكرتك، بتفاصيلها.</strong><small>تجربة صُممت لك</small></div></div>
      <div className="product-badge product-badge-bottom" data-motion="rise" data-motion-delay="450"><span><Icon name="check" size={18} /></span><div><strong>من التصميم إلى الإطلاق</strong><small>مسار واحد. رؤية واضحة.</small></div></div>
      <p className="product-scene-note">نموذج واجهة توضيحي · AMTDEX STUDIO</p>
    </div>
  )
}
