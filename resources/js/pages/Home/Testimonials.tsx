import { useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "@/components/ui/Icon"
import { TESTIMONIALS } from "@/data/site"

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const quote = TESTIMONIALS[index]
  const move = (direction: number) => setIndex(current => (current + direction + TESTIMONIALS.length) % TESTIMONIALS.length)
  return (
    <section className="testimonial-panel" aria-label="آراء العملاء">
      <div className="testimonial-heading"><div><span>علاقات تُبنى على الثقة</span><h3>ماذا يقول عملاؤنا</h3></div><Icon name="quote" size={38} /></div>
      <div className="testimonial-story" aria-live="polite" aria-atomic="true">
        <span className="sr-only">الرأي {index + 1} من {TESTIMONIALS.length}</span>
        <blockquote key={quote.name}>{quote.text}</blockquote>
        <div className="testimonial-author"><span className="testimonial-avatar" aria-hidden="true">{quote.avatar}</span><div><strong>{quote.name}</strong><p>{quote.role}</p></div></div>
      </div>
      <div className="testimonial-navigation">
        <div className="testimonial-dots" aria-label="اختيار رأي العميل">{TESTIMONIALS.map((item, position) => <button key={item.name} type="button" aria-label={`عرض رأي ${item.name}`} aria-pressed={position === index} onClick={() => setIndex(position)}><span /></button>)}</div>
        <div className="testimonial-arrows"><button type="button" onClick={() => move(-1)} aria-label="الرأي السابق"><Icon name="arrowRight" size={19} /></button><button type="button" onClick={() => move(1)} aria-label="الرأي التالي"><Icon name="arrowLeft" size={19} /></button></div>
      </div>
      <Link className="testimonial-link" to="/portfolio">تعرّف على أعمالنا <Icon name="arrowLeft" size={17} /></Link>
    </section>
  )
}
