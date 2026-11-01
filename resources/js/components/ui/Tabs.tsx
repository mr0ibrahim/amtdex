import * as React from "react"

export interface TabItem {
  id: string
  label: React.ReactNode
  badge?: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  variant?: "pill" | "line"
  className?: string
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "pill",
  className = "",
}: TabsProps) {
  if (variant === "line") {
    return (
      <div className={`flex border-b border-[var(--color-border)] gap-6 ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`pb-3 text-[13px] font-semibold transition-all relative flex items-center gap-2 ${
                isActive
                  ? "text-[var(--color-primary)] font-bold"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {tab.label}
              {tab.badge && <span>{tab.badge}</span>}
              {isActive && (
                <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-[var(--color-primary)] rounded-full animate-in fade-in" />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="tablist"
      className={`inline-flex bg-[var(--color-lavender)]/60 border border-[var(--color-border)] p-1 rounded-full text-[12px] font-medium ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-4 py-2 transition-all flex items-center gap-1.5 ${
              isActive
                ? "bg-white shadow-sm border border-[var(--color-border)] text-[var(--color-ink)] font-bold"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab.label}
            {tab.badge && <span>{tab.badge}</span>}
          </button>
        )
      })}
    </div>
  )
}
