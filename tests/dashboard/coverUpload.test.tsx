import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CoverUpload } from "@/pages/Dashboard/Blog/editor/CoverUpload"
import { API } from "@/lib/api"

vi.mock("@/lib/api", () => ({
  API: {
    media: {
      upload: vi.fn(),
    },
  },
}))

describe("CoverUpload", () => {
  beforeEach(() => {
    vi.mocked(API.media.upload).mockReset()
  })

  it("opens a gallery file picker and previews the image while it uploads", async () => {
    let resolveUpload: (value: { ok: boolean; url: string; id: string }) => void = () => {}
    vi.mocked(API.media.upload).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpload = resolve
        }),
    )

    const onChange = vi.fn()
    render(<CoverUpload url="" alt="" onChange={onChange} onClear={() => {}} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toBeTruthy()
    expect(input).toHaveAttribute("accept", "image/*")
    expect(input.hasAttribute("capture")).toBe(false)

    const file = new File([new Uint8Array([137, 80, 78, 71])], "cover.png", { type: "image/png" })
    fireEvent.change(input, { target: { files: [file] } })

    const preview = await screen.findByRole("img", { name: "معاينة الغلاف" })
    expect(preview.getAttribute("src") || "").toMatch(/^blob:/)
    expect(screen.getByText("جارٍ الرفع...")).toBeInTheDocument()

    resolveUpload({ ok: true, url: "/uploads/media/abc.png", id: "9" })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        cover_image: "/uploads/media/abc.png",
        cover_image_alt: "cover",
      })
    })
  })

  it("shows the saved public url after the parent stores it", () => {
    render(
      <CoverUpload
        url="/uploads/media/saved.png"
        alt="غلاف المقال"
        onChange={() => {}}
        onClear={() => {}}
      />,
    )

    const preview = screen.getByRole("img", { name: "غلاف المقال" })
    expect(preview).toHaveAttribute("src", "/uploads/media/saved.png")
  })
})
