export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-text-faint)]">
      <span className="size-1.5 rounded-full bg-[var(--color-ink)]" /> {children}
    </div>
  )
}
