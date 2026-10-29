import { useState } from "react"
import {
  useServicesQuery,
  useProjectsQuery,
  useUpsertServiceMutation,
  useDeleteServiceMutation,
  useUpsertProjectMutation,
  useDeleteProjectMutation,
} from "@/lib/queries"
import type { Service } from "@/types/service"
import type { Project } from "@/types/project"

function Section({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[14px] font-bold text-[var(--color-ink)]">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="text-[11px] font-bold bg-[var(--color-ink)] text-white px-3 py-1.5 rounded-full">
            + إضافة
          </button>
        )}
      </div>
      <div className="mt-4">{children}</div>
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

  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-[var(--color-ink)]">إدارة المحتوى</h1>
      </div>

      <Section
        title={`الخدمات (${services.length})`}
        onAdd={() =>
          setEditingService({
            slug: "",
            icon: "web" as Service["icon"],
            title: "",
            desc: "",
            bullets: [],
            tech: [],
            detail: "",
          })
        }
      >
        {loadingServices ? (
          <div className="py-6 text-center text-[12px] text-[var(--color-text-faint)]">جار تحميل الخدمات...</div>
        ) : (
          <div className="grid gap-2">
            {services.map((s) => (
              <div key={s.slug} className="flex items-center justify-between gap-3 border border-[var(--color-border)] rounded-xl px-3 py-2.5">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[var(--color-ink)] truncate">
                    {s.title} <span className="text-[10px] text-[var(--color-text-faint)]">/{s.slug}</span>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] truncate">{s.desc}</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setEditingService({ ...s })}
                    className="text-[11px] border border-[var(--color-border)] px-3 py-1 rounded-full hover:bg-[var(--color-lavender)]"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف خدمة ${s.title}؟`)) {
                        deleteServiceMutation.mutate(s.slug)
                      }
                    }}
                    className="text-[11px] border border-red-200 text-red-600 px-3 py-1 rounded-full hover:bg-red-50"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        title={`المشاريع (${projects.length})`}
        onAdd={() =>
          setEditingProject({
            slug: "",
            cat: "",
            title: "",
            client: "",
            year: "2026",
            stack: [],
            color: "#16064F",
            accent: "#FFBF08",
            summary: "",
          })
        }
      >
        {loadingProjects ? (
          <div className="py-6 text-center text-[12px] text-[var(--color-text-faint)]">جار تحميل المشاريع...</div>
        ) : (
          <div className="grid gap-2">
            {projects.map((p) => (
              <div key={p.slug} className="flex items-center justify-between gap-3 border border-[var(--color-border)] rounded-xl px-3 py-2.5">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[var(--color-ink)] truncate">
                    {p.title} <span className="text-[10px] text-[var(--color-text-faint)]">/{p.slug}</span>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                    {p.client} • {p.cat} • {p.year}
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setEditingProject({ ...p })}
                    className="text-[11px] border border-[var(--color-border)] px-3 py-1 rounded-full hover:bg-[var(--color-lavender)]"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف مشروع ${p.title}؟`)) {
                        deleteProjectMutation.mutate(p.slug)
                      }
                    }}
                    className="text-[11px] border border-red-200 text-red-600 px-3 py-1 rounded-full hover:bg-red-50"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Service Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
          <div className="bg-white rounded-2xl max-w-[500px] w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-[15px] font-bold text-[var(--color-ink)]">
              {editingService.slug ? "تعديل خدمة" : "إضافة خدمة جديدة"}
            </h3>
            <input
              placeholder="Slug (رابط الخدمة بالإنجليزية)"
              value={editingService.slug}
              onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px]"
            />
            <input
              placeholder="عنوان الخدمة"
              value={editingService.title}
              onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px]"
            />
            <textarea
              placeholder="وصف مختصر"
              value={editingService.desc}
              onChange={(e) => setEditingService({ ...editingService, desc: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px] h-20"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingService(null)} className="px-4 py-1.5 border rounded-full text-[12px]">إلغاء</button>
              <button
                onClick={() => {
                  upsertServiceMutation.mutate(editingService, {
                    onSuccess: () => setEditingService(null),
                  })
                }}
                className="px-4 py-1.5 bg-[var(--color-ink)] text-white rounded-full text-[12px] font-bold"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
          <div className="bg-white rounded-2xl max-w-[500px] w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-[15px] font-bold text-[var(--color-ink)]">
              {editingProject.slug ? "تعديل مشروع" : "إضافة مشروع جديد"}
            </h3>
            <input
              placeholder="Slug (رابط المشروع بالإنجليزية)"
              value={editingProject.slug}
              onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px]"
            />
            <input
              placeholder="عنوان المشروع"
              value={editingProject.title}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px]"
            />
            <input
              placeholder="العميل"
              value={editingProject.client}
              onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-[12px]"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingProject(null)} className="px-4 py-1.5 border rounded-full text-[12px]">إلغاء</button>
              <button
                onClick={() => {
                  upsertProjectMutation.mutate(editingProject, {
                    onSuccess: () => setEditingProject(null),
                  })
                }}
                className="px-4 py-1.5 bg-[var(--color-ink)] text-white rounded-full text-[12px] font-bold"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
