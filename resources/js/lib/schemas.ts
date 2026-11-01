import { z } from "zod"

// Shared helpers
const requiredString = (label: string) => z.string().trim().min(1, `${label} مطلوب`)
const emailSchema = z.string().trim().email("يرجى إدخال بريد إلكتروني صالح")
const phoneSchema = z
  .string()
  .trim()
  .min(1, "رقم الجوال مطلوب")
  .regex(/^[0-9+\s-]{7,20}$/, "رقم الجوال غير صحيح (7 إلى 20 رقماً)")

export const contactSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب ولا يقل عن حرفين"),
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "الرسالة يجب ألا تقل عن 10 أحرف"),
})

export const newsletterSchema = z.object({
  email: emailSchema,
})

export const quoteSchema = z.object({
  service: requiredString("الخدمة"),
  budget: requiredString("الميزانية"),
  timeline: requiredString("الجدول الزمني"),
  name: z.string().trim().min(2, "الاسم مطلوب ولا يقل عن حرفين"),
  email: emailSchema,
  phone: phoneSchema,
  details: z.string().trim().min(10, "يرجى كتابة تفاصيل المشروع (10 أحرف على الأقل)"),
})

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
