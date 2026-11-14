import type { ReactNode } from "react"

export function ContentSection({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string
  addLabel: string
  onAdd: () => void
  children: ReactNode
}) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-[14px] font-bold text-[var(--color-ink)]">{title}</h2>
        <button
          onClick={onAdd}
          className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3.5 py-2 rounded-xl hover:bg-black transition-colors w-full sm:w-auto"
        >
          {addLabel}
        </button>
      </div>
      {children}
    </div>
  )
}
