import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import { useDialog } from "@/hooks/useDialog"

/** Editor dialogs share the dashboard theme, including when rendered outside its DOM tree. */
export function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const panel = useDialog(true, onClose)
  return createPortal(<div className="dash-dialog" dir="rtl" lang="ar"
    onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} className="dash-dialog-panel">{children}</div>
  </div>, document.body)
}
