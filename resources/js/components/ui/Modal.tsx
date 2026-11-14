import { useEffect, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'

/** Shared editor shell: focus stays in the dialog and returns to its trigger on close. */
export function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  useEffect(() => { close.current = onClose }, [onClose])
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const node = panel.current!
    const elements = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => !el.closest('[hidden], [aria-hidden="true"]'))
    ;(elements()[0] ?? node).focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close.current(); return }
      if (event.key !== "Tab") return
      const items = elements()
      const first = items[0], last = items.at(-1)
      if (!first) { event.preventDefault(); node.focus(); return }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === node)) { event.preventDefault(); first.focus() }
    }
    node.addEventListener("keydown", keydown)
    return () => {
      node.removeEventListener("keydown", keydown)
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])
  return createPortal(<div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 overflow-y-auto"
    onMouseDown={event => { if (event.target === event.currentTarget) close.current() }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} className="w-full flex justify-center outline-none">{children}</div>
  </div>, document.body)
}
