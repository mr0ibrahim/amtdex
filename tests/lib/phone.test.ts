import { describe, expect, it } from "vitest"
import { getCountries, getExampleNumber } from "libphonenumber-js/max"
import examples from "libphonenumber-js/examples.mobile.json"
import { normalizePhoneInput, parseValidPhone, phoneCountries } from "@/lib/phone"
import { createContactSchema } from "@/lib/schemas"

describe("international telephone validation", () => {
  it("accepts international and national example numbers for every supported country", () => {
    for (const country of getCountries()) {
      const example = getExampleNumber(country, examples)
      expect(example, country).toBeDefined()
      expect(parseValidPhone(example!.number)?.number, country).toBe(example!.number)
      expect(parseValidPhone(example!.formatNational(), country)?.number, country).toBe(example!.number)
    }
    expect(phoneCountries).toHaveLength(getCountries().length)
  })
  it("accepts fixed lines as well as mobile numbers", () => {
    expect(parseValidPhone("+442079460018")?.isValid()).toBe(true)
    expect(parseValidPhone("+12025550123")?.isValid()).toBe(true)
  })
  it("normalizes Arabic and Persian digits and the 00 international prefix", () => {
    expect(normalizePhoneInput("٠٠٩٦٧٧٨٤٤٤٠٤٢٩")).toBe("+967784440429")
    expect(parseValidPhone("۰۰۴۴۲۰۷۹۴۶۰۰۱۸")?.number).toBe("+442079460018")
    expect(parseValidPhone("+٩٦٧ ٧٨٤ ٤٤٠ ٤٢٩")?.number).toBe("+967784440429")
  })
  it.each(["-------", "+999123456789", "+9665", "+1202555012300000", "call +12025550123", "++12025550123", "123", "+12025550123 ext 4"])("rejects invalid or extraneous input: %s", input => {
    expect(parseValidPhone(input)).toBeUndefined()
  })
  it("uses the chosen country for local input and the explicit prefix for international input", () => {
    expect(parseValidPhone("020 7946 0018", "GB")?.number).toBe("+442079460018")
    expect(parseValidPhone("020 7946 0018", "YE")).toBeUndefined()
    expect(parseValidPhone("+442079460018", "YE")?.number).toBe("+442079460018")
    const result = createContactSchema("GB").shape.phone.safeParse("020 7946 0018")
    expect(result.success && result.data).toBe("+442079460018")
  })
})
