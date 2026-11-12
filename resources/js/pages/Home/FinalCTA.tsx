import { PublicLink as Link } from "@/cms/PublicLink"
import { useSection } from "@/cms/useCms"

export function FinalCTA(_props: { onToast?: (m: string) => void }) {
  void _props
  const title = useSection("cta").fields.title || "من الفكرة\nإلى التنفيذ."

  return (
    <section data-motion-group className="da-band text-white">
      <div className="page-container page-container--wide py-16 sm:py-20 grid lg:grid-cols-[1.2fr_auto] gap-8 items-end">
        <div>
          <p data-motion="fade" className="text-[12px] text-white/60">امتدكس سوفت</p>
          <h2 data-motion="rise" data-motion-delay="120" className="mt-4 text-[36px] sm:text-[56px] font-semibold leading-[1.15]">
            {title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
          </h2>
          <p data-motion="rise" data-motion-delay="240" className="mt-4 text-[15px] leading-8 text-white/70 max-w-[36rem]">
            حيث تلتقي الأفكار بالتقنية، وتتحول الطموحات إلى مشاريع قابلة للتحقيق.
          </p>
        </div>
        <div data-motion="rise" data-motion-delay="320" className="flex flex-col items-start gap-3">
          <Link to="/contact" className="btn btn-gold brand-cta">تواصل معنا</Link>
          <a href="https://wa.me/967784440429" className="btn brand-cta border border-white/40 text-white">واتساب</a>
        </div>
      </div>
    </section>
  )
}
