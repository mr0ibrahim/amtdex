import { Icon } from "@/components/ui/Icon"
import { Link, useParams } from "react-router-dom"
import { PROJECTS as SEED_PROJECTS } from "@/data/projects"
import { useProjectsQuery } from "@/lib/queries"
import { Skeleton } from "@/components/ui/Skeleton"
import { Seo } from "@/components/Seo"
import { coverSources, projectLinkLabel } from "@/lib/projectMedia"

export function PortfolioDetailPage() {
  const { slug } = useParams()
  const { data: apiProjects, isLoading } = useProjectsQuery()
  const PROJECTS = apiProjects?.length ? apiProjects : SEED_PROJECTS
  const p = PROJECTS.find((x) => x.slug === slug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-[320px] w-full rounded-[28px]" />
        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!p) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="size-16 rounded-full bg-rose-50 text-rose-500 grid place-items-center mx-auto mb-4">
          <Icon name="close" size={28} />
        </div>
        <h1 className="text-[24px] font-bold text-[var(--color-ink)]">المشروع غير موجود</h1>
        <p className="text-[14px] text-[var(--color-text-muted)] mt-2">
          ربما تم نقل دراسة الحالة أو تغيير الرابط. تفضل بالاطلاع على بقية أعمالنا.
        </p>
        <Link
          to="/portfolio"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-bold hover:bg-[var(--color-primary-light)] transition-colors"
        >
          ← العودة لكافة الأعمال
        </Link>
      </div>
    )
  }

  // No invented figures: sections appear only when the project has the data.
  const deliverables = p.deliverables ?? []
  const metrics = p.metrics ?? []
  const media = coverSources(p)
  const facts = [
    ["العميل", p.client], ["الدولة", p.country], ["التصنيف", p.cat], ["سنة الإطلاق", p.year], ["المدة", p.duration], ["فريق العمل", p.team_size],
  ].filter((row): row is [string, string] => !!row[1])

  return (
    <div className="page-container work-detail py-8 sm:py-12">
      <Seo title={p.meta_title || p.title} description={p.meta_description || p.summary} ogImage={p.og_image || (p.cover_image?.startsWith("/") ? `https://amtdex.com${p.cover_image}` : p.cover_image)} />
      <Link to="/portfolio" className="work-back">→ كل الأعمال</Link>

      <header className="work-head">
        <div className="work-meta">{[p.cat, p.country, p.year].filter(Boolean).join(" · ")}</div>
        <h1>{p.title}</h1>
        <p>{p.summary}</p>
        <div className="work-tags">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="work-actions">
          {p.project_url && (
            <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="btn btn-ink brand-cta">
              {projectLinkLabel(p.project_url)}<Icon name="actionArrow" size={16} />
            </a>
          )}
          <Link to="/quote" className="btn btn-line brand-cta">ابدأ مشروعًا مشابهًا</Link>
        </div>
      </header>

      <figure className="work-hero" style={{ background: p.color }}>
        {media ? (
          <img src={media.src} srcSet={media.srcSet} sizes="(max-width: 1279px) 94vw, 1200px" width={1200} height={800} fetchPriority="high" alt={p.cover_image_alt || p.title} />
        ) : (
          <div className="work-hero-fallback" style={{ background: `radial-gradient(800px 400px at 60% 20%, ${p.accent}, transparent 70%)` }} />
        )}
        {media?.illustrative && <figcaption>صورة توضيحية مصمّمة من ميزات المشروع. {p.project_url ? "المشروع الفعلي عبر الرابط أعلاه." : ""}</figcaption>}
      </figure>

      <div className="work-content">
        <div>
          {p.challenge && (
            <section className="work-section">
              <h2>عن المشروع</h2>
              <p className="whitespace-pre-line">{p.challenge}</p>
            </section>
          )}
          {deliverables.length > 0 && (
            <section className="work-section">
              <h2>أبرز ما في المشروع</h2>
              <ul className="work-list">
                {deliverables.map((x) => (
                  <li key={x}><span aria-hidden="true"><Icon name="check" size={15} /></span>{x}</li>
                ))}
              </ul>
            </section>
          )}
          {metrics.length > 0 && (
            <section className="work-section">
              <h2>النتائج</h2>
              <div className="work-metrics">
                {metrics.map((x) => <div key={x.l}><b>{x.v}</b><span>{x.l}</span></div>)}
              </div>
            </section>
          )}
          {p.gallery && p.gallery.length > 0 && (
            <section className="work-section">
              <h2>لقطات من المشروع</h2>
              <div className="work-gallery">
                {p.gallery.map((imgUrl, i) => <img key={imgUrl} src={imgUrl} loading="lazy" decoding="async" alt={`${p.title} — لقطة ${i + 1}`} />)}
              </div>
            </section>
          )}
        </div>

        <aside className="work-side">
          {facts.length > 0 && (
            <div className="geo-card work-facts" data-geo="wave">
              <h2>بيانات المشروع</h2>
              <dl>{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          )}
          <div className="geo-card work-cta">
            <h2>لديك فكرة مشابهة؟</h2>
            <p>نراجع متطلباتك ونرسل لك عرضًا فنيًا وماليًا لمشروعك، ومعه عام كامل من الصيانة المجانية بعد الإطلاق.</p>
            <Link to="/quote" className="btn brand-cta">ابدأ مشروعك<Icon name="actionArrow" size={16} /></Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
