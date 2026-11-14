import { expect, it } from "vitest"
import { dashboardNavigation } from "@/routing/dashboard"

it("filters navigation by the same roles used for route authorization", () => {
  const paths = (role: "admin" | "author" | "viewer") => dashboardNavigation(role).flatMap(group => group.items.map(item => item.to))
  expect(paths("admin")).toContain("/dashboard/users")
  expect(paths("author")).toContain("/dashboard/blog")
  expect(paths("author")).not.toContain("/dashboard/leads")
  expect(paths("viewer")).toContain("/dashboard/leads")
  expect(paths("viewer")).not.toContain("/dashboard/content")
  expect(dashboardNavigation(undefined)).toEqual([])
})
