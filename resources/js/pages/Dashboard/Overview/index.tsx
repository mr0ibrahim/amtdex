import { useDashboardStatsQuery } from "@/lib/queries"

export function OverviewPage({ onToast }: { onToast: (m: string) => void }) {
  void onToast
  const { data: stats, isLoading, error, refetch } = useDashboardStatsQuery()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-[var(--color-ink)]">نظرة عامة</h1>
        <span className="text-[11px] text-[var(--color-text-faint)]">آخر تحديث — الآن</span>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-7 bg-gray-200 rounded w-1/2 mt-3" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mt-2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-[12px] text-red-700">تعذر تحميل الإحصائيات</p>
          <button onClick={() => refetch()} className="mt-2 text-[11px] bg-red-600 text-white px-3 py-1 rounded-full">إعادة المحاولة</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { k: "المشاريع النشطة", v: stats?.activeProjects.value ?? 0, sub: stats?.activeProjects.sub ?? "" },
            { k: "طلبات التواصل", v: stats?.contactRequests.value ?? 0, sub: stats?.contactRequests.sub ?? "" },
            { k: "عروض الأسعار", v: stats?.quotes.value ?? 0, sub: stats?.quotes.sub ?? "" },
          ].map((c) => (
            <div key={c.k} className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
              <div className="text-[11px] text-[var(--color-text-faint)]">{c.k}</div>
              <div className="text-[22px] font-bold text-[var(--color-ink)] mt-1">{c.v}</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-1">{c.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
        <h3 className="text-[13px] font-bold text-[var(--color-ink)]">مرحباً في لوحة Amtdex</h3>
        <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">لوحة تحكم تفاعلية متصلة بالكامل عبر React و TanStack Query، جاهزة للربط الفوري مع Laravel API.</p>
      </div>
    </div>
  )
}
