import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { PROJECTS as SEED_PROJECTS } from "@/data/projects"
import { useProjectsQuery } from "@/lib/queries"
import { CardSkeleton } from "@/components/ui/Skeleton"

export function PortfolioPage() {
  const { data: apiProjects, isLoading } = useProjectsQuery()
  const PROJECTS = (apiProjects && apiProjects.length > 0) ? apiProjects : SEED_PROJECTS
  const [filter, setFilter] = useState<string>("الكل")

  const cats = useMemo(() => ["الكل", ...Array.from(new Set(PROJECTS.map((p) => p.cat)))], [PROJECTS])
  const filtered = useMemo(
    () => (filter === "الكل" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter)),
    [filter, PROJECTS],
  )

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SectionLabel>أعمالنا ومشاريعنا</SectionLabel>
      <h1 className="mt-3 text-[32px] sm:text-[44px] font-bold tracking-tight text-[var(--color-ink)] leading-tight">
        نصنع منتجات
        <br />
        يحبها الناس وتصنع فارقاً.
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-muted)] max-w-[560px]">
        نماذج من مشاريع ومنصات رقمية قمنا بتطويرها وإطلاقها بنجاح — كل مشروع يمثل قصة نجاح وقيمة عملية قابلة للقياس.
      </p>

      {/* Categories Filter Tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`text-[12.5px] font-bold px-4 py-2 rounded-full border transition-all ${
              filter === c
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)] shadow-sm"
                : "bg-white border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-primary-light)]/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Projects Grid with Skeletons */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          filtered.map((p) => (
            <Link
              key={p.slug}
              to={`/portfolio/${p.slug}`}
              className="group rounded-[24px] overflow-hidden bg-white border border-[var(--color-border)] hover:shadow-[var(--shadow-card-lg)] hover:-translate-y-1 transition-all flex flex-col"
            >
              <div
                className="h-[210px] relative overflow-hidden bg-[var(--color-ink)]"
                style={{ background: p.cover_image ? undefined : p.color }}
              >
                {p.cover_image ? (
                  <img
                    src={p.cover_image}
                    alt={p.cover_image_alt || p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ background: `radial-gradient(600px 300px at 70% 30%, ${p.accent}, transparent 60%)` }}
                    />
                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="flex gap-1.5">
                        <span className="size-2.5 rounded-full bg-white/20" />
                        <span className="size-2.5 rounded-full bg-white/20" />
                        <span className="size-2.5 rounded-full bg-white/20" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2.5 w-3/5 bg-white/15 rounded-full" />
                        <div className="h-2 w-2/5 bg-white/10 rounded-full" />
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="h-12 rounded-xl bg-white/10 border border-white/10" />
                          <div className="h-12 rounded-xl bg-white/10 border border-white/10" />
                          <div className="h-12 rounded-xl" style={{ background: p.accent }} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11.5px] font-semibold text-[var(--color-text-muted)]">
                    {p.cat} • {p.year} • {p.client}
                  </div>
                  <h3 className="mt-1.5 text-[16px] font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-text-muted)] line-clamp-2">
                    {p.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex gap-1.5 flex-wrap">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-card-soft)]/50 border border-[var(--color-border)] text-[var(--color-ink)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
