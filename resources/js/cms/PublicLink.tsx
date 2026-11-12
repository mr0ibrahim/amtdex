import { Link, type LinkProps } from "react-router-dom"
import { pageIsListed, useCms } from "./useCms"

export function PublicLink({ to, ...props }: LinkProps) {
  const { pages } = useCms()
  const href = typeof to === "string" ? to : (to.pathname ?? "/")
  if (!pageIsListed(pages, href, false)) return null
  return <Link to={to} {...props} />
}
