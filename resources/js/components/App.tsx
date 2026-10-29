/**
 * Amtdex - App shell (routing + lazy code-splitting + auth + SEO).
 * Layout Routes: Marketing (Header/Footer) | Auth (standalone) | Dashboard (own shell) | 404
 */
import { Suspense, lazy, useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { AuthLayout, MarketingLayout } from "@/components/layout/MarketingLayout"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { ForbiddenPage, ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Seo } from "@/components/Seo"
import { useToast } from "@/components/ui/Toast"
import { isBlogSubdomain, getMainUrl } from "@/lib/subdomain"

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

function DashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Seo title="لوحة التحكم" noindex />
      <ErrorBoundary>
        <DashboardLayout>{children}</DashboardLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}

export default function App() {
  const { show, el } = useToast()
  const onBlogSubdomain = isBlogSubdomain()

  return (
    <>
      {el}
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* If on blog subdomain (e.g. blog.amtdex.com or blog.localhost) */}
            {onBlogSubdomain ? (
              <>
                <Route element={<MarketingLayout onToast={show} />}>
                  <Route path="/" element={<BlogHomePage />} />
                  <Route path="/posts/:slug" element={<BlogPostPage />} />
                  <Route path="/categories/:slug" element={<BlogCategoryPage />} />
                  <Route path="/tags/:slug" element={<BlogTagPage />} />
                </Route>

                {/* Subdomain automatic redirects to main site for non-blog routes */}
                <Route path="/dashboard" element={<SubdomainCrossRedirect />} />
                <Route path="/dashboard/*" element={<SubdomainCrossRedirect />} />
                <Route path="/login" element={<SubdomainCrossRedirect />} />
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
            ) : (
              /* Main site domain routes */
              <>
                <Route element={<MarketingLayout onToast={show} />}>
                  <Route path="/" element={<><Seo title="الرئيسية" description="Amtdex - شركة يمنية للحلول البرمجية: مواقع، تطبيقات، ERP/CRM، ذكاء اصطناعي." /><HomePage onToast={show} /></>} />
                  <Route path="/services" element={<><Seo title="الخدمات" /><ServicesPage /></>} />
                  <Route path="/services/:slug" element={<ServiceDetailPage />} />
                  <Route path="/portfolio" element={<><Seo title="اعمالنا" /><PortfolioPage /></>} />
                  <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
                  <Route path="/pricing" element={<><Seo title="الاسعار" /><PricingPage onToast={show} /></>} />
                  <Route path="/about" element={<><Seo title="من نحن" /><AboutPage /></>} />
                  <Route path="/contact" element={<><Seo title="تواصل معنا" /><ContactPage onToast={show} /></>} />
                  <Route path="/quote" element={<><Seo title="اطلب عرض سعر" /><QuotePage onToast={show} /></>} />

                  {/* Blog routes on main site */}
                  <Route path="/blog" element={<BlogHomePage />} />
                  <Route path="/blog/posts/:slug" element={<BlogPostPage />} />
                  <Route path="/blog/categories/:slug" element={<BlogCategoryPage />} />
                  <Route path="/blog/tags/:slug" element={<BlogTagPage />} />
                </Route>

                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<><Seo title="تسجيل الدخول" noindex /><LoginPage /></>} />
                  <Route path="/403" element={<><Seo title="غير مصرح" noindex /><ForbiddenPage /></>} />
                </Route>

                {/* Unified Central Dashboard */}
                <Route path="/dashboard" element={<DashboardFrame><OverviewPage onToast={show} /></DashboardFrame>} />
                <Route path="/dashboard/overview" element={<DashboardFrame><OverviewPage onToast={show} /></DashboardFrame>} />
                <Route path="/dashboard/blog" element={<DashboardFrame><DashboardBlogPage onToast={show} /></DashboardFrame>} />
                <Route path="/dashboard/content" element={<DashboardFrame><ContentPage /></DashboardFrame>} />
                <Route path="/dashboard/leads" element={<DashboardFrame><LeadsPage /></DashboardFrame>} />
                <Route path="/dashboard/seo" element={<DashboardFrame><SeoPage /></DashboardFrame>} />
                <Route path="/dashboard/media" element={<DashboardFrame><MediaPage /></DashboardFrame>} />
                <Route path="/dashboard/settings" element={<DashboardFrame><SettingsPage /></DashboardFrame>} />
                <Route path="/dashboard/users" element={<DashboardFrame><UsersPage /></DashboardFrame>} />
                <Route path="/dashboard/audit" element={<DashboardFrame><AuditPage /></DashboardFrame>} />
                <Route path="/dashboard/legacy" element={<><Seo title="لوحة التحكم قديم" noindex /><ProtectedRoute><DashboardPageOld onToast={show} /></ProtectedRoute></>} />
                <Route path="*" element={<NotFoundPage />} />
              </>
            )}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
