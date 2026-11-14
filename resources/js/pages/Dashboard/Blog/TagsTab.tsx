import { QueryError } from "@/components/ui/QueryError"
import { errorMessage } from "@/lib/errors"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Button } from "@/components/ui/Button"
import type { BlogTag } from "@/types/blog"

export function TagsTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [tagName, setTagName] = useState("")

  const { data: tagsRes, isLoading, error: loadError, refetch } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => BlogAPI.getAdminTags(),
  })
  const tags = tagsRes?.data ?? []

  const saveMutation = useMutation({
    mutationFn: (name: string) =>
      BlogAPI.saveTag({
        name,
        slug: name.toLowerCase().trim().replace(/[\s\W-]+/g, "-"),
      }),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم إضافة الوسم بنجاح.")
      setTagName("")
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteTag(id),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم حذف الوسم.")
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] })
    },
  })

  return (
    <div className="space-y-4">
      <QueryError error={loadError} onRetry={() => { void refetch() }} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (tagName.trim()) saveMutation.mutate(tagName.trim())
        }}
        className="flex flex-col sm:flex-row gap-2 max-w-md"
      >
        <input
          type="text"
          required
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="أدخل اسم وسم جديد (مثال: React, Docker)..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none"
        />
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          size="sm"
          className="bg-[var(--color-ink)] text-white text-xs font-bold rounded-xl w-full sm:w-auto"
        >
          إضافة وسم
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 pt-2">
        {isLoading ? (
          <div className="text-xs text-[var(--color-text-faint)]">جارٍ التحميل...</div>
        ) : tags.length === 0 ? (
          <div className="text-xs text-[var(--color-text-muted)]">لا توجد وسوم مسجلة.</div>
        ) : (
          tags.map((t: BlogTag) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[var(--color-border)] text-xs text-[var(--color-ink)]"
            >
              <span>#{t.name}</span>
              <button
                onClick={() => {
                  if (confirm(`حذف وسم "${t.name}"؟`)) deleteMutation.mutate(t.id)
                }}
                className="text-red-400 hover:text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  )
}
