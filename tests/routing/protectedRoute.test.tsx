import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, beforeEach } from "vitest"
import { ProtectedRoute, ForbiddenPage } from "@/components/layout/ProtectedRoute"
import { login, logout } from "@/lib/auth"

describe("ProtectedRoute and Authorization", () => {
  beforeEach(async () => {
    await logout()
  })

  it("redirects unauthenticated users to /login", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<div>صفحة الدخول</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>محتوى محمي</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText("صفحة الدخول")).toBeInTheDocument()
    expect(screen.queryByText("محتوى محمي")).not.toBeInTheDocument()
  })

  it("renders protected content when user is authenticated with proper role", async () => {
    await login("admin@amtdex.ye", "Amtdex2026!")

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <div>محتوى محمي للمسؤول</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText("محتوى محمي للمسؤول")).toBeInTheDocument()
  })

  it("redirects to /403 when user lacks required role", async () => {
    await login("viewer@amtdex.ye", "Amtdex2026!")

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/403" element={<ForbiddenPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <div>محتوى محمي للمسؤول</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(/403 — ليس لديك صلاحية/)).toBeInTheDocument()
    expect(screen.queryByText("محتوى محمي للمسؤول")).not.toBeInTheDocument()
  })
})

