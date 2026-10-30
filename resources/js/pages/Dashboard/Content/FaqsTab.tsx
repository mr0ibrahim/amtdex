import { useState } from "react"
import {
  useFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "@/lib/queries"

interface FaqData {
  id?: number | string
  question: string
  answer: string
  category: string
  sort_order: number
  is_published: boolean
}

export function FaqsTab() {
  const { data: faqs = [], isLoading } = useFaqsQuery()
  const createMutation = useCreateFaqMutation()
  const updateMutation = useUpdateFaqMutation()
  const deleteMutation = useDeleteFaqMutation()

  const [editingFaq, setEditingFaq] = useState<FaqData | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const handleOpenAdd = () => {
    setFormError(null)
    setEditingFaq({
      question: "",
      answer: "",
      category: "عام",
      sort_order: (faqs?.length || 0) + 1,
      is_published: true,
    })
  }

  const handleOpenEdit = (f: any) => {
    setFormError(null)
    setEditingFaq({
      id: f.id,
      question: f.question || "",
      answer: f.answer || "",
      category: f.category || "عام",
      sort_order: f.sort_order ?? 1,
      is_published: f.is_published !== false,
    })
  }

  const handleSave = () => {
    if (!editingFaq) return
    if (!editingFaq.question.trim()) {
      setFormError("نص السؤال مطلوب.")
      return
    }
    if (!editingFaq.answer.trim()) {
      setFormError("نص الإجابة مطلوب.")
      return
    }

    setFormError(null)

    const payload = {
      question: editingFaq.question,
      answer: editingFaq.answer,
      category: editingFaq.category || "عام",
      sort_order: editingFaq.sort_order || 1,
      is_published: editingFaq.is_published,
    }

    if (editingFaq.id) {
      updateMutation.mutate(
        { id: editingFaq.id, data: payload },
        {
          onSuccess: () => setEditingFaq(null),
          onError: (err: any) => setFormError(err?.message || "فشل تحديث السؤال."),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setEditingFaq(null),
        onError: (err: any) => setFormError(err?.message || "فشل إضافة السؤال."),
      })
    }
  }

  const handleDelete = (f: any) => {
    if (window.confirm(`هل أنت متأكد من حذف السؤال "${f.question}"؟`)) {
      deleteMutation.mutate(f.id, {
        onError: (err: any) => alert(err?.message || "فشل حذف السؤال."),
      })
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--color-ink)]">الأسئلة الشائعة ({faqs.length})</h2>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            إدارة بنك الأسئلة المتكررة وإجاباتها لزوار وعملاء الموقع.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3.5 py-1.5 rounded-full hover:bg-black transition-colors"
        >
          + إضافة سؤال جديد
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
          جار تحميل الأسئلة الشائعة...
        </div>
      ) : faqs.length === 0 ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          لا توجد أسئلة شائعة مضافة حالياً.
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((f: any) => (
            <div
              key={f.id || f.question}
              className="border border-[var(--color-border)] rounded-xl p-4 bg-white hover:border-[var(--color-primary)]/40 transition-colors flex items-start justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[var(--color-lavender)] text-[var(--color-primary)] font-bold px-2 py-0.5 rounded-full">
                    {f.category || "عام"}
                  </span>
                  <span className="font-bold text-[13px] text-[var(--color-ink)]">{f.question}</span>
                </div>
                <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
                  {f.answer}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(f)}
                  className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-1 rounded-full hover:bg-[var(--color-lavender)] transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(f)}
                  className="text-[11px] font-bold text-red-600 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-[500px] w-full p-6 space-y-4 shadow-2xl border border-[var(--color-border)] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[15px] font-bold text-[var(--color-ink)]">
                {editingFaq.id ? "تعديل السؤال الشائع" : "إضافة سؤال شائع جديد"}
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                نص السؤال <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="مثال: كم تستغرق مدة تنفيذ وتطوير النظام؟"
                value={editingFaq.question}
                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                الإجابة التفصيلية <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="اكتب الإجابة بوضوح ودقة للعميل..."
                value={editingFaq.answer}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-24 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  التصنيف
                </label>
                <select
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] bg-white outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="عام">عام</option>
                  <option value="الأسعار">الأسعار والتعاقد</option>
                  <option value="التقنيات">التقنيات والبرمجة</option>
                  <option value="الضمان">الضمان والدعم الفني</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الترتيب
                </label>
                <input
                  type="number"
                  value={editingFaq.sort_order}
                  onChange={(e) => setEditingFaq({ ...editingFaq, sort_order: Number(e.target.value) })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 text-[12px]">
              <input
                type="checkbox"
                checked={editingFaq.is_published}
                onChange={(e) => setEditingFaq({ ...editingFaq, is_published: e.target.checked })}
                className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
              />
              <span className="text-[var(--color-ink)] font-medium">نشر وإتاحة السؤال للعامة</span>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
                className="px-4 py-2 border border-[var(--color-border)] rounded-full text-[12px] font-medium hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={createMutation.isPending || updateMutation.isPending}
                onClick={handleSave}
                className="px-6 py-2 bg-[var(--color-ink)] text-white rounded-full text-[12px] font-bold hover:bg-black transition-colors"
              >
                {createMutation.isPending || updateMutation.isPending ? "جار الحفظ..." : "حفظ السؤال"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
