import { useSyncExternalStore } from "react"

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

const KEY = "amtdex_leads"

const SEED: Lead[] = [
  { id: "1", name: "سارة العتيبي", email: "sara@test.com", phone: "+966500111222", subject: "web", message: "أحتاج متجر إلكتروني لعلامتي مع دفع مدى", status: "جديد", createdAt: new Date(Date.now() - 1000*60*30).toISOString(), source: "contact", meta: {} },
  { id: "2", name: "عمر الحربي", email: "omar@test.com", message: "طلب عرض سعر لتطبيق جوال مطاعم", status: "قيد المراجعة", createdAt: new Date(Date.now() - 1000*60*60*5).toISOString(), source: "quote", meta: { service: "mobile", budget: "30K — 80K", timeline: "مرن — شهر" } },
  { id: "3", name: "نورة القحطاني", email: "nora@test.com", message: "اشتراك نشرة", status: "تم التواصل", createdAt: new Date(Date.now() - 1000*60*60*24).toISOString(), source: "newsletter", meta: {} },
]

function load(): Lead[] {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) as Lead[] } catch {}
  return SEED
}
function save(v: Lead[]) { localStorage.setItem(KEY, JSON.stringify(v)); listeners.forEach((cb) => cb()) }
const listeners = new Set<() => void>()
function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb) }

export function getLeads(): Lead[] { return load() }
export function setLeads(v: Lead[]) { save(v) }
export function addLead(l: Lead) { save([l, ...load()]) }
export function updateLeadStatus(id: string, status: LeadStatus) { save(load().map((x) => x.id === id ? { ...x, status } : x)) }
export function deleteLead(id: string) { save(load().filter((x) => x.id !== id)) }
export function exportLeadsCsv(): string {
  const rows = load()
  const header = ["id","name","email","phone","subject","message","status","createdAt","source"].join(",")
  const lines = rows.map((r) => [r.id,r.name,r.email,r.phone??"",r.subject??"",`"${(r.message||"").replace(/"/g,'""')}"`,r.status,r.createdAt,r.source].join(","))
  return [header, ...lines].join("\n")
}
export function useLeads(): Lead[] { return useSyncExternalStore(subscribe, load, () => SEED) }
