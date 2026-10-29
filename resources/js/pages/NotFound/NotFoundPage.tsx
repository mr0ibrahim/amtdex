import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-[28px] font-bold">404 — الصفحة غير موجودة</h1>
      <p className="mt-2 text-[13px] text-black/50">الرابط الذي طلبته غير موجود.</p>
      <Link to="/" className="mt-6 inline-flex bg-[var(--color-ink)] text-white px-6 py-3 rounded-full text-[13px] font-semibold hover:bg-black transition-colors">
        العودة للرئيسية ←
      </Link>
    </div>
  )
}
