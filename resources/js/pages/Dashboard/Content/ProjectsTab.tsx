import { QueryError } from "@/components/ui/QueryError"
import { useProjectsQuery, useDeleteProjectMutation } from "@/lib/queries"
import { ContentSection } from "./ContentSection"
import { ProjectEditor } from "./ProjectEditor"
import { useProjectEditor } from "./useProjectEditor"

export function ProjectsTab() {
  const { data: projects = [], isLoading: loadingProjects, error: loadError, refetch } = useProjectsQuery({ fallback: false })
  const deleteProjectMutation = useDeleteProjectMutation()
  const editor = useProjectEditor(projects)
  const { openProject, existingCategories } = editor
  return <>
    <QueryError error={loadError ?? deleteProjectMutation.error} onRetry={() => { void refetch() }} />
      <ContentSection
        title={`المشاريع (${projects.length})`}
        addLabel="+ إضافة مشروع"
        onAdd={() => {
          openProject({
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
                      openProject({
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
      </ContentSection>
    <ProjectEditor editor={editor} />
  </>
}
