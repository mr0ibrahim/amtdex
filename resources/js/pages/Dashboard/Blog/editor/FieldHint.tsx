export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-text-muted)]">{children}</p>
}

export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="block text-[12.5px] font-bold text-[var(--color-ink)] mb-1.5">
      {children}
      {required && <span className="text-rose-500 ms-1">*</span>}
    </label>
  )
}

export function EditorSection({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string
  description?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}) {
  if (!collapsible) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-4 sm:p-5 space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--color-ink)]">{title}</h3>
          {description && <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{description}</p>}
        </div>
        {children}
      </section>
    )
  }

  return (
    <details
      open={defaultOpen}
      className="rounded-2xl border border-[var(--color-border)] bg-white group overflow-hidden"
    >
      <summary className="cursor-pointer list-none px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 select-none">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--color-ink)]">{title}</h3>
          {description && <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{description}</p>}
        </div>
        <span className="text-[11px] font-bold text-[var(--color-text-muted)] group-open:hidden">إظهار</span>
        <span className="text-[11px] font-bold text-[var(--color-text-muted)] hidden group-open:inline">إخفاء</span>
      </summary>
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 border-t border-[var(--color-border)] pt-4">{children}</div>
    </details>
  )
}
