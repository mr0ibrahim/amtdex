import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "@/components/App"

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("routing", () => {
  it("الرئيسية / تعرض حلول برمجية", async () => {
    const { container } = renderAt("/")
    // بعد R1 الهيرو مجزأ على spans، نتحقق من الـ h1 مباشرةً بدل findByText
    await screen.findByRole("heading", { level: 1 }, { timeout: 5000 })
    expect(container.querySelector("h1")?.textContent).toMatch(/نحوّل أفكارك/)
  })

  it("الخدمات /services تعرض العنوان", async () => {
    renderAt("/services")
    expect(await screen.findByText(/كل ما تحتاجه لبناء/)).toBeInTheDocument()
  })

  it("تفاصيل خدمة /services/web تعرض العنوان", async () => {
    renderAt("/services/web")
    expect(await screen.findByRole("heading", { name: "تطوير المواقع" })).toBeInTheDocument()
  })

  it("الأعمال /portfolio تعرض العنوان", async () => {
    renderAt("/portfolio")
    expect(await screen.findByText(/نصنع منتجات/)).toBeInTheDocument()
  })

  it("تفاصيل مشروع /portfolio/noon-replatform", async () => {
    renderAt("/portfolio/noon-replatform")
    expect(await screen.findByText(/إعادة بناء منصة نون/)).toBeInTheDocument()
  })

  it("الأسعار /pricing تعرض العنوان", async () => {
    renderAt("/pricing")
    expect(await screen.findByText(/استثمار برمجي واضح/)).toBeInTheDocument()
  })

  it("من نحن /about تعرض العنوان", async () => {
    renderAt("/about")
    expect(await screen.findByText(/نبني برمجيات/)).toBeInTheDocument()
  })

  it("تواصل /contact تعرض النموذج", async () => {
    renderAt("/contact")
    expect(await screen.findByText(/لنتحدث عن/)).toBeInTheDocument()
  })

  it("طلب عرض سعر /quote", async () => {
    renderAt("/quote")
    expect(await screen.findByRole("heading", { name: /اطلب عرض سعر/ })).toBeInTheDocument()
  })

  it("لوحة التحكم /dashboard — محمية (تحويل لتسجيل الدخول)", async () => {
    renderAt("/dashboard")
    // بعد S1 اللوحة محمية — غير المسجل يُحول لـ /login
    expect(await screen.findByText(/تسجيل الدخول/)).toBeInTheDocument()
  })

  it("مسار غير موجود → 404", async () => {
    renderAt("/no-such-page-xyz")
    expect(await screen.findByText(/404/)).toBeInTheDocument()
  })
})
