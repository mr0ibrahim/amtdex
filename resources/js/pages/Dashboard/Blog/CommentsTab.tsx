import { QueryError } from "@/components/ui/QueryError"
import { errorMessage } from "@/lib/errors"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import type { BlogComment } from "@/types/blog"

export function CommentsTab({ onNotify }: { onNotify: (m: string) => void }) {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState("all")

  const { data: commentsRes, isLoading, error: loadError, refetch } = useQuery({
    queryKey: ["admin-comments", filterStatus],
    queryFn: () => BlogAPI.getAdminComments({ status: filterStatus !== "all" ? filterStatus : undefined }),
  })

  const comments = commentsRes?.data ?? []

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" | "spam" }) =>
      BlogAPI.updateCommentStatus(id, status),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم تحديث حالة التعليق.")
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BlogAPI.deleteComment(id),
    onError: error => onNotify(errorMessage(error)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      onNotify("تم حذف التعليق.")
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] })
    },
  })

  return (
    <div className="space-y-4">
      <QueryError error={loadError} onRetry={() => { void refetch() }} />
      <div className="dash-tabs">
        {["all", "pending", "approved", "spam"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`dash-tab${filterStatus === s ? " is-active" : ""}`}
          >
            {s === "all" ? "الكل" : s === "pending" ? "المعلقة" : s === "approved" ? "المعتمدة" : "مزعجة (Spam)"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-[var(--color-text-faint)]">جارٍ التحميل...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center bg-[var(--color-bg-subtle)] rounded-2xl border text-xs text-[var(--color-text-muted)]">
          لا توجد تعليقات في هذه القائمة.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c: BlogComment) => (
            <div key={c.id} className="p-4 bg-white border border-[var(--color-border)] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[var(--color-ink)]">{c.author_name}</span>
                  <span className="text-[11px] text-[var(--color-text-faint)] font-mono">({c.author_email})</span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      c.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : c.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {c.status !== "approved" && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: c.id, status: "approved" })}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      موافقة
                    </button>
                  )}
                  {c.status !== "spam" && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: c.id, status: "spam" })}
                      className="text-amber-600 font-bold hover:underline"
                    >
                      Spam
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("حذف هذا التعليق نهائياً؟")) deleteMutation.mutate(c.id)
                    }}
                    className="text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </div>
              <p className="text-xs text-[var(--color-ink)] leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
