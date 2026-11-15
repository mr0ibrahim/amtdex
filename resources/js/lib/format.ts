/** Western digits and the Gregorian calendar, to match every other number on the site. */
const DATE_LOCALE = "ar-u-nu-latn-ca-gregory"

export function formatDate(value: string | number | Date | null | undefined, style: "long" | "short" = "long") {
  if (value === null || value === undefined || value === "") return ""
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value.slice(0, 10) : ""
  return date.toLocaleDateString(DATE_LOCALE, style === "long" ? { year: "numeric", month: "long", day: "numeric" } : { year: "numeric", month: "numeric", day: "numeric" })
}

export function formatNumber(value: number) {
  return value.toLocaleString("en-US")
}

/**
 * Arabic counts: 1 دقيقة, 2 دقيقتان, 3–10 دقائق, 11 and above دقيقة.
 * "16 دقائق" is the common mistake this exists to prevent.
 */
export function readingTime(minutes: number | null | undefined) {
  const count = Math.max(1, Math.round(Number(minutes) || 0))
  if (count === 1) return "دقيقة واحدة قراءة"
  if (count === 2) return "دقيقتان قراءة"
  return `${count} ${count <= 10 ? "دقائق" : "دقيقة"} قراءة`
}
