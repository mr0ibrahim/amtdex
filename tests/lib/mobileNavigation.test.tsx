import { cleanup, render, screen, within, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { CMS_DEFAULTS } from "@/cms/defaults"

vi.mock("@/cms/useCms", () => ({ useCms: () => CMS_DEFAULTS, pageIsListed: () => true }))
vi.mock("@/routing/lifecycle", () => ({ prefetchRoute: vi.fn() }))
const media = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
beforeEach(() => {
  media.matches = false
  vi.stubGlobal("matchMedia", () => media)
})
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.clearAllMocks(); document.body.style.overflow = "" })
function mount() {
  return render(<MemoryRouter><div className="brand-motion"><Header onToast={() => {}} /><button>محتوى الصفحة</button></div></MemoryRouter>)
}

it("contains focus in the drawer and restores it and scrolling on Escape", async () => {
  const user = userEvent.setup()
  mount()
  const toggle = screen.getByRole("button", { name: "فتح القائمة" })
  await user.click(toggle)
  const dialog = screen.getByRole("dialog", { name: "استكشف امتدكس" })
  expect(within(dialog).getByRole("button", {name:"إغلاق القائمة"})).toHaveFocus()
  expect(document.body.style.overflow).toBe("hidden")
  expect(document.querySelector<HTMLElement>(".brand-motion")!.inert).toBe(true)
  await user.keyboard("{Shift>}{Tab}{/Shift}")
  expect(within(dialog).getByRole("link", {name:/تواصل معنا/})).toHaveFocus()
  await user.keyboard("{Tab}")
  expect(within(dialog).getByRole("button", {name:"إغلاق القائمة"})).toHaveFocus()
  await user.keyboard("{Escape}")
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  expect(toggle).toHaveFocus()
  expect(document.body.style.overflow).toBe("")
  expect(document.querySelector<HTMLElement>(".brand-motion")!.inert).toBe(false)
})

it("links to quote once and dismisses after navigation or backdrop click", async () => {
  const user = userEvent.setup()
  mount()
  await user.click(screen.getByRole("button", {name:"فتح القائمة"}))
  const dialog = screen.getByRole("dialog")
  expect(within(dialog).getAllByRole("link", {name:/ابدأ مشروعك/})).toHaveLength(1)
  expect(within(dialog).getByRole("link", {name:/ابدأ مشروعك/})).toHaveAttribute("href","/quote")
  await user.click(within(dialog).getByRole("link", {name:/ابدأ مشروعك/}))
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  await user.click(screen.getByRole("button", {name:"فتح القائمة"}))
  await user.click(screen.getByRole("button", {name:"إغلاق القائمة بالنقر خارجها"}))
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
})

it("releases the modal state when switching to desktop width", async () => {
  const user = userEvent.setup()
  mount()
  await user.click(screen.getByRole("button", {name:"فتح القائمة"}))
  media.matches = true
  const callback = media.addEventListener.mock.calls.at(-1)![1] as () => void
  fireEvent(window, new Event("resize"))
  const { act } = await import("@testing-library/react")
  act(callback)
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  expect(document.body.style.overflow).toBe("")
})
