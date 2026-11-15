import { Modal } from "@/components/ui/Modal"
import { TagsInput } from "./TagsInput"
import type { ProjectEditorState } from "./useProjectEditor"

export function ProjectEditor({ editor }: { editor: ProjectEditorState }) {
  const { editingProject, setEditingProject, closeProject, projectError, customCat, setCustomCat, existingCategories, uploadingCover, uploadingGallery, uploadingOg, galleryUrlInput, setGalleryUrlInput, handleSaveProject, handleCoverUpload, handleGalleryUpload, handleAddGalleryUrl, handleRemoveGalleryItem, handleOgUpload, saving } = editor
  return <>
      {editingProject && (
        <Modal label="محرر المشروع" onClose={closeProject}>
          <div className="dash-dialog-card bg-white rounded-2xl max-w-[720px] w-full p-6 space-y-4 shadow-2xl my-8 max-h-[92vh] overflow-y-auto border border-[var(--color-border)]">
            <div className="dash-dialog-head flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[16px] font-bold text-[var(--color-ink)]">
                {editingProject.slug ? `تعديل مشروع: ${editingProject.title}` : "إضافة مشروع جديد إلى معرض الأعمال"}
              </h3>
              <button
                onClick={closeProject}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {projectError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl">
                {projectError}
              </div>
            )}

            {/* Basic Project Info */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  عنوان المشروع <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="اسم المشروع"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  الرابط اللطيف (Slug)
                </label>
                <input
                  placeholder="nabdh-alyaman (يُولد تلقائياً)"
                  value={editingProject.slug}
                  dir="ltr"
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] font-mono outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[var(--color-ink)]">
                    التصنيف (Category) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomCat(!customCat)}
                    className="text-[10px] text-[var(--color-primary)] hover:underline font-bold"
                  >
                    {customCat ? "اختر من القائمة" : "+ تصنيف مخصص"}
                  </button>
                </div>
                {customCat ? (
                  <input
                    placeholder="اكتب اسم التصنيف الجديد..."
                    value={editingProject.cat}
                    onChange={(e) => setEditingProject({ ...editingProject, cat: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                  />
                ) : (
                  <select
                    value={editingProject.cat}
                    onChange={(e) => setEditingProject({ ...editingProject, cat: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] bg-white outline-none focus:border-[var(--color-primary)]"
                  >
                    {existingCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    {!existingCategories.includes(editingProject.cat) && editingProject.cat && (
                      <option value={editingProject.cat}>{editingProject.cat}</option>
                    )}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">سنة التنفيذ</label>
                <input
                  placeholder="2026"
                  value={editingProject.year}
                  onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  اسم العميل / الجهة <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="اسم العميل"
                  value={editingProject.client}
                  onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProject.sort_order ?? 0}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, sort_order: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                ملخص دراسة الحالة <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="نبذة سريعة عما تم إنجازه في هذا المشروع ولماذا كان ناجحاً..."
                value={editingProject.summary}
                onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-16 outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Cover Image & Alt Text */}
            <div className="p-4 bg-[var(--color-card-soft)] rounded-xl border border-[var(--color-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[var(--color-ink)]">غلاف المشروع (Cover Image)</span>
                <label className="cursor-pointer text-[11px] font-bold bg-[var(--color-lavender)] text-[var(--color-primary)] px-3 py-1.5 rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  {uploadingCover ? "جار الرفع..." : "رفع غلاف 📤"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingCover}
                    onChange={handleCoverUpload}
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  placeholder="https://... رابط صورة الغلاف أو ارفع من الزر"
                  value={editingProject.cover_image || ""}
                  dir="ltr"
                  onChange={(e) => setEditingProject({ ...editingProject, cover_image: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] font-mono bg-white outline-none focus:border-[var(--color-primary)]"
                />
                <input
                  placeholder="النص البديل للصورة (Alt Text)"
                  value={editingProject.cover_image_alt || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, cover_image_alt: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] bg-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {editingProject.cover_image && (
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={editingProject.cover_image}
                    alt="معاينة الغلاف"
                    className="h-16 w-28 object-cover rounded-lg border border-black/10 shadow-sm"
                  />
                  <div className="flex-1 text-[11px] text-[var(--color-text-muted)] truncate">
                    يظهر هذا الغلاف في بطاقات الأعمال وفي ترويسة تفاصيل المشروع.
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProject({ ...editingProject, cover_image: "", cover_image_alt: "" })}
                    className="text-[11px] text-red-600 font-bold hover:underline"
                  >
                    إزالة الغلاف
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="p-4 bg-[var(--color-card-soft)] rounded-xl border border-[var(--color-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[var(--color-ink)]">
                  معرض الصور واللقطات ({editingProject.gallery?.length || 0})
                </span>
                <label className="cursor-pointer text-[11px] font-bold bg-[var(--color-lavender)] text-[var(--color-primary)] px-3 py-1.5 rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  {uploadingGallery ? "جار الرفع..." : "+ رفع صورة للمعرض 📤"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingGallery}
                    onChange={handleGalleryUpload}
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="https://... أضف رابط صورة مباشر للمعرض"
                  value={galleryUrlInput}
                  dir="ltr"
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddGalleryUrl()
                    }
                  }}
                  className="flex-1 border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] font-mono bg-white outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="px-3.5 py-1.5 bg-[var(--color-ink)] text-white text-[11px] font-bold rounded-xl hover:bg-black"
                >
                  إضافة
                </button>
              </div>

              {editingProject.gallery && editingProject.gallery.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                  {editingProject.gallery.map((url, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-black/10 aspect-video bg-white">
                      <img src={url} alt={`معاينة ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(i)}
                        className="absolute top-1 left-1 size-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center opacity-80 hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Case Study Details */}
            <div className="p-4 bg-[var(--color-card-soft)] rounded-xl border border-[var(--color-border)] space-y-3">
              <span className="text-[12px] font-bold text-[var(--color-ink)] block">
                تفاصيل دراسة الحالة (Case Study Details)
              </span>

              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  التحدي (Challenge)
                </label>
                <textarea
                  placeholder="وصف المشكلة أو التحدي الذي واجه العميل قبل بدء المشروع..."
                  value={editingProject.challenge || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-16 bg-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <TagsInput
                label="ما بنيناه وتسليمه (Deliverables) — اضغط Enter للإضافة"
                tags={editingProject.deliverables || []}
                placeholder="مثال: واجهة سريعة، لوحة تحكم، بوابات دفع"
                onChange={(deliverables) => setEditingProject({ ...editingProject, deliverables })}
              />

              {/* Metrics */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  أهم النتائج والمؤشرات (Key Metrics)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((idx) => {
                    const currentMetrics = editingProject.metrics || [
                      { v: "+40%", l: "أسرع" },
                      { v: "2.1×", l: "تحويل أعلى" },
                      { v: "99.9%", l: "توفر" },
                    ]
                    const metric = currentMetrics[idx] || { v: "", l: "" }
                    return (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-[var(--color-border)] space-y-1.5">
                        <input
                          placeholder="القيمة e.g. +40%"
                          value={metric.v}
                          dir="ltr"
                          onChange={(e) => {
                            const newMetrics = [...currentMetrics]
                            newMetrics[idx] = { ...metric, v: e.target.value }
                            setEditingProject({ ...editingProject, metrics: newMetrics })
                          }}
                          className="w-full font-bold text-[12px] text-center border-b border-gray-100 pb-1 outline-none"
                        />
                        <input
                          placeholder="الوصف e.g. أسرع"
                          value={metric.l}
                          onChange={(e) => {
                            const newMetrics = [...currentMetrics]
                            newMetrics[idx] = { ...metric, l: e.target.value }
                            setEditingProject({ ...editingProject, metrics: newMetrics })
                          }}
                          className="w-full text-[11px] text-center text-gray-500 outline-none"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">المدة الزمنية</label>
                  <input
                    placeholder="مثال: 8 أسابيع"
                    value={editingProject.duration || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] bg-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">حجم الفريق</label>
                  <input
                    placeholder="مثال: 5 أشخاص"
                    value={editingProject.team_size || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, team_size: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] bg-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">رابط المشروع الحي</label>
                  <input
                    placeholder="https://client.com"
                    value={editingProject.project_url || ""}
                    dir="ltr"
                    onChange={(e) => setEditingProject({ ...editingProject, project_url: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] font-mono bg-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>

            <TagsInput
              label="حزمة التقنيات (Stack) — اضغط Enter للإضافة"
              tags={editingProject.stack || []}
              placeholder="مثال: Flutter, Laravel, AWS"
              onChange={(stack) => setEditingProject({ ...editingProject, stack })}
            />

            {/* Colors */}
            <div className="grid sm:grid-cols-2 gap-3 p-3 bg-[var(--color-card-soft)] rounded-xl border border-[var(--color-border)]">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  لون البطاقة الأساسي (Hex)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={editingProject.color?.startsWith("#") ? editingProject.color : "#0E2A47"}
                    onChange={(e) => setEditingProject({ ...editingProject, color: e.target.value })}
                    className="size-8 rounded-lg cursor-pointer border border-[var(--color-border)] p-0.5"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={editingProject.color || "#0E2A47"}
                    onChange={(e) => setEditingProject({ ...editingProject, color: e.target.value })}
                    className="flex-1 border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-[11px] font-mono bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  اللون الثانوي (Accent)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={editingProject.accent?.startsWith("#") ? editingProject.accent : "#2ECC71"}
                    onChange={(e) => setEditingProject({ ...editingProject, accent: e.target.value })}
                    className="size-8 rounded-lg cursor-pointer border border-[var(--color-border)] p-0.5"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={editingProject.accent || "#2ECC71"}
                    onChange={(e) => setEditingProject({ ...editingProject, accent: e.target.value })}
                    className="flex-1 border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-[11px] font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="p-4 bg-[var(--color-card-soft)] rounded-xl border border-[var(--color-border)] space-y-3">
              <span className="text-[12px] font-bold text-[var(--color-ink)] block">
                تحسين محركات البحث للمشروع (SEO & Open Graph)
              </span>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  عنوان الصفحة في جوجل (Meta Title)
                </label>
                <input
                  placeholder="عنوان مخصص لمحركات البحث (إن ترك فارغاً سيتم استخدام عنوان المشروع)"
                  value={editingProject.meta_title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, meta_title: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] bg-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-ink)] mb-1">
                  وصف الصفحة في جوجل (Meta Description)
                </label>
                <textarea
                  placeholder="وصف مخصص يظهر في نتائج البحث ومشاركات وسائل التواصل..."
                  value={editingProject.meta_description || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, meta_description: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-14 bg-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[var(--color-ink)]">
                    صورة المشاركة الاجتماعية (OG Image)
                  </label>
                  <label className="cursor-pointer text-[10px] font-bold text-[var(--color-primary)] hover:underline">
                    {uploadingOg ? "جار الرفع..." : "+ رفع صورة OG"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingOg}
                      onChange={handleOgUpload}
                    />
                  </label>
                </div>
                <input
                  placeholder="https://... رابط صورة المعاينة الاجتماعية"
                  value={editingProject.og_image || ""}
                  dir="ltr"
                  onChange={(e) => setEditingProject({ ...editingProject, og_image: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[11px] font-mono bg-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={editingProject.is_published !== false}
                onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
              />
              <span className="text-[12px] font-medium text-[var(--color-ink)]">
                نشر المشروع في المعرض العام
              </span>
            </label>

            <div className="dash-dialog-actions flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={closeProject}
                className="px-4 py-2 border border-[var(--color-border)] rounded-full text-[12px] font-medium hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveProject}
                className="px-6 py-2 bg-[var(--color-ink)] text-white rounded-full text-[12px] font-bold hover:bg-black transition-colors"
              >
                {saving ? "جار الحفظ..." : "حفظ المشروع"}
              </button>
            </div>
          </div>
        </Modal>
      )}
  </>
}
