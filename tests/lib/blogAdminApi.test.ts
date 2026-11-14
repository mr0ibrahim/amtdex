import { afterEach, expect, it, vi } from "vitest"
import { BlogAPI } from "@/lib/blogApi"

afterEach(() => { vi.restoreAllMocks(); delete window.__AMTDEX_CONFIG__ })
it("reads the flat statistics response returned by Laravel", async () => {
  const stats = { total_posts: 3, published_posts: 3, total_views: 24, pending_comments: 2, categories_count: 1, tags_count: 4, top_posts: [], recent_comments: [] }
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(stats), { status: 200 }))
  expect((await BlogAPI.getAdminStats()).stats).toEqual(stats)
})
it("also accepts a wrapped statistics response", async () => {
  const stats = { total_posts: 3, published_posts: 3, total_views: 0, pending_comments: 0, top_posts: [], recent_comments: [] }
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ stats }), { status: 200 }))
  expect((await BlogAPI.getAdminStats()).stats).toEqual(stats)
})
it("sends the q search parameter understood by the administrative posts controller", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: [], meta: { total: 0 } }), { status: 200 }))
  await BlogAPI.getAdminPosts({ search: "تصميم المواقع", page: 2, status: "published" })
  const request = new URL(String(fetch.mock.calls[0][0]), "http://localhost")
  expect(request.searchParams.get("q")).toBe("تصميم المواقع")
  expect(request.searchParams.get("page")).toBe("2")
  expect(request.searchParams.has("search")).toBe(false)
})
