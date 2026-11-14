import { lazy, Suspense, type ReactNode } from "react"
const NotFoundPage = lazy(() => import("@/pages/NotFound/NotFoundPage").then(m => ({ default: m.NotFoundPage })))
import { pageIsListed, useCms } from "./useCms"

export function PublicPage({ path, children }: { path: string; children: ReactNode }) {
  const { pages } = useCms()
  if (!pageIsListed(pages, path, false)) return <Suspense fallback={null}><NotFoundPage /></Suspense>
  return <>{children}</>
}
