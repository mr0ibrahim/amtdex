import { StrictMode } from "react"
import { cleanup, render, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { useBrandMotion } from "@/hooks/useBrandMotion"

const { mount, revert } = vi.hoisted(() => ({ mount: vi.fn(), revert: vi.fn() }))
vi.mock("@/lib/motion/brandScenes", () => ({ mountBrandScenes: mount }))

function Scene({ route = "/" }: { route?: string }) {
  const ref = useBrandMotion(route)
  return <div ref={ref}><section data-motion-group><div data-motion="rise">Content</div></section></div>
}
afterEach(() => { cleanup(); vi.resetAllMocks() })

it("cleans up the previous route before mounting a new scene", async () => {
  mount.mockReturnValue(revert)
  const view = render(<Scene />)
  await waitFor(() => expect(mount).toHaveBeenCalledTimes(1))
  view.rerender(<Scene route="/services" />)
  await waitFor(() => expect(mount).toHaveBeenCalledTimes(2))
  expect(revert).toHaveBeenCalledTimes(1)
  view.unmount()
  expect(revert).toHaveBeenCalledTimes(2)
})

it("does not mount a stale async scene after StrictMode cleanup", async () => {
  mount.mockReturnValue(revert)
  const view = render(<StrictMode><Scene /></StrictMode>)
  await waitFor(() => expect(mount).toHaveBeenCalledTimes(1))
  expect(view.getByText("Content")).toBeVisible()
  view.unmount()
  expect(revert).toHaveBeenCalledTimes(1)
})
