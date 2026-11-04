import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { OgImageField } from "@/pages/Dashboard/Blog/editor/OgImageField"
import { API } from "@/lib/api"

vi.mock("@/lib/api", () => ({
  API: {
    media: {
      upload: vi.fn(),
    },
  },
}))

describe("OgImageField", () => {
  beforeEach(() => {
    vi.mocked(API.media.upload).mockReset()
  })

  it("uploads from a gallery file picker without a capture attribute", async () => {
    vi.mocked(API.media.upload).mockResolvedValue({
      ok: true,
      url: "/uploads/media/og-share.png",
      id: "4",
    })

    const onChange = vi.fn()
    render(<OgImageField url="" onChange={onChange} onClear={() => {}} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toHaveAttribute("accept", "image/*")
    expect(input.hasAttribute("capture")).toBe(false)

    const file = new File([new Uint8Array([137, 80, 78, 71])], "share.png", { type: "image/png" })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("/uploads/media/og-share.png")
    })
    expect(API.media.upload).toHaveBeenCalledWith(file)
  })

  it("previews a saved image, accepts a pasted url, and can be removed or replaced", async () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    const view = render(
      <OgImageField url="/uploads/media/saved.png" onChange={onChange} onClear={onClear} />,
    )

    const preview = screen.getByRole("img", { name: "معاينة صورة المشاركة" })
    expect(preview).toHaveAttribute("src", `${window.location.origin}/uploads/media/saved.png`)

    fireEvent.change(screen.getByLabelText("رابط صورة المشاركة"), {
      target: { value: "https://cdn.example/og.jpg" },
    })
    expect(onChange).toHaveBeenCalledWith("https://cdn.example/og.jpg")

    fireEvent.click(screen.getByRole("button", { name: "حذف" }))
    expect(onClear).toHaveBeenCalled()

    vi.mocked(API.media.upload).mockResolvedValue({
      ok: true,
      url: "/uploads/media/replaced.png",
      id: "8",
    })
    view.rerender(
      <OgImageField url="https://cdn.example/og.jpg" onChange={onChange} onClear={onClear} />,
    )
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File([new Uint8Array([137, 80, 78, 71])], "replaced.png", { type: "image/png" })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("/uploads/media/replaced.png")
    })
  })
})
