import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { QuotePage } from "@/pages/Quote/QuotePage"
const state = vi.hoisted(() => ({ quote: vi.fn() }))
vi.mock("@/lib/api", () => ({ API: { quote: state.quote } }))
vi.mock("@/lib/leadStore", () => ({ addLead: vi.fn() }))
vi.mock("@/lib/queries", () => ({ useServicesQuery: () => ({ data: [{ slug: "web", title: "تطوير المواقع", icon: "web", description: "تصميم وتطوير المواقع" }] }) }))
afterEach(cleanup)
beforeEach(() => state.quote.mockReset())
function start() {
  render(<MemoryRouter><QuotePage onToast={vi.fn()} /></MemoryRouter>)
  fireEvent.click(screen.getByRole("button", { name: /تطوير المواقع/ }))
  fireEvent.click(screen.getByRole("button", { name: /الخطوة التالية/ }))
  fireEvent.click(screen.getByRole("button", { name: /مرن/ }))
  fireEvent.click(screen.getByRole("button", { name: /الخطوة التالية/ }))
}
it("keeps contact details when going back and corrects validation errors", () => {
  start()
  fireEvent.click(screen.getByRole("button", { name: /إرسال طلب عرض السعر/ }))
  const name = screen.getByLabelText(/الاسم الكامل/)
  expect(name).toHaveFocus()
  fireEvent.change(name, { target: { value: "إبراهيم الشامي" } })
  expect(name).toHaveAttribute("aria-invalid", "false")
  fireEvent.click(screen.getByRole("button", { name: /رجوع/ }))
  fireEvent.click(screen.getByRole("button", { name: /الخطوة التالية/ }))
  expect(screen.getByLabelText(/الاسم الكامل/)).toHaveValue("إبراهيم الشامي")
  expect(screen.getByText("بيانات التواصل").closest("li")).toHaveAttribute("aria-current", "step")
})
it("uses the chosen country and normalizes the submitted phone", async () => {
  state.quote.mockResolvedValue({})
  start()
  fireEvent.change(screen.getByLabelText(/الاسم الكامل/), { target: { value: "إبراهيم الشامي" } })
  fireEvent.change(screen.getByLabelText(/البريد الإلكتروني/), { target: { value: "test@example.com" } })
  fireEvent.change(screen.getByLabelText("الدولة / مفتاح الاتصال"), { target: { value: "GB" } })
  fireEvent.change(screen.getByLabelText(/رقم الهاتف/), { target: { value: "020 7946 0018" } })
  fireEvent.change(screen.getByLabelText(/تفاصيل ونبذة/), { target: { value: "أريد تطوير موقع إلكتروني للشركة" } })
  fireEvent.click(screen.getByRole("button", { name: /إرسال طلب عرض السعر/ }))
  await waitFor(() => expect(state.quote).toHaveBeenCalledTimes(1))
  expect(state.quote.mock.calls[0][0].phone).toBe("+442079460018")
})
