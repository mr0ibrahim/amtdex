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
  const valid = { name: "أحمد الغامدي", email: "ahmed@test.com", phone: "+966500000000", message: "مرحبا، هذه رسالة اختبار كافية للطول" }

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
  it("يقبل subject اختيارياً", () => {
    expect(contactSchema.safeParse({ ...valid, subject: "web" }).success).toBe(true)
  })
})

describe("quoteSchema", () => {
  const valid = {
    service: "web",
    budget: "10K — 30K",
    timeline: "مرن — شهر",
    name: "سارة",
    email: "sara@test.com",
    phone: "+966500000000",
    details: "تفاصيل كافية عن المشروع المطلوب",
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
  it("يرفض رقم جوال غير صالح", () => {
    expect(quoteSchema.safeParse({ ...valid, phone: "+9665" }).success).toBe(false)
  })
  it("يرفض تفاصيل مشروع أقصر من 10 أحرف", () => {
    expect(quoteSchema.safeParse({ ...valid, details: "قصير" }).success).toBe(false)
  })
})
