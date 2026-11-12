import { render, screen } from "@testing-library/react"
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

it("hides testimonials when the company has not published any", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter><Testimonials /></MemoryRouter>
    </QueryClientProvider>
  )
  expect(screen.queryByText("سارة العتيبي")).not.toBeInTheDocument()
  expect(screen.queryByRole("region", { name: "آراء العملاء" })).not.toBeInTheDocument()
})
