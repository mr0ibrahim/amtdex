import { getSession } from "@/lib/auth"
import { useUsersQuery } from "@/lib/queries"

export function UsersPage() {
  const me = getSession()?.user
  const { data: users = [], isLoading, error, refetch } = useUsersQuery()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-[var(--color-ink)]">المستخدمون</h1>
        <span className="text-[11px] text-[var(--color-text-faint)]">مسجل كـ {me?.email ?? "-"}</span>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">
            <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
            جار تحميل قائمة المستخدمين...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-[12px] text-red-600">
            تعذر تحميل المستخدمين.
            <button onClick={() => refetch()} className="mr-2 underline font-bold">إعادة المحاولة</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-[var(--color-card-soft)] text-[11px] text-[var(--color-text-faint)]">
                <tr>
                  <th className="text-right px-4 py-3">الاسم</th>
                  <th className="text-right px-4 py-3">البريد</th>
                  <th className="text-right px-4 py-3">الدور</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-[var(--color-text-faint)]">
                      لا يوجد مستخدمون حالياً.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.email} className="border-t border-[var(--color-border)]">
                      <td className="px-4 py-3 font-bold">{u.name}</td>
                      <td className="px-4 py-3 font-mono text-[11px]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                            u.role === "admin"
                              ? "bg-[var(--color-ink)] text-white"
                              : u.role === "editor"
                              ? "bg-[var(--color-lavender)] text-[var(--color-primary)]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-[11px] text-[var(--color-text-faint)]">
        * يتم فرض الصلاحيات الحقيقية وإدارة كلمات المرور وتأكيد الحسابات عبر Laravel Policy & Gate على الخادم.
      </p>
    </div>
  )
}
