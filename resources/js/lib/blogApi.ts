import { apiClient } from "./api"
import type {
  BlogCategory,
  BlogComment,
  BlogPost,
  BlogRedirect,
  BlogSettings,
  BlogStats,
  BlogTag,
} from "@/types/blog"

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    has_more?: boolean
  }
}

export interface PostDetailResponse {
  post: BlogPost
  data?: BlogPost
  related: BlogPost[]
  navigation: { next?: BlogPost | null; prev?: BlogPost | null }
  redirect?: boolean
  target?: string
}

export const BlogAPI = {
  // ── Public API ──
  getPosts: async (params?: {
    page?: number
    category?: string
    tag?: string
    q?: string
    featured?: boolean
    per_page?: number
  }) => {
    const q = new URLSearchParams()
    if (params?.page) q.set("page", String(params.page))
    if (params?.category) q.set("category", params.category)
    if (params?.tag) q.set("tag", params.tag)
    if (params?.q) q.set("q", params.q)
    if (params?.featured) q.set("featured", "1")
    if (params?.per_page) q.set("per_page", String(params.per_page))

    const url = `/blog/posts${q.toString() ? `?${q.toString()}` : ""}`
    return apiClient<PaginatedResult<BlogPost>>(url, "GET")
  },

  getPost: async (slug: string): Promise<PostDetailResponse> => {
    const res = await apiClient<{
      post: BlogPost
      related: BlogPost[]
      navigation: { next?: BlogPost | null; prev?: BlogPost | null }
      redirect?: boolean
      target?: string
    }>(`/blog/posts/${slug}`, "GET")

    return {
      ...res,
      data: res.post,
    }
  },

  getPostBySlug: async (slug: string): Promise<PostDetailResponse> => {
    return BlogAPI.getPost(slug)
  },

  getCategories: async () => {
    return apiClient<{ data: BlogCategory[] }>("/blog/categories", "GET")
  },

  getCategory: async (slug: string, page = 1) => {
    return apiClient<{
      category: BlogCategory
      posts: BlogPost[]
      meta: { current_page: number; last_page: number; total: number }
    }>(`/blog/categories/${slug}?page=${page}`, "GET")
  },

  getTags: async () => {
    return apiClient<{ data: BlogTag[] }>("/blog/tags", "GET")
  },

  getTag: async (slug: string, page = 1) => {
    return apiClient<{
      tag: BlogTag
      posts: BlogPost[]
      meta: { current_page: number; last_page: number; total: number }
    }>(`/blog/tags/${slug}?page=${page}`, "GET")
  },

  createComment: async (
    slugOrId: string | number,
    data: {
      author_name: string
      author_email: string
      content: string
      parent_id?: number
    }
  ) => {
    return apiClient<{ ok: boolean; message: string; comment: BlogComment }>(
      `/blog/posts/${slugOrId}/comments`,
      "POST",
      data
    )
  },

  getSettings: async () => {
    return apiClient<{ settings: BlogSettings }>("/blog/settings", "GET")
  },

  // ── Admin API ──
  getAdminStats: async () => {
    return apiClient<{ stats: BlogStats }>("/admin/blog/stats", "GET")
  },

  getAdminPosts: async (params?: {
    page?: number
    status?: string
    category_id?: number
    author_id?: number
    search?: string
    sort_by?: string
    sort_dir?: "asc" | "desc"
  }) => {
    const q = new URLSearchParams()
    if (params?.page) q.set("page", String(params.page))
    if (params?.status) q.set("status", params.status)
    if (params?.category_id) q.set("category_id", String(params.category_id))
    if (params?.author_id) q.set("author_id", String(params.author_id))
    if (params?.search) q.set("search", params.search)
    if (params?.sort_by) q.set("sort_by", params.sort_by)
    if (params?.sort_dir) q.set("sort_dir", params.sort_dir)

    const url = `/admin/blog/posts${q.toString() ? `?${q.toString()}` : ""}`
    return apiClient<PaginatedResult<BlogPost>>(url, "GET")
  },

  getAdminPost: async (id: number) => {
    return apiClient<{ post: BlogPost }>(`/admin/blog/posts/${id}`, "GET")
  },

  createAdminPost: async (payload: Partial<BlogPost>) => {
    return apiClient<{ ok: boolean; message: string; post: BlogPost }>(
      "/admin/blog/posts",
      "POST",
      payload
    )
  },

  updateAdminPost: async (id: number, payload: Partial<BlogPost>) => {
    return apiClient<{ ok: boolean; message: string; post: BlogPost }>(
      `/admin/blog/posts/${id}`,
      "PUT",
      payload
    )
  },

  deleteAdminPost: async (id: number) => {
    return apiClient<{ ok: boolean; message: string }>(`/admin/blog/posts/${id}`, "DELETE")
  },

  bulkActionPosts: async (ids: number[], action: "publish" | "draft" | "archive" | "delete") => {
    return apiClient<{ ok: boolean; message: string }>(
      "/admin/blog/posts/bulk",
      "POST",
      { ids, action }
    )
  },

  // Categories
  getAdminCategories: async () => {
    return apiClient<{ data: BlogCategory[] }>("/admin/blog/categories", "GET")
  },

  saveCategory: async (payload: Partial<BlogCategory>) => {
    if (payload.id) {
      return apiClient<{ ok: boolean; category: BlogCategory }>(
        `/admin/blog/categories/${payload.id}`,
        "PUT",
        payload
      )
    }
    return apiClient<{ ok: boolean; category: BlogCategory }>("/admin/blog/categories", "POST", payload)
  },

  deleteCategory: async (id: number) => {
    return apiClient<{ ok: boolean; message: string }>(`/admin/blog/categories/${id}`, "DELETE")
  },

  // Tags
  getAdminTags: async () => {
    return apiClient<{ data: BlogTag[] }>("/admin/blog/tags", "GET")
  },

  saveTag: async (payload: Partial<BlogTag>) => {
    if (payload.id) {
      return apiClient<{ ok: boolean; tag: BlogTag }>(`/admin/blog/tags/${payload.id}`, "PUT", payload)
    }
    return apiClient<{ ok: boolean; tag: BlogTag }>("/admin/blog/tags", "POST", payload)
  },

  deleteTag: async (id: number) => {
    return apiClient<{ ok: boolean; message: string }>(`/admin/blog/tags/${id}`, "DELETE")
  },

  // Comments
  getAdminComments: async (params?: { page?: number; status?: string }) => {
    const q = new URLSearchParams()
    if (params?.page) q.set("page", String(params.page))
    if (params?.status) q.set("status", params.status)

    return apiClient<PaginatedResult<BlogComment> & { counts: Record<string, number> }>(
      `/admin/blog/comments${q.toString() ? `?${q.toString()}` : ""}`,
      "GET"
    )
  },

  updateCommentStatus: async (id: number, status: "pending" | "approved" | "rejected" | "spam") => {
    return apiClient<{ ok: boolean; comment: BlogComment }>(
      `/admin/blog/comments/${id}/status`,
      "PATCH",
      { status }
    )
  },

  deleteComment: async (id: number) => {
    return apiClient<{ ok: boolean; message: string }>(`/admin/blog/comments/${id}`, "DELETE")
  },

  // Redirects
  getAdminRedirects: async () => {
    return apiClient<{ data: BlogRedirect[] }>("/admin/blog/redirects", "GET")
  },

  saveRedirect: async (payload: { source_path: string; target_path: string; status_code: number }) => {
    return apiClient<{ ok: boolean; redirect: BlogRedirect }>("/admin/blog/redirects", "POST", payload)
  },

  deleteRedirect: async (id: number) => {
    return apiClient<{ ok: boolean; message: string }>(`/admin/blog/redirects/${id}`, "DELETE")
  },

  // Settings
  getAdminSettings: async () => {
    return apiClient<{ settings: BlogSettings }>("/admin/blog/settings", "GET")
  },

  updateAdminSettings: async (payload: Partial<BlogSettings>) => {
    return apiClient<{ ok: boolean; settings: BlogSettings }>("/admin/blog/settings", "PUT", payload)
  },
}
