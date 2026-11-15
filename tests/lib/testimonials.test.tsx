import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { expect, it } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Testimonials } from "@/pages/Home/Testimonials"

const published = [
  { author: "خالد", content: "عمل ممتاز.", role: "مدير التسويق", company: "شركة أ", avatar: "/storage/khaled.jpg", rating: 5, sort_order: 0, is_active: true },
  { author: "منى", content: "تعامل راقٍ.", role: "", company: "", avatar: null, rating: 5, sort_order: 1, is_active: true },
  { author: "سعيد", content: "تسليم في الموعد.", role: "مؤسس", company: "", avatar: null, rating: 5, sort_order: 2, is_active: true },
]

function renderWith(data: unknown[]) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  queryClient.setQueryData(["content", "testimonials", "public"], data)
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter><Testimonials /></MemoryRouter>
    </QueryClientProvider>,
  )
}

it("lets readers navigate the published testimonials and wraps in both directions", () => {
  renderWith(published)
  expect(screen.getByText("خالد")).toBeVisible()
  fireEvent.click(screen.getByRole("button", { name: "الرأي التالي" }))
  expect(screen.getByText("منى")).toBeVisible()
  fireEvent.click(screen.getByRole("button", { name: "عرض رأي سعيد" }))
  expect(screen.getByText("سعيد")).toBeVisible()
  expect(screen.getByRole("button", { name: "عرض رأي سعيد" })).toHaveAttribute("aria-pressed", "true")
  fireEvent.click(screen.getByRole("button", { name: "الرأي التالي" }))
  expect(screen.getByText("خالد")).toBeVisible()
  fireEvent.click(screen.getByRole("button", { name: "الرأي السابق" }))
  expect(screen.getByText("سعيد")).toBeVisible()
})

it("shows the photo, role and company entered in the dashboard", () => {
  const { container } = renderWith(published)
  expect(screen.getByText("مدير التسويق · شركة أ")).toBeVisible()
  expect(container.querySelector("img.testimonial-photo")).toHaveAttribute("src", "/storage/khaled.jpg")
})

it("renders nothing when no testimonial is published", () => {
  const { container } = renderWith([])
  expect(container.querySelector(".testimonial-panel")).toBeNull()
})
