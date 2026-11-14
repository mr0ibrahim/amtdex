import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { SearchSelect } from "@/components/ui/SearchSelect"
import { countryOptions, currencyOptions } from "@/data/selectOptions"

it("filters by Arabic, English, ISO code and dialling digits, then reports the pick", () => {
  const change = vi.fn()
  render(<SearchSelect id="country" label="الدولة" options={countryOptions} value="YE" onChange={change} />)
  fireEvent.click(screen.getByLabelText("الدولة"))
  const search = screen.getByRole("combobox")
  for (const query of ["السعوديه", "saudi", "SA", "966"]) {
    fireEvent.change(search, { target: { value: query } })
    expect(screen.getAllByRole("option").some(option => option.textContent?.includes("السعودية"))).toBe(true)
  }
  fireEvent.change(search, { target: { value: "saudi" } })
  fireEvent.keyDown(search, { key: "Enter" })
  expect(change).toHaveBeenCalledWith("SA")
  expect(screen.queryByRole("listbox")).toBeNull()
})

it("submits through a hidden input and restores its default on form reset", () => {
  const { container } = render(<form><SearchSelect id="currency" name="currency" label="العملة" options={currencyOptions} defaultValue="SAR" /></form>)
  const field = container.querySelector<HTMLInputElement>('input[name="currency"]')!
  fireEvent.click(screen.getByLabelText("العملة"))
  fireEvent.click(screen.getByRole("option", { name: /يورو/ }))
  expect(field.value).toBe("EUR")
  fireEvent.reset(container.querySelector("form")!)
  expect(field.value).toBe("SAR")
})

it("closes on Escape, returns focus to the field and shows an empty state", () => {
  render(<SearchSelect id="currency" label="العملة" options={currencyOptions} value="USD" onChange={() => {}} />)
  const trigger = screen.getByLabelText("العملة")
  fireEvent.keyDown(trigger, { key: "ArrowDown" })
  const search = screen.getByRole("combobox")
  fireEvent.change(search, { target: { value: "zzzz" } })
  expect(screen.getByText(/لا توجد نتائج/)).toBeInTheDocument()
  fireEvent.keyDown(search, { key: "Escape" })
  expect(screen.queryByRole("listbox")).toBeNull()
  expect(trigger).toHaveFocus()
})
