/**
 * Amtdex - App shell (routing + lazy code-splitting + auth + SEO).
 * Layout Routes: Marketing (Header/Footer) | Auth (standalone) | Dashboard (own shell) | 404
 */
import { Suspense, lazy, useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { RouteProgress, useRouteLifecycle } from "@/routing/lifecycle"
import { PublicPage } from "@/cms/PublicPage"
import type { Role } from "@/lib/auth"
import { AuthLayout, MarketingLayout } from "@/components/layout/MarketingLayout"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { ForbiddenPage, ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Seo } from "@/components/Seo"
import { useToast } from "@/components/ui/Toast"
import { isBlogSubdomain, isDashboardHost, getMainUrl } from "@/lib/subdomain"

const HomePage = lazy(() => import("@/pages/Home/HomePage").then((m) => ({ default: m.HomePage })))
const ServicesPage = lazy(() => import("@/pages/Services/ServicesPage").then((m) => ({ default: m.ServicesPage })))
const ServiceDetailPage = lazy(() => import("@/pages/Services/ServiceDetailPage").then((m) => ({ default: m.ServiceDetailPage })))
const PortfolioPage = lazy(() => import("@/pages/Portfolio/PortfolioPage").then((m) => ({ default: m.PortfolioPage })))
const PortfolioDetailPage = lazy(() => import("@/pages/Portfolio/PortfolioDetailPage").then((m) => ({ default: m.PortfolioDetailPage })))
const PricingPage = lazy(() => import("@/pages/Pricing/PricingPage").then((m) => ({ default: m.PricingPage })))
const AboutPage = lazy(() => import("@/pages/About/AboutPage").then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import("@/pages/Contact/ContactPage").then((m) => ({ default: m.ContactPage })))
const QuotePage = lazy(() => import("@/pages/Quote/QuotePage").then((m) => ({ default: m.QuotePage })))
const LoginPage = lazy(() => import("@/pages/Auth/LoginPage").then((m) => ({ default: m.LoginPage })))
const DashboardPageOld = lazy(() => import("@/pages/Dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })))
const OverviewPage = lazy(() => import("@/pages/Dashboard/Overview").then((m) => ({ default: m.OverviewPage })))
const ContentPage = lazy(() => import("@/pages/Dashboard/Content").then((m) => ({ default: m.ContentPage })))
const LeadsPage = lazy(() => import("@/pages/Dashboard/Leads").then((m) => ({ default: m.LeadsPage })))
const SeoPage = lazy(() => import("@/pages/Dashboard/Seo").then((m) => ({ default: m.SeoPage })))
const MediaPage = lazy(() => import("@/pages/Dashboard/Media").then((m) => ({ default: m.MediaPage })))
const SettingsPage = lazy(() => import("@/pages/Dashboard/Settings").then((m) => ({ default: m.SettingsPage })))
const UsersPage = lazy(() => import("@/pages/Dashboard/Users").then((m) => ({ default: m.UsersPage })))
const AuditPage = lazy(() => import("@/pages/Dashboard/Audit").then((m) => ({ default: m.AuditPage })))
const NotFoundPage = lazy(() => import("@/pages/NotFound/NotFoundPage").then((m) => ({ default: m.NotFoundPage })))

// Blog Pages
const BlogHomePage = lazy(() => import("@/pages/Blog/BlogHomePage").then((m) => ({ default: m.BlogHomePage })))
const BlogPostPage = lazy(() => import("@/pages/Blog/BlogPostPage").then((m) => ({ default: m.BlogPostPage })))
const BlogCategoryPage = lazy(() => import("@/pages/Blog/BlogCategoryPage").then((m) => ({ default: m.BlogCategoryPage })))
const BlogTagPage = lazy(() => import("@/pages/Blog/BlogTagPage").then((m) => ({ default: m.BlogTagPage })))
const BlogNotFoundPage = lazy(() => import("@/pages/Blog/BlogNotFoundPage").then((m) => ({ default: m.BlogNotFoundPage })))
const DashboardBlogPage = lazy(() => import("@/pages/Dashboard/Blog/DashboardBlogPage").then((m) => ({ default: m.DashboardBlogPage })))
const SiteManagerPage = lazy(() => import("@/pages/Dashboard/Site").then((m) => ({ default: m.SiteManagerPage })))

function PageLoader() {
  return (
    <div className="grid place-items-center py-24">
      <div className="flex items-center gap-3 text-[13px] text-[var(--color-text-faint)]">
        <span className="size-4 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-text-faint)] animate-spin" aria-hidden />
        جار تحميل الصفحة...
      </div>
    </div>
  )
}

function SubdomainCrossRedirect() {
  const loc = useLocation()
  useEffect(() => {
    const target = getMainUrl(loc.pathname + loc.search + loc.hash)
    window.location.replace(target)
  }, [loc])

  return (
    <div className="grid place-items-center py-24">
      <div className="flex items-center gap-3 text-[13px] text-[var(--color-text-faint)]">
        <span className="size-4 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-text-faint)] animate-spin" aria-hidden />
        جارِ التحويل إلى الموقع الرئيسي...
      </div>
    </div>
  )
}

function DashboardFrame({ children, roles }: { children: React.ReactNode; roles: Role[] }) {
  return (
    <ProtectedRoute roles={roles}>
      <Seo title="لوحة التحكم" noindex />
      <ErrorBoundary>
        <DashboardLayout>{children}</DashboardLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}

const STAFF: Role[] = ["admin", "editor", "author", "viewer"]
const EDITORS: Role[] = ["admin", "editor"]
const WRITERS: Role[] = ["admin", "editor", "author"]
const READERS: Role[] = ["admin", "editor", "viewer"]
const ADMINS: Role[] = ["admin"]

export default function App() {
  const { show, el } = useToast()
  const onBlogSubdomain = isBlogSubdomain()
  const onDashboardHost = isDashboardHost()
  const dashboardElsewhere = Boolean(window.__AMTDEX_CONFIG__?.dashboardDomain) && !onDashboardHost
  useRouteLifecycle()

  return (
    <>
      <RouteProgress />
      {el}
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {onBlogSubdomain ? (
              <>
                <Route element={<MarketingLayout onToast={show} />}>
                  <Route path="/" element={<PublicPage path="/blog"><BlogHomePage /></PublicPage>} />
                  <Route path="/posts/:slug" element={<PublicPage path="/blog"><BlogPostPage /></PublicPage>} />
                  <Route path="/categories/:slug" element={<PublicPage path="/blog"><BlogCategoryPage /></PublicPage>} />
                  <Route path="/tags/:slug" element={<PublicPage path="/blog"><BlogTagPage /></PublicPage>} />
                </Route>
                <Route path="/dashboard" element={<NotFoundPage />} />
                <Route path="/dashboard/*" element={<NotFoundPage />} />
                <Route path="/login" element={<NotFoundPage />} />
                <Route path="/403" element={<SubdomainCrossRedirect />} />
                <Route path="/about" element={<SubdomainCrossRedirect />} />
                <Route path="/services" element={<SubdomainCrossRedirect />} />
                <Route path="/services/*" element={<SubdomainCrossRedirect />} />
                <Route path="/portfolio" element={<SubdomainCrossRedirect />} />
                <Route path="/portfolio/*" element={<SubdomainCrossRedirect />} />
                <Route path="/pricing" element={<SubdomainCrossRedirect />} />
                <Route path="/contact" element={<SubdomainCrossRedirect />} />
                <Route path="/quote" element={<SubdomainCrossRedirect />} />
                <Route path="*" element={<BlogNotFoundPage />} />
              </>
            ) : onDashboardHost ? (
              <>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<><Seo title="تسجيل الدخول" noindex nofollow /><LoginPage /></>} />
                  <Route path="/403" element={<><Seo title="غير مصرح" noindex nofollow /><ForbiddenPage /></>} />
                </Route>
                <Route path="/dashboard" element={<DashboardFrame roles={STAFF}><OverviewPage onToast={show} /></DashboardFrame>} />
                <Route path="/dashboard/overview" element={<DashboardFrame roles={STAFF}><OverviewPage onToast={show} /></DashboardFrame>} />
                <Route path="/dashboard/blog" element={<DashboardFrame roles={WRITERS}><DashboardBlogPage onToast={show} /></DashboardFrame>} />
                <Route path="/dashboard/content" element={<DashboardFrame roles={EDITORS}><ContentPage /></DashboardFrame>} />
                <Route path="/dashboard/site" element={<DashboardFrame roles={EDITORS}><SiteManagerPage /></DashboardFrame>} />
                <Route path="/dashboard/leads" element={<DashboardFrame roles={READERS}><LeadsPage /></DashboardFrame>} />
                <Route path="/dashboard/seo" element={<DashboardFrame roles={EDITORS}><SeoPage /></DashboardFrame>} />
                <Route path="/dashboard/media" element={<DashboardFrame roles={WRITERS}><MediaPage /></DashboardFrame>} />
                <Route path="/dashboard/settings" element={<DashboardFrame roles={ADMINS}><SettingsPage /></DashboardFrame>} />
                <Route path="/dashboard/users" element={<DashboardFrame roles={ADMINS}><UsersPage /></DashboardFrame>} />
                <Route path="/dashboard/audit" element={<DashboardFrame roles={ADMINS}><AuditPage /></DashboardFrame>} />
                <Route path="/dashboard/legacy" element={<><Seo title="لوحة التحكم قديم" noindex nofollow /><ProtectedRoute roles={ADMINS}><DashboardPageOld onToast={show} /></ProtectedRoute></>} />
                <Route path="*" element={<NotFoundPage />} />
              </>
            ) : (
              <>
                <Route element={<MarketingLayout onToast={show} />}>
                  <Route path="/" element={<PublicPage path="/"><Seo title="AMTDEX SOFT — امتدكس سوفت" description="هندسة الفكرة قبل برمجتها. من الفكرة إلى التنفيذ." /><HomePage onToast={show} /></PublicPage>} />
                  <Route path="/services" element={<PublicPage path="/services"><Seo title="الخدمات" /><ServicesPage /></PublicPage>} />
                  <Route path="/services/:slug" element={<PublicPage path="/services"><ServiceDetailPage /></PublicPage>} />
                  <Route path="/portfolio" element={<PublicPage path="/portfolio"><Seo title="اعمالنا" /><PortfolioPage /></PublicPage>} />
                  <Route path="/portfolio/:slug" element={<PublicPage path="/portfolio"><PortfolioDetailPage /></PublicPage>} />
                  <Route path="/pricing" element={<PublicPage path="/pricing"><Seo title="الاسعار" /><PricingPage onToast={show} /></PublicPage>} />
                  <Route path="/about" element={<PublicPage path="/about"><Seo title="من نحن" /><AboutPage /></PublicPage>} />
                  <Route path="/contact" element={<PublicPage path="/contact"><Seo title="تواصل معنا" /><ContactPage onToast={show} /></PublicPage>} />
                  <Route path="/quote" element={<PublicPage path="/quote"><Seo title="اطلب عرض سعر" /><QuotePage onToast={show} /></PublicPage>} />
                  <Route path="/blog" element={<PublicPage path="/blog"><BlogHomePage /></PublicPage>} />
                  <Route path="/blog/posts/:slug" element={<PublicPage path="/blog"><BlogPostPage /></PublicPage>} />
                  <Route path="/blog/categories/:slug" element={<PublicPage path="/blog"><BlogCategoryPage /></PublicPage>} />
                  <Route path="/blog/tags/:slug" element={<PublicPage path="/blog"><BlogTagPage /></PublicPage>} />
                </Route>
                {dashboardElsewhere ? (
                  <>
                    <Route path="/403" element={<><Seo title="غير مصرح" noindex /><ForbiddenPage /></>} />
                    <Route path="/login" element={<NotFoundPage />} />
                    <Route path="/dashboard" element={<NotFoundPage />} />
                    <Route path="/dashboard/*" element={<NotFoundPage />} />
                  </>
                ) : (
                  <>
                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<><Seo title="تسجيل الدخول" noindex nofollow /><LoginPage /></>} />
                      <Route path="/403" element={<><Seo title="غير مصرح" noindex nofollow /><ForbiddenPage /></>} />
                    </Route>
                    <Route path="/dashboard" element={<DashboardFrame roles={STAFF}><OverviewPage onToast={show} /></DashboardFrame>} />
                    <Route path="/dashboard/overview" element={<DashboardFrame roles={STAFF}><OverviewPage onToast={show} /></DashboardFrame>} />
                    <Route path="/dashboard/blog" element={<DashboardFrame roles={WRITERS}><DashboardBlogPage onToast={show} /></DashboardFrame>} />
                    <Route path="/dashboard/content" element={<DashboardFrame roles={EDITORS}><ContentPage /></DashboardFrame>} />
                    <Route path="/dashboard/site" element={<DashboardFrame roles={EDITORS}><SiteManagerPage /></DashboardFrame>} />
                    <Route path="/dashboard/leads" element={<DashboardFrame roles={READERS}><LeadsPage /></DashboardFrame>} />
                    <Route path="/dashboard/seo" element={<DashboardFrame roles={EDITORS}><SeoPage /></DashboardFrame>} />
                    <Route path="/dashboard/media" element={<DashboardFrame roles={WRITERS}><MediaPage /></DashboardFrame>} />
                    <Route path="/dashboard/settings" element={<DashboardFrame roles={ADMINS}><SettingsPage /></DashboardFrame>} />
                    <Route path="/dashboard/users" element={<DashboardFrame roles={ADMINS}><UsersPage /></DashboardFrame>} />
                    <Route path="/dashboard/audit" element={<DashboardFrame roles={ADMINS}><AuditPage /></DashboardFrame>} />
                    <Route path="/dashboard/legacy" element={<><Seo title="لوحة التحكم قديم" noindex nofollow /><ProtectedRoute roles={ADMINS}><DashboardPageOld onToast={show} /></ProtectedRoute></>} />
                  </>
                )}
                <Route path="*" element={<NotFoundPage />} />
              </>
            )}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
