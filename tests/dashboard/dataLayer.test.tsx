import { act, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { afterEach, describe, expect, it, vi, type MockInstance } from "vitest"
import { API, ApiError } from "@/lib/api"
import { useServicesQuery, useUpsertServiceMutation } from "@/lib/queries"
import type { Service } from "@/types/service"

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
afterEach(() => vi.restoreAllMocks())

describe("administrative data boundary", () => {
  it("uses the staff collection including drafts rather than the public catalogue", async () => {
    const draft: Service = { id: "draft", slug: "hidden", title: "مسودة", desc: "خدمة مخفية", icon: "web", bullets: [], tech: [], is_published: false }
    const admin = vi.spyOn(API.adminContent, "list").mockResolvedValue({ data: [draft] })
    const publicList = vi.spyOn(API.services, "list")
    const { result } = renderHook(() => useServicesQuery({ fallback: false }), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([draft])
    expect(admin).toHaveBeenCalledWith("services")
    expect(publicList).not.toHaveBeenCalled()
  })
  it("keeps a successful empty public catalogue empty", async () => {
    vi.spyOn(API.services, "list").mockResolvedValue({ data: [] })
    const { result } = renderHook(() => useServicesQuery(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })
  it("does not mask staff authorization errors with seed content", async () => {
    vi.spyOn(API.adminContent, "list").mockRejectedValue(new ApiError(403, "غير مصرح"))
    const { result } = renderHook(() => useServicesQuery({ fallback: false }), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBeUndefined()
  })
  it("does not convert a failed update into a create or report success", async () => {
    vi.spyOn(API.services, "update").mockRejectedValue(new ApiError(404, "حُذفت الخدمة"))
    const create: MockInstance = vi.spyOn(API.services, "create")
    const { result } = renderHook(() => useUpsertServiceMutation(), { wrapper: wrapper() })
    await act(async () => {
      await expect(result.current.mutateAsync({ id: "existing", slug: "web", title: "موقع", desc: "وصف", icon: "web", bullets: [], tech: [] })).rejects.toThrow("حُذفت الخدمة")
    })
    expect(create).not.toHaveBeenCalled()
  })
  it("updates the original URL when a service slug is edited", async () => {
    const update = vi.spyOn(API.services, "update").mockResolvedValue({ ok: true, data: {} })
    const { result } = renderHook(() => useUpsertServiceMutation(), { wrapper: wrapper() })
    await act(async () => {
      await result.current.mutateAsync({ id: "existing", originalSlug: "old-url", slug: "new-url", title: "موقع", desc: "وصف", icon: "web", bullets: [], tech: [] })
    })
    expect(update).toHaveBeenCalledWith("old-url", expect.objectContaining({ slug: "new-url" }))
    expect(update.mock.calls[0][1]).not.toHaveProperty("originalSlug")
  })

})
