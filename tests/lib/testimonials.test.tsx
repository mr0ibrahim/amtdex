import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { expect, it } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Testimonials } from "@/pages/Home/Testimonials"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

it("lets readers navigate all existing testimonials and wraps in both directions", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter><Testimonials /></MemoryRouter>
    </QueryClientProvider>
  )
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
