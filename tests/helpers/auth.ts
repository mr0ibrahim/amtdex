import { vi } from "vitest"
import { API } from "@/lib/api"
import type { Role } from "@/types/auth"

/** Authentication fixtures stay in tests; application code always calls the server. */
export function mockAuthApi() {
  vi.spyOn(API, "login").mockImplementation(async ({ email }) => {
    const role: Role = email.startsWith("admin") ? "admin" : email.startsWith("editor") ? "editor" : "viewer"
    return { user: { id: email, name: role === "admin" ? "أحمد الغامدي" : "مستخدم الاختبار", email, role } }
  })
  vi.spyOn(API, "logout").mockResolvedValue({ ok: true })
}
