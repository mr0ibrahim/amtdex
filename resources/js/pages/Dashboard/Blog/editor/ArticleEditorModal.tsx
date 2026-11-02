import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BlogAPI } from "@/lib/blogApi"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import type { BlogCategory, BlogPost, BlogPostStatus } from "@/types/blog"
import { CoverUpload } from "./CoverUpload"
import { EditorSection, FieldHint, FieldLabel } from "./FieldHint"
import { PublishReadiness, SeoDescriptionMeter, SeoTitleMeter, type ReadinessItem } from "./SeoMeters"
import { RichTextEditor } from "./RichTextEditor"
import { SchemaPreviewPanel } from "./SchemaPreviewPanel"
import { sanitizeBlogHtml } from "./sanitizeHtml"
import { TagPicker } from "./TagPicker"

function formatSeoPublishError(err: unknown): string {
  if (err instanceof ApiError && err.errors) {
    const messages = Object.values(err.errors).flat().filter(Boolean)
    if (messages.length) return messages.slice(0, 3).join(" — ")
  }
  if (err instanceof Error && err.message) return err.message
  return "تعذر إكمال العملية بسبب متطلبات SEO أو التحقق."
}

function toLocalInputValue(iso?: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

type Section = "content" | "seo" | "advanced"

export function ArticleEditorModal({
  initialData,
  onClose,
  onSaved,
}: {
  initialData: Partial<BlogPost>
  onClose: () => void
  onSaved: (msg: string) => void
}) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<Partial<BlogPost>>(initialData)
  const [tagIds, setTagIds] = useState<number[]>(initialData.tags?.map((t) => t.id) ?? [])
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>(initialData.faq_schema ?? [])
  const [section, setSection] = useState<Section>("content")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">(
    initialData.status === "scheduled" ? "schedule" : "now",
  )
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategorySlug, setNewCategorySlug] = useState("")

  const patch = (next: Partial<BlogPost>) => {
    setForm((prev) => ({ ...prev, ...next }))
    setDirty(true)
  }

  const { data: categoriesRes } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => BlogAPI.getAdminCategories(),
  })
  const categories = categoriesRes?.data ?? []

  type SavePayload = Omit<Partial<BlogPost>, "tags"> & { tags: number[] }

  const saveMutation = useMutation({
    mutationFn: (payload: SavePayload) => {
      const body = payload as unknown as Partial<BlogPost>
      if (payload.id) return BlogAPI.updateAdminPost(payload.id, body)
      return BlogAPI.createAdminPost(body)
    },
    onSuccess: (_, vars) => {
      setSaveError(null)
      setDirty(false)
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] })
      const msg =
        vars.status === "published"
          ? "تم حفظ المقال ونشره بنجاح."
          : vars.status === "scheduled"
            ? "تم جدولة المقال بنجاح."
            : "تم حفظ المسودة بنجاح."
      onSaved(msg)
    },
    onError: (err) => setSaveError(formatSeoPublishError(err)),
  })

  const categoryMutation = useMutation({
    mutationFn: (payload: Partial<BlogCategory>) => BlogAPI.saveCategory(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
      if (res.category?.id) {
        patch({ category_id: res.category.id })
      }
      setShowNewCategory(false)
      setNewCategoryName("")
      setNewCategorySlug("")
    },
  })

  const focusKey = form.focus_keyword?.trim().toLowerCase() ?? ""
  const titleHasKey = focusKey ? (form.title ?? "").toLowerCase().includes(focusKey) : false
  const slugHasKey = focusKey ? (form.slug ?? "").toLowerCase().includes(focusKey) : false
  const summaryHasKey = focusKey ? (form.summary ?? "").toLowerCase().includes(focusKey) : false

  const autoGenerateSlug = () => {
    if (!form.title) return
    const s = form.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
    patch({ slug: s || `post-${Date.now()}` })
  }

  const readiness: ReadinessItem[] = useMemo(() => {
    const title = (form.meta_title || form.title || "").trim()
    const desc = (form.meta_description || form.summary || "").trim()
    const contentText = sanitizeBlogHtml(form.content || "").replace(/<[^>]+>/g, "").trim()
    return [
      { id: "title", label: "عنوان المقال", ok: !!(form.title && form.title.trim()), tip: "أدخل عنواناً واضحاً" },
      { id: "slug", label: "الرابط الدائم", ok: !!(form.slug && form.slug.trim()), tip: "ولّد أو اكتب slug" },
      { id: "content", label: "المحتوى", ok: contentText.length > 20, tip: "أضف محتوى كافياً" },
      {
        id: "meta_title",
        label: "Meta Title (≤60)",
        ok: title.length > 0 && title.length <= 60,
        tip: "اطلب عنوان SEO ضمن 60 حرفاً",
      },
      {
        id: "meta_desc",
        label: "Meta Description (50–160)",
        ok: desc.length >= 50 && desc.length <= 160,
        tip: "الوصف يجب أن يكون بين 50 و160 حرفاً",
      },
      {
        id: "cover",
        label: "صورة الغلاف",
        ok: !!(form.cover_image && form.cover_image.trim()),
        tip: "ارفع غلافاً قبل النشر",
      },
    ]
  }, [form])

  const buildPayload = (status: BlogPostStatus): SavePayload => {
    let publishedAt = form.published_at ?? null
    if (status === "published" && scheduleMode === "now") {
      publishedAt = new Date().toISOString()
    }
    if (status === "scheduled") {
      publishedAt = form.published_at || null
    }
    const { tags: _ignoredTags, ...rest } = form
    return {
      ...rest,
      content: sanitizeBlogHtml(form.content || ""),
      status,
      published_at: publishedAt,
      faq_schema: faqList.filter((f) => f.question.trim() && f.answer.trim()),
      tags: tagIds,
      meta_title: form.meta_title || form.title || "",
      meta_description: form.meta_description || form.summary || "",
      og_image: form.og_image || form.cover_image || "",
      cover_image_alt: form.cover_image_alt || form.title || "",
    }
  }

  const saveAs = (status: BlogPostStatus) => {
    if (!form.title?.trim() || !form.slug?.trim() || !sanitizeBlogHtml(form.content || "").replace(/<[^>]+>/g, "").trim()) {
      setSaveError("العنوان والرابط والمحتوى مطلوبة قبل الحفظ.")
      setSection("content")
      return
    }
    for (const faq of faqList) {
      if ((faq.question && !faq.answer) || (!faq.question && faq.answer)) {
        setSaveError("كل سؤال في FAQ يحتاج سؤالاً وإجابة معاً.")
        setSection("advanced")
        return
      }
    }
    if (status === "scheduled") {
      if (!form.published_at) {
        setSaveError("حدد تاريخ ووقت الجدولة.")
        setSection("advanced")
        return
      }
      if (new Date(form.published_at).getTime() <= Date.now()) {
        setSaveError("وقت الجدولة يجب أن يكون في المستقبل.")
        setSection("advanced")
        return
      }
    }
    if (status === "published") {
      const failed = readiness.filter((r) => !r.ok)
      if (failed.length) {
        setSaveError(`غير جاهز للنشر: ${failed.map((f) => f.label).join("، ")}`)
        setSection("seo")
        return
      }
    }
    saveMutation.mutate(buildPayload(status))
  }

  // Autosave existing drafts only (never create duplicate posts)
  useEffect(() => {
    if (!dirty || saveMutation.isPending || !form.id) return
    if (form.status === "published" || form.status === "scheduled") return
    const timer = window.setTimeout(() => {
      if (!form.title?.trim()) return
      saveMutation.mutate({ ...buildPayload("draft"), id: form.id })
    }, 45000)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, form, tagIds, faqList])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault()
        saveAs(form.status === "published" ? "published" : "draft")
      }
      if (e.key === "Escape") {
        if (dirty) {
          if (!window.confirm("هناك تغييرات غير محفوظة. هل تريد الإغلاق؟")) return
        }
        onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, form, tagIds, faqList])

  const tabs: Array<{ id: Section; label: string }> = [
    { id: "content", label: "المحتوى" },
    { id: "seo", label: "الظهور والـ SEO" },
    { id: "advanced", label: "متقدم" },
  ]

  return (
    <div className="dash-editor-shell" role="dialog" aria-modal="true" aria-label="محرر المقال">
      <div className={`dash-editor-panel${fullscreen ? " is-fullscreen" : ""}`}>
        <div className="px-4 sm:px-6 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-card-soft)] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-[var(--color-ink)] truncate">
              {form.id ? `تعديل: ${form.title || "مقال"}` : "إنشاء مقال جديد"}
            </h2>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              اكتب المحتوى، راجع SEO، ثم احفظ كمسودة أو انشر. اختصارات: Ctrl/Cmd+S حفظ — Esc إغلاق
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFullscreen((v) => !v)}
              className="h-9 px-3 rounded-full bg-white border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-ink)]"
              title={fullscreen ? "الخروج من ملء الشاشة" : "توسيع المحرر لملء الشاشة"}
              aria-pressed={fullscreen}
            >
              {fullscreen ? "⛶ تصغير" : "⛶ ملء الشاشة"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (dirty && !window.confirm("هناك تغييرات غير محفوظة. هل تريد الإغلاق؟")) return
                onClose()
              }}
              className="size-9 rounded-full bg-white border border-[var(--color-border)] grid place-items-center text-sm font-bold"
              aria-label="إغلاق المحرر"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-3">
          <div className="dash-tabs" role="tablist" aria-label="أقسام المحرر">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={section === t.id}
                onClick={() => setSection(t.id)}
                className={`dash-tab${section === t.id ? " is-active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {saveError && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[11px] text-rose-700 font-semibold">
              {saveError}
            </div>
          )}

          {section === "content" && (
            <>
              <EditorSection title="أساسيات المقال" description="العنوان، الرابط، التصنيف والوسوم.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <FieldLabel required>عنوان المقال</FieldLabel>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={form.title ?? ""}
                        onChange={(e) => patch({ title: e.target.value })}
                        placeholder="عنوان واضح وجذاب للمقال"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      />
                      <Button type="button" onClick={autoGenerateSlug} size="sm" variant="outline" className="rounded-xl text-[11px] whitespace-nowrap">
                        توليد الرابط
                      </Button>
                    </div>
                  </div>

                  <div>
                    <FieldLabel required>الرابط الدائم (Slug)</FieldLabel>
                    <input
                      type="text"
                      value={form.slug ?? ""}
                      onChange={(e) => patch({ slug: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-mono focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    />
                    <FieldHint>يُستخدم في رابط المقال. يمكنك توليده من العنوان ثم تعديله يدوياً. تجنّب المسافات والرموز.</FieldHint>
                  </div>

                  <div>
                    <FieldLabel>التصنيف</FieldLabel>
                    <select
                      value={form.category_id ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === "__new__") {
                          setShowNewCategory(true)
                          return
                        }
                        patch({ category_id: val ? parseInt(val, 10) : null })
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-white outline-none"
                    >
                      <option value="">بدون تصنيف</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                      <option value="__new__">+ إضافة تصنيف جديد</option>
                    </select>
                    {showNewCategory && (
                      <div className="mt-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 space-y-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => {
                            setNewCategoryName(e.target.value)
                            if (!newCategorySlug) {
                              setNewCategorySlug(
                                e.target.value
                                  .toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, "-")
                                  .replace(/[^\w\u0600-\u06FF-]+/g, ""),
                              )
                            }
                          }}
                          placeholder="اسم التصنيف"
                          className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs outline-none"
                        />
                        <input
                          type="text"
                          value={newCategorySlug}
                          onChange={(e) => setNewCategorySlug(e.target.value)}
                          placeholder="slug"
                          className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs font-mono outline-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="rounded-lg text-[11px]"
                            disabled={!newCategoryName.trim() || categoryMutation.isPending}
                            onClick={() =>
                              categoryMutation.mutate({
                                name: newCategoryName.trim(),
                                slug: newCategorySlug.trim() || undefined,
                              })
                            }
                          >
                            حفظ التصنيف
                          </Button>
                          <button type="button" className="text-[11px] font-bold text-[var(--color-text-muted)]" onClick={() => setShowNewCategory(false)}>
                            إلغاء
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <TagPicker
                      selectedIds={tagIds}
                      onChange={(ids) => {
                        setTagIds(ids)
                        setDirty(true)
                      }}
                    />
                  </div>
                </div>
              </EditorSection>

              <EditorSection title="الغلاف والملخص" description="صورة البطاقة الاجتماعية وملخص القوائم.">
                <CoverUpload
                  url={form.cover_image}
                  alt={form.cover_image_alt}
                  onChange={(next) => patch(next)}
                  onClear={() => patch({ cover_image: "", cover_image_alt: "" })}
                />
                <div>
                  <FieldLabel>ملخص المقال</FieldLabel>
                  <textarea
                    rows={3}
                    value={form.summary ?? ""}
                    onChange={(e) => patch({ summary: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none resize-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  <FieldHint>يظهر في قوائم المقالات وبطاقات المشاركة، ويمكن استخدامه كوصف SEO افتراضي.</FieldHint>
                </div>
              </EditorSection>

              <EditorSection title="المحتوى" description="محرر غني مع دعم كامل للعربية (RTL).">
                <RichTextEditor
                  value={form.content ?? ""}
                  onChange={(html) => patch({ content: html })}
                  disabled={saveMutation.isPending}
                />
              </EditorSection>
            </>
          )}

          {section === "seo" && (
            <div className="space-y-4">
              <PublishReadiness items={readiness} />

              <EditorSection title="معاينة نتيجة البحث">
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1">
                  <div className="text-[11px] text-gray-600">amtdex.com › posts › {form.slug || "example-post"}</div>
                  <h4 className="text-[15px] text-[#1a0dab] truncate">{form.meta_title || form.title || "عنوان المقال"}</h4>
                  <p className="text-[12px] text-[#4d5156] line-clamp-2">
                    {form.meta_description || form.summary || "الوصف المختصر الذي يظهر في نتائج البحث..."}
                  </p>
                </div>
              </EditorSection>

              <EditorSection title="حقول الظهور">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>الكلمة المفتاحية</FieldLabel>
                    <input
                      type="text"
                      value={form.focus_keyword ?? ""}
                      onChange={(e) => patch({ focus_keyword: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none"
                    />
                    {focusKey && (
                      <div className="flex flex-wrap gap-3 text-[11px] mt-2">
                        <span className={titleHasKey ? "text-emerald-600 font-bold" : "text-rose-500"}>{titleHasKey ? "✓" : "✗"} في العنوان</span>
                        <span className={slugHasKey ? "text-emerald-600 font-bold" : "text-rose-500"}>{slugHasKey ? "✓" : "✗"} في الرابط</span>
                        <span className={summaryHasKey ? "text-emerald-600 font-bold" : "text-rose-500"}>{summaryHasKey ? "✓" : "✗"} في الملخص</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <FieldLabel>Canonical URL</FieldLabel>
                    <input
                      type="url"
                      value={form.canonical_url ?? ""}
                      onChange={(e) => patch({ canonical_url: e.target.value })}
                      placeholder="https://blog.amtdex.com/posts/..."
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-mono outline-none"
                    />
                    <FieldHint>اتركه فارغاً ليُولَّد تلقائياً عند النشر، أو ضع رابطاً مطلقاً إن لزم.</FieldHint>
                  </div>
                  <div className="sm:col-span-2">
                    <SeoTitleMeter value={form.meta_title ?? ""} onChange={(v) => patch({ meta_title: v })} />
                  </div>
                  <div className="sm:col-span-2">
                    <SeoDescriptionMeter value={form.meta_description ?? ""} onChange={(v) => patch({ meta_description: v })} />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel>صورة Open Graph</FieldLabel>
                    <input
                      type="url"
                      value={form.og_image ?? ""}
                      onChange={(e) => patch({ og_image: e.target.value })}
                      placeholder="افتراضياً تُستخدم صورة الغلاف"
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              </EditorSection>

              <SchemaPreviewPanel
                schemaType={form.schema_type || "BlogPosting"}
                onSchemaTypeChange={(value) => patch({ schema_type: value })}
                input={{
                  form,
                  faqList,
                  category: categories.find((c) => c.id === form.category_id) ?? form.category ?? null,
                  tags: form.tags,
                }}
              />
            </div>
          )}

          {section === "advanced" && (
            <div className="space-y-4">
              <EditorSection title="النشر والجدولة" description="انشر فوراً أو اختر موعداً مستقبلياً.">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScheduleMode("now")
                      setDirty(true)
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                      scheduleMode === "now" ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-white border-[var(--color-border)]"
                    }`}
                  >
                    نشر الآن
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScheduleMode("schedule")
                      setDirty(true)
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                      scheduleMode === "schedule" ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-white border-[var(--color-border)]"
                    }`}
                  >
                    جدولة
                  </button>
                </div>
                {scheduleMode === "schedule" && (
                  <div>
                    <FieldLabel htmlFor="publish-at">تاريخ ووقت النشر</FieldLabel>
                    <input
                      id="publish-at"
                      type="datetime-local"
                      value={toLocalInputValue(form.published_at)}
                      onChange={(e) => {
                        const v = e.target.value
                        patch({ published_at: v ? new Date(v).toISOString() : null, status: "scheduled" })
                      }}
                      className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-xs outline-none"
                    />
                    <FieldHint>سيتم تحويل الحالة إلى «مجدول»، ومهمة خلفية تنشر المقال تلقائياً عند حلول الموعد.</FieldHint>
                  </div>
                )}
              </EditorSection>

              <EditorSection title="خيارات إضافية" collapsible defaultOpen>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-border)]">
                    <input type="checkbox" checked={!!form.allow_comments} onChange={(e) => patch({ allow_comments: e.target.checked })} />
                    <span className="font-bold text-[var(--color-ink)]">السماح بالتعليقات</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-border)]">
                    <input type="checkbox" checked={!!form.robots_index} onChange={(e) => patch({ robots_index: e.target.checked })} />
                    <span className="font-bold text-[var(--color-ink)]">فهرسة محركات البحث</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-border)]">
                    <input type="checkbox" checked={!!form.is_featured} onChange={(e) => patch({ is_featured: e.target.checked })} />
                    <span className="font-bold text-[var(--color-ink)]">مقال مميز</span>
                  </label>
                </div>
              </EditorSection>

              <EditorSection title="أسئلة شائعة (FAQ Schema)" description="تظهر كبيانات منظمة في نتائج البحث عند اكتمال الأزواج.">
                <div className="space-y-3">
                  {faqList.map((faq, i) => (
                    <div key={i} className="p-3 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[11px]">سؤال #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFaqList(faqList.filter((_, idx) => idx !== i))
                            setDirty(true)
                          }}
                          className="text-rose-500 text-[11px] font-bold"
                          aria-label="حذف السؤال"
                        >
                          حذف
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const next = [...faqList]
                          next[i] = { ...next[i], question: e.target.value }
                          setFaqList(next)
                          setDirty(true)
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs outline-none"
                        placeholder="السؤال"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const next = [...faqList]
                          next[i] = { ...next[i], answer: e.target.value }
                          setFaqList(next)
                          setDirty(true)
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs outline-none resize-none"
                        placeholder="الإجابة"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFaqList([...faqList, { question: "", answer: "" }])
                      setDirty(true)
                    }}
                    className="text-[11px] font-bold text-[var(--color-primary)]"
                  >
                    + إضافة سؤال
                  </button>
                </div>
              </EditorSection>
            </div>
          )}
        </div>

        <div className="dash-editor-foot">
          <div className="flex flex-col gap-1 order-3 sm:order-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (dirty && !window.confirm("هناك تغييرات غير محفوظة. هل تريد الإغلاق؟")) return
                onClose()
              }}
              className="rounded-xl text-xs w-full sm:w-auto"
            >
              إلغاء
            </Button>
            <span className="hidden sm:block text-[10px] text-[var(--color-text-faint)]">Ctrl/Cmd+S · Esc</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
            <Button
              type="button"
              variant="outline"
              disabled={saveMutation.isPending}
              onClick={() => saveAs("draft")}
              className="rounded-xl text-xs w-full sm:w-auto"
            >
              حفظ كمسودة
            </Button>
            {scheduleMode === "schedule" ? (
              <Button
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveAs("scheduled")}
                className="bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl w-full sm:w-auto"
              >
                {saveMutation.isPending ? "جارٍ الحفظ..." : "جدولة النشر"}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveAs("published")}
                className="bg-[var(--color-ink)] hover:bg-[var(--color-primary)] text-white text-xs font-bold px-5 py-2.5 rounded-xl w-full sm:w-auto"
              >
                {saveMutation.isPending ? "جارٍ الحفظ..." : "نشر المقال الآن"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
