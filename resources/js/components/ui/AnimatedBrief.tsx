import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useMotionPlayback } from "@/hooks/useMotionPlayback"
import { Icon } from "./Icon"

export const briefPhrases = ["أحتاج موقعًا يعكس هوية مشروعي", "أريد تطبيقًا يسهّل تجربة عملائي", "أحتاج نظامًا يرتّب أعمال فريقي"]

export function AnimatedBrief() {
  const ref = useRef<HTMLDivElement>(null)
  const running = useMotionPlayback(ref)
  const [frame, setFrame] = useState({ phrase: 0, length: briefPhrases[0].length, deleting: false })
  useEffect(() => {
    if (!running) return
    const phrase = briefPhrases[frame.phrase]
    const waiting = !frame.deleting && frame.length === phrase.length
    const empty = frame.deleting && frame.length === 0
    const timer = window.setTimeout(() => {
      if (waiting) setFrame(previous => ({ ...previous, deleting: true }))
      else if (empty) setFrame(previous => ({ phrase: (previous.phrase + 1) % briefPhrases.length, length: 0, deleting: false }))
      else setFrame(previous => ({ ...previous, length: previous.length + (previous.deleting ? -1 : 1) }))
    }, waiting ? 2000 : empty ? 500 : frame.deleting ? 50 : 100)
    return () => window.clearTimeout(timer)
  }, [frame, running])
  return <div ref={ref} className="reference-brief" role="group" aria-label="فكرتك بداية مشروعك">
    <span className="reference-brief-label"><Icon name="sparkles" size={16} /> فكرتك بداية مشروعك</span>
    <p className="sr-only">مواقع وتطبيقات وأنظمة أعمال مصممة حول احتياجك.</p>
    <div className="reference-brief-typing" aria-hidden="true">{briefPhrases[frame.phrase].slice(0, frame.length)}<span className="reference-type-caret" /></div>
    <div className="reference-brief-footer"><span>نحوّلها إلى تجربة قابلة للاستخدام</span><Link to="/quote" aria-label="أخبرنا بفكرة مشروعك"><Icon name="arrowLeft" size={20} /></Link></div>
  </div>
}
