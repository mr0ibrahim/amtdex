import * as React from "react"
import { Icon } from "./Icon"

export interface AccordionItem {
  id: string
  title: React.ReactNode
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string
  className?: string
}

export function Accordion({ items, defaultOpenId, className = "" }: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(defaultOpenId ?? null)

  const toggle = (id: string) => {
    setOpenId((curr) => (curr === id ? null : id))
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "border-[var(--color-primary-light)]/40 bg-[var(--color-card-soft)]/40 shadow-sm"
                : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary-light)]/20"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between p-5 text-right font-bold text-[14px] text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
            >
              <span>{item.title}</span>
              <span
                className={`size-7 rounded-full bg-[var(--color-lavender)]/50 flex items-center justify-center transition-transform duration-300 text-[var(--color-ink)] shrink-0 me-2 ${
                  isOpen ? "rotate-180 bg-[var(--color-primary)] text-white" : ""
                }`}
              >
                <Icon name="chevronDown" size={15} />
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-[13px] leading-relaxed text-[var(--color-text-muted)] animate-in fade-in slide-in-from-top-1">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
