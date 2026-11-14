import { useId, useState } from "react"

export function TagsInput({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder: string
}) {
  const inputId = useId()
  const [inputVal, setInputVal] = useState("")

  const addTag = () => {
    const trimmed = inputVal.trim()
    if (!trimmed) return
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInputVal("")
  }

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-[11px] font-bold text-[var(--color-ink)]">{label}</label>
      <div className="flex flex-wrap gap-1.5 p-2 border border-[var(--color-border)] rounded-xl bg-white min-h-[42px] items-center">
        {tags.map((t, idx) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 bg-[var(--color-lavender)] text-[var(--color-primary)] text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
          >
            {t}
            <button
              type="button"
              aria-label={`حذف ${t}`}
              onClick={() => removeTag(idx)}
              className="text-[12px] font-bold text-black/40 hover:text-red-600 mr-0.5"
            >
              ×
            </button>
          </span>
        ))}
        <div className="flex-1 min-w-[120px] flex gap-1">
          <input
            id={inputId}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder={tags.length === 0 ? placeholder : "أضف المزيد..."}
            className="w-full text-[12px] outline-none bg-transparent"
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="text-[11px] bg-[var(--color-ink)] text-white px-2 py-0.5 rounded-md font-bold"
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
