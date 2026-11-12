import type { ReactNode } from "react"
import { NotFoundPage } from "@/pages/NotFound/NotFoundPage"
import { pageIsListed, useCms } from "./useCms"

export function PublicPage({ path, children }: { path: string; children: ReactNode }) {
  const { pages } = useCms()
  if (!pageIsListed(pages, path, false)) return <NotFoundPage />
  return <>{children}</>
}
