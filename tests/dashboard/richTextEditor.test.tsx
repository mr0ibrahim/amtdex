import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { RichTextEditor } from "@/pages/Dashboard/Blog/editor/RichTextEditor"

vi.mock("@/lib/api", () => ({
  API: {
    media: {
      upload: vi.fn(),
    },
  },
}))

describe("RichTextEditor", () => {
  it("exposes the formatting tools and a gallery image picker", async () => {
    render(<RichTextEditor value="<p>مرحبا بالعالم في هذا المقال التجريبي</p>" onChange={() => {}} />)

    expect(await screen.findByRole("button", { name: "عريض" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "مائل" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "تحته خط" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "يتوسطه خط" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "قائمة نقطية" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "قائمة مرقمة" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "اقتباس" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "كتلة كود" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "رابط" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "جدول" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "تراجع" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "إعادة" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "اتجاه من اليمين لليسار" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "اتجاه من اليسار لليمين" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "مصدر HTML" })).toBeInTheDocument()

    const input = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement
    expect(input).toBeTruthy()
    expect(input.hasAttribute("capture")).toBe(false)
  })
})
