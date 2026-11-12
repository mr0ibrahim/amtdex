import { useMemo, useState } from "react"
import { EditorSection, FieldHint, FieldLabel } from "./FieldHint"
import {
  SCHEMA_TYPE_OPTIONS,
  buildPostSchemaPreview,
  schemaPreviewCanonical,
  type SchemaPreviewInput,
} from "./schemaPreview"

export function SchemaPreviewPanel({
  input,
  schemaType,
  onSchemaTypeChange,
}: {
  input: SchemaPreviewInput
  schemaType: string
  onSchemaTypeChange: (value: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const graph = useMemo(
    () => buildPostSchemaPreview({ ...input, form: { ...input.form, schema_type: schemaType } }),
    [input, schemaType],
  )
  const canonical = useMemo(
    () => schemaPreviewCanonical({ ...input, form: { ...input.form, schema_type: schemaType } }),
    [input, schemaType],
  )
  const jsonText = useMemo(() => JSON.stringify(graph, null, 2), [graph])
  const types = graph.map((node) => String(node["@type"] ?? "?")).filter(Boolean)
  const richResultsUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(canonical)}`

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <EditorSection
      title="البيانات المنظمة للمقال"
      description="معاينة البيانات المنظمة التي تُحقَن في صفحة المقال بعد النشر."
    >
      <div className="space-y-3">
        <div>
          <FieldLabel htmlFor="schema-type">نوع المخطط</FieldLabel>
          <select
            id="schema-type"
            value={SCHEMA_TYPE_OPTIONS.some((o) => o.value === schemaType) ? schemaType : "BlogPosting"}
            onChange={(e) => onSchemaTypeChange(e.target.value)}
            className="w-full sm:w-auto min-w-[240px] px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none bg-white"
          >
            {SCHEMA_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldHint>يُحفظ مع المقال ويظهر في نتائج البحث بعد النشر.</FieldHint>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {types.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-[var(--color-lavender)] text-[var(--color-primary)] px-2.5 py-0.5 text-[10px] font-bold"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyJson}
            className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-2 rounded-xl hover:bg-[var(--color-lavender)] transition-colors"
          >
            {copied ? "تم النسخ" : "نسخ البيانات المنظمة"}
          </button>
          <a
            href={richResultsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-2 rounded-xl hover:bg-[var(--color-lavender)] transition-colors"
          >
            اختبار Google Rich Results
          </a>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] font-bold text-[var(--color-primary)] px-2 py-2"
          >
            {expanded ? "إخفاء البيانات" : "عرض البيانات"}
          </button>
        </div>

        <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
          رابط الاختبار يستخدم عنوان المقال الحالي. للمقالات غير المنشورة قد يظهر تنبيه حتى يصبح الرابط عاماً.
        </p>

        {expanded && (
          <pre
            dir="ltr"
            className="max-h-72 overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-ink)] text-white p-3 text-[10px] leading-4 font-mono whitespace-pre"
          >
            {jsonText}
          </pre>
        )}
      </div>
    </EditorSection>
  )
}
