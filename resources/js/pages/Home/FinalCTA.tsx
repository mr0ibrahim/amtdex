import { Link } from "react-router-dom"

export function FinalCTA(_props: { onToast?: (m: string) => void }) {
  void _props
  return (
    <section className="page-container page-container--wide py-12 sm:py-16 flex flex-col items-center text-center relative overflow-hidden bg-gradient-cta">
      <span className="inline-flex items-center gap-2 bg-[var(--color-border-strong)] border border-[var(--color-cta-dark-border)] text-[var(--color-text-faint)] text-[11px] font-semibold px-3.5 py-2 rounded-full">
        <span className="size-1.5 rounded-full bg-[var(--color-live)]" /> انضم الى 300+ عميل يبنون مستقبلهم مع AMTDEX
      </span>
      <h2 className="mt-4 text-white text-[clamp(28px,8vw,52px)] font-bold leading-[1.05] tracking-[-0.02em]">
        جاهز لبناء
        <br />
        برمجيتك القادمة؟
      </h2>
      <p className="mt-3 text-[var(--color-text-faint)] text-[14px] leading-6 max-w-[480px]">
        احجز استشارة مجانية 30 دقيقة مع مهندس حلول - نحلل فكرتك ونعطيك خارطة طريق وتقدير تكلفة خلال 24 ساعة.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link
          to="/quote"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-[15px] font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-[var(--color-primary-light)] transition-colors shadow-[var(--shadow-cta)]"
        >
          احجز استشارتك المجانية
        </Link>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 bg-transparent border border-[var(--color-cta-dark-border)] text-white text-[14px] font-semibold px-6 py-3.5 sm:py-4 rounded-full hover:bg-white/5 transition-colors"
        >
          شاهد اعمالنا
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-5 justify-center text-[var(--color-text-faint)] text-[11px]">
        <span className="flex items-center gap-1.5">◇ استشارة مجانية</span>
        <span className="flex items-center gap-1.5">◇ تسليم مرحلي</span>
        <span className="flex items-center gap-1.5">◇ كود ملكك 100%</span>
      </div>
    </section>
  )
}
