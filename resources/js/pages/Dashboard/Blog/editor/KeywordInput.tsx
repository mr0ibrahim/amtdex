import { useState } from "react"
import { mergeKeywords, parseKeywordList } from "@/lib/seoKeywords"
import { FieldHint, FieldLabel } from "./FieldHint"

type Props = {
  keywords: string[]
  onChange: (keywords: string[]) => void
  disabled?: boolean
}

export function KeywordInput({ keywords, onChange, disabled }: Props) {
  const [draft, setDraft] = useState("")

  const commit = (raw: string) => {
    const parts = parseKeywordList(raw)
    if (parts.length === 0) {
      setDraft("")
      return
    }
    onChange(mergeKeywords(keywords, parts))
    setDraft("")
  }

  return (
    <div>
      <FieldLabel htmlFor="seo-keyword-input">الكلمات المفتاحية</FieldLabel>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-2 py-1.5 min-h-[44px] focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="inline-flex items-center gap-1 max-w-full rounded-full bg-[var(--color-lavender)] text-[var(--color-ink)] text-[11px] font-bold px-2.5 py-1"
          >
            <span className="truncate">{keyword}</span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(keywords.filter((item) => item !== keyword))}
              className="text-[13px] leading-none text-[var(--color-text-muted)] hover:text-rose-600"
              aria-label={`إزالة ${keyword}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id="seo-keyword-input"
          type="text"
          value={draft}
          disabled={disabled}
          aria-label="إضافة كلمة مفتاحية"
          placeholder={keywords.length === 0 ? "اكتب كلمة أو عبارة ثم Enter" : "أضف المزيد..."}
          onChange={(e) => {
            const value = e.target.value
            if (/[,،\n\r]/.test(value)) {
              commit(value)
              return
            }
            setDraft(value)
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return
            if (e.key === "Enter" || e.key === "," || e.key === "،") {
              e.preventDefault()
              commit(draft)
              return
            }
            if (e.key === "Backspace" && draft === "" && keywords.length > 0) {
              e.preventDefault()
              onChange(keywords.slice(0, -1))
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text")
            if (!/[,،\n\r]/.test(text)) return
            e.preventDefault()
            commit(`${draft}${text}`)
          }}
          onBlur={() => {
            if (draft.trim()) commit(draft)
          }}
          className="flex-1 min-w-[140px] bg-transparent px-1.5 py-1 text-xs outline-none"
        />
      </div>
      <FieldHint>
        كلمة واحدة أو عدة كلمات، بالعربية أو الإنجليزية. المسافة تبقى داخل العبارة. Enter أو الفاصلة
        (، أو ,) تضيف الكلمة، ولصق قائمة مفصولة بفواصل أو أسطر يضيفها كلها. التكرار يُتجاهل.
        {keywords[0] ? ` الكلمة الأساسية للفحص: «${keywords[0]}».` : ""}
      </FieldHint>
    </div>
  )
}
