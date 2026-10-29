import { describe, expect, it } from "vitest"
import { contactSchema, newsletterSchema, quoteSchema } from "@/lib/schemas"

describe("newsletterSchema", () => {
  it("يقبل بريداً صحيحاً", () => {
    expect(newsletterSchema.safeParse({ email: "hi@amtdex.com" }).success).toBe(true)
  })
  it("يرفض بريداً فارغاً", () => {
    expect(newsletterSchema.safeParse({ email: "" }).success).toBe(false)
  })
  it("يرفض بريداً بدون @", () => {
    expect(newsletterSchema.safeParse({ email: "not-an-email" }).success).toBe(false)
  })
})

describe("contactSchema", () => {
  const valid = { name: "أحمد الغامدي", email: "ahmed@test.com", message: "مرحبا، هذه رسالة اختبار كافية للطول" }

  it("يقبل بيانات صحيحة", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })
  it("يرفض بدون اسم", () => {
    expect(contactSchema.safeParse({ ...valid, name: "" }).success).toBe(false)
  })
  it("يرفض بريداً غير صالح", () => {
    expect(contactSchema.safeParse({ ...valid, email: "bad" }).success).toBe(false)
  })
  it("يرفض رسالة قصيرة (<10)", () => {
    expect(contactSchema.safeParse({ ...valid, message: "قصير" }).success).toBe(false)
  })
  it("يقبل phone/subject اختياريين", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "+966500000000", subject: "web" }).success).toBe(true)
  })
})

describe("quoteSchema", () => {
  const valid = {
    service: "web",
    budget: "10K — 30K",
    timeline: "مرن — شهر",
    name: "سارة",
    email: "sara@test.com",
  }

  it("يقبل بيانات صحيحة", () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true)
  })
  it("يرفض بدون service", () => {
    expect(quoteSchema.safeParse({ ...valid, service: "" }).success).toBe(false)
  })
  it("يرفض بدون budget", () => {
    expect(quoteSchema.safeParse({ ...valid, budget: "" }).success).toBe(false)
  })
  it("يرفض بدون timeline", () => {
    expect(quoteSchema.safeParse({ ...valid, timeline: "" }).success).toBe(false)
  })
  it("يرفض بدون name", () => {
    expect(quoteSchema.safeParse({ ...valid, name: "" }).success).toBe(false)
  })
  it("يرفض بريداً غير صالح", () => {
    expect(quoteSchema.safeParse({ ...valid, email: "bad" }).success).toBe(false)
  })
  it("يقبل phone/details اختياريين", () => {
    expect(quoteSchema.safeParse({ ...valid, phone: "+9665", details: "تفاصيل المشروع" }).success).toBe(true)
  })
})
