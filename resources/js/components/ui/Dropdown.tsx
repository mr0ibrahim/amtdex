import * as React from "react"
import { Icon, type IconName } from "./Icon"

export interface DropdownItem {
  id: string
  label: React.ReactNode
  icon?: IconName
  danger?: boolean
  onClick: () => void
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: "right" | "left"
  className?: string
}

export function Dropdown({ trigger, items, align = "right", className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={`absolute z-30 mt-2 min-w-[180px] bg-white rounded-2xl border border-[var(--color-border)] p-1.5 shadow-[var(--shadow-card-lg)] animate-in fade-in zoom-in-95 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              type="button"
              onClick={() => {
                setIsOpen(false)
                item.onClick()
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium rounded-xl transition-colors text-right ${
                item.danger
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-[var(--color-ink)] hover:bg-[var(--color-lavender)]/50"
              }`}
            >
              {item.icon && <Icon name={item.icon} size={15} />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
