import { useEffect, useRef, useState } from "react"
import { useIsFetching, useIsMutating } from "@tanstack/react-query"
import { beginLoading, usePendingCount } from "@/lib/loading"

/** Loads shorter than this never show a bar: a flash of progress is noise, not feedback. */
const SHOW_AFTER = 140
/** Once shown, the bar stays long enough to be read as one event. */
const MIN_VISIBLE = 320
const FINISH = 420

type Phase = "idle" | "loading" | "done"

/**
 * The site's single loading line, fixed to the top edge.
 * It reflects real work only: page chunks, first loads of data, and submissions.
 */
export function SiteLoader() {
  const pending = usePendingCount()
  // Background refreshes of data already on screen are not something to wait for.
  const fetching = useIsFetching({ predicate: query => query.state.data === undefined })
  const mutating = useIsMutating()
  const busy = pending + fetching + mutating > 0
  const [phase, setPhase] = useState<Phase>("idle")
  const shownAt = useRef(0)

  useEffect(() => {
    if (busy) {
      if (phase === "loading") return
      const timer = window.setTimeout(() => { shownAt.current = Date.now(); setPhase("loading") }, phase === "done" ? 0 : SHOW_AFTER)
      return () => window.clearTimeout(timer)
    }
    if (phase === "loading") {
      const wait = Math.max(0, MIN_VISIBLE - (Date.now() - shownAt.current))
      const timer = window.setTimeout(() => setPhase("done"), wait)
      return () => window.clearTimeout(timer)
    }
    if (phase === "done") {
      const timer = window.setTimeout(() => setPhase("idle"), FINISH)
      return () => window.clearTimeout(timer)
    }
  }, [busy, phase])

  return (
    <div
      className="site-loader"
      data-state={phase}
      role="progressbar"
      aria-label="جارٍ التحميل"
      aria-busy={phase === "loading"}
      aria-hidden={phase === "idle"}
      aria-valuetext={phase === "loading" ? "جارٍ التحميل" : phase === "done" ? "اكتمل التحميل" : undefined}
    >
      <i />
    </div>
  )
}

/**
 * Placeholder while a page's code is downloading. It keeps the page's height so the footer
 * does not jump, appears only if the wait is noticeable, and drives the top loading line.
 */
export function PageLoader() {
  useEffect(() => beginLoading(), [])
  return (
    <div className="page-loader page-container" role="status">
      <span className="sr-only">جارٍ تحميل الصفحة</span>
      <div className="page-loader-head" aria-hidden="true"><i /><i /><i /></div>
      <div className="page-loader-grid" aria-hidden="true"><i /><i /><i /></div>
    </div>
  )
}
