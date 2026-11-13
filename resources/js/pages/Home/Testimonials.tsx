import { useSection } from "@/cms/useCms"
import { PublicLink as Link } from "@/cms/PublicLink"
import { useState } from "react"
import { Icon } from "@/components/ui/Icon"
import { TESTIMONIALS } from "@/data/site"
import { useTestimonialsQuery } from "@/lib/queries"

export function Testimonials() {
  const fields = useSection("testimonials").fields
  const { data: dbData } = useTestimonialsQuery()
  const rawList = dbData && dbData.length > 0 ? dbData : TESTIMONIALS
  const list = rawList.map((item: any) => ({
    name: item.author || item.name,
    text: item.content || item.text,
    avatar: item.avatar || (item.author ? item.author.charAt(0) : item.name?.charAt(0) || "U"),
  }))

  const [index, setIndex] = useState(0)
  const safeIndex = index < list.length ? index : 0
  const quote = list[safeIndex] || list[0]
  const move = (direction: number) => setIndex(current => (current + direction + list.length) % list.length)

  return (
    <section className="testimonial-panel" aria-label="آراء العملاء">
      <div className="testimonial-heading"><div><span>{fields.kicker}</span><h3>{fields.title}</h3></div><Icon name="quote" size={38} /></div>
      <div className="testimonial-story" aria-live="polite" aria-atomic="true">
        <span className="sr-only">الرأي {safeIndex + 1} من {list.length}</span>
        <blockquote key={quote?.name}>{quote?.text}</blockquote>
        <div className="testimonial-author"><span className="testimonial-avatar" aria-hidden="true">{quote?.avatar}</span><div><strong>{quote?.name}</strong></div></div>
      </div>
      <div className="testimonial-navigation">
        <div className="testimonial-dots" aria-label="اختيار رأي العميل">{list.map((item: any, position: number) => <button key={item.name} type="button" aria-label={`عرض رأي ${item.name}`} aria-pressed={position === safeIndex} onClick={() => setIndex(position)}><span /></button>)}</div>
        <div className="testimonial-arrows"><button type="button" onClick={() => move(-1)} aria-label="الرأي السابق"><Icon name="arrowRight" size={19} /></button><button type="button" onClick={() => move(1)} aria-label="الرأي التالي"><Icon name="arrowLeft" size={19} /></button></div>
      </div>
      <Link className="testimonial-link" to="/portfolio"><span><small>من الثقة إلى النتيجة</small><strong>{fields.link}</strong></span><span className="testimonial-link-icon"><Icon name="arrowUpLeft" size={20} /></span></Link>
    </section>
  )
}
