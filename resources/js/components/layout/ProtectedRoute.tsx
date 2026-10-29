import { Navigate } from "react-router-dom"
import { hasRole, isAuthenticated } from "@/lib/auth"
import type { Role } from "@/lib/auth"

export function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: Role[] }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  if (roles && !hasRole(roles)) return <Navigate to="/403" replace />
  return <>{children}</>
}

export function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-[640px] px-6 py-16 text-center">
      <div className="size-12 rounded-full bg-[var(--color-lavender)] grid place-items-center text-[20px] mx-auto">⛔</div>
      <h1 className="mt-4 text-[22px] font-bold text-[var(--color-ink)]">403 — ليس لديك صلاحية</h1>
      <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-muted)]">حسابك لا يملك صلاحية الوصول لهذه الصفحة. تواصل مع المسؤول إذا كنت تحتاج الوصول.</p>
      <a href="/" className="mt-6 inline-flex bg-[var(--color-ink)] text-white px-6 py-2.5 rounded-full text-[13px] font-semibold">العودة للرئيسية</a>
    </div>
  )
}
