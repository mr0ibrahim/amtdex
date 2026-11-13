import { BrandArtwork, type ArtworkKind } from "@/components/ui/BrandArtwork"
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
  artwork?: ArtworkKind
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "start",
  withSectionLabel = true,
  actions,
  artwork = "systems",
  className = "",
}: PageHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : ""

  return (
    <header data-motion-group className={`brand-page-header ${alignClass} ${className}`.trim()}>
      <div className="brand-page-header-copy">
      {eyebrow != null &&
        (withSectionLabel ? (
          <SectionLabel>{eyebrow}</SectionLabel>
        ) : (
          <div className="text-[11px] font-bold tracking-[0.6px] text-[var(--color-primary)]">{eyebrow}</div>
        ))}
      <h1 className="mt-4 text-[34px] sm:text-[52px] font-semibold text-[var(--color-ink)] leading-[1.2]">
        {title}
      </h1>
      {description != null && (
        <p data-motion="rise" data-motion-delay="240" className={`mt-4 text-[15px] leading-8 text-[var(--color-text-muted)] max-w-[36rem] ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
      {actions != null && <div className="mt-6">{actions}</div>}
      </div>
      <div className="brand-page-header-art" data-motion="vector"><BrandArtwork kind={artwork} /></div>
    </header>
  )
}
