import { useEffect, useRef } from "react"

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'

/** Share focus, Escape and scroll locking between the mobile navigation and editor dialogs. */
export function useDialog(open: boolean, onClose: () => void) {
  const panel = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  useEffect(() => { close.current = onClose }, [onClose])
  useEffect(() => {
    if (!open || !panel.current) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const node = panel.current
    const elements = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter(el => !el.closest('[hidden], [aria-hidden="true"]'))
    ;(elements()[0] ?? node).focus({ preventScroll: true })
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close.current(); return }
      if (event.key !== "Tab") return
      const items = elements()
      const first = items[0], last = items.at(-1)
      if (!first) { event.preventDefault(); node.focus(); return }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        event.preventDefault(); last?.focus()
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === node)) {
        event.preventDefault(); first.focus()
      }
    }
    node.addEventListener("keydown", keydown)
    return () => {
      node.removeEventListener("keydown", keydown)
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [open])
  return panel
}
