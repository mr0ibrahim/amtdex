export type LeadStatus = "جديد" | "قيد المراجعة" | "تم التواصل" | "مغلق"
export type Lead = {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: LeadStatus
  createdAt: string // ISO
  source: "contact" | "quote" | "newsletter"
  meta?: Record<string, string> // service/budget/timeline
}
