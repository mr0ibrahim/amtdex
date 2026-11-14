import { act, renderHook } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { afterEach, expect, it, vi } from "vitest"
import type { ChangeEvent } from "react"
import { API } from "@/lib/api"
import type { Project } from "@/types/project"
import { useProjectEditor } from "@/pages/Dashboard/Content/useProjectEditor"

const project: Project = { id: "1", slug: "first", title: "المشروع الأول", client: "عميل", cat: "مواقع", year: "2026", stack: [], color: "#281849", accent: "#56358d", summary: "ملخص" }
function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return renderHook(() => useProjectEditor([]), { wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider> })
}
afterEach(() => vi.restoreAllMocks())

it("preserves edits made while a project image is uploading", async () => {
  let finish!: (response: { ok: boolean; url: string; id: string }) => void
  vi.spyOn(API.media, "upload").mockImplementation(() => new Promise(resolve => { finish = resolve }))
  const { result } = setup()
  act(() => result.current.openProject(project))
  let upload!: Promise<void>
  await act(async () => { upload = result.current.handleCoverUpload({ target: { files: [new File(["image"], "cover.png", { type: "image/png" })] } } as unknown as ChangeEvent<HTMLInputElement>); await Promise.resolve() })
  act(() => result.current.setEditingProject(current => ({ ...current!, title: "العنوان المعدل" })))
  await act(async () => { finish({ ok: true, id: "image", url: "/uploads/cover.png" }); await upload })
  expect(result.current.editingProject?.title).toBe("العنوان المعدل")
  expect(result.current.editingProject?.cover_image).toBe("/uploads/cover.png")
})
it("ignores an old upload when another project editor is opened", async () => {
  let finish!: (response: { ok: boolean; url: string; id: string }) => void
  vi.spyOn(API.media, "upload").mockImplementation(() => new Promise(resolve => { finish = resolve }))
  const { result } = setup()
  act(() => result.current.openProject(project))
  let upload!: Promise<void>
  await act(async () => { upload = result.current.handleCoverUpload({ target: { files: [new File(["image"], "cover.png", { type: "image/png" })] } } as unknown as ChangeEvent<HTMLInputElement>); await Promise.resolve() })
  act(() => { result.current.closeProject(); result.current.openProject({ ...project, id: "2", slug: "second", title: "مشروع آخر" }) })
  await act(async () => { finish({ ok: true, id: "image", url: "/uploads/old.png" }); await upload })
  expect(result.current.editingProject?.slug).toBe("second")
  expect(result.current.editingProject?.cover_image).toBeUndefined()
})
