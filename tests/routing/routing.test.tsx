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
    expect(container.querySelector("h1")?.textContent).toMatch(/هندسة الفكرة/)
  })

  it("الخدمات /services تعرض العنوان", async () => {
    renderAt("/services")
    expect(await screen.findByText(/تصميم وبرمجة وحلول رقمية/)).toBeInTheDocument()
  })

  it("تفاصيل خدمة /services/web تعرض العنوان", async () => {
    renderAt("/services/web")
    expect(await screen.findByRole("heading", { name: "تصميم وبرمجة المواقع الإلكترونية" })).toBeInTheDocument()
  })

  it("الأعمال /portfolio غير منشورة", async () => {
    renderAt("/portfolio")
    expect(await screen.findByText(/404/)).toBeInTheDocument()
  })

  it("تفاصيل مشروع مخترع غير منشورة", async () => {
    renderAt("/portfolio/noon-replatform")
    expect(await screen.findByText(/404/)).toBeInTheDocument()
  })

  it("الأسعار /pricing غير منشورة", async () => {
    renderAt("/pricing")
    expect(await screen.findByText(/404/)).toBeInTheDocument()
  })

  it("من نحن /about تعرض العنوان", async () => {
    renderAt("/about")
    expect(await screen.findByRole("heading", { level: 1, name: /امتدكس سوفت/ })).toBeInTheDocument()
  })

  it("تواصل /contact تعرض النموذج", async () => {
    renderAt("/contact")
    expect(await screen.findByText(/لنبدأ/)).toBeInTheDocument()
  })

  it("طلب عرض سعر /quote", async () => {
    renderAt("/quote")
    expect(await screen.findByRole("heading", { name: /اطلب عرض سعر/ })).toBeInTheDocument()
  })

  it("لوحة التحكم على نطاق منفصل تعيد 404 بلا رابط دخول", async () => {
    window.__AMTDEX_CONFIG__ = { isDashboardHost: false, dashboardDomain: "admin.example.com", host: "amtdex.com" }
    renderAt("/dashboard")
    expect(await screen.findByText(/404/)).toBeInTheDocument()
    expect(screen.queryByText(/تسجيل الدخول/)).not.toBeInTheDocument()
  })

  it("لوحة التحكم على نفس النطاق تفتح تسجيل الدخول", async () => {
    window.__AMTDEX_CONFIG__ = { isDashboardHost: false, dashboardDomain: "", host: "127.0.0.1" }
    renderAt("/dashboard")
    expect(await screen.findByText(/تسجيل الدخول/)).toBeInTheDocument()
  })

  it("لوحة التحكم على نطاقها تحوّل الزائر لتسجيل الدخول", async () => {
    window.__AMTDEX_CONFIG__ = { isDashboardHost: true, host: "admin.localhost", dashboardDomain: "admin.localhost" }
    renderAt("/dashboard")
    expect(await screen.findByText(/تسجيل الدخول/)).toBeInTheDocument()
  })

  it("مسار غير موجود → 404", async () => {
    renderAt("/no-such-page-xyz")
    expect(await screen.findByText(/404/)).toBeInTheDocument()
  })
})
