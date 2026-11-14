import { QueryError } from "@/components/ui/QueryError"
import { errorMessage } from "@/lib/errors"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { Button } from "@/components/ui/Button"
import type { BlogRedirect } from "@/types/blog"

export function RedirectsTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [source, setSource] = useState("")
  const [target, setTarget] = useState("")

  const { data: redirectsRes, isLoading, error: loadError, refetch } = useQuery({
    queryKey: ["admin-redirects"],
    queryFn: () => BlogAPI.getAdminRedirects(),
  })
  const redirects = redirectsRes?.data ?? []

  const saveMutation = useMutation({
    mutationFn: (data: { source_path: string; target_path: string; status_code: number }) =>
      BlogAPI.saveRedirect(data),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم إضافة التحويل 301 بنجاح.")
      setSource("")
      setTarget("")
      queryClient.invalidateQueries({ queryKey: ["admin-redirects"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteRedirect(id),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم حذف التحويل.")
      queryClient.invalidateQueries({ queryKey: ["admin-redirects"] })
    },
  })

  return (
    <div className="space-y-4">
      <QueryError error={loadError} onRetry={() => { void refetch() }} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (source.trim() && target.trim()) {
            saveMutation.mutate({ source_path: source.trim(), target_path: target.trim(), status_code: 301 })
          }
        }}
        className="p-4 bg-white border border-[var(--color-border)] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
      >
        <div>
          <label className="block text-[11px] font-bold mb-1">المسار القديم (Source)</label>
          <input
            type="text"
            required
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="/posts/old-slug"
            className="w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold mb-1">المسار الجديد (Target)</label>
          <input
            type="text"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="/posts/new-slug"
            className="w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none"
          />
        </div>
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          size="sm"
          className="bg-[var(--color-ink)] text-white text-xs font-bold rounded-xl py-2"
        >
          + إضافة تحويل 301
        </Button>
      </form>

      <div className="space-y-2">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-[var(--color-text-faint)]">جارٍ التحميل...</div>
        ) : redirects.length === 0 ? (
          <div className="py-8 text-center bg-[var(--color-bg-subtle)] rounded-2xl border text-xs text-[var(--color-text-muted)]">
            لا توجد تحويلات مخصصة مسجلة حالياً.
          </div>
        ) : (
          redirects.map((r: BlogRedirect) => (
            <div key={r.id} className="p-3 bg-white border rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-red-500">{r.source_path}</span>
                <span className="text-gray-400">→</span>
                <span className="text-emerald-600 font-bold">{r.target_path}</span>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  {r.status_code} ({r.hits} نقرة)
                </span>
              </div>
              <button
                onClick={() => {
                  if (confirm("حذف هذا التحويل؟")) deleteMutation.mutate(r.id)
                }}
                className="text-red-400 hover:text-red-600 font-bold"
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
