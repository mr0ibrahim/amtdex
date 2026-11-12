import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-[28px] font-bold text-[var(--text)]">404 — الصفحة غير موجودة</h1>
      <p className="mt-2 text-[13px] text-[var(--text-muted)]">الرابط الذي طلبته غير موجود.</p>
      <Link to="/" className="btn btn-ink mt-6">
        العودة للرئيسية ←
      </Link>
    </div>
  )
}
