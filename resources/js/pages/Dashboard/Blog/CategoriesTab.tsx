import { QueryError } from "@/components/ui/QueryError"
import { errorMessage } from "@/lib/errors"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Button } from "@/components/ui/Button"
import type { BlogCategory } from "@/types/blog"

export function CategoriesTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [desc, setDesc] = useState("")
  const [search, setSearch] = useState("")

  const { data: categoriesRes, isLoading, error: loadError, refetch } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => BlogAPI.getAdminCategories(),
  })
  const categories = (categoriesRes?.data ?? []).filter((c) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
  })

  const saveMutation = useMutation({
    mutationFn: (payload: Partial<BlogCategory>) => BlogAPI.saveCategory(payload),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم حفظ التصنيف بنجاح.")
      setName("")
      setSlug("")
      setDesc("")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteCategory(id),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم حذف التصنيف.")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const s = slug.trim() || name.trim().toLowerCase().replace(/[\s\W-]+/g, "-")
    saveMutation.mutate({ name: name.trim(), slug: s, description: desc.trim() })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QueryError className="md:col-span-3" error={loadError} onRetry={() => { void refetch() }} />
      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white p-5 rounded-2xl border border-[var(--color-border)] space-y-3 h-fit">
        <h3 className="font-bold text-xs text-[var(--color-ink)]">إضافة تصنيف جديد</h3>
        <div>
          <label className="block text-[11px] font-semibold mb-1">اسم التصنيف</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!slug) setSlug(e.target.value.toLowerCase().replace(/[\s\W-]+/g, "-"))
            }}
            placeholder="مثال: هندسة البيانات"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">الرابط (Slug)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="data-engineering"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs font-mono outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">الوصف</label>
          <textarea
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none resize-none"
          />
        </div>
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          size="sm"
          className="w-full bg-[var(--color-ink)] text-white font-bold rounded-xl text-xs py-2"
        >
          {saveMutation.isPending ? "جارٍ الإضافة..." : "إضافة التصنيف"}
        </Button>
      </form>

      {/* List */}
      <div className="md:col-span-2 space-y-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث في التصنيفات..."
          className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none mb-1"
        />
        {isLoading ? (
          <div className="text-xs text-[var(--color-text-faint)] py-6 text-center">جارٍ التحميل...</div>
        ) : categories.length === 0 ? (
          <div className="text-xs text-[var(--color-text-muted)] py-6 text-center">لا توجد تصنيفات.</div>
        ) : (
          categories.map((c: BlogCategory) => (
            <div
              key={c.id}
              className="p-4 bg-white border border-[var(--color-border)] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-[var(--color-ink)]">{c.name}</h4>
                <p className="text-[11px] text-[var(--color-text-faint)] font-mono break-all">/categories/{c.slug}</p>
                {c.description && <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{c.description}</p>}
              </div>
              <button
                onClick={() => {
                  if (confirm(`حذف تصنيف "${c.name}"؟`)) deleteMutation.mutate(c.id)
                }}
                className="text-rose-600 border border-rose-200 rounded-xl px-3 py-2 text-xs font-bold w-full sm:w-auto"
              >
                حذف
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
