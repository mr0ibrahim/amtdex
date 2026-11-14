import { lazy } from "react"
import { Navigate, Route } from "react-router-dom"
import { AuthLayout } from "@/components/layout/MarketingLayout"
import { ForbiddenPage, ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { Seo } from "@/components/Seo"
import { DASHBOARD_PAGES } from "./dashboard"

const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout").then(m => ({ default: m.DashboardLayout })))
const LoginPage = lazy(() => import("@/pages/Auth/LoginPage").then(m => ({ default: m.LoginPage })))
const OverviewPage = lazy(() => import("@/pages/Dashboard/Overview").then(m => ({ default: m.OverviewPage })))
const BlogPage = lazy(() => import("@/pages/Dashboard/Blog/DashboardBlogPage").then(m => ({ default: m.DashboardBlogPage })))
const ContentPage = lazy(() => import("@/pages/Dashboard/Content").then(m => ({ default: m.ContentPage })))
const SitePage = lazy(() => import("@/pages/Dashboard/Site").then(m => ({ default: m.SiteManagerPage })))
const LeadsPage = lazy(() => import("@/pages/Dashboard/Leads").then(m => ({ default: m.LeadsPage })))
const SeoPage = lazy(() => import("@/pages/Dashboard/Seo").then(m => ({ default: m.SeoPage })))
const MediaPage = lazy(() => import("@/pages/Dashboard/Media").then(m => ({ default: m.MediaPage })))
const UsersPage = lazy(() => import("@/pages/Dashboard/Users").then(m => ({ default: m.UsersPage })))
const AuditPage = lazy(() => import("@/pages/Dashboard/Audit").then(m => ({ default: m.AuditPage })))
const SettingsPage = lazy(() => import("@/pages/Dashboard/Settings").then(m => ({ default: m.SettingsPage })))

/** A route fragment, shared by same-host and isolated-host deployments. */
export function dashboardRoutes(onToast: (message: string) => void) {
  const screens = {
    overview: <OverviewPage onToast={onToast} />, blog: <BlogPage onToast={onToast} />,
    content: <ContentPage />, site: <SitePage />, leads: <LeadsPage />, seo: <SeoPage />,
    media: <MediaPage />, users: <UsersPage />, audit: <AuditPage />, settings: <SettingsPage />,
  }
  return <>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<><Seo title="تسجيل الدخول" noindex nofollow /><LoginPage /></>} />
      <Route path="/403" element={<><Seo title="غير مصرح" noindex nofollow /><ForbiddenPage /></>} />
    </Route>
    <Route element={<ProtectedRoute><Seo title="لوحة التحكم" noindex /><ErrorBoundary><DashboardLayout /></ErrorBoundary></ProtectedRoute>}>
      {(Object.keys(screens) as (keyof typeof screens)[]).map(id => <Route key={id} path={DASHBOARD_PAGES[id].path}
        element={<ProtectedRoute roles={DASHBOARD_PAGES[id].roles}>{screens[id]}</ProtectedRoute>} />)}
      <Route path="/dashboard/overview" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard/legacy" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </>
}
