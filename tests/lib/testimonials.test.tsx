import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { expect, it } from "vitest"
import { Testimonials } from "@/pages/Home/Testimonials"

it("lets readers navigate all existing testimonials and wraps in both directions", () => {
  render(<MemoryRouter><Testimonials /></MemoryRouter>)
  expect(screen.getByText("سارة العتيبي")).toBeVisible()
  fireEvent.click(screen.getByRole("button", { name: "الرأي التالي" }))
  expect(screen.getByText("عمر الحربي")).toBeVisible()
  fireEvent.click(screen.getByRole("button", { name: "عرض رأي نورة القحطاني" }))
  expect(screen.getByText("نورة القحطاني")).toBeVisible()
  expect(screen.getByRole("button", { name: "عرض رأي نورة القحطاني" })).toHaveAttribute("aria-pressed", "true")
  fireEvent.click(screen.getByRole("button", { name: "الرأي التالي" }))
  expect(screen.getByText("سارة العتيبي")).toBeVisible()
  fireEvent.click(screen.getByRole("button", { name: "الرأي السابق" }))
  expect(screen.getByText("نورة القحطاني")).toBeVisible()
})
