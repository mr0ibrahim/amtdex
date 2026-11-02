import type { ReactNode } from "react"
import { SectionLabel } from "@/components/ui/SectionLabel"

type PageHeaderProps = {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  align?: "start" | "center"
  /** Use SectionLabel (dot + tracking) when true; otherwise primary tracking eyebrow */
  withSectionLabel?: boolean
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "start",
  withSectionLabel = true,
  actions,
  className = "",
}: PageHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : ""

  return (
    <header className={`${alignClass} ${className}`.trim()}>
      {eyebrow != null &&
        (withSectionLabel ? (
          <SectionLabel>{eyebrow}</SectionLabel>
        ) : (
          <div className="text-[11px] font-bold tracking-[0.6px] text-[var(--color-primary)]">{eyebrow}</div>
        ))}
      <h1 className="mt-3 text-[32px] sm:text-[44px] font-bold tracking-tight text-[var(--color-ink)] leading-tight">
        {title}
      </h1>
      {description != null && (
        <p className={`mt-3 text-[14px] leading-relaxed text-[var(--color-text-muted)] max-w-[560px] ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
      {actions != null && <div className="mt-6">{actions}</div>}
    </header>
  )
}
