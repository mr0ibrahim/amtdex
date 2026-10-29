import * as React from "react"

type Variant = "primary" | "secondary" | "ghost" | "outline"
type Size = "sm" | "md" | "lg"

const variantClasses: Record<Variant, string> = {
  primary: "text-white hover:opacity-90 shadow-[0_4px_12px_rgba(40,16,113,0.25)]",
  secondary: "bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]",
  ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-lavender)]",
  outline: "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-lavender)]",
}

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-[12px]",
  md: "px-5 py-2.5 text-[13px]",
  lg: "px-7 py-3.5 text-[14px]",
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  pill?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", pill = true, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        style={variant === "primary" ? { background: "var(--gradient-primary)" } : undefined}
        className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]/30 ${variantClasses[variant]} ${sizeClasses[size]} ${pill ? "rounded-full" : "rounded-xl"} ${className}`}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"
