import { useState } from "react"
import {
  usePricingPlansQuery,
  useCreatePricingPlanMutation,
  useUpdatePricingPlanMutation,
  useDeletePricingPlanMutation,
} from "@/lib/queries"

interface PricingPlanData {
  id?: number | string
  name: string
  slug?: string
  badge?: string
  description: string
  price: string
  currency: string
  period: string
  cta: string
  highlight: boolean
  sort_order: number
  is_active: boolean
  features: string[]
}

export function PricingTab() {
  const { data: plans = [], isLoading } = usePricingPlansQuery()
  const createMutation = useCreatePricingPlanMutation()
  const updateMutation = useUpdatePricingPlanMutation()
  const deleteMutation = useDeletePricingPlanMutation()

  const [editingPlan, setEditingPlan] = useState<PricingPlanData | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [featureInput, setFeatureInput] = useState("")

  const handleOpenAdd = () => {
    setFormError(null)
    setEditingPlan({
      name: "",
      badge: "",
      description: "",
      price: "",
      currency: "SAR",
      period: "تدفع لمرة واحدة",
      cta: "ابدأ الآن",
      highlight: false,
      sort_order: (plans?.length || 0) + 1,
      is_active: true,
      features: [],
    })
  }

  const handleOpenEdit = (p: any) => {
    setFormError(null)
    const featuresList = (p.features || []).map((f: any) => (typeof f === "string" ? f : f.text || ""))
    setEditingPlan({
      id: p.id,
      name: p.name || "",
      slug: p.slug,
      badge: p.badge || "",
      description: p.description || "",
      price: p.price || "",
      currency: p.currency || "SAR",
      period: p.period || "تدفع لمرة واحدة",
      cta: p.cta || "ابدأ الآن",
      highlight: !!p.highlight,
      sort_order: p.sort_order ?? 1,
      is_active: p.is_active !== false,
      features: featuresList,
    })
  }

  const handleAddFeature = () => {
    if (!featureInput.trim() || !editingPlan) return
    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, featureInput.trim()],
    })
    setFeatureInput("")
  }

  const handleRemoveFeature = (idx: number) => {
    if (!editingPlan) return
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.filter((_, i) => i !== idx),
    })
  }

  const handleSave = () => {
    if (!editingPlan) return
    if (!editingPlan.name.trim()) {
      setFormError("اسم الباقة مطلوب.")
      return
    }
    if (!editingPlan.price.trim()) {
      setFormError("سعر الباقة مطلوب.")
      return
    }
    if (!editingPlan.description.trim()) {
      setFormError("وصف الباقة مطلوب.")
      return
    }

    setFormError(null)

    const payload = {
      name: editingPlan.name,
      badge: editingPlan.badge || null,
      description: editingPlan.description,
      price: editingPlan.price,
      currency: editingPlan.currency || "SAR",
      period: editingPlan.period || "تدفع لمرة واحدة",
      cta: editingPlan.cta || "ابدأ الآن",
      highlight: editingPlan.highlight,
      sort_order: editingPlan.sort_order,
      is_active: editingPlan.is_active,
      features: editingPlan.features,
    }

    if (editingPlan.id) {
      updateMutation.mutate(
        { id: editingPlan.id, data: payload },
        {
          onSuccess: () => setEditingPlan(null),
          onError: (err: any) => setFormError(err?.message || "فشل تحديث الباقة."),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setEditingPlan(null),
        onError: (err: any) => setFormError(err?.message || "فشل إضافة الباقة."),
      })
    }
  }

  const handleDelete = (p: any) => {
    if (window.confirm(`هل أنت متأكد من حذف باقة "${p.name}"؟`)) {
      deleteMutation.mutate(p.id, {
        onError: (err: any) => alert(err?.message || "فشل حذف الباقة."),
      })
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--color-ink)]">باقات الأسعار ({plans.length})</h2>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            إدارة الباقات المعروضة في صفحة الأسعار العامة ومميزاتها.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3.5 py-1.5 rounded-full hover:bg-black transition-colors"
        >
          + إضافة باقة جديدة
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
          جار تحميل باقات الأسعار...
        </div>
      ) : plans.length === 0 ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          لا توجد باقات أسعار مضافة حالياً.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {plans.map((p: any) => (
            <div
              key={p.id || p.name}
              className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                p.highlight
                  ? "border-[var(--color-primary)] shadow-[0_4px_16px_rgba(40,16,113,0.08)] bg-[var(--color-card-soft)]/40"
                  : "border-[var(--color-border)] bg-white"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-[14px] text-[var(--color-ink)]">{p.name}</span>
                    {p.badge && (
                      <span className="mr-2 text-[10px] font-bold bg-[var(--color-lavender)] text-[var(--color-primary)] px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  {p.highlight && (
                    <span className="text-[10px] bg-[var(--color-ink)] text-white px-2 py-0.5 rounded-full font-bold">
                      مميزة
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[18px] font-extrabold text-[var(--color-ink)]">
                  {p.price} <span className="text-[11px] font-normal text-[var(--color-text-muted)]">{p.currency || "SAR"} / {p.period}</span>
                </div>
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)] line-clamp-2">
                  {p.description}
                </p>
                <div className="mt-3 border-t border-[var(--color-border)] pt-2 text-[11px] text-[var(--color-text-faint)]">
                  {(p.features || []).length} مميزات مشمولة
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[var(--color-border)] pt-3">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-1 rounded-full hover:bg-[var(--color-lavender)] transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="text-[11px] font-bold text-red-600 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-[540px] w-full p-6 space-y-4 shadow-2xl border border-[var(--color-border)] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[15px] font-bold text-[var(--color-ink)]">
                {editingPlan.id ? `تعديل باقة: ${editingPlan.name}` : "إضافة باقة أسعار جديدة"}
              </h3>
              <button
                onClick={() => setEditingPlan(null)}
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

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  اسم الباقة <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="مثال: باقة النمو"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  شارة الباقة (Badge)
                </label>
                <input
                  placeholder="مثال: الأكثر طلباً"
                  value={editingPlan.badge || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  السعر <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="مثال: 9,900"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  العملة
                </label>
                <input
                  placeholder="SAR"
                  value={editingPlan.currency}
                  onChange={(e) => setEditingPlan({ ...editingPlan, currency: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  دورية الدفع
                </label>
                <input
                  placeholder="تدفع لمرة واحدة"
                  value={editingPlan.period}
                  onChange={(e) => setEditingPlan({ ...editingPlan, period: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                وصف الباقة <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="شرح مختصر للشركات والفئات المستهدفة من هذه الباقة..."
                value={editingPlan.description}
                onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-16 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  نص زر الطلب (CTA)
                </label>
                <input
                  placeholder="ابدأ الآن"
                  value={editingPlan.cta}
                  onChange={(e) => setEditingPlan({ ...editingPlan, cta: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الترتيب
                </label>
                <input
                  type="number"
                  value={editingPlan.sort_order}
                  onChange={(e) => setEditingPlan({ ...editingPlan, sort_order: Number(e.target.value) })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            {/* Features section */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                مميزات الباقة ({editingPlan.features.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  placeholder="اكتب ميزة واضغط إضافة (مثال: دعم فني على مدار الساعة)"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddFeature()
                    }
                  }}
                  className="flex-1 border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-[var(--color-ink)] text-white text-[11px] font-bold rounded-xl hover:bg-black"
                >
                  إضافة
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {editingPlan.features.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-card-soft)] rounded-lg text-[12px]"
                  >
                    <span>✓ {f}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={editingPlan.highlight}
                  onChange={(e) => setEditingPlan({ ...editingPlan, highlight: e.target.checked })}
                  className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                />
                <span className="font-bold text-[var(--color-ink)]">تمييز كـ (الأكثر طلباً)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={editingPlan.is_active}
                  onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                  className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                />
                <span className="text-[var(--color-ink)]">تفعيل وعرض في الموقع</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
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
                {createMutation.isPending || updateMutation.isPending ? "جار الحفظ..." : "حفظ الباقة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

