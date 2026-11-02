import { useState } from "react"
import { useLeadsQuery, useUpdateLeadStatusMutation, useDeleteLeadMutation } from "@/lib/queries"
import type { LeadStatus } from "@/lib/leadStore"

const STATUSES: LeadStatus[] = ["جديد", "قيد المراجعة", "تم التواصل", "مغلق"]

export function LeadsPage() {
  const [filter, setFilter] = useState<LeadStatus | "الكل">("الكل")
  const [source, setSource] = useState<string>("الكل")

  const { data: leads = [], isLoading, error, refetch } = useLeadsQuery(
    filter === "الكل" && source === "الكل"
      ? undefined
      : {
          status: filter !== "الكل" ? filter : undefined,
          source: source !== "الكل" ? source : undefined,
        },
  )

  const updateMutation = useUpdateLeadStatusMutation()
  const deleteMutation = useDeleteLeadMutation()

  const filtered = leads.filter(
    (l) => (filter === "الكل" || l.status === filter) && (source === "الكل" || l.source === source),
  )

  const handleExport = () => {
    const header = ["id", "name", "email", "phone", "subject", "message", "status", "createdAt", "source"].join(",")
    const lines = filtered.map((r) =>
      [
        r.id,
        r.name,
        r.email,
        r.phone ?? "",
        r.subject ?? "",
        `"${(r.message || "").replace(/"/g, '""')}"`,
        r.status,
        r.createdAt,
        r.source,
      ].join(","),
    )
    const csv = [header, ...lines].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `amtdex-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-extrabold text-[var(--color-ink)]">الطلبات والتواصل</h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">إدارة طلبات التواصل وعروض الأسعار والنشرة.</p>
        </div>
        <button
          onClick={handleExport}
          className="text-[11px] font-bold bg-white border border-[var(--color-border)] px-4 py-2.5 rounded-full hover:bg-[var(--color-lavender)] w-full sm:w-auto"
        >
          تصدير CSV
        </button>
      </div>

      <div className="space-y-2">
        <div className="dash-tabs">
          {["الكل", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as typeof filter)}
              className={`dash-tab${filter === s ? " is-active" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="dash-tabs">
          {["الكل", "contact", "quote", "newsletter"].map((s) => (
            <button key={s} onClick={() => setSource(s)} className={`dash-tab${source === s ? " is-active" : ""}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">جار تحميل الطلبات...</div>
        ) : error ? (
          <div className="p-6 text-center text-[12px] text-rose-600">
            حدث خطأ أثناء تحميل الطلبات.
            <button onClick={() => refetch()} className="me-2 underline font-bold">
              إعادة المحاولة
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">لا توجد طلبات مطابقة.</div>
        ) : (
          <>
            <div className="dash-mobile-cards p-3">
              {filtered.map((l) => (
                <article key={l.id} className="dash-post-card">
                  <div>
                    <div className="text-[13px] font-bold text-[var(--color-ink)]">{l.name}</div>
                    <div className="text-[11px] text-[var(--color-text-muted)] mt-1 break-all">
                      {l.email}
                      {l.phone ? ` • ${l.phone}` : ""}
                    </div>
                    <p className="text-[11px] text-[var(--color-text-faint)] mt-2 line-clamp-3">{l.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] bg-[var(--color-lavender)] px-2 py-1 rounded-full font-bold">{l.source}</span>
                    <span className="text-[10px] text-[var(--color-text-faint)]">
                      {new Date(l.createdAt).toLocaleDateString("ar-YE")}
                    </span>
                  </div>
                  <select
                    value={l.status}
                    disabled={updateMutation.isPending}
                    onChange={(e) => updateMutation.mutate({ id: l.id, status: e.target.value as LeadStatus })}
                    className="w-full text-[12px] border border-[var(--color-border)] rounded-xl px-3 py-2 bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (window.confirm("حذف هذا الطلب؟")) deleteMutation.mutate(l.id)
                    }}
                    className="text-[11px] font-bold text-rose-600"
                  >
                    حذف الطلب
                  </button>
                </article>
              ))}
            </div>

            <div className="dash-desktop-table overflow-x-auto">
              <table className="w-full text-[12px] min-w-[680px]">
                <thead className="bg-[var(--color-card-soft)] text-[11px] text-[var(--color-text-faint)]">
                  <tr>
                    <th className="text-right px-4 py-3">الاسم</th>
                    <th className="text-right px-4 py-3">المصدر</th>
                    <th className="text-right px-4 py-3">الحالة</th>
                    <th className="text-right px-4 py-3">التاريخ</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id} className="border-t border-[var(--color-border)]">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[var(--color-ink)]">{l.name}</div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">
                          {l.email} {l.phone ? `• ${l.phone}` : ""}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-faint)] line-clamp-1">{l.message}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] bg-[var(--color-lavender)] px-2 py-1 rounded-full">{l.source}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={l.status}
                          disabled={updateMutation.isPending}
                          onChange={(e) => updateMutation.mutate({ id: l.id, status: e.target.value as LeadStatus })}
                          className="text-[11px] border border-[var(--color-border)] rounded-full px-2 py-1 bg-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[var(--color-text-faint)]">
                        {new Date(l.createdAt).toLocaleDateString("ar-YE")}
                      </td>
                      <td className="px-4 py-3 text-left">
                        <button
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (window.confirm("حذف هذا الطلب؟")) deleteMutation.mutate(l.id)
                          }}
                          className="text-[11px] text-rose-600 hover:underline"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
