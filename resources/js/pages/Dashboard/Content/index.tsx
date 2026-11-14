import { lazy, Suspense, useState } from "react"

const ProjectsTab = lazy(() => import("./ProjectsTab").then(m => ({ default: m.ProjectsTab })))
const ServicesTab = lazy(() => import("./ServicesTab").then(m => ({ default: m.ServicesTab })))
const TestimonialsTab = lazy(() => import("./TestimonialsTab").then(m => ({ default: m.TestimonialsTab })))
const FaqsTab = lazy(() => import("./FaqsTab").then(m => ({ default: m.FaqsTab })))
const TeamTab = lazy(() => import("./TeamTab").then(m => ({ default: m.TeamTab })))
const ClientsTab = lazy(() => import("./ClientsTab").then(m => ({ default: m.ClientsTab })))

const tabs = [
  { id: "projects", label: "معرض المشاريع", component: ProjectsTab },
  { id: "services", label: "الخدمات", component: ServicesTab },
  { id: "testimonials", label: "آراء العملاء", component: TestimonialsTab },
  { id: "faqs", label: "الأسئلة الشائعة", component: FaqsTab },
  { id: "team", label: "فريق العمل", component: TeamTab },
  { id: "clients", label: "الشركاء والعملاء", component: ClientsTab },
] as const

export function ContentPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("projects")
  const Panel = tabs.find(tab => tab.id === activeTab)!.component
  return <div className="space-y-5">
    <header>
      <h1 className="text-lg sm:text-[18px] font-extrabold text-[var(--color-ink)]">إدارة المحتوى</h1>
      <p className="text-[12px] text-[var(--color-text-muted)] mt-1">إدارة المشاريع والخدمات وآراء العملاء والأسئلة وفريق العمل.</p>
    </header>
    <div className="dash-tabs" role="tablist" aria-label="أقسام المحتوى">
      {tabs.map(tab => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id}
        onClick={() => setActiveTab(tab.id)} className={`dash-tab${activeTab === tab.id ? " is-active" : ""}`}>{tab.label}</button>)}
    </div>
    <Suspense fallback={<p role="status">جار تحميل القسم...</p>}><Panel /></Suspense>
  </div>
}
