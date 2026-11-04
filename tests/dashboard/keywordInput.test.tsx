import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { KeywordInput } from "@/pages/Dashboard/Blog/editor/KeywordInput"

describe("KeywordInput", () => {
  it("adds one multi-word arabic phrase on Enter and ignores a duplicate", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const view = render(<KeywordInput keywords={[]} onChange={onChange} />)
    const input = screen.getByLabelText("إضافة كلمة مفتاحية")

    await user.type(input, "تطوير المواقع{Enter}")
    expect(onChange).toHaveBeenCalledWith(["تطوير المواقع"])

    view.rerender(<KeywordInput keywords={["تطوير المواقع"]} onChange={onChange} />)
    await user.type(input, "تطوير المواقع{Enter}")
    expect(onChange).toHaveBeenLastCalledWith(["تطوير المواقع"])
  })

  it("adds a keyword when the latin or arabic comma is pressed", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<KeywordInput keywords={[]} onChange={onChange} />)
    const input = screen.getByLabelText("إضافة كلمة مفتاحية")

    await user.type(input, "SEO,")
    expect(onChange).toHaveBeenCalledWith(["SEO"])

    onChange.mockClear()
    await user.type(input, "عبارة عربية،")
    expect(onChange).toHaveBeenCalledWith(["عبارة عربية"])
  })

  it("adds every keyword from a pasted comma and newline list", () => {
    const onChange = vi.fn()
    render(<KeywordInput keywords={["SEO"]} onChange={onChange} />)
    const input = screen.getByLabelText("إضافة كلمة مفتاحية")

    fireEvent.paste(input, {
      clipboardData: {
        getData: () => "web development، تطوير المواقع\nأمن التطبيقات, SEO",
      },
    })

    expect(onChange).toHaveBeenCalledWith([
      "SEO",
      "web development",
      "تطوير المواقع",
      "أمن التطبيقات",
    ])
  })

  it("removes a single keyword", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<KeywordInput keywords={["تطوير المواقع", "SEO"]} onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "إزالة تطوير المواقع" }))
    expect(onChange).toHaveBeenCalledWith(["SEO"])
  })
})
