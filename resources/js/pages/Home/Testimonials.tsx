import { PublicLink as Link } from "@/cms/PublicLink"
import { useState } from "react"
import { Icon } from "@/components/ui/Icon"
import { useTestimonialsQuery } from "@/lib/queries"

export function Testimonials() {
  const { data: dbData } = useTestimonialsQuery()
  // Only what is published in the dashboard (the query itself falls back if the server is unreachable).
  // Nothing is shown while loading, so sample quotes never flash before the real ones.
  const list = (dbData ?? []).map((item: any) => {
    const name = item.author || item.name || ""
    const photo = typeof item.avatar === "string" && /^(https?:|\/)/.test(item.avatar) ? item.avatar : ""
    return {
      name,
      text: item.content || item.text,
      photo,
      initial: (!photo && item.avatar) || name.charAt(0) || "؟",
      title: [item.role, item.company].filter(Boolean).join(" · "),
    }
  })

  const [index, setIndex] = useState(0)
  const safeIndex = index < list.length ? index : 0
  const quote = list[safeIndex] || list[0]
  const move = (direction: number) => setIndex(current => (current + direction + list.length) % list.length)

  if (!list.length) return null

  return (
    <section className="testimonial-panel" aria-label="آراء العملاء">
      <div className="testimonial-heading"><div><span>علاقات تُبنى على الثقة</span><h3>ماذا يقول عملاؤنا</h3></div><Icon name="quote" size={38} /></div>
      <div className="testimonial-story" aria-live="polite" aria-atomic="true">
        <span className="sr-only">الرأي {safeIndex + 1} من {list.length}</span>
        <blockquote key={quote?.name}>{quote?.text}</blockquote>
        <div className="testimonial-author">{quote?.photo ? <img className="testimonial-avatar testimonial-photo" src={quote.photo} alt="" width={48} height={48} loading="lazy" /> : <span className="testimonial-avatar" aria-hidden="true">{quote?.initial}</span>}<div><strong>{quote?.name}</strong>{quote?.title && <p>{quote.title}</p>}</div></div>
      </div>
      <div className="testimonial-navigation">
        <div className="testimonial-dots" role="group" aria-label="اختيار رأي العميل">{list.map((item: any, position: number) => <button key={item.name} type="button" aria-label={`عرض رأي ${item.name}`} aria-pressed={position === safeIndex} onClick={() => setIndex(position)}><span /></button>)}</div>
        <div className="testimonial-arrows"><button type="button" onClick={() => move(-1)} aria-label="الرأي السابق"><Icon name="arrowRight" size={19} /></button><button type="button" onClick={() => move(1)} aria-label="الرأي التالي"><Icon name="arrowLeft" size={19} /></button></div>
      </div>
      <Link className="testimonial-link" to="/portfolio"><span><small>من الثقة إلى النتيجة</small><strong>تعرّف على أعمالنا</strong></span><span className="testimonial-link-icon"><Icon name="actionArrow" size={20} /></span></Link>
    </section>
  )
}
