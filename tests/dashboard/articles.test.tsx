import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { afterEach, describe, expect, it, vi } from "vitest"
import { BlogAPI, type AdminPostsResult } from "@/lib/blogApi"
import { PostsManager } from "@/pages/Dashboard/Blog/PostsManager"
import type { BlogPost } from "@/types/blog"

const title = "تصميم مواقع إلكترونية في اليمن: كيف تختار الموقع المناسب لنشاطك التجاري؟"
const post: BlogPost = { id: 1, author_id: 1, title, slug: "tsmym-mwaqaa-alktrony-fy-alymn-".repeat(12), content: "", status: "published", views_count: 5, reading_time_minutes: 2, is_featured: false, allow_comments: true, robots_index: true, robots_follow: true, og_type: "article", twitter_card: "summary_large_image", schema_type: "BlogPosting" }
const response: AdminPostsResult = { data: [post], meta: { current_page: 1, last_page: 3, per_page: 15, total: 31 }, counts: { all: 42, published: 30, draft: 10, archived: 1, scheduled: 1 } }
function renderManager() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}><PostsManager onNotify={vi.fn()} /></QueryClientProvider>)
}
afterEach(() => { cleanup(); vi.restoreAllMocks() })

describe("article management", () => {
  it("renders very long article links inside a bounded mobile card with named actions", async () => {
    vi.spyOn(BlogAPI, "getAdminPosts").mockResolvedValue(response)
    const { container } = renderManager()
    const card = await screen.findByRole("article")
    expect(within(card).getByRole("heading", { name: title })).toBeInTheDocument()
    const slug = container.querySelector(".dash-post-slug")!
    expect(slug).toHaveAttribute("dir", "ltr")
    expect(slug.textContent).toContain(post.slug)
    expect(within(card).getByRole("button", { name: "تعديل" })).toBeInTheDocument()
    expect(within(card).getByRole("link", { name: "معاينة" })).toBeInTheDocument()
    expect(within(card).getByRole("button", { name: "حذف المقال" })).toBeInTheDocument()
  })
  it("uses server totals, requests the next page, and resets pagination when searching", async () => {
    const list = vi.spyOn(BlogAPI, "getAdminPosts").mockResolvedValue(response)
    renderManager()
    await screen.findByRole("article")
    expect(screen.getByRole("option", { name: "كل الحالات (42)" })).toBeInTheDocument()
    expect(screen.getByText("منشور: 30")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "التالي" }))
    await waitFor(() => expect(list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })))
    fireEvent.change(screen.getByRole("searchbox", { name: "بحث المقالات" }), { target: { value: "برمجة" } })
    await waitFor(() => expect(list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, search: "برمجة" })))
  })
  it("shows a fetch error instead of claiming the article collection is empty", async () => {
    vi.spyOn(BlogAPI, "getAdminPosts").mockRejectedValue(new Error("تعذر تحميل المقالات"))
    renderManager()
    expect(await screen.findByRole("alert")).toHaveTextContent("تعذر تحميل المقالات")
    expect(screen.queryByText("لا توجد مقالات مطابقة. ابدأ بإنشاء مقالك الأول.")).not.toBeInTheDocument()
  })
})
