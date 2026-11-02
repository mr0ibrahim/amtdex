import * as React from "react"

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
  padding?: "none" | "sm" | "md" | "lg"
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
} as const

export function Card({ hover = false, padding = "md", className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] ${paddingMap[padding]} ${hover ? "hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300" : ""} ${className}`}
      {...props}
    />
  )
}

export function CardIcon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`size-10 rounded-xl bg-[var(--color-ink)] text-white grid place-items-center text-[14px] ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`mt-4 text-[16px] font-bold tracking-tight text-[var(--color-text)] ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-2 text-[13px] leading-6 text-[var(--color-text-muted)] ${className}`}>{children}</p>
}
