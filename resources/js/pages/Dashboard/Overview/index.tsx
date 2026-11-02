import { Link } from "react-router-dom"
import { Icon, type IconName } from "@/components/ui/Icon"
import { useDashboardStatsQuery } from "@/lib/queries"
import { getSession } from "@/lib/auth"

type ModuleCard = {
  to: string
  title: string
  desc: string
  icon: IconName
}

const MODULE_GROUPS: Array<{ title: string; items: ModuleCard[] }> = [
  {
    title: "المحتوى والنشر",
    items: [
      { to: "/dashboard/blog", title: "المدونة", desc: "مقالات، تصنيفات، ووسوم", icon: "pen" },
      { to: "/dashboard/content", title: "محتوى الموقع", desc: "خدمات، أسعار، وفريق العمل", icon: "layers" },
      { to: "/dashboard/media", title: "مكتبة الوسائط", desc: "صور وملفات جاهزة للنشر", icon: "image" },
    ],
  },
  {
    title: "المبيعات والنمو",
    items: [
      { to: "/dashboard/leads", title: "الطلبات والعروض", desc: "تواصل، عروض أسعار، ونشرات", icon: "mail" },
      { to: "/dashboard/seo", title: "تحسين الظهور", desc: "عناوين ووصف وبيانات SEO", icon: "globe" },
      { to: "/dashboard/users", title: "المستخدمون", desc: "صلاحيات فريق العمل", icon: "users" },
    ],
  },
  {
    title: "التشغيل والأمان",
    items: [
      { to: "/dashboard/audit", title: "سجل النشاط", desc: "تتبع التغييرات الحساسة", icon: "history" },
      { to: "/dashboard/settings", title: "إعدادات النظام", desc: "بيانات الشركة والاتصال", icon: "settings" },
      { to: "/", title: "عرض الموقع", desc: "معاينة الواجهة العامة", icon: "launch" },
    ],
  },
]

const RECENT = [
  { title: "مراجعة طلب عرض سعر جديد", meta: "قبل 12 دقيقة", to: "/dashboard/leads", icon: "mail" as IconName },
  { title: "تحديث مقال المدونة", meta: "قبل ساعة", to: "/dashboard/blog", icon: "pen" as IconName },
  { title: "ضبط بيانات SEO للخدمات", meta: "اليوم", to: "/dashboard/seo", icon: "globe" as IconName },
]

export function OverviewPage({ onToast }: { onToast: (m: string) => void }) {
  void onToast
  const session = getSession()
  const { data: stats, isLoading, error, refetch } = useDashboardStatsQuery()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "صباح الخير" : hour < 18 ? "مساء الخير" : "مرحباً"

  return (
    <div className="space-y-5">
      <section className="dash-hero">
        <div className="dash-hero-grid" aria-hidden />
        <div className="dash-hero-inner text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-[var(--color-gold)]">
            <span className="size-1.5 rounded-full bg-[var(--color-gold)]" />
            مركز Amtdex التشغيلي
          </div>
          <h1 className="mt-4 text-[28px] sm:text-[36px] font-extrabold tracking-tight leading-tight">
            {greeting}{session?.user.name ? `، ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-[13px] sm:text-[14px] text-white/70 max-w-[560px] mx-auto">
            أدِر المحتوى والطلبات والفريق من لوحة واحدة بمعايير شركات المنتجات الكبرى.
          </p>

          <form
            className="dash-search mt-6"
            onSubmit={(e) => {
              e.preventDefault()
              const q = new FormData(e.currentTarget).get("q")?.toString().trim()
              if (!q) return
              if (q.includes("طلب") || q.includes("عرض")) window.location.href = "/dashboard/leads"
              else if (q.includes("مقال") || q.includes("مدون")) window.location.href = "/dashboard/blog"
              else if (q.includes("seo") || q.includes("ظهور")) window.location.href = "/dashboard/seo"
              else window.location.href = "/dashboard/content"
            }}
          >
            <Icon name="search" size={18} className="text-[var(--color-primary)]" />
            <input name="q" placeholder="ابحث عن طلب، مقال، إعداد، أو وحدة تشغيل..." aria-label="بحث لوحة التحكم" />
            <button type="submit">بحث</button>
          </form>

          <div className="dash-pill-row">
            <Link to="/dashboard/leads" className="dash-pill">الطلبات الجديدة</Link>
            <Link to="/dashboard/blog" className="dash-pill">نشر مقال</Link>
            <Link to="/dashboard/content" className="dash-pill">تحديث المحتوى</Link>
          </div>

          <div className="mt-5 text-[11px] text-white/55">
            نظرة لحظية على المشاريع والطلبات والعروض — بيانات حية من الـ API
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dash-panel animate-pulse">
              <div className="h-3 bg-[var(--color-border)] rounded w-1/3" />
              <div className="h-7 bg-[var(--color-border)] rounded w-1/2 mt-3" />
              <div className="h-3 bg-[var(--color-border)] rounded w-2/3 mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {error && (
            <div className="dash-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-[var(--color-gold)]/30 bg-[rgb(255_191_8_/_8%)]">
              <p className="text-[12px] text-[var(--color-ink)]">تعذر مزامنة الإحصائيات الحية — عرض آخر قيم محفوظة.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3 py-1.5 rounded-full"
              >
                إعادة المحاولة
              </button>
            </div>
          )}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                k: "المشاريع النشطة",
                v: stats?.activeProjects.value ?? 12,
                sub: stats?.activeProjects.sub ?? "4 قيد التنفيذ",
                icon: "folder" as IconName,
              },
              {
                k: "طلبات التواصل",
                v: stats?.contactRequests.value ?? 28,
                sub: stats?.contactRequests.sub ?? "7 جديدة اليوم",
                icon: "mail" as IconName,
              },
              {
                k: "عروض الأسعار",
                v: stats?.quotes.value ?? 9,
                sub: stats?.quotes.sub ?? "بانتظار الرد",
                icon: "invoice" as IconName,
              },
            ].map((c) => (
              <div key={c.k} className="dash-panel flex items-start gap-3">
                <span className="dash-module-ico shrink-0">
                  <Icon name={c.icon} size={18} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--color-text-faint)]">{c.k}</div>
                  <div className="text-[26px] font-extrabold text-[var(--color-ink)] leading-none mt-1">{c.v}</div>
                  <div className="text-[11px] text-[var(--color-text-muted)] mt-2">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-[minmax(0,1fr)_300px] gap-5 items-start">
        <div className="space-y-6">
          {MODULE_GROUPS.map((group) => (
            <section key={group.title}>
              <div className="flex items-center justify-between gap-3 mb-3 px-1">
                <h2 className="text-[14px] font-bold text-[var(--color-ink)]">{group.title}</h2>
                <span className="text-[11px] text-[var(--color-text-faint)]">{group.items.length} وحدات</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.items.map((item) => (
                  <Link key={item.to + item.title} to={item.to} className="dash-module-card">
                    <span className="dash-module-ico">
                      <Icon name={item.icon} size={20} />
                    </span>
                    <div>
                      <div className="text-[14px] font-bold text-[var(--color-ink)]">{item.title}</div>
                      <div className="mt-1 text-[12px] leading-5 text-[var(--color-text-muted)]">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="dash-panel xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[14px] font-bold text-[var(--color-ink)]">تابع من حيث توقفت</h2>
            <span className="text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-card-soft)] px-2 py-1 rounded-full">
              حديث
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            {RECENT.map((item) => (
              <div key={item.title} className="dash-recent-card">
                <div className="flex items-start gap-3">
                  <span className="dash-module-ico !size-10 !rounded-xl">
                    <Icon name={item.icon} size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[var(--color-ink)] leading-snug">{item.title}</div>
                    <div className="text-[11px] text-[var(--color-text-faint)] mt-1">{item.meta}</div>
                  </div>
                </div>
                <Link
                  to={item.to}
                  className="inline-flex items-center justify-center gap-1.5 text-[12px] font-bold text-[var(--color-primary)] bg-[var(--color-card-soft)] hover:bg-[var(--color-lavender)] rounded-full py-2 transition-colors"
                >
                  متابعة <span aria-hidden>←</span>
                </Link>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
