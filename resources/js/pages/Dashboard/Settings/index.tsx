import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { API } from "@/lib/api"
import { useSettingsQuery, useUpdateSettingsMutation } from "@/lib/queries"
import type { SiteSettings } from "@/lib/queries"
import { generateSitemap, useSeo } from "@/lib/seoStore"

function SettingsForm({
  defaultSettings,
  onSave,
  isPending,
  saved,
}: {
  defaultSettings: SiteSettings
  onSave: (val: SiteSettings) => void
  isPending: boolean
  saved: boolean
}) {
  const [siteName, setSiteName] = useState(defaultSettings.siteName)
  const [email, setEmail] = useState(defaultSettings.email)
  const [phone, setPhone] = useState(defaultSettings.phone)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ siteName, email, phone })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[var(--color-ink)]">بيانات النظام</h2>
        {saved && <span className="text-[11px] text-emerald-600 font-bold">تم الحفظ بنجاح ✓</span>}
      </div>

      <label className="block text-[11px] font-medium text-[var(--color-text)]">
        اسم الموقع
        <input
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="mt-1 w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)]"
        />
      </label>

      <label className="block text-[11px] font-medium text-[var(--color-text)]">
        البريد الرسمي للتواصل
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
          className="mt-1 w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)]"
        />
      </label>

      <label className="block text-[11px] font-medium text-[var(--color-text)]">
        رقم الهاتف
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          dir="ltr"
          className="mt-1 w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)]"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="bg-gradient-primary text-white text-[12px] font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
      >
        {isPending ? "جار الحفظ..." : "حفظ التغييرات"}
      </button>
    </form>
  )
}

/** The host copies files on deploy but does not touch the database; this applies the rest. */
function DatabaseUpdateCard() {
  const queryClient = useQueryClient()
  const [state, setState] = useState<{ status: "idle" | "running" | "done" | "error"; text?: string }>({ status: "idle" })

  const run = async () => {
    setState({ status: "running" })
    try {
      const result = await API.system.updateDatabase()
      await queryClient.invalidateQueries()
      setState({
        status: "done",
        text: result.applied.length ? `تم تطبيق ${result.applied.length} تحديث: ${result.applied.join("، ")}` : "قاعدة البيانات محدّثة بالفعل، لا يوجد ما يُطبَّق.",
      })
    } catch (error) {
      setState({ status: "error", text: error instanceof Error ? error.message : "تعذّر تحديث قاعدة البيانات." })
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
      <h2 className="text-[14px] font-bold text-[var(--color-ink)]">تحديث قاعدة البيانات</h2>
      <p className="mt-1 text-[12px] leading-6 text-[var(--color-text-muted)]">
        بعض التحديثات (مثل أسماء الخدمات) تُحفظ في قاعدة البيانات، والنشر التلقائي لا يطبّقها. اضغط بعد كل نشر جديد؛ إن لم يكن هناك جديد فلن يتغير شيء.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={state.status === "running"}
        className="mt-3 bg-gradient-primary text-white text-[12px] font-bold px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-60"
      >
        {state.status === "running" ? "جارٍ التحديث..." : "تطبيق التحديثات"}
      </button>
      {state.text && (
        <p role="status" className={`mt-3 text-[12px] leading-6 ${state.status === "error" ? "text-rose-600" : "text-emerald-700"}`}>{state.text}</p>
      )}
    </div>
  )
}

export function SettingsPage() {
  const { data: settings, isLoading, error } = useSettingsQuery()
  const updateMutation = useUpdateSettingsMutation()
  const [saved, setSaved] = useState(false)
  const seoCount = useSeo().length

  const handleSave = (val: SiteSettings) => {
    updateMutation.mutate(val, {
      onSuccess: () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      },
    })
  }

  const handleExport = () => {
    const data = {
      siteName: settings?.siteName ?? "Amtdex",
      email: settings?.email ?? "Info@amtdex.com",
      phone: settings?.phone ?? "+967 784 440 429",
      sitemap: generateSitemap(),
      at: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "amtdex-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg sm:text-[18px] font-extrabold text-[var(--color-ink)]">الإعدادات العامة</h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-1">بيانات الموقع والنسخ الاحتياطي للإعدادات.</p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-[12px] text-[var(--color-text-faint)]">
          <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
          جار تحميل الإعدادات...
        </div>
      ) : error ? (
        <div className="p-6 text-center text-[12px] text-red-600">
          تعذر تحميل الإعدادات من الخادم.
        </div>
      ) : settings ? (
        <SettingsForm
          defaultSettings={settings}
          onSave={handleSave}
          isPending={updateMutation.isPending}
          saved={saved}
        />
      ) : null}

      <DatabaseUpdateCard />

      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
        <h2 className="text-[14px] font-bold text-[var(--color-ink)]">النسخ الاحتياطي والاستعادة</h2>
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          تحسين الظهور: {seoCount} مسارات مسجلة — يتم تصدير كامل البيانات كملف.
        </p>
        <button
          onClick={handleExport}
          className="mt-3 bg-[var(--color-ink)] text-white text-[12px] font-bold px-5 py-2.5 rounded-full hover:opacity-90"
        >
          تصدير الإعدادات
        </button>
      </div>
    </div>
  )
}
