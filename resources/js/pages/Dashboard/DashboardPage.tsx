import { Icon, type IconName } from "@/components/ui/Icon"
import { useRef, useState } from "react"

export function DashboardPage({ onToast }: { onToast: (m: string) => void }) {
  const [tab, setTab] = useState<"overview" | "projects" | "invoices" | "settings">("overview")
  const [projects, setProjects] = useState([
    { id: 1, name: "متجر نون — إعادة بناء", client: "نون", status: "قيد التنفيذ", progress: 64 },
    { id: 2, name: "سداد — محفظة", client: "سداد", status: "مراجعة", progress: 88 },
    { id: 3, name: "شفاء — منصة طبية", client: "شفاء", status: "مكتمل", progress: 100 },
    { id: 4, name: "رواء — ERP", client: "رواء", status: "قيد التنفيذ", progress: 42 },
  ])
  const nextIdRef = useRef(5)

  const addProject = () => {
    const n = `مشروع جديد #${projects.length + 1}`
    const id = nextIdRef.current++
    setProjects((p) => [{ id, name: n, client: "عميل جديد", status: "جديد", progress: 0 }, ...p])
    onToast("تم إنشاء المشروع — واجهة تجريبية فقط")
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-[12px] leading-5">
          <span className="font-bold">وضع المعاينة — Frontend Only:</span> هذه لوحة تحكم واجهات فقط بدون قاعدة بيانات. كل البيانات Mock وستُربط مع Laravel (Sanctum + Filament) لاحقاً.
          <span className="block text-[11px] text-black/50 mt-1">Endpoints المقترحة: GET /api/dashboard/stats — GET /api/projects — POST /api/projects — GET /api/invoices</span>
        </div>
        <span className="shrink-0 text-[10px] font-bold tracking-wide bg-[var(--color-ink)] text-white rounded-full px-3 py-1">MOCK MODE</span>
      </div>

      <div className="mt-6 grid lg:grid-cols-[220px_1fr] gap-6 items-start">
        <aside className="bg-white border border-black/5 rounded-[20px] p-3 lg:sticky lg:top-[76px]">
          <div className="flex items-center gap-2 px-2 py-2">
            <span className="size-8 rounded-xl bg-[var(--color-ink)] text-white grid place-items-center text-[12px] font-bold">A</span>
            <div>
              <div className="text-[12px] font-bold leading-none">لوحة Amtdex</div>
              <div className="text-[10px] text-black/40">admin@amtdex.com</div>
            </div>
          </div>
          <nav className="mt-4 grid gap-1">
            {[
              { id: "overview", label: "نظرة عامة", icon: "erp" },
              { id: "projects", label: "المشاريع", icon: "folder" },
              { id: "invoices", label: "الفواتير", icon: "invoice" },
              { id: "settings", label: "الإعدادات", icon: "settings" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`text-right flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${tab === t.id ? "bg-[var(--color-ink)] text-white" : "hover:bg-black/5 text-black/60"}`}
              >
                <span className="text-[12px]"><Icon name={t.icon as IconName} size={18} /></span>
                {t.label}
              </button>
            ))}
          </nav>
          <button onClick={() => onToast("تسجيل الخروج — سيُربط مع POST /api/logout")} className="mt-4 w-full py-2.5 rounded-xl border border-black/10 text-[12px] font-medium hover:bg-black hover:text-white transition-colors">
            تسجيل الخروج
          </button>
        </aside>

        <div className="min-w-0">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-[20px] font-bold">نظرة عامة</h1>
                <button onClick={addProject} className="self-start bg-[var(--color-ink)] text-white px-5 py-2.5 rounded-full text-[12px] font-semibold hover:bg-black transition-colors">
                  + مشروع جديد
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { k: "المشاريع النشطة", v: "12", sub: "4 قيد التنفيذ" },
                  { k: "إجمالي الإيراد", v: "﷼ 1.2M", sub: "+18% هذا الشهر" },
                  { k: "تذاكر الدعم", v: "3", sub: "مفتوحة" },
                ].map((c) => (
                  <div key={c.k} className="bg-white border border-black/5 rounded-2xl p-5">
                    <div className="text-[11px] text-black/40">{c.k}</div>
                    <div className="text-[22px] font-bold mt-1">{c.v}</div>
                    <div className="text-[11px] text-black/40 mt-1">{c.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-black/5 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-bold">المشاريع الأخيرة</h3>
                  <button onClick={() => setTab("projects")} className="text-[11px] font-medium underline decoration-black/20">
                    عرض الكل ←
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {projects.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 bg-[var(--color-bg)] border border-black/5 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold truncate">{p.name}</div>
                        <div className="text-[11px] text-black/40">
                          {p.client} • {p.status}
                        </div>
                      </div>
                      <div className="w-24 h-1.5 bg-black/10 rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-[var(--color-ink)] rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-[11px] font-mono text-black/40 w-8 text-left">{p.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-white border border-black/5 rounded-2xl p-5">
                  <h3 className="text-[12px] font-bold">نشاط الفريق</h3>
                  <ul className="mt-3 space-y-2 text-[12px] text-black/60">
                    <li>• أحمد أكمل واجهة الدفع — قبل ساعة</li>
                    <li>• ريم رفعت تصميم المتجر — أمس</li>
                    <li>• فيصل نشر تحديث الخادم — أمس</li>
                  </ul>
                </div>
                <div className="bg-[var(--color-ink)] text-white rounded-2xl p-5">
                  <h3 className="text-[12px] font-bold">تنبيه</h3>
                  <p className="text-[12px] text-white/60 mt-2">فاتورة #INV-0421 مستحقة خلال 3 أيام — ﷼ 14,900</p>
                  <button onClick={() => setTab("invoices")} className="mt-3 text-[11px] font-medium bg-white text-black px-4 py-1.5 rounded-full">
                    عرض الفواتير
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-[20px] font-bold">المشاريع</h1>
                <button onClick={addProject} className="bg-[var(--color-ink)] text-white px-5 py-2.5 rounded-full text-[12px] font-semibold hover:bg-black transition-colors">
                  + مشروع جديد
                </button>
              </div>
              <div className="bg-white border border-black/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead className="bg-[var(--color-bg)] text-[11px] text-black/40">
                      <tr>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          المشروع
                        </th>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          العميل
                        </th>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          الحالة
                        </th>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          التقدم
                        </th>
                        <th scope="col" className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr key={p.id} className="border-t border-black/5 hover:bg-[var(--color-bg)]/60">
                          <td className="px-4 py-3 font-medium">{p.name}</td>
                          <td className="px-4 py-3 text-black/60">{p.client}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${p.status === "مكتمل" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : p.status === "مراجعة" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-black/5 text-black/60 border border-black/10"}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-black/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--color-ink)] rounded-full" style={{ width: `${p.progress}%` }} />
                              </div>
                              <span className="text-[11px] font-mono">{p.progress}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-left">
                            <button onClick={() => onToast(`فتح ${p.name}`)} className="text-[11px] font-medium underline decoration-black/20">
                              عرض
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 text-[11px] text-black/30 border-t border-black/5">GET /api/projects — مع pagination و filter?status= — جاهز للربط</div>
              </div>
            </div>
          )}

          {tab === "invoices" && (
            <div className="space-y-4">
              <h1 className="text-[20px] font-bold">الفواتير</h1>
              <div className="bg-white border border-black/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead className="bg-[var(--color-bg)] text-[11px] text-black/40">
                      <tr>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          رقم الفاتورة
                        </th>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          العميل
                        </th>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          المبلغ
                        </th>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          الحالة
                        </th>
                        <th scope="col" className="text-right px-4 py-3 font-medium">
                          الاستحقاق
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "INV-0421", client: "نون", amount: "﷼ 14,900", status: "مستحقة", due: "2026-04-01" },
                        { id: "INV-0420", client: "سداد", amount: "﷼ 32,000", status: "مدفوعة", due: "2026-03-15" },
                        { id: "INV-0419", client: "شفاء", amount: "﷼ 8,500", status: "مدفوعة", due: "2026-03-01" },
                      ].map((r) => (
                        <tr key={r.id} className="border-t border-black/5">
                          <td className="px-4 py-3 font-mono text-[12px]">{r.id}</td>
                          <td className="px-4 py-3">{r.client}</td>
                          <td className="px-4 py-3 font-semibold">{r.amount}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${r.status === "مدفوعة" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{r.status}</span>
                          </td>
                          <td className="px-4 py-3 text-black/50 text-[12px]">{r.due}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-4">
              <h1 className="text-[20px] font-bold">الإعدادات</h1>
              <div className="bg-white border border-black/5 rounded-2xl p-6">
                <h3 className="text-[13px] font-bold">إعدادات الحساب</h3>
                <div className="mt-4 grid gap-4 max-w-[420px]">
                  <div>
                    <label htmlFor="dash-company" className="text-[12px] font-medium">
                      اسم الشركة
                    </label>
                    <input id="dash-company" defaultValue="Amtdex" className="mt-1.5 w-full bg-[var(--color-bg)] border border-black/10 rounded-xl px-4 py-3 text-[13px] outline-none" />
                  </div>
                  <div>
                    <label htmlFor="dash-email" className="text-[12px] font-medium">
                      البريد
                    </label>
                    <input id="dash-email" defaultValue="admin@amtdex.com" dir="ltr" className="mt-1.5 w-full bg-[var(--color-bg)] border border-black/10 rounded-xl px-4 py-3 text-[13px] outline-none" />
                  </div>
                  <div>
                    <label htmlFor="dash-api" className="text-[12px] font-medium">
                      رابط الـ API (Laravel)
                    </label>
                    <input id="dash-api" placeholder="https://api.amtdex.test/api" dir="ltr" className="mt-1.5 w-full bg-[var(--color-bg)] border border-black/10 rounded-xl px-4 py-3 text-[13px] outline-none placeholder:text-black/30" />
                    <p className="text-[11px] text-black/30 mt-1">يُحفظ في VITE_API_URL — src/lib/api.ts</p>
                  </div>
                  <button onClick={() => onToast("تم الحفظ — واجهة تجريبية")} className="w-fit bg-[var(--color-ink)] text-white px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-black transition-colors">
                    حفظ التغييرات
                  </button>
                </div>
              </div>
              <div className="bg-[var(--color-ink)] text-white rounded-2xl p-6">
                <h3 className="text-[13px] font-bold">الربط مع Laravel — دليل سريع</h3>
                <ol className="mt-3 space-y-2 text-[12px] leading-6 text-white/70 list-decimal list-inside">
                  <li>
                    أنشئ مشروع Laravel + Sanctum + Filament
                  </li>
                  <li>
                    أنشئ endpoints: <code className="bg-white/10 px-1 py-0.5 rounded">/api/contact</code> <code className="bg-white/10 px-1 py-0.5 rounded">/api/quotes</code>{" "}
                    <code className="bg-white/10 px-1 py-0.5 rounded">/api/projects</code>
                  </li>
                  <li>
                    ضع <code className="bg-white/10 px-1 py-0.5 rounded">VITE_API_URL=https://your-api.test/api</code> في <code className="bg-white/10 px-1 py-0.5 rounded">.env</code>
                  </li>
                  <li>
                    استبدل stubs في <code className="bg-white/10 px-1 py-0.5 rounded">src/lib/api.ts</code> بـ fetch حقيقي مع <code className="bg-white/10 px-1 py-0.5 rounded">Authorization: Bearer</code>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
