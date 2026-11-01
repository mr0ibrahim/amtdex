import * as React from "react"
import { Icon } from "./Icon"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
}: ModalProps) {
  // Handle ESC key press
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#16064F]/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Dialog Card */}
      <div
        className={`relative w-full ${maxWidthMap[maxWidth]} bg-white rounded-[24px] border border-[var(--color-border)] p-6 sm:p-8 shadow-[var(--shadow-modal)] z-10 transition-all duration-300 transform scale-100 animate-in zoom-in-95`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-5 left-5 size-8 rounded-full bg-[var(--color-lavender)]/50 hover:bg-[var(--color-lavender)] text-[var(--color-ink)] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <Icon name="x" size={16} />
        </button>

        {/* Header */}
        {(title || description) && (
          <div className="mb-5 pe-8">
            {title && (
              <h3 className="text-[20px] font-bold text-[var(--color-ink)] leading-snug">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1.5 text-[13px] text-[var(--color-text-muted)] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="text-[14px] text-[var(--color-ink)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
