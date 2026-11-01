import * as React from "react"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[var(--color-lavender)]/50 ${className}`}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-sm space-y-4">
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <Skeleton className="h-6 w-3/4 rounded-lg" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
      <div className="pt-4 flex gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-[var(--color-border)]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  )
}
