import { useState, useMemo } from "react"
import {
  useServicesQuery,
  useProjectsQuery,
  useUpsertServiceMutation,
  useDeleteServiceMutation,
  useUpsertProjectMutation,
  useDeleteProjectMutation,
  useUploadMediaMutation,
} from "@/lib/queries"
import type { Service } from "@/types/service"
import type { Project } from "@/types/project"
import { Icon, type IconName } from "@/components/ui/Icon"
import { PricingTab } from "./PricingTab"
import { TestimonialsTab } from "./TestimonialsTab"
import { FaqsTab } from "./FaqsTab"
import { TeamTab } from "./TeamTab"
import { ClientsTab } from "./ClientsTab"

type ContentTab = "projects" | "services" | "pricing" | "testimonials" | "faqs" | "team" | "clients"

const SERVICE_ICONS: Array<{ id: IconName; label: string }> = [
  { id: "web", label: "مواقع ويب (Web)" },
  { id: "mobile", label: "تطبيقات جوال (Mobile)" },
  { id: "erp", label: "أنظمة أعمال (ERP/CRM)" },
  { id: "ai", label: "ذكاء اصطناعي (AI)" },
  { id: "security", label: "أمن سيبراني (Security)" },
  { id: "cloud", label: "سحابة وبنية تحتية (Cloud)" },
  { id: "code", label: "برمجة وكود (Code)" },
  { id: "launch", label: "إطلاق ونشر (Launch)" },
  { id: "folder", label: "مجلد وملفات (Folder)" },
  { id: "invoice", label: "فواتير ومالية (Invoice)" },
  { id: "settings", label: "إعدادات وتخصيص (Settings)" },
  { id: "star", label: "نجمة ومميز (Star)" },
]

function Section({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string
  addLabel: string
  onAdd: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-[14px] font-bold text-[var(--color-ink)]">{title}</h2>
        <button
          onClick={onAdd}
          className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3.5 py-2 rounded-xl hover:bg-black transition-colors w-full sm:w-auto"
        >
          {addLabel}
        </button>
      </div>
      {children}
    </div>
  )
}

function TagsInput({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder: string
}) {
  const [inputVal, setInputVal] = useState("")

  const addTag = () => {
    const trimmed = inputVal.trim()
    if (!trimmed) return
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInputVal("")
  }

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-[var(--color-ink)]">{label}</label>
      <div className="flex flex-wrap gap-1.5 p-2 border border-[var(--color-border)] rounded-xl bg-white min-h-[42px] items-center">
        {tags.map((t, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 bg-[var(--color-lavender)] text-[var(--color-primary)] text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-[12px] font-bold text-black/40 hover:text-red-600 mr-0.5"
            >
              ×
            </button>
          </span>
        ))}
        <div className="flex-1 min-w-[120px] flex gap-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder={tags.length === 0 ? placeholder : "أضف المزيد..."}
            className="w-full text-[12px] outline-none bg-transparent"
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="text-[11px] bg-[var(--color-ink)] text-white px-2 py-0.5 rounded-md font-bold"
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ContentPage() {
  const { data: services = [], isLoading: loadingServices } = useServicesQuery()
  const { data: projects = [], isLoading: loadingProjects } = useProjectsQuery()

  const upsertServiceMutation = useUpsertServiceMutation()
  const deleteServiceMutation = useDeleteServiceMutation()
  const upsertProjectMutation = useUpsertProjectMutation()
  const deleteProjectMutation = useDeleteProjectMutation()
  const uploadMutation = useUploadMediaMutation()

  const [editingService, setEditingService] = useState<Service | null>(null)
  const [activeTab, setActiveTab] = useState<ContentTab>("projects")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [serviceError, setServiceError] = useState<string | null>(null)
  const [projectError, setProjectError] = useState<string | null>(null)

  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadingOg, setUploadingOg] = useState(false)
  const [galleryUrlInput, setGalleryUrlInput] = useState("")

  // Extract unique categories from current projects
  const existingCategories = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.cat && p.cat.trim()) set.add(p.cat.trim())
    })
    return Array.from(set)
  }, [projects])

  const [customCat, setCustomCat] = useState(false)

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

    upsertServiceMutation.mutate(editingService, {
      onSuccess: () => {
        setEditingService(null)
      },
      onError: (err: any) => {
        setServiceError(err?.message || "حدث خطأ أثناء حفظ الخدمة.")
      },
    })
  }

  const handleSaveProject = () => {
    if (!editingProject) return
    if (!editingProject.title.trim()) {
      setProjectError("عنوان المشروع مطلوب.")
      return
    }
    if (!editingProject.client.trim()) {
      setProjectError("اسم العميل مطلوب.")
      return
    }
    if (!editingProject.cat.trim()) {
      setProjectError("تصنيف المشروع مطلوب.")
      return
    }
    if (!editingProject.summary.trim()) {
      setProjectError("ملخص المشروع مطلوب.")
      return
    }
    setProjectError(null)

    upsertProjectMutation.mutate(editingProject, {
      onSuccess: () => {
        setEditingProject(null)
      },
      onError: (err: any) => {
        setProjectError(err?.message || "حدث خطأ أثناء حفظ المشروع.")
      },
    })
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingProject) return

    setUploadingCover(true)
    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setUploadingCover(false)
        const url = res?.url || res?.data?.url
        if (url) {
          setEditingProject({ ...editingProject, cover_image: url })
        }
      },
      onError: (err: any) => {
        setUploadingCover(false)
        alert(err?.message || "فشل رفع غلاف المشروع")
      },
    })
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingProject) return

    setUploadingGallery(true)
    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setUploadingGallery(false)
        const url = res?.url || res?.data?.url
        if (url) {
          const gallery = [...(editingProject.gallery || []), url]
          setEditingProject({ ...editingProject, gallery })
        }
      },
      onError: (err: any) => {
        setUploadingGallery(false)
        alert(err?.message || "فشل رفع الصورة للمعرض")
      },
    })
  }

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim() || !editingProject) return
    const gallery = [...(editingProject.gallery || []), galleryUrlInput.trim()]
    setEditingProject({ ...editingProject, gallery })
    setGalleryUrlInput("")
  }

  const handleRemoveGalleryItem = (index: number) => {
    if (!editingProject) return
    const gallery = (editingProject.gallery || []).filter((_, i) => i !== index)
    setEditingProject({ ...editingProject, gallery })
  }

  const handleOgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingProject) return

    setUploadingOg(true)
    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        setUploadingOg(false)
        const url = res?.url || res?.data?.url
        if (url) {
          setEditingProject({ ...editingProject, og_image: url })
        }
      },
      onError: (err: any) => {
        setUploadingOg(false)
        alert(err?.message || "فشل رفع صورة OG")
      },
    })
  }

  const contentTabs: Array<{ id: ContentTab; label: string }> = [
    { id: "projects", label: `معرض المشاريع (${projects.length})` },
    { id: "services", label: `الخدمات (${services.length})` },
    { id: "pricing", label: "باقات الأسعار" },
    { id: "testimonials", label: "آراء العملاء" },
    { id: "faqs", label: "الأسئلة الشائعة" },
    { id: "team", label: "فريق العمل" },
    { id: "clients", label: "الشركاء والعملاء" },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg sm:text-[18px] font-extrabold text-[var(--color-ink)]">إدارة المحتوى</h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
          المشاريع، الخدمات، الباقات، والآراء من شاشة واحدة متجاوبة مع الجوال.
        </p>
      </div>

      <div className="dash-tabs" role="tablist" aria-label="أقسام المحتوى">
        {contentTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
            className={`dash-tab${activeTab === t.id ? " is-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Services Section */}
      {activeTab === "services" && (
      <Section
        title={`الخدمات (${services.length})`}
        addLabel="+ إضافة خدمة"
        onAdd={() => {
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
                      setServiceError(null)
                      setEditingService({
                        ...s,
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
      </Section>
      )}

      {/* Projects Section */}
      {activeTab === "projects" && (
      <Section
        title={`المشاريع (${projects.length})`}
        addLabel="+ إضافة مشروع"
        onAdd={() => {
          setProjectError(null)
          setCustomCat(false)
          setEditingProject({
            slug: "",
            cat: existingCategories[0] || "أنظمة أعمال",
            title: "",
            client: "",
            year: new Date().getFullYear().toString(),
            stack: [],
            color: "#0E2A47",
            accent: "#2ECC71",
            summary: "",
            cover_image: "",
            cover_image_alt: "",
            gallery: [],
            challenge: "",
            deliverables: [],
            metrics: [
              { v: "+40%", l: "أسرع" },
              { v: "2.1×", l: "تحويل أعلى" },
              { v: "99.9%", l: "توفر" },
            ],
            duration: "8 أسابيع",
            team_size: "5 أشخاص",
            project_url: "",
            meta_title: "",
            meta_description: "",
            og_image: "",
            sort_order: projects.length + 1,
            is_published: true,
          })
        }}
      >
        {loadingProjects ? (
          <div className="py-6 text-center text-[12px] text-[var(--color-text-faint)]">
            <span className="inline-block size-4 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mr-2" />
            جار تحميل المشاريع...
          </div>
        ) : (
          <div className="grid gap-2">
            {projects.map((p) => (
              <div
                key={p.slug}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[var(--color-border)] rounded-xl px-3.5 sm:px-4 py-3 bg-white hover:border-[var(--color-primary)]/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {p.cover_image ? (
                    <img
                      src={p.cover_image}
                      alt={p.cover_image_alt || p.title}
                      className="size-10 rounded-lg shrink-0 object-cover border border-black/10 shadow-sm"
                    />
                  ) : (
                    <div
                      className="size-10 rounded-lg shrink-0 border border-black/10 flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: p.color || "#0E2A47" }}
                    >
                      <span className="size-3 rounded-full" style={{ backgroundColor: p.accent || "#2ECC71" }} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[var(--color-ink)] flex flex-wrap items-center gap-2">
                      <span className="truncate max-w-full">{p.title}</span>
                      <span className="text-[10px] text-[var(--color-text-faint)] font-mono">/{p.slug}</span>
                      {p.is_published === false && (
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                          مخفي
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] line-clamp-2 sm:truncate">
                      العميل: <strong className="text-[var(--color-ink)]">{p.client}</strong> • {p.cat} • {p.year}
                      {p.summary ? ` — ${p.summary}` : ""}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setProjectError(null)
                      setCustomCat(false)
                      setEditingProject({
                        ...p,
                        stack: p.stack || [],
                        color: p.color || "#0E2A47",
                        accent: p.accent || "#2ECC71",
                        cover_image: p.cover_image || "",
                        cover_image_alt: p.cover_image_alt || "",
                        gallery: p.gallery || [],
                        challenge: p.challenge || "",
                        deliverables: p.deliverables || [],
                        metrics: p.metrics || [
                          { v: "+40%", l: "أسرع" },
                          { v: "2.1×", l: "تحويل أعلى" },
                          { v: "99.9%", l: "توفر" },
                        ],
                        duration: p.duration || "8 أسابيع",
                        team_size: p.team_size || "5 أشخاص",
                        project_url: p.project_url || "",
                        meta_title: p.meta_title || "",
                        meta_description: p.meta_description || "",
                        og_image: p.og_image || "",
                        sort_order: p.sort_order ?? 0,
                        is_published: p.is_published ?? true,
                      })
                    }}
                    className="text-[11px] font-bold border border-[var(--color-border)] px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-full hover:bg-[var(--color-lavender)] transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف مشروع "${p.title}"؟`)) {
                        deleteProjectMutation.mutate(p.slug)
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
      </Section>
      )}

      {/* Dynamic Content Tabs */}
      {activeTab === "pricing" && <PricingTab />}
      {activeTab === "testimonials" && <TestimonialsTab />}
      {activeTab === "faqs" && <FaqsTab />}
      {activeTab === "team" && <TeamTab />}
      {activeTab === "clients" && <ClientsTab />}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-[620px] w-full p-6 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto border border-[var(--color-border)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[16px] font-bold text-[var(--color-ink)] flex items-center gap-2">
                <Icon name={editingService.icon as IconName} size={20} />
                {editingService.slug ? "تعديل الخدمة" : "إضافة خدمة تقنية جديدة"}
              </h3>
              <button
                onClick={() => setEditingService(null)}
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

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditingService(null)}
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
        </div>
      )}

      {/* Project Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-[720px] w-full p-6 space-y-4 shadow-2xl my-8 max-h-[92vh] overflow-y-auto border border-[var(--color-border)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-[16px] font-bold text-[var(--color-ink)]">
                {editingProject.slug ? `تعديل مشروع: ${editingProject.title}` : "إضافة مشروع جديد إلى معرض الأعمال"}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
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
                  placeholder="مثال: منصة نون — 40% تسريع"
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
                  placeholder="noon-replatform (يُولد تلقائياً)"
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
                  placeholder="مثال: شركة نون القابضة"
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
                placeholder="مثال: واجهة سريعة، لوحة تحكم Filament، بوابات دفع، API موثق"
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

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 border border-[var(--color-border)] rounded-full text-[12px] font-medium hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={upsertProjectMutation.isPending}
                onClick={handleSaveProject}
                className="px-6 py-2 bg-[var(--color-ink)] text-white rounded-full text-[12px] font-bold hover:bg-black transition-colors"
              >
                {upsertProjectMutation.isPending ? "جار الحفظ..." : "حفظ المشروع"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
