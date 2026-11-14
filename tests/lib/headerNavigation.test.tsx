import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { Header } from "@/components/layout/Header"
vi.mock("@/cms/useCms", () => ({ pageIsListed: () => true, useCms: () => ({ pages: [], nav: [
  { id: "services", to: "/services", visible: true, label: "الخدمات" },
  { id: "about", to: "/about", visible: true, label: "من نحن" },
] }) }))
vi.mock("@/routing/lifecycle", () => ({ prefetchRoute: vi.fn() }))
afterEach(cleanup)
it("updates the active link and closes the mobile menu on navigation", () => {
  render(<MemoryRouter initialEntries={["/services"]}><Header onToast={() => {}} /></MemoryRouter>)
  const nav = screen.getByRole("navigation", { name: "التنقل الرئيسي" })
  expect(within(nav).getByRole("link", { name: "الخدمات" })).toHaveAttribute("aria-current", "page")
  fireEvent.click(screen.getByRole("button", { name: "فتح القائمة" }))
  expect(document.body.style.overflow).toBe("hidden")
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("link", { name: "من نحن" }))
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  expect(document.body.style.overflow).not.toBe("hidden")
  expect(within(nav).getByRole("link", { name: "من نحن" })).toHaveAttribute("aria-current", "page")
  expect(within(nav).getByRole("link", { name: "الخدمات" })).not.toHaveAttribute("aria-current")
})
it("releases the menu scroll lock when resizing to desktop", () => {
  const previousWidth = window.innerWidth
  render(<MemoryRouter><Header onToast={() => {}} /></MemoryRouter>)
  fireEvent.click(screen.getByRole("button", { name: "فتح القائمة" }))
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 })
  fireEvent(window, new Event("resize"))
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  expect(document.body.style.overflow).not.toBe("hidden")
  Object.defineProperty(window, "innerWidth", { configurable: true, value: previousWidth })
})
