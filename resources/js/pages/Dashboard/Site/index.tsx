import { useEffect, useState } from "react"
import { type CmsDocument } from "@/cms/defaults"
import { useCms, useSaveCms } from "@/cms/useCms"

const FIELD_LABELS: Record<string, string> = {
  kicker: "السطر التعريفي",
  title: "العنوان",
  lede: "المقدمة",
  cta: "زر الإجراء",
  cta2: "الزر الثاني",
  proof: "سطر الثقة",
  label: "النص",
  link: "نص الرابط",
  "footer.blurb": "نبذة التذييل",
  "footer.city": "المدينة",
}

function fieldLabel(key: string) {
  const stat = key.match(/^stat(\d+)_(value|label|sub)$/)
  if (stat) return `الرقم ${stat[1]} — ${{ value: "القيمة", label: "العنوان", sub: "الوصف" }[stat[2]]}`
  const step = key.match(/^step(\d+)_(title|description)$/)
  if (step) return `الخطوة ${step[1]} — ${step[2] === "title" ? "العنوان" : "الوصف"}`
  return ({ note: "النص التوضيحي", deck_kicker: "تعريف معرض البطاقات", deck_title: "عنوان معرض البطاقات", deck_lede: "وصف معرض البطاقات" } as Record<string,string>)[key] ?? FIELD_LABELS[key] ?? key
}

export function SiteManagerPage() {
  const remote = useCms()
  const save = useSaveCms()
  const [doc, setDoc] = useState<CmsDocument | null>(null)
  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (!doc) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = "" }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [doc])
  const current = doc ?? { copy: remote.copy, pages: remote.pages, nav: remote.nav, homeSections: remote.homeSections }

  const update = (next: CmsDocument) => setDoc(next)
  const prime = (index: number) => (el: HTMLDetailsElement | null) => {
    if (!el || el.dataset.ready === "1") return
    const narrow = window.matchMedia("(max-width: 1024px)").matches
    el.open = !narrow || index === 0
    el.dataset.ready = "1"
  }
  const move = <T,>(list: T[], index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= list.length) return list
    const copy = list.slice()
    const [item] = copy.splice(index, 1)
    copy.splice(target, 0, item)
    return copy
  }

  const persist = async () => {
    if (!remote.ready || saving || !doc) return
    const snapshot = current
    setSaving(true)
    setStatus("جار الحفظ...")
    try {
      await save(snapshot)
      setDoc(latest => latest === snapshot ? null : latest)
      setStatus("تم الحفظ ويظهر للزوار الآن")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "تعذر الحفظ")
    } finally {
      setSaving(false)
    }
  }

  if (!remote.ready) return <div className="dash-panel" role="status">{remote.error ? <>تعذّر تحميل المحتوى. <button type="button" className="dash-tab" onClick={() => void remote.refetch()}>إعادة المحاولة</button></> : "جار تحميل المحتوى المحفوظ..."}</div>

  return (
    <div className="site-manager space-y-6">
      <div>
        <h1 className="dash-page-title">محتوى الموقع</h1>
        <p className="dash-page-sub">عدّل النصوص، أظهر أو أخفِ الصفحات والأقسام، وأعد ترتيب القائمة. تُحمّل القيم المحفوظة من الخادم. الأقسام المحذوفة لا تظهر هنا.</p>
      </div>
      {status && <p role="status" className="text-[13px] text-[var(--color-text-muted)]">{status}</p>}

      <section className="dash-panel space-y-3">
        <h2 className="text-[16px] font-bold">أقسام الصفحة الرئيسية</h2>
        {current.homeSections.map((section, index) => (
          <details key={section.id} className="site-acc" ref={prime(index)}>
            <summary>
              <strong>{section.label}</strong>
            </summary>
            <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-2">
                <button type="button" className="dash-tab" onClick={() => update({ ...current, homeSections: move(current.homeSections, index, -1) })}>أعلى</button>
                <button type="button" className="dash-tab" onClick={() => update({ ...current, homeSections: move(current.homeSections, index, 1) })}>أسفل</button>
                <label className="site-toggle text-[12px] font-bold">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={(e) => {
                      const homeSections = current.homeSections.slice()
                      homeSections[index] = { ...section, visible: e.target.checked }
                      update({ ...current, homeSections })
                    }}
                  /> ظاهر
                </label>
              </div>
            </div>
            {Object.entries(section.fields).map(([key, value]) => (
              <label key={key} className="block text-[12px] font-bold">
                {fieldLabel(key)}
                <textarea
                  className="mt-1 w-full min-h-16 rounded-xl border border-[var(--color-border)] px-3 py-2 font-medium"
                  value={value}
                  onChange={(e) => {
                    const homeSections = current.homeSections.slice()
                    homeSections[index] = { ...section, fields: { ...section.fields, [key]: e.target.value } }
                    update({ ...current, homeSections })
                  }}
                />
              </label>
            ))}

            </div>
          </details>
        ))}
      </section>

      <section className="dash-panel space-y-3">
        <h2 className="text-[16px] font-bold">الصفحات</h2>
        {current.pages.map((page, index) => (
          <article key={page.path} className="border border-[var(--color-border)] rounded-2xl p-3 grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{page.label}</strong>
              <label className="site-toggle text-[12px] font-bold">
                <input
                  type="checkbox"
                  checked={page.published}
                  onChange={(e) => {
                    const pages = current.pages.slice()
                    pages[index] = { ...page, published: e.target.checked }
                    update({ ...current, pages })
                  }}
                /> منشورة
              </label>
            </div>
            <input className="rounded-xl border border-[var(--color-border)] px-3 py-2" value={page.seoTitle} aria-label={`عنوان ${page.label}`} onChange={(e) => {
              const pages = current.pages.slice(); pages[index] = { ...page, seoTitle: e.target.value }; update({ ...current, pages })
            }} />
            <textarea className="rounded-xl border border-[var(--color-border)] px-3 py-2" value={page.seoDescription} aria-label={`وصف ${page.label}`} onChange={(e) => {
              const pages = current.pages.slice(); pages[index] = { ...page, seoDescription: e.target.value }; update({ ...current, pages })
            }} />
          </article>
        ))}
      </section>

      <section className="dash-panel space-y-3">
        <h2 className="text-[16px] font-bold">القائمة</h2>
        {current.nav.map((item, index) => (
          <div key={item.id} className="flex flex-wrap items-center gap-2">
            <input className="rounded-xl border border-[var(--color-border)] px-3 py-2" value={item.label} aria-label={item.id} onChange={(e) => {
              const nav = current.nav.slice(); nav[index] = { ...item, label: e.target.value }; update({ ...current, nav })
            }} />
            <button type="button" className="dash-tab" onClick={() => update({ ...current, nav: move(current.nav, index, -1) })}>أعلى</button>
            <button type="button" className="dash-tab" onClick={() => update({ ...current, nav: move(current.nav, index, 1) })}>أسفل</button>
            <label className="site-toggle text-[12px] font-bold"><input type="checkbox" checked={item.visible} onChange={(e) => {
              const nav = current.nav.slice(); nav[index] = { ...item, visible: e.target.checked }; update({ ...current, nav })
            }} /> ظاهر</label>
          </div>
        ))}
      </section>

      <section className="dash-panel space-y-3">
        <h2 className="text-[16px] font-bold">نصوص التذييل</h2>
        {Object.entries(current.copy).map(([key, value]) => (
          <label key={key} className="block text-[12px] font-bold">
            {fieldLabel(key)}
            <textarea className="mt-1 w-full rounded-xl border border-[var(--color-border)] px-3 py-2 font-medium" value={value} onChange={(e) => update({ ...current, copy: { ...current.copy, [key]: e.target.value } })} />
          </label>
        ))}
      </section>
      <div className="site-savebar">
        <button type="button" className="btn btn-ink" disabled={saving || !doc} onClick={persist}>{saving ? "جار الحفظ..." : "حفظ التغييرات"}</button>
        {doc && <span className="text-[12px]">لديك تغييرات غير محفوظة</span>}
        {status && <span className="text-[13px]">{status}</span>}
      </div>
    </div>
  )
}
