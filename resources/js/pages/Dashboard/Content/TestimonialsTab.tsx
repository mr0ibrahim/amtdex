import { useState } from "react"
import {
  useTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useUploadMediaMutation,
} from "@/lib/queries"

interface TestimonialData {
  id?: number | string
  author: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
  sort_order: number
  is_active: boolean
}

export function TestimonialsTab() {
  const { data: testimonials = [], isLoading } = useTestimonialsQuery()
  const createMutation = useCreateTestimonialMutation()
  const updateMutation = useUpdateTestimonialMutation()
  const deleteMutation = useDeleteTestimonialMutation()
  const uploadMutation = useUploadMediaMutation()

  const [editingItem, setEditingItem] = useState<TestimonialData | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleOpenAdd = () => {
    setFormError(null)
    setEditingItem({
      author: "",
      role: "",
      company: "",
      content: "",
      avatar: "",
      rating: 5,
      sort_order: (testimonials?.length || 0) + 1,
      is_active: true,
    })
  }

  const handleOpenEdit = (t: any) => {
    setFormError(null)
    setEditingItem({
      id: t.id,
      author: t.author || t.name || "",
      role: t.role || "",
      company: t.company || "",
      content: t.content || t.text || "",
      avatar: t.avatar || "",
      rating: t.rating || 5,
      sort_order: t.sort_order ?? 1,
      is_active: t.is_active !== false,
    })
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingItem) return

    setUploadingAvatar(true)
    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setUploadingAvatar(false)
        const url = res?.url || res?.data?.url
        if (url) {
          setEditingItem({ ...editingItem, avatar: url })
        }
      },
      onError: (err: any) => {
        setUploadingAvatar(false)
        alert(err?.message || "فشل رفع الصورة")
      },
    })
  }

  const handleSave = () => {
    if (!editingItem) return
    if (!editingItem.author.trim()) {
      setFormError("اسم صاحب الرأي مطلوب.")
      return
    }
    if (!editingItem.content.trim()) {
      setFormError("نص الرأي مطلوب.")
      return
    }

    setFormError(null)

    const payload = {
      author: editingItem.author,
      role: editingItem.role || "عميل",
      company: editingItem.company || "عميل أمـتـدِكس",
      content: editingItem.content,
      avatar: editingItem.avatar || null,
      rating: editingItem.rating || 5,
      sort_order: editingItem.sort_order || 1,
      is_active: editingItem.is_active,
    }

    if (editingItem.id) {
      updateMutation.mutate(
        { id: editingItem.id, data: payload },
        {
          onSuccess: () => setEditingItem(null),
          onError: (err: any) => setFormError(err?.message || "فشل تحديث الرأي."),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setEditingItem(null),
        onError: (err: any) => setFormError(err?.message || "فشل إضافة الرأي."),
      })
    }
  }

  const handleDelete = (t: any) => {
    const name = t.author || t.name
    if (window.confirm(`هل أنت متأكد من حذف رأي "${name}"؟`)) {
      deleteMutation.mutate(t.id, {
        onError: (err: any) => alert(err?.message || "فشل حذف الرأي."),
      })
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--color-ink)]">آراء وتقييمات العملاء ({testimonials.length})</h2>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            إدارة الشهادات المعروضة في الصفحة الرئيسية وأقسام الثقة.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3.5 py-1.5 rounded-full hover:bg-black transition-colors"
        >
          + إضافة رأي جديد
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
          جار تحميل آراء العملاء...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-8 text-center text-[12px] text-[var(--color-text-faint)]">
          لا توجد آراء عملاء مضافة حالياً.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {testimonials.map((t: any) => {
            const author = t.author || t.name
            const content = t.content || t.text
            const role = t.role || ""
            const company = t.company || ""
            return (
              <div
                key={t.id || author}
                className="border border-[var(--color-border)] rounded-xl p-4 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt=""
                        className="size-10 rounded-full object-cover border border-black/10 shrink-0"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-[var(--color-lavender)] text-[var(--color-primary)] font-bold grid place-items-center text-sm shrink-0">
                        {author?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-[13px] text-[var(--color-ink)]">{author}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">
                        {role} {company && `• ${company}`}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-amber-400 text-xs">
                    {"★".repeat(t.rating || 5)}{"☆".repeat(5 - (t.rating || 5))}
                  </div>

                  <p className="mt-2 text-[12px] text-[var(--color-ink)]/90 leading-relaxed line-clamp-3">
                    "{content}"
                  </p>
                </div>

                <div className="mt-4 flex justify-end gap-2 border-t border-[var(--color-border)] pt-3">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-1 rounded-full hover:bg-[var(--color-lavender)] transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="text-[11px] font-bold text-red-600 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Testimonial Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-[500px] w-full p-6 space-y-4 shadow-2xl border border-[var(--color-border)] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[15px] font-bold text-[var(--color-ink)]">
                {editingItem.id ? `تعديل رأي: ${editingItem.author}` : "إضافة رأي عميل جديد"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
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
                اسم العميل / الشخص <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="مثال: م. أحمد الشامي"
                value={editingItem.author}
                onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  المسمى الوظيفي
                </label>
                <input
                  placeholder="مثال: الرئيس التنفيذي"
                  value={editingItem.role}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الشركة / المنظمة
                </label>
                <input
                  placeholder="مثال: شركة مسار للتقنية"
                  value={editingItem.company}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                نص الشهادة / الرأي <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="اكتب تجربة العميل ورأيه بالخدمة وجودة التنفيذ..."
                value={editingItem.content}
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-20 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Avatar upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[var(--color-ink)]">
                  صورة العميل (اختياري)
                </label>
                <label className="cursor-pointer text-[10px] font-bold text-[var(--color-primary)] hover:underline">
                  {uploadingAvatar ? "جار الرفع..." : "+ رفع صورة"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              <input
                placeholder="رابط الصورة أو اضغط رفع..."
                value={editingItem.avatar || ""}
                dir="ltr"
                onChange={(e) => setEditingItem({ ...editingItem, avatar: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] font-mono outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  التقييم (النجوم)
                </label>
                <select
                  value={editingItem.rating}
                  onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] bg-white outline-none focus:border-[var(--color-primary)]"
                >
                  <option value={5}>5 نجوم ★★★★★</option>
                  <option value={4}>4 نجوم ★★★★☆</option>
                  <option value={3}>3 نجوم ★★★☆☆</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الترتيب
                </label>
                <input
                  type="number"
                  value={editingItem.sort_order}
                  onChange={(e) => setEditingItem({ ...editingItem, sort_order: Number(e.target.value) })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 text-[12px]">
              <input
                type="checkbox"
                checked={editingItem.is_active}
                onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
              />
              <span className="text-[var(--color-ink)] font-medium">عرض في الموقع الرئيسي</span>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
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
                {createMutation.isPending || updateMutation.isPending ? "جار الحفظ..." : "حفظ الرأي"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

