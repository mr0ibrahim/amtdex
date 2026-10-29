import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
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
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe("OverviewPage (Dashboard)", () => {
  it("renders overview stats heading and welcoming card", async () => {
    renderWithClient(<OverviewPage onToast={() => {}} />)

    expect(screen.getByRole("heading", { name: "نظرة عامة" })).toBeInTheDocument()
    expect(await screen.findByText("المشاريع النشطة")).toBeInTheDocument()
    expect(screen.getByText("طلبات التواصل")).toBeInTheDocument()
    expect(screen.getByText("عروض الأسعار")).toBeInTheDocument()
    expect(screen.getByText(/مرحباً في لوحة Amtdex/)).toBeInTheDocument()
  })
})

