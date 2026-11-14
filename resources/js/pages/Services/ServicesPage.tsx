import { PageHeader } from "@/components/layout/PageHeader"
import { ServiceCollection } from "@/components/ui/ServiceCollection"
import { WorkflowSection } from "@/pages/Home/WorkflowSection"

export function ServicesPage() {
  return <div className="reference-service-page">
    <div className="page-container page-container--wide page-section"><PageHeader artwork="web" eyebrow="خدماتنا" title="ماذا نقدم؟" description="مواقع وتطبيقات ومتاجر وأنظمة أعمال؛ اختر الخدمة المناسبة واستكشف تفاصيلها." /></div>
    <section className="reference-services-section page-section" aria-label="خدمات امتدكس سوفت"><div className="page-container page-container--wide"><ServiceCollection /></div></section>
    <WorkflowSection />
  </div>
}
