import type { CSSProperties, ReactNode } from "react"

export function Marquee({
  children,
  label,
  duration = 45,
}: {
  children: ReactNode
  label: string
  duration?: number
}) {
  return (
    <div
      className="marquee"
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      role="region"
      aria-label={label}
    >
      <div className="marquee-track">
        <div className="marquee-set">{children}</div>
        <div className="marquee-set" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}
