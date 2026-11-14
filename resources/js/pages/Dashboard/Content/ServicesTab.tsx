import { errorMessage } from "@/lib/errors"
import { QueryError } from "@/components/ui/QueryError"
import { Modal } from "@/components/ui/Modal"
import { useRef, useState } from "react"
import { useServicesQuery, useUpsertServiceMutation, useDeleteServiceMutation } from "@/lib/queries"
import type { ServiceDraft } from "@/types/service"
import { Icon, type IconName } from "@/components/ui/Icon"
import { ContentSection } from "./ContentSection"
import { TagsInput } from "./TagsInput"
import { SERVICE_ICONS } from "./serviceIcons"

export function ServicesTab() {
  const { data: services = [], isLoading: loadingServices, error: loadError, refetch } = useServicesQuery({ fallback: false })
  const upsertServiceMutation = useUpsertServiceMutation()
  const deleteServiceMutation = useDeleteServiceMutation()
  const [editingService, setEditingService] = useState<ServiceDraft | null>(null)
  const [serviceError, setServiceError] = useState<string | null>(null)

  const version = useRef(0)
  const closeService = () => { version.current++; setEditingService(null) }

  const handleSaveService = () => {
    if (!editingService) return
    if (!editingService.title.trim()) {
      setServiceError("عنوان الخدمة مطلوب.")
      return
    }
    if (!editingService.desc.trim()) {
      setServiceError("الوصف المختصر للخدمة مطلوب.")
      return
    }
    setServiceError(null)

    const currentVersion = version.current
    upsertServiceMutation.mutate(editingService, {
      onSuccess: () => {
        if (currentVersion === version.current) closeService()
      },
      onError: (err) => {
        if (currentVersion === version.current) setServiceError(errorMessage(err, "حدث خطأ أثناء حفظ الخدمة."))
      },
    })
  }

  return <>
    <QueryError error={loadError ?? deleteServiceMutation.error} onRetry={() => { void refetch() }} />
      <ContentSection
        title={`الخدمات (${services.length})`}
        addLabel="+ إضافة خدمة"
        onAdd={() => {
          version.current++
          setServiceError(null)
          setEditingService({
            slug: "",
            icon: "web",
            title: "",
            desc: "",
            bullets: [],
            tech: [],
            detail: "",
            sort_order: services.length + 1,
            is_published: true,
          })
        }}
      >
        {loadingServices ? (
          <div className="py-6 text-center text-[12px] text-[var(--color-text-faint)]">
            <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
            جار تحميل الخدمات...
          </div>
        ) : (
          <div className="grid gap-2">
            {services.map((s) => (
              <div
                key={s.slug}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[var(--color-border)] rounded-xl px-3.5 sm:px-4 py-3 bg-white hover:border-[var(--color-primary)]/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-lg bg-[var(--color-lavender)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <Icon name={s.icon as IconName} size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[var(--color-ink)] flex flex-wrap items-center gap-2">
                      <span className="truncate max-w-full">{s.title}</span>
                      <span className="text-[10px] text-[var(--color-text-faint)] font-mono">/{s.slug}</span>
                      {s.is_published === false && (
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                          مخفي
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] line-clamp-2 sm:truncate">
                      {s.desc}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      version.current++
                      setServiceError(null)
                      setEditingService({
                        ...s,
                        originalSlug: s.slug,
                        bullets: s.bullets || [],
                        tech: s.tech || [],
                        detail: s.detail || "",
                        sort_order: s.sort_order ?? 0,
                        is_published: s.is_published ?? true,
                      })
                    }}
                    className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-full hover:bg-[var(--color-lavender)] transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف خدمة "${s.title}"؟`)) {
                        deleteServiceMutation.mutate(s.slug)
                      }
                    }}
                    className="text-[11px] font-bold border border-red-200 text-red-600 px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-full hover:bg-red-50 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ContentSection>
      {editingService && (
        <Modal label="محرر الخدمة" onClose={closeService}>
          <div className="dash-dialog-card bg-white rounded-2xl max-w-[620px] w-full p-6 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto border border-[var(--color-border)]">
            <div className="dash-dialog-head flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[16px] font-bold text-[var(--color-ink)] flex items-center gap-2">
                <Icon name={editingService.icon as IconName} size={20} />
                {editingService.slug ? "تعديل الخدمة" : "إضافة خدمة تقنية جديدة"}
              </h3>
              <button
                onClick={closeService}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {serviceError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl">
                {serviceError}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  عنوان الخدمة <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="مثال: تطوير تطبيقات الجوال"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الرابط اللطيف (Slug)
                </label>
                <input
                  placeholder="mobile (يُولد تلقائياً إن ترك فارغاً)"
                  value={editingService.slug}
                  dir="ltr"
                  onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] font-mono outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  أيقونة الخدمة
                </label>
                <select
                  value={editingService.icon}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value as IconName })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] bg-white outline-none focus:border-[var(--color-primary)]"
                >
                  {SERVICE_ICONS.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingService.sort_order ?? 0}
                  onChange={(e) =>
                    setEditingService({ ...editingService, sort_order: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                الوصف المختصر <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="وصف سريع للخدمة يظهر في البطاقة الرئيسية..."
                value={editingService.desc}
                onChange={(e) => setEditingService({ ...editingService, desc: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-20 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                التفاصيل الموسعة (تظهر في صفحة الخدمة المنفصلة)
              </label>
              <textarea
                placeholder="شرح موسع وتفصيلي لما تشمله هذه الخدمة والحلول التي نقدمها للعميل..."
                value={editingService.detail || ""}
                onChange={(e) => setEditingService({ ...editingService, detail: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-24 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <TagsInput
              label="المميزات الرئيسية (Bullets) — اضغط Enter للإضافة"
              tags={editingService.bullets || []}
              placeholder="مثال: تصميم مخصص، أداء عال، دعم فني مستمر"
              onChange={(bullets) => setEditingService({ ...editingService, bullets })}
            />

            <TagsInput
              label="التقنيات المستخدمة (Tech Stack) — اضغط Enter للإضافة"
              tags={editingService.tech || []}
              placeholder="مثال: React Native, Flutter, Swift"
              onChange={(tech) => setEditingService({ ...editingService, tech })}
            />

            <div className="p-3 bg-[var(--color-card-soft)] rounded-xl border border-[var(--color-border)] space-y-2">
              <span className="text-[11px] font-bold text-[var(--color-ink)] block">
                تحسين محركات البحث للخدمة (SEO)
              </span>
              <input
                placeholder="عنوان صفحة الخدمة في جوجل (Meta Title)"
                value={editingService.meta_title || ""}
                onChange={(e) => setEditingService({ ...editingService, meta_title: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-1.5 text-[11px] bg-white outline-none focus:border-[var(--color-primary)]"
              />
              <textarea
                placeholder="وصف مختصر للخدمة في نتائج البحث (Meta Description)"
                value={editingService.meta_description || ""}
                onChange={(e) => setEditingService({ ...editingService, meta_description: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-1.5 text-[11px] h-14 bg-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={editingService.is_published !== false}
                onChange={(e) => setEditingService({ ...editingService, is_published: e.target.checked })}
                className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
              />
              <span className="text-[12px] font-medium text-[var(--color-ink)]">
                نشر الخدمة في الموقع العام
              </span>
            </label>

            <div className="dash-dialog-actions flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={closeService}
                className="px-4 py-2 border border-[var(--color-border)] rounded-full text-[12px] font-medium hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={upsertServiceMutation.isPending}
                onClick={handleSaveService}
                className="px-6 py-2 bg-[var(--color-ink)] text-white rounded-full text-[12px] font-bold hover:bg-black transition-colors"
              >
                {upsertServiceMutation.isPending ? "جار الحفظ..." : "حفظ الخدمة"}
              </button>
            </div>
          </div>
        </Modal>
      )}

  </>
}
