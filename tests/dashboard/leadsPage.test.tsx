import { API } from "@/lib/api"
import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import { LeadsPage } from "@/pages/Dashboard/Leads"

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe("LeadsPage (Dashboard)", () => {
  afterEach(() => vi.restoreAllMocks())
  it("renders leads management page, export button, and filter controls", async () => {
    vi.spyOn(API.leads, "list").mockResolvedValue({ data: [{ id: "request-1", name: "عميل الاختبار", email: "client@example.test", message: "طلب موقع", status: "جديد", source: "contact", createdAt: "2026-11-14T12:00:00Z" }] })
    renderWithClient(<LeadsPage />)

    expect(screen.getByRole("heading", { name: "الطلبات والتواصل" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "تصدير CSV" })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "الكل" }).length).toBeGreaterThan(0)
    expect(screen.getByRole("button", { name: "جديد" })).toBeInTheDocument()

    // Verify table columns
    expect(await screen.findByText("الاسم")).toBeInTheDocument()
    expect(screen.getByText("المصدر")).toBeInTheDocument()
    expect(screen.getByText("الحالة")).toBeInTheDocument()
    expect(screen.getByText("التاريخ")).toBeInTheDocument()
  })
})

