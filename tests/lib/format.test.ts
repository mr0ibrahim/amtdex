import { expect, it } from "vitest"
import { formatDate, readingTime } from "@/lib/format"

it("counts reading minutes with Arabic number agreement", () => {
  expect(readingTime(1)).toBe("دقيقة واحدة قراءة")
  expect(readingTime(2)).toBe("دقيقتان قراءة")
  expect(readingTime(3)).toBe("3 دقائق قراءة")
  expect(readingTime(10)).toBe("10 دقائق قراءة")
  expect(readingTime(11)).toBe("11 دقيقة قراءة")
  expect(readingTime(16)).toBe("16 دقيقة قراءة")
})

it("writes dates with western digits in the Gregorian calendar", () => {
  const text = formatDate("2026-11-14T09:00:00Z")
  expect(text).toMatch(/14/)
  expect(text).toMatch(/2026/)
  expect(text).toContain("نوفمبر")
  expect(text).not.toMatch(/[٠-٩]/)
  expect(formatDate(null)).toBe("")
})
