import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { ExperienceStudio } from "@/pages/Home/ExperienceStudio"

vi.mock("@/cms/PublicLink", async () => ({ PublicLink: (await import("react-router-dom")).Link }))
beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

it("switches sample products and supports RTL keyboard navigation", async () => {
  const user = userEvent.setup()
  render(<MemoryRouter><ExperienceStudio /></MemoryRouter>)
  await user.click(screen.getByRole("tab", { name: /نظام أعمال/ }))
  expect(screen.getByRole("tabpanel")).toHaveTextContent("إنجاز المشروع")
  await user.keyboard("{ArrowLeft}")
  expect(screen.getByRole("tab", { name: /منصة حجوزات/ })).toHaveFocus()
  expect(screen.getByRole("tabpanel")).toHaveTextContent("المواعيد هذا الأسبوع")
  await user.keyboard("{Home}")
  expect(screen.getByRole("tab", { name: /متجر إلكتروني/ })).toHaveAttribute("aria-selected", "true")
  expect(screen.getByRole("link", { name: /لنصمّم مشروعك/ })).toHaveAttribute("href", "/quote")
})


it("cycles the visible deck using explicit controls without losing the active tab", async () => {
  const user = userEvent.setup()
  const { container } = render(<MemoryRouter><ExperienceStudio /></MemoryRouter>)
  await user.click(screen.getByRole("button", { name: "النموذج التالي" }))
  expect(screen.getByRole("tab", { name: /نظام أعمال/ })).toHaveAttribute("aria-selected", "true")
  expect(container.querySelector('.project-deck-card-operations')).toHaveAttribute("data-active", "true")
  await user.click(screen.getByRole("button", { name: "النموذج السابق" }))
  expect(screen.getByRole("tab", { name: /متجر إلكتروني/ })).toHaveAttribute("aria-selected", "true")
  await user.click(screen.getByRole("button", { name: "النموذج السابق" }))
  expect(screen.getByRole("tab", { name: /منصة حجوزات/ })).toHaveAttribute("aria-selected", "true")
})
