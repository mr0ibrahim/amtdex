import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Seo } from "@/components/Seo"
import { Button } from "@/components/ui/Button"
import { getBlogUrl, getMainUrl, isBlogSubdomain } from "@/lib/subdomain"

export function BlogNotFoundPage() {
  const [q, setQ] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    if (isBlogSubdomain()) {
      navigate(`/?q=${encodeURIComponent(q.trim())}`)
    } else {
      window.location.href = `${getBlogUrl("/")}?q=${encodeURIComponent(q.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-ink)] flex items-center justify-center p-4">
      <Seo
        title="الصفحة غير موجودة 404 | مدونة Amtdex"
        description="الصفحة المطلوبة في مدونة Amtdex غير موجودة أو تم نقلها."
        noindex={true}
        nofollow={true}
      />

      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-[var(--color-border)] shadow-sm text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[var(--color-card-soft)] text-[var(--color-primary)] flex items-center justify-center font-bold text-3xl font-mono">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[var(--color-ink)] font-heading">
            عذراً، المقال أو الصفحة غير موجودة!
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            ربما تم نقل المقال إلى مسار جديد أو تغيير الرابط الدائم، يمكنك البحث في المدونة أو العودة للرئيسية.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن مقال، موضوع، أو وسم..."
            className="w-full px-4 py-3 rounded-2xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-subtle)] ps-4 pe-10"
          />
          <button
            type="submit"
            className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => {
              if (isBlogSubdomain()) {
                navigate("/")
              } else {
                window.location.href = getBlogUrl("/")
              }
            }}
            className="w-full sm:w-auto text-xs font-semibold px-6 py-2.5 rounded-xl"
          >
            رئيسية المدونة
          </Button>
          <a
            href={getMainUrl("/")}
            className="w-full sm:w-auto inline-flex items-center justify-center text-xs font-semibold px-6 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-ink)] transition-colors"
          >
            الموقع الرئيسي Amtdex
          </a>
        </div>
      </div>
    </div>
  )
}
