import { Link } from "react-router-dom"

export function FinalCTA(_props: { onToast?: (m: string) => void }) {
  void _props
  return (
    <section className="mx-auto max-w-[1440px] px-10 py-16 flex flex-col items-center text-center relative overflow-hidden" style={{ background: "radial-gradient(ellipse 70% 45% at 50% 0%, var(--color-ink-soft) 0%, var(--color-ink) 100%)" }}>
      <span className="inline-flex items-center gap-2 bg-[var(--color-border-strong)] border border-[#2A3347] text-[var(--color-text-faint)] text-[11px] font-semibold px-3.5 py-2 rounded-full">
        <span className="size-1.5 rounded-full bg-[#7DD3A0]" /> انضم الى 300+ عميل يبنون مستقبلهم مع AMTDEX
      </span>
      <h2 className="mt-4 text-white text-[42px] sm:text-[52px] font-bold leading-[0.95] tracking-[-0.02em]">جاهز لبناء<br />برمجيتك القادمة؟</h2>
      <p className="mt-3 text-[var(--color-text-faint)] text-[14px] leading-6 max-w-[480px]">احجز استشارة مجانية 30 دقيقة مع مهندس حلول - نحلل فكرتك ونعطيك خارطة طريق وتقدير تكلفة خلال 24 ساعة.</p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link to="/quote" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-[15px] font-extrabold px-8 py-4 rounded-full hover:bg-[#0958E0] transition-colors shadow-[0_10px_24px_rgba(10,102,255,0.4)]">احجز استشارتك المجانية</Link>
        <Link to="/portfolio" className="inline-flex items-center gap-2 bg-transparent border border-[#2A3347] text-white text-[14px] font-semibold px-6 py-4 rounded-full hover:bg-white/5 transition-colors">شاهد اعمالنا</Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-5 text-[var(--color-text-faint)] text-[11px]">
        <span className="flex items-center gap-1.5">◇ استشارة مجانية</span>
        <span className="flex items-center gap-1.5">◇ تسليم مرحلي</span>
        <span className="flex items-center gap-1.5">◇ كود ملكك 100%</span>
      </div>
    </section>
  )
}