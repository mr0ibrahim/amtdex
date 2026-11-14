import { QueryError } from "@/components/ui/QueryError"
import { errorMessage } from "@/lib/errors"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Button } from "@/components/ui/Button"
import type { BlogSettings } from "@/types/blog"

export function SettingsTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const { data: settingsRes, isLoading, error: loadError, refetch } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => BlogAPI.getAdminSettings(),
  })

  const [form, setForm] = useState<Partial<BlogSettings>>({})

  // Sync state once loaded
  const current = { ...settingsRes?.settings, ...form }

  const saveMutation = useMutation({
    mutationFn: (data: Partial<BlogSettings>) => BlogAPI.updateAdminSettings(data),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم حفظ إعدادات المدونة بنجاح.")
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] })
      queryClient.invalidateQueries({ queryKey: ["blog-settings"] })
    },
  })

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-[var(--color-text-faint)]">جارٍ تحميل الإعدادات...</div>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        saveMutation.mutate(current)
      }}
      className="max-w-2xl bg-white p-6 rounded-2xl border border-[var(--color-border)] space-y-4 text-xs"
    >
      <QueryError error={loadError} onRetry={() => { void refetch() }} />
      <div>
        <label className="block font-bold text-[var(--color-ink)] mb-1">اسم المدونة الرئيسي</label>
        <input
          type="text"
          value={current.blog_title ?? ""}
          onChange={(e) => setForm({ ...form, blog_title: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none"
        />
      </div>

      <div>
        <label className="block font-bold text-[var(--color-ink)] mb-1">السب دومين المخصص</label>
        <input
          type="text"
          value={current.blog_subdomain ?? "blog.amtdex.com"}
          onChange={(e) => setForm({ ...form, blog_subdomain: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-mono outline-none"
        />
      </div>

      <div>
        <label className="block font-bold text-[var(--color-ink)] mb-1">وصف السيو العام للمدونة (Meta Description)</label>
        <textarea
          rows={3}
          value={current.blog_description ?? ""}
          onChange={(e) => setForm({ ...form, blog_description: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none resize-none"
        />
      </div>

      <div>
        <label className="block font-bold text-[var(--color-ink)] mb-1">عدد المقالات لكل صفحة</label>
        <input
          type="number"
          min={3}
          max={30}
          value={current.posts_per_page ?? 9}
          onChange={(e) => setForm({ ...form, posts_per_page: parseInt(e.target.value, 10) })}
          className="w-32 px-3.5 py-2 rounded-xl border border-[var(--color-border)] text-xs outline-none"
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="comments_auto"
          checked={Boolean(current.comments_auto_approve)}
          onChange={(e) => setForm({ ...form, comments_auto_approve: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="comments_auto" className="font-semibold text-[var(--color-ink)]">
          الموافقة التلقائية على التعليقات دون مراجعة يدوية
        </label>
      </div>

      <div className="pt-4 border-t border-[var(--color-border)]">
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="bg-[var(--color-ink)] hover:bg-[var(--color-primary)] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
        >
          {saveMutation.isPending ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </form>
  )
}
