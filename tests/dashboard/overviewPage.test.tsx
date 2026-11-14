import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import { OverviewPage } from "@/pages/Dashboard/Overview"

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("OverviewPage (Dashboard)", () => {
  beforeEach(() => localStorage.setItem("amtdex_session", JSON.stringify({ user: { id: "test-admin", name: "مسؤول الاختبار", email: "admin@example.test", role: "admin" } })))
  afterEach(() => localStorage.clear())
  it("renders enterprise overview hero, stats, and modules", async () => {
    renderWithClient(<OverviewPage onToast={() => {}} />)

    expect(screen.getByText("مركز Amtdex التشغيلي")).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/ابحث عن طلب/)).toBeInTheDocument()
    expect(await screen.findByText("المشاريع النشطة")).toBeInTheDocument()
    expect(screen.getByText("طلبات التواصل")).toBeInTheDocument()
    expect(screen.getByText("طلبات المشاريع")).toBeInTheDocument()
    expect(screen.getByText("تابع من حيث توقفت")).toBeInTheDocument()
    expect(screen.getByText("المحتوى والنشر")).toBeInTheDocument()
  })
})
