import * as React from "react"

type BadgeVariant = "default" | "muted" | "success" | "warning" | "dark"

const variantMap: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)]",
  muted: "bg-black/5 border-[var(--color-border)] text-[var(--color-text-faint)]",
  success: "bg-[var(--color-success-bg)] border-[var(--color-success)]/20 text-[var(--color-success)]",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  dark: "bg-[var(--color-ink)] border-[var(--color-ink)] text-white",
}

export function Badge({
  variant = "default",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium px-2.5 py-1 rounded-full border ${variantMap[variant]} ${className}`}
      {...props}
    />
  )
}

// Status pill for dashboard tables
export function StatusBadge({ status }: { status: string }) {
  const v: BadgeVariant =
    status === "مكتمل" || status === "مدفوعة" ? "success" :
    status === "مراجعة" || status === "مستحقة" ? "warning" : "muted"
  return <Badge variant={v}>{status}</Badge>
}
