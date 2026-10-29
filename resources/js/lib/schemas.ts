import { z } from "zod"

// Shared helpers
const requiredString = (label: string) => z.string().trim().min(1, `${label} مطلوب`)
const emailSchema = z.string().trim().email("بريد صحيح مطلوب")

export const contactSchema = z.object({
  name: requiredString("الاسم"),
  email: emailSchema,
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "اكتب رسالة 10 أحرف على الأقل"),
})

export const newsletterSchema = z.object({
  email: emailSchema,
})

export const quoteSchema = z.object({
  service: requiredString("الخدمة"),
  budget: requiredString("الميزانية"),
  timeline: requiredString("الجدول الزمني"),
  name: requiredString("الاسم"),
  email: emailSchema,
  phone: z.string().trim().optional(),
  details: z.string().trim().optional(),
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
