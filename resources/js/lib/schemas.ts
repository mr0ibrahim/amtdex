import { z } from "zod"
import { parseValidPhone, type CountryCode } from "./phone"

// Shared helpers
const requiredString = (label: string) => z.string().trim().min(1, `${label} مطلوب`)
const emailSchema = z.string().trim().email("يرجى إدخال بريد إلكتروني صالح")
export const createContactSchema = (country: CountryCode = "YE") => z.object({
  name: z.string().trim().min(2, "الاسم مطلوب ولا يقل عن حرفين"),
  email: emailSchema,
  phone: z.string().trim().min(1, "رقم الهاتف مطلوب").transform((value, ctx) => {
    const phone = parseValidPhone(value, country)
    if (!phone) {
      ctx.addIssue({ code: "custom", message: "رقم الهاتف غير صالح. اختر الدولة الصحيحة أو أدخل الرقم مع مفتاحه الدولي." })
      return z.NEVER
    }
    return String(phone.number)
  }),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "الرسالة يجب ألا تقل عن 10 أحرف"),
})

export const contactSchema = createContactSchema()

export const newsletterSchema = z.object({
  email: emailSchema,
})

export const quoteBudgetSchema = z.string().trim()
  .regex(/^[0-9]+(?:\.[0-9]{1,2})? [A-Z]{3}$/, "أدخل مبلغ الميزانية واختر العملة")
  .refine(value => Number(value.split(" ")[0]) > 0, "يجب أن تكون الميزانية أكبر من صفر")

export const createQuoteSchema = (country: CountryCode = "YE") => z.object({
  service: requiredString("الخدمة"),
  budget: quoteBudgetSchema,
  timeline: requiredString("الجدول الزمني"),
  name: z.string().trim().min(2, "الاسم مطلوب ولا يقل عن حرفين"),
  email: emailSchema,
  phone: createContactSchema(country).shape.phone,
  details: z.string().trim().min(10, "يرجى كتابة تفاصيل المشروع (10 أحرف على الأقل)"),
})

export const quoteSchema = createQuoteSchema()

export type ContactInput = z.infer<typeof contactSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type QuoteInput = z.infer<typeof quoteSchema>

/** تحويل أخطاء zod إلى Record<string,string> للفورم */
export function zodErrors(result: { success: true; data: unknown } | { success: false; error: z.ZodError }): Record<string, string> {
  if (result.success) return {}
  const out: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "_")
    if (!out[key]) out[key] = issue.message
  }
  return out
}
