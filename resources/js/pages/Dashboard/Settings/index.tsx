import { useState } from "react"
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
        className="text-white text-[12px] font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        style={{ background: "var(--gradient-primary)" }}
      >
        {isPending ? "جار الحفظ..." : "حفظ التغييرات"}
      </button>
    </form>
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
      email: settings?.email ?? "hello@amtdex.ye",
      phone: settings?.phone ?? "+967 7xx xxx xxx",
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
    <div className="space-y-6">
      <h1 className="text-[18px] font-bold text-[var(--color-ink)]">الإعدادات العامة</h1>

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

      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
        <h2 className="text-[14px] font-bold text-[var(--color-ink)]">النسخ الاحتياطي والاستعادة</h2>
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          SEO: {seoCount} مسارات مسجلة — يتم تصدير كامل البيانات كملف JSON.
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
