import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import type { BlogTag } from "@/types/blog"
import { FieldHint, FieldLabel } from "./FieldHint"

type Props = {
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export function TagPicker({ selectedIds, onChange }: Props) {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => BlogAPI.getAdminTags(),
  })
  const tags = data?.data ?? []

  const createMutation = useMutation({
    mutationFn: (name: string) =>
      BlogAPI.saveTag({
        name,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      }),
    onSuccess: (res) => {
      const tag = res.tag
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] })
      if (tag?.id && !selectedIds.includes(tag.id)) {
        onChange([...selectedIds, tag.id])
      }
      setQuery("")
      setOpen(false)
    },
  })

  const selected = useMemo(
    () => tags.filter((t) => selectedIds.includes(t.id)),
    [tags, selectedIds],
  )

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tags
      .filter((t) => !selectedIds.includes(t.id))
      .filter((t) => !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
      .slice(0, 8)
  }, [tags, selectedIds, query])

  const exactExists = tags.some((t) => t.name.trim().toLowerCase() === query.trim().toLowerCase())

  const remove = (id: number) => onChange(selectedIds.filter((x) => x !== id))
  const add = (tag: BlogTag) => {
    if (!selectedIds.includes(tag.id)) onChange([...selectedIds, tag.id])
    setQuery("")
    setOpen(false)
  }

  return (
    <div>
      <FieldLabel>الوسوم</FieldLabel>
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-soft)]/30 p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5 min-h-[32px]">
          {selected.length === 0 && (
            <span className="text-[11px] text-[var(--color-text-faint)]">لا توجد وسوم مرتبطة بعد.</span>
          )}
          {selected.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-ink)]"
            >
              #{t.name}
              <button type="button" onClick={() => remove(t.id)} className="text-rose-500" aria-label={`إزالة ${t.name}`}>
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                if (suggestions[0]) add(suggestions[0])
                else if (query.trim() && !exactExists) createMutation.mutate(query.trim())
              }
              if (e.key === "Escape") setOpen(false)
            }}
            placeholder="ابحث أو أنشئ وسمًا..."
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-xs outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          {open && (query.trim() || suggestions.length > 0) && (
            <div className="absolute z-20 inset-x-0 top-[calc(100%+4px)] rounded-xl border border-[var(--color-border)] bg-white shadow-lg overflow-hidden max-h-56 overflow-y-auto">
              {suggestions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => add(t)}
                  className="w-full text-right px-3 py-2 text-xs hover:bg-[var(--color-card-soft)]"
                >
                  #{t.name}
                </button>
              ))}
              {query.trim() && !exactExists && (
                <button
                  type="button"
                  disabled={createMutation.isPending}
                  onClick={() => createMutation.mutate(query.trim())}
                  className="w-full text-right px-3 py-2 text-xs font-bold text-[var(--color-primary)] border-t border-[var(--color-border)] hover:bg-[var(--color-lavender)]"
                >
                  {createMutation.isPending ? "جارٍ الإنشاء..." : `+ إنشاء وسم «${query.trim()}»`}
                </button>
              )}
              {suggestions.length === 0 && exactExists && (
                <div className="px-3 py-2 text-[11px] text-[var(--color-text-muted)]">هذا الوسم مضاف أو موجود مسبقاً.</div>
              )}
            </div>
          )}
        </div>
      </div>
      <FieldHint>اضغط Enter لإضافة أول اقتراح، أو أنشئ وسمًا جديداً مباشرة من هنا.</FieldHint>
    </div>
  )
}
