import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { Modal } from "@/components/ui/Modal"

it("traps focus, closes with Escape, and restores focus and the previous scroll lock", () => {
  const trigger = document.createElement("button")
  document.body.append(trigger); trigger.focus()
  const close = vi.fn()
  document.body.style.overflow = "auto"
  const { unmount } = render(<Modal label="محرر الاختبار" onClose={close}><button>الأول</button><button>الأخير</button></Modal>)
  expect(screen.getByRole("button", { name: "الأول" })).toHaveFocus()
  expect(document.body.style.overflow).toBe("hidden")
  screen.getByRole("button", { name: "الأخير" }).focus()
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" })
  expect(screen.getByRole("button", { name: "الأول" })).toHaveFocus()
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" })
  expect(close).toHaveBeenCalledTimes(1)
  unmount()
  expect(trigger).toHaveFocus()
  expect(document.body.style.overflow).toBe("auto")
  trigger.remove(); document.body.style.overflow = ""
})
