import parsePhoneNumber, { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/max"

export type { CountryCode }

export function normalizePhoneInput(value: string): string {
  return value.trim()
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x6f0))
    .replace(/[\u200e\u200f\u061c]/g, "")
    .replace(/^00/, "+")
}

/** A valid numbering-plan match; this does not verify ownership or connectivity. */
export function parseValidPhone(value: string, country: CountryCode = "YE") {
  const input = normalizePhoneInput(value)
  if (!input || !/^\+?[\d\s().-]+$/.test(input)) return undefined
  const phone = parsePhoneNumber(input, { defaultCountry: country, extract: false })
  return phone?.isValid() ? phone : undefined
}

const names = new Intl.DisplayNames(["ar"], { type: "region" })
export const phoneCountries = getCountries().map(code => ({
  code,
  name: names.of(code) ?? code,
  callingCode: getCountryCallingCode(code),
})).sort((a, b) => a.name.localeCompare(b.name, "ar"))
