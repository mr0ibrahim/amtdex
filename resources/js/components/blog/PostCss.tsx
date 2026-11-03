import { useMemo } from "react"
import { scopePostCss } from "@/lib/blogCss"

/** Injects the post stylesheet with selectors limited to that post. */
export function PostCss({ css, postId }: { css?: string | null; postId?: number | null }) {
  const scoped = useMemo(() => scopePostCss(css || "", postId), [css, postId])
  if (!scoped) return null
  return <style data-blog-post-css="true">{scoped}</style>
}
