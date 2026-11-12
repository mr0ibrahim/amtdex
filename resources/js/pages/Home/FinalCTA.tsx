import { PublicLink as Link } from "@/cms/PublicLink"

export function FinalCTA(_props: { onToast?: (m: string) => void }) {
  void _props
  return (
    <section data-motion-group className="da-band text-white">
      <div className="page-container page-container--wide py-16 sm:py-20 grid lg:grid-cols-[1.2fr_auto] gap-8 items-end">
        <div>
          <p data-motion="fade" className="text-[12px] text-white/60">انضم الى 300+ عميل يبنون مستقبلهم مع AMTDEX</p>
          <h2 data-motion="rise" data-motion-delay="120" className="mt-4 text-[36px] sm:text-[56px] font-semibold leading-[1.15]">
            جاهز لبناء
            <br />
            برمجيتك القادمة؟
          </h2>
          <p data-motion="rise" data-motion-delay="240" className="mt-4 text-[15px] leading-8 text-white/70 max-w-[36rem]">
            احجز استشارة مجانية 30 دقيقة مع مهندس حلول - نحلل فكرتك ونعطيك خارطة طريق وتقدير تكلفة خلال 24 ساعة.
          </p>
        </div>
        <div data-motion="rise" data-motion-delay="320" className="flex flex-col items-start gap-3">
          <Link to="/quote" className="btn btn-gold brand-cta">احجز استشارتك المجانية</Link>
          <Link to="/portfolio" className="btn brand-cta border border-white/40 text-white">شاهد اعمالنا</Link>
          <p className="text-[12px] text-white/55">استشارة مجانية · تسليم مرحلي · كود ملكك 100%</p>
        </div>
      </div>
    </section>
  )
}
