export function QueryError({ error, onRetry, className = "" }: { error: unknown; onRetry: () => void; className?: string }) {
  if (!error) return null
  return <div role="alert" className={`rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 ${className}`}>
    <p>{error instanceof Error ? error.message : "تعذر تحميل البيانات"}</p>
    <button type="button" className="mt-2 underline" onClick={onRetry}>إعادة المحاولة</button>
  </div>
}
