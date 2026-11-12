import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { PROJECTS as SEED_PROJECTS } from "@/data/projects"
import { useProjectsQuery } from "@/lib/queries"
import { CardSkeleton } from "@/components/ui/Skeleton"

export function PortfolioPage() {
  const { data: apiProjects, isLoading } = useProjectsQuery()
  const PROJECTS = apiProjects && apiProjects.length > 0 ? apiProjects : SEED_PROJECTS
  const [filter, setFilter] = useState<string>("الكل")

  const cats = useMemo(() => ["الكل", ...Array.from(new Set(PROJECTS.map((p) => p.cat)))], [PROJECTS])
  const filtered = useMemo(
    () => (filter === "الكل" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter)),
    [filter, PROJECTS],
  )

  return (
    <Container className="py-8 sm:py-12">
      <PageHeader
        eyebrow="أعمالنا ومشاريعنا"
        title={
          <>
            نصنع منتجات
            <br />
            يحبها الناس وتصنع فارقاً.
          </>
        }
        description="نماذج من مشاريع ومنصات رقمية قمنا بتطويرها وإطلاقها بنجاح — كل مشروع يمثل قصة نجاح وقيمة عملية قابلة للقياس."
      />

      <div data-motion-group className="da-filters">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={filter === c ? "is-on" : undefined}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Projects Grid with Skeletons */}
      <div data-motion-group className="da-works">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          filtered.map((p, index) => (
            <Link
              key={p.slug}
              to={`/portfolio/${p.slug}`}
              data-motion="rise"
              data-motion-delay={(index % 2) * 140}
              className="group lift flex flex-col"
            >
              <div
                className="da-plate"
                style={{ background: p.cover_image ? undefined : p.color }}
              >
                {p.cover_image ? (
                  <img
                    src={p.cover_image}
                    alt={p.cover_image_alt || p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {p.title}
                    <small>{p.client} · {p.year}</small>
                  </span>
                )}
              </div>

              <div className="pt-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11.5px] font-semibold text-[var(--color-text-muted)]">
                    {p.cat} • {p.year} • {p.client}
                  </div>
                  <h3 className="mt-1.5 text-[16px] font-bold text-[var(--color-ink)] leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-text-muted)]">
                    {p.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex gap-1.5 flex-wrap">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium text-[var(--color-text-muted)]"
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
    </Container>
  )
}
