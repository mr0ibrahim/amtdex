import { useAuditLogsQuery } from "@/lib/queries"

export function AuditPage() {
  const { data, isLoading, error, refetch } = useAuditLogsQuery()
  const logs = data?.logs || []
  const blocked = data?.blockedIps || []

  return (
    <div className="space-y-4">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">السجل والأمان</h1>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">
            <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
            جار تحميل سجل العمليات والأمان...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-[12px] text-red-600">
            تعذر تحميل السجل.
            <button onClick={() => refetch()} className="mr-2 underline font-bold">إعادة المحاولة</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-[var(--color-card-soft)] text-[11px] text-[var(--color-text-faint)]">
                <tr>
                  <th className="text-right px-4 py-3">المستخدم</th>
                  <th className="text-right px-4 py-3">الإجراء</th>
                  <th className="text-right px-4 py-3">IP</th>
                  <th className="text-right px-4 py-3">التوقيت</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-[var(--color-text-faint)]">
                      لا توجد عمليات مسجلة حتى الآن.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id} className="border-t border-[var(--color-border)]">
                      <td className="px-4 py-3 font-mono text-[11px]">{l.user}</td>
                      <td className="px-4 py-3">{l.action}</td>
                      <td className="px-4 py-3 font-mono text-[11px]">{l.ip}</td>
                      <td className="px-4 py-3 text-[var(--color-text-faint)]">{l.at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="text-[12px] font-bold text-amber-900">عناوين IP المحظورة</div>
        <p className="text-[11px] text-amber-800 mt-1">
          {blocked.length === 0 ? "لا يوجد عنوان IP محظور حالياً." : blocked.join(", ")}
        </p>
        <p className="text-[10px] text-amber-700 mt-2">
          * يتم تفعيل حظر IP التلقائي ومعدل الطلبات (Rate Limiting) عبر Laravel Middleware (`throttle:api`).
        </p>
      </div>
    </div>
  )
}
