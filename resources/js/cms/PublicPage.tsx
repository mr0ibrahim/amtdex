import type { ReactNode } from "react"
import { NotFoundPage } from "@/pages/NotFound/NotFoundPage"
import { CMS_DEFAULTS } from "./defaults"
import { useCms } from "./useCms"

export function PublicPage({ path, children }: { path: string; children: ReactNode }) {
  const { pages, staff, ready } = useCms()
  const known = CMS_DEFAULTS.pages.some((item) => item.path === path)
  const page = pages.find((item) => item.path === path)
  if (ready && known && !staff && (!page || !page.published)) return <NotFoundPage />
  return <>{children}</>
}
