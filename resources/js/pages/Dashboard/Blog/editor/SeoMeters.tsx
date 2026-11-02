import { FieldHint, FieldLabel } from "./FieldHint"

function meterTone(length: number, min: number, idealMax: number, hardMax: number): "green" | "yellow" | "red" {
  if (length === 0) return "yellow"
  if (length < min) return "yellow"
  if (length > hardMax) return "red"
  if (length > idealMax) return "yellow"
  return "green"
}

function toneClasses(tone: "green" | "yellow" | "red") {
  if (tone === "green") return { bar: "bg-emerald-500", text: "text-emerald-700", track: "bg-emerald-100" }
  if (tone === "yellow") return { bar: "bg-amber-500", text: "text-amber-700", track: "bg-amber-100" }
  return { bar: "bg-rose-500", text: "text-rose-700", track: "bg-rose-100" }
}

function Meter({
  label,
  value,
  onChange,
  min,
  idealMax,
  hardMax,
  hint,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  min: number
  idealMax: number
  hardMax: number
  hint: string
  multiline?: boolean
}) {
  const length = value.length
  const tone = meterTone(length, min, idealMax, hardMax)
  const cls = toneClasses(tone)
  const pct = Math.min(100, Math.round((length / hardMax) * 100))
  const shortWarn = length > 0 && length < min

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <FieldLabel>{label}</FieldLabel>
        <span className={`text-[11px] font-bold ${cls.text}`}>
          {length}/{hardMax}
        </span>
      </div>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none resize-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      )}
      <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${cls.track}`}>
        <div className={`h-full ${cls.bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <FieldHint>{hint}</FieldHint>
      {shortWarn && (
        <p className="mt-1 text-[11px] font-semibold text-amber-700">قصير جداً — يُفضّل بين {min} و{idealMax} حرفاً.</p>
      )}
      {length > hardMax && <p className="mt-1 text-[11px] font-semibold text-rose-700">تجاوز الحد الأقصى وقد يُقتطع في نتائج البحث.</p>}
    </div>
  )
}

export function SeoTitleMeter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Meter
      label="Meta Title"
      value={value}
      onChange={onChange}
      min={30}
      idealMax={60}
      hardMax={60}
      hint="الطول الأمثل تقريباً 50–60 حرفاً. يظهر كعنوان نتيجة البحث."
    />
  )
}

export function SeoDescriptionMeter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Meter
      label="Meta Description"
      value={value}
      onChange={onChange}
      min={50}
      idealMax={160}
      hardMax={160}
      hint="الطول الأمثل 120–160 حرفاً. يظهر كوصف تحت العنوان في نتائج البحث."
      multiline
    />
  )
}

export type ReadinessItem = { id: string; label: string; ok: boolean; tip?: string }

export function PublishReadiness({ items }: { items: ReadinessItem[] }) {
  const ready = items.filter((i) => i.ok).length
  const total = items.length
  const allOk = ready === total

  return (
    <div
      className={`rounded-2xl border p-4 space-y-3 ${
        allOk ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-extrabold text-[var(--color-ink)]">جاهزية النشر</h4>
        <span className={`text-[11px] font-bold ${allOk ? "text-emerald-700" : "text-amber-700"}`}>
          {ready}/{total}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-[11px]">
            <span className={item.ok ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>{item.ok ? "✓" : "✗"}</span>
            <span>
              <span className="font-semibold text-[var(--color-ink)]">{item.label}</span>
              {!item.ok && item.tip && <span className="text-[var(--color-text-muted)]"> — {item.tip}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
