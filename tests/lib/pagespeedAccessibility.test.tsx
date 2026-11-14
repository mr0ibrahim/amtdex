import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axe from "axe-core"
import App from "@/components/App"

afterEach(cleanup)
it("keeps the home accessibility tree free of invalid ARIA and nested controls", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const { container } = render(<QueryClientProvider client={client}><MemoryRouter initialEntries={["/"]}><App /></MemoryRouter></QueryClientProvider>)
  await screen.findByRole("heading", { level: 1 })
  const results = await axe.run(container, { runOnly: { type: "rule", values: [
    "aria-prohibited-attr", "aria-allowed-attr", "aria-valid-attr", "aria-valid-attr-value",
    "aria-required-children", "aria-required-parent", "aria-roles", "nested-interactive", "button-name", "link-name", "label",
  ] } })
  expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.html) }))).toEqual([])
}, 10000)
