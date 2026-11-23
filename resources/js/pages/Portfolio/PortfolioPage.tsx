import { useMemo, useState, type CSSProperties } from "react"
import { flushSync } from "react-dom"
import { Icon } from "@/components/ui/Icon"
import { coverSources } from "@/lib/projectMedia"
import { Link } from "react-router-dom"
import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { PROJECTS as SEED_PROJECTS } from "@/data/projects"
import { useProjectsQuery } from "@/lib/queries"
import { CardSkeleton } from "@/components/ui/Skeleton"

export function PortfolioPage() {
  const { data: apiProjects, isLoading } = useProjectsQuery()
  // An empty collection from the CMS must not leave the page blank.
  const PROJECTS = apiProjects?.length ? apiProjects : SEED_PROJECTS
  const [filter, setFilter] = useState<string>("الكل")
  // Filtering re-flows the grid; where supported, cards glide to their new places instead of jumping.
  const choose = (next: string) => {
    if (next === filter) return
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const doc = document as Document & { startViewTransition?: (update: () => void) => unknown }
    if (doc.startViewTransition && !reduce) doc.startViewTransition(() => flushSync(() => setFilter(next)))
    else setFilter(next)
  }

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
            تطبيقات ومواقع
            <br />
            يستخدمها الناس كل يوم.
          </>
        }
        description="عينة من تطبيقات ومواقع طوّرناها لعملاء في السعودية والكويت واليمن، مع رابط مباشر لكل مشروع."
      />

      <div data-motion-group className="da-filters" role="group" aria-label="تصفية الأعمال">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => choose(c)}
            className={filter === c ? "is-on" : undefined}
          >
            {c}
          </button>
        ))}
      </div>

      <div data-motion-group className="da-works work-grid">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          filtered.map((p) => {
            const media = coverSources(p)
            return (
              <Link
                key={p.slug}
                to={`/portfolio/${p.slug}`}
                className="work-card premium-card group flex flex-col"
                style={{ viewTransitionName: `work-${p.slug}` } as CSSProperties}
              >
                <div className="da-plate work-cover" style={{ background: p.color }}>
                  {media ? (
                    <img src={media.src} srcSet={media.srcSet} sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 400px" width={1200} height={800} loading="lazy" decoding="async" alt={p.cover_image_alt || p.title} />
                  ) : (
                    <span>{p.title}<small>{p.client}</small></span>
                  )}
                  <span className="work-go" aria-hidden="true">عرض المشروع<Icon name="actionArrow" size={15} /></span>
                </div>
                <div className="work-body">
                  <div className="work-meta">{[p.cat, p.country, p.year].filter(Boolean).join(" · ")}</div>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <div className="work-tags">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </Container>
  )
}
