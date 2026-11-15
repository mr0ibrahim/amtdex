/**
 * Amtdex - App shell (routing + lazy code-splitting + auth + SEO).
 * Layout Routes: Marketing (Header/Footer) | Auth (standalone) | Dashboard (own shell) | 404
 */
import { Suspense, lazy, useEffect, type ComponentType } from "react"
import { beginLoading } from "@/lib/loading"
import { Route, Routes, useLocation } from "react-router-dom"
import { dashboardRoutes } from "@/routing/dashboardRoutes"
import { useRouteLifecycle } from "@/routing/lifecycle"
import { PageLoader, SiteLoader } from "@/components/ui/SiteLoader"
import { PublicPage } from "@/cms/PublicPage"
import { MarketingLayout } from "@/components/layout/MarketingLayout"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { ForbiddenPage } from "@/components/layout/ProtectedRoute"
import { Seo } from "@/components/Seo"
import { useToast } from "@/components/ui/Toast"
import { isBlogSubdomain, isDashboardHost, getMainUrl } from "@/lib/subdomain"
/**
 * A lazy page that reports its download to the site loader. Navigation keeps the current page
 * on screen while the next one loads, so without this there is no sign that anything is happening.
 * Prefetched pages resolve at once and never show the line.
 */
function lazyPage<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(() => {
    const end = beginLoading()
    return load().finally(end)
  })
}

const HomePage = lazyPage(() => import("@/pages/Home/HomePage").then(m => ({ default: m.HomePage })))
const ServicesPage = lazyPage(() => import("@/pages/Services/ServicesPage").then(m => ({ default: m.ServicesPage })))
const LegalPage = lazyPage(() => import("@/pages/Legal/LegalPage").then(m => ({ default: m.LegalPage })))
const AboutPage = lazyPage(() => import("@/pages/About/AboutPage").then(m => ({ default: m.AboutPage })))
const ContactPage = lazyPage(() => import("@/pages/Contact/ContactPage").then(m => ({ default: m.ContactPage })))

const ServiceDetailPage = lazyPage(() => import("@/pages/Services/ServiceDetailPage").then((m) => ({ default: m.ServiceDetailPage })))
const PortfolioPage = lazyPage(() => import("@/pages/Portfolio/PortfolioPage").then((m) => ({ default: m.PortfolioPage })))
const PortfolioDetailPage = lazyPage(() => import("@/pages/Portfolio/PortfolioDetailPage").then((m) => ({ default: m.PortfolioDetailPage })))
const QuotePage = lazyPage(() => import("@/pages/Quote/QuotePage").then((m) => ({ default: m.QuotePage })))
const NotFoundPage = lazyPage(() => import("@/pages/NotFound/NotFoundPage").then((m) => ({ default: m.NotFoundPage })))

// Blog Pages
const BlogHomePage = lazyPage(() => import("@/pages/Blog/BlogHomePage").then((m) => ({ default: m.BlogHomePage })))
const BlogPostPage = lazyPage(() => import("@/pages/Blog/BlogPostPage").then((m) => ({ default: m.BlogPostPage })))
const BlogCategoryPage = lazyPage(() => import("@/pages/Blog/BlogCategoryPage").then((m) => ({ default: m.BlogCategoryPage })))
const BlogTagPage = lazyPage(() => import("@/pages/Blog/BlogTagPage").then((m) => ({ default: m.BlogTagPage })))
const BlogNotFoundPage = lazyPage(() => import("@/pages/Blog/BlogNotFoundPage").then((m) => ({ default: m.BlogNotFoundPage })))

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

export default function App() {
  const { show, el } = useToast()
  const onBlogSubdomain = isBlogSubdomain()
  const onDashboardHost = isDashboardHost()
  const dashboardElsewhere = Boolean(window.__AMTDEX_CONFIG__?.dashboardDomain) && !onDashboardHost
  useRouteLifecycle()

  return (
    <>
      <SiteLoader />
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
                {dashboardRoutes(show)}
                <Route path="*" element={<NotFoundPage />} />
              </>
            ) : (
              <>
                <Route element={<MarketingLayout onToast={show} />}>
                  <Route path="/" element={<PublicPage path="/"><Seo title="AMTDEX SOFT — امتدكس سوفت" description="هندسة الفكرة قبل برمجتها. من الفكرة إلى التنفيذ." /><HomePage onToast={show} /></PublicPage>} />
                  <Route path="/services" element={<PublicPage path="/services"><Seo title="الخدمات" /><ServicesPage /></PublicPage>} />
                  <Route path="/services/:slug" element={<PublicPage path="/services"><ServiceDetailPage /></PublicPage>} />
                  <Route path="/portfolio" element={<PublicPage path="/portfolio"><Seo title="أعمالنا" /><PortfolioPage /></PublicPage>} />
                  <Route path="/portfolio/:slug" element={<PublicPage path="/portfolio"><PortfolioDetailPage /></PublicPage>} />
                  <Route path="/pricing" element={<NotFoundPage />} />
                  <Route path="/about" element={<PublicPage path="/about"><Seo title="من نحن" /><AboutPage /></PublicPage>} />
                  <Route path="/contact" element={<PublicPage path="/contact"><Seo title="تواصل معنا" /><ContactPage onToast={show} /></PublicPage>} />
                  <Route path="/quote" element={<PublicPage path="/quote"><Seo title="ابدأ مشروعك" /><QuotePage onToast={show} /></PublicPage>} />
                  <Route path="/blog" element={<PublicPage path="/blog"><BlogHomePage /></PublicPage>} />
                  <Route path="/blog/posts/:slug" element={<PublicPage path="/blog"><BlogPostPage /></PublicPage>} />
                  <Route path="/blog/categories/:slug" element={<PublicPage path="/blog"><BlogCategoryPage /></PublicPage>} />
                  <Route path="/blog/tags/:slug" element={<PublicPage path="/blog"><BlogTagPage /></PublicPage>} />
                  <Route path="/privacy" element={<LegalPage kind="privacy" />} />
                  <Route path="/terms" element={<LegalPage kind="terms" />} />
                  {/* Unknown addresses keep the site header, footer and navigation. */}
                  <Route path="*" element={<NotFoundPage />} />
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
                    {dashboardRoutes(show)}
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
