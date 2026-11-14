import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BlogHomePage } from "@/pages/Blog/BlogHomePage"
import { BlogAPI } from "@/lib/blogApi"
vi.mock("@/lib/blogApi", () => ({ BlogAPI: { getPosts: vi.fn(), getSettings: vi.fn(), getCategories: vi.fn() } }))
afterEach(() => { cleanup(); vi.resetAllMocks() })
it("reserves featured content while its slower request is pending", async () => {
  const post = { id: 1, slug: "engineering", title: "دليل هندسي", summary: "ملخص المقال", reading_time_minutes: 3 }
  const result = { data: [post], meta: { current_page: 1, last_page: 1, total: 1, per_page: 9 } }
  let resolveFeatured!: (value: unknown) => void
  const featured = new Promise(resolve => { resolveFeatured = resolve })
  vi.mocked(BlogAPI.getPosts).mockImplementation(params => (params?.featured ? featured : Promise.resolve(result)) as ReturnType<typeof BlogAPI.getPosts>)
  vi.mocked(BlogAPI.getCategories).mockResolvedValue({ data: [] })
  vi.mocked(BlogAPI.getSettings).mockResolvedValue({ settings: {} } as Awaited<ReturnType<typeof BlogAPI.getSettings>>)
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={client}><HelmetProvider><MemoryRouter><BlogHomePage /></MemoryRouter></HelmetProvider></QueryClientProvider>)
  await screen.findByRole("heading", { name: post.title, level: 3 })
  expect(screen.getByRole("status", { name: "جار تحميل المقال المميز" })).toHaveClass("blog-featured-skeleton")
  resolveFeatured(result)
  await screen.findByRole("heading", { name: post.title, level: 2 })
  expect(screen.queryByRole("status", { name: "جار تحميل المقال المميز" })).not.toBeInTheDocument()
})
