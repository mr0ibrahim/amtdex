import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { login } from "@/lib/auth"
import { getMainUrl } from "@/lib/subdomain"
import { z } from "zod"

const schema = z.object({
  email: z.string().trim().email("بريد صحيح مطلوب"),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل"),
})

export function LoginPage() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState("admin@amtdex.ye")
  const [password, setPassword] = useState("Amtdex2026!")
  const [err, setErr] = useState<string | null>(null)
  const [fieldErrs, setFieldErrs] = useState<Record<string, string>>({})

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      const m: Record<string, string> = {}
      for (const iss of parsed.error.issues) m[String(iss.path[0])] = iss.message
      setFieldErrs(m); return
    }
    setFieldErrs({})
    try {
      await login(email, password)
      const next = params.get("next") || "/dashboard"
      const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard"
      nav(safe, { replace: true })
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "فشل تسجيل الدخول")
    }
  }

  return (
    <div className="login-shell min-h-screen grid place-items-center px-4 py-10">
      <form onSubmit={submit} noValidate className="login-card w-full max-w-[420px] p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="size-2 bg-[var(--color-gold)]" aria-hidden />
          <span className="font-display font-semibold text-[16px] text-[var(--color-ink)]">AMTDEX — تسجيل الدخول</span>
        </div>
        <p className="mt-2 text-[12px] text-[var(--color-text-muted)]">لوحة التحكم — تجربة Mock. جرّب: admin@amtdex.ye / Amtdex2026!</p>

        {err && <div role="alert" className="mt-4 bg-[var(--danger-bg)] border border-[var(--danger)] text-[var(--danger)] text-[12px] rounded-xl px-3 py-2">{err}</div>}

        <label className="block mt-5 text-[12px] font-medium text-[var(--text)]">البريد</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-[13px] outline-none bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--placeholder)] ${fieldErrs.email ? "border-[var(--danger)]" : "border-[var(--border)]"}`} placeholder="you@amtdex.ye" />
        {fieldErrs.email && <p className="text-[11px] text-[var(--danger)] mt-1">{fieldErrs.email}</p>}

        <label className="block mt-3 text-[12px] font-medium text-[var(--text)]">كلمة المرور</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-[13px] outline-none bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--placeholder)] ${fieldErrs.password ? "border-[var(--danger)]" : "border-[var(--border)]"}`} placeholder="••••••••" />
        {fieldErrs.password && <p className="text-[11px] text-[var(--danger)] mt-1">{fieldErrs.password}</p>}

        <button type="submit" className="btn btn-ink brand-cta mt-6 w-full">دخول</button>

        <div className="mt-3 flex gap-2 text-[11px] text-[var(--color-text-faint)]">
          <span>أدوار للتجربة:</span>
          <code className="bg-[var(--color-card-soft)] px-1.5 py-0.5 rounded">admin</code>
          <code className="bg-[var(--color-card-soft)] px-1.5 py-0.5 rounded">editor</code>
          <code className="bg-[var(--color-card-soft)] px-1.5 py-0.5 rounded">viewer</code>
        </div>
        <a href={getMainUrl("/")} className="mt-4 block text-center text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-ink)]">← العودة للرئيسية</a>
      </form>
    </div>
  )
}
