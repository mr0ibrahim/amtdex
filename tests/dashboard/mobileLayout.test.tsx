import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

beforeEach(() => {
  vi.stubGlobal("innerWidth", 390)
  localStorage.setItem("amtdex_session", JSON.stringify({ user: { id: "test-admin", name: "مسؤول الاختبار", email: "admin@example.test", role: "admin" } }))
})
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); document.body.style.overflow = "" })
function renderLayout(path = "/dashboard/content") {
  return render(<MemoryRouter initialEntries={[path]}><DashboardLayout><h1>محتوى القسم</h1></DashboardLayout></MemoryRouter>)
}
it("locks background scrolling, traps focus and restores the trigger when the drawer closes", () => {
  renderLayout()
  const toggle = screen.getByRole("button", { name: "فتح القائمة" })
  toggle.focus(); fireEvent.click(toggle)
  const dialog = screen.getByRole("dialog", { name: "قائمة لوحة التحكم" })
  expect(toggle).toHaveAttribute("aria-expanded", "true")
  expect(document.body.style.overflow).toBe("hidden")
  const close = within(dialog).getByRole("button", { name: "إغلاق القائمة" })
  expect(close).toHaveFocus()
  const lastLink = within(dialog).getByRole("link", { name: /العودة للموقع/ })
  lastLink.focus(); fireEvent.keyDown(dialog, { key: "Tab" })
  expect(close).toHaveFocus()
  fireEvent.keyDown(dialog, { key: "Escape" })
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  expect(document.body.style.overflow).toBe("")
  expect(toggle).toHaveFocus()
})
it("closes the drawer and releases its scroll lock when resizing to desktop", () => {
  renderLayout()
  fireEvent.click(screen.getByRole("button", { name: "فتح القائمة" }))
  vi.stubGlobal("innerWidth", 1280)
  act(() => fireEvent(window, new Event("resize")))
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  expect(document.body.style.overflow).toBe("")
})
it("closes the drawer after choosing a destination", () => {
  renderLayout()
  fireEvent.click(screen.getByRole("button", { name: "المزيد من أقسام اللوحة" }))
  const dialog = screen.getByRole("dialog")
  fireEvent.click(within(dialog).getByRole("link", { name: "الوسائط" }))
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  expect(document.body.style.overflow).toBe("")
})
it("only offers quick destinations allowed for the current role", () => {
  localStorage.setItem("amtdex_session", JSON.stringify({ user: { id: "reader", name: "قارئ", email: "reader@example.test", role: "viewer" } }))
  renderLayout("/dashboard/leads")
  const dock = screen.getByRole("navigation", { name: "التنقل السريع في لوحة التحكم" })
  expect(within(dock).getByRole("link", { name: "الطلبات" })).toHaveAttribute("aria-current", "page")
  expect(within(dock).queryByRole("link", { name: "المدونة" })).not.toBeInTheDocument()
  expect(within(dock).queryByRole("link", { name: "المحتوى" })).not.toBeInTheDocument()
  expect(within(dock).getByRole("button", { name: "المزيد من أقسام اللوحة" })).toBeInTheDocument()
})
