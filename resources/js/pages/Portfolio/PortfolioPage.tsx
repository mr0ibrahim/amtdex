import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { useProjects } from "@/lib/contentStore"
import { useProjectsQuery } from "@/lib/queries"

export function PortfolioPage() {
  const { data: apiProjects } = useProjectsQuery()
  const fallbackProjects = useProjects()
  const PROJECTS = (apiProjects && apiProjects.length > 0) ? apiProjects : fallbackProjects
  const [filter, setFilter] = useState<string>("الكل")

  const cats = useMemo(() => ["الكل", ...Array.from(new Set(PROJECTS.map((p) => p.cat)))], [PROJECTS])
  const filtered = useMemo(
    () => (filter === "الكل" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter)),
    [filter, PROJECTS],
  )

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SectionLabel>أعمالنا</SectionLabel>
      <h1 className="mt-3 text-[32px] sm:text-[44px] font-bold tracking-[-0.04em]">
        نصنع منتجات
        <br />
        يحبها الناس.
      </h1>
      <p className="mt-3 text-[14px] text-black/50 max-w-[560px]">مختارات من مشاريع سلّمناها — كل مشروع قصة نجاح قابلة للقياس.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-[12px] font-medium px-4 py-2 rounded-full border transition-colors ${filter === c ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-white border-black/10 text-black/60 hover:text-black"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Link key={p.slug} to={`/portfolio/${p.slug}`} className="group rounded-[24px] overflow-hidden bg-white border border-black/5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col">
            <div className="h-[200px] relative overflow-hidden bg-[var(--color-ink)]" style={{ background: p.cover_image ? undefined : p.color }}>
              {p.cover_image ? (
                <img
                  src={p.cover_image}
                  alt={p.cover_image_alt || p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(600px 300px at 70% 30%, ${p.accent}, transparent 60%)` }} />
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
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-black/40">
                  {p.cat} • {p.year} • {p.client}
                </div>
                <h3 className="mt-1 text-[15px] font-semibold leading-6 group-hover:underline underline-offset-4 decoration-black/15">{p.title}</h3>
                <p className="mt-2 text-[12px] leading-5 text-black/50 line-clamp-2">{p.summary}</p>
              </div>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {p.stack.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-[var(--color-bg)] border border-black/5 text-black/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
