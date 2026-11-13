import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { ContactPage } from "@/pages/Contact/ContactPage"
const state = vi.hoisted(() => ({ contact: vi.fn(), addLead: vi.fn() }))
vi.mock("@/lib/api", () => ({ API: { contact: state.contact } }))
vi.mock("@/lib/leadStore", () => ({ addLead: state.addLead }))
afterEach(cleanup)
beforeEach(() => { vi.clearAllMocks(); state.contact.mockReset() })
function fill() {
  fireEvent.change(screen.getByLabelText(/الاسم الكامل/), { target: { value: "إبراهيم الشامي" } })
  fireEvent.change(screen.getByLabelText(/البريد الإلكتروني/), { target: { value: "ibrahim@example.com" } })
  fireEvent.change(screen.getByLabelText(/رقم الجوال/), { target: { value: "+967784440429" } })
  fireEvent.change(screen.getByLabelText(/^رسالتك/), { target: { value: "أريد تطوير موقع جديد لشركتي" } })
}
it("focuses the first invalid field and does not send an empty form", () => {
  render(<ContactPage onToast={vi.fn()} />)
  fireEvent.click(screen.getByRole("button", { name: /إرسال الرسالة/ }))
  expect(screen.getByLabelText(/الاسم الكامل/)).toHaveFocus()
  expect(screen.getByLabelText(/الاسم الكامل/)).toHaveAttribute("aria-invalid", "true")
  expect(state.contact).not.toHaveBeenCalled()
})
it("confirms successful submission inline and resets submitted fields", async () => {
  state.contact.mockResolvedValue({})
  render(<ContactPage onToast={vi.fn()} />)
  fill()
  fireEvent.click(screen.getByRole("button", { name: /إرسال الرسالة/ }))
  expect(await screen.findByRole("status")).toHaveTextContent("وصلتنا رسالتك بنجاح")
  expect(state.contact).toHaveBeenCalledTimes(1)
  expect(state.addLead).toHaveBeenCalledTimes(1)
  expect(screen.getByLabelText(/الاسم الكامل/)).toHaveValue("")
})
it("retains user input when the request fails and allows retry", async () => {
  state.contact.mockRejectedValue(new Error("تعذر الاتصال بالخادم"))
  render(<ContactPage onToast={vi.fn()} />)
  fill()
  fireEvent.click(screen.getByRole("button", { name: /إرسال الرسالة/ }))
  expect(await screen.findByRole("alert")).toHaveTextContent("تعذر الاتصال بالخادم")
  expect(screen.getByLabelText(/الاسم الكامل/)).toHaveValue("إبراهيم الشامي")
  expect(state.addLead).not.toHaveBeenCalled()
  await waitFor(() => expect(screen.getByRole("button", { name: /إرسال الرسالة/ })).toBeEnabled())
})
