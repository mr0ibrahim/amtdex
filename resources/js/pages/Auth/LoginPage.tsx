import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "@/lib/auth"
import { z } from "zod"

const schema = z.object({
  email: z.string().trim().email("بريد صحيح مطلوب"),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل"),
})

export function LoginPage() {
  const nav = useNavigate()
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
      nav("/dashboard", { replace: true })
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "فشل تسجيل الدخول")
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-10 bg-[var(--color-lavender)]/40">
      <form onSubmit={submit} noValidate className="w-full max-w-[420px] bg-white border border-[var(--color-border)] rounded-[24px] p-6 sm:p-8 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-[var(--color-primary)]" aria-hidden />
          <span className="font-extrabold text-[16px] text-[var(--color-ink)]">AMTDEX — تسجيل الدخول</span>
        </div>
        <p className="mt-2 text-[12px] text-[var(--color-text-muted)]">لوحة التحكم — تجربة Mock. جرّب: admin@amtdex.ye / Amtdex2026!</p>

        {err && <div role="alert" className="mt-4 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl px-3 py-2">{err}</div>}

        <label className="block mt-5 text-[12px] font-medium text-[var(--color-ink)]">البريد</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-[13px] outline-none ${fieldErrs.email ? "border-red-400" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"}`} placeholder="you@amtdex.ye" />
        {fieldErrs.email && <p className="text-[11px] text-red-600 mt-1">{fieldErrs.email}</p>}

        <label className="block mt-3 text-[12px] font-medium text-[var(--color-ink)]">كلمة المرور</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-[13px] outline-none ${fieldErrs.password ? "border-red-400" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"}`} placeholder="••••••••" />
        {fieldErrs.password && <p className="text-[11px] text-red-600 mt-1">{fieldErrs.password}</p>}

        <button type="submit" className="mt-6 w-full text-white font-bold text-[13px] py-3 rounded-full hover:opacity-90 transition-opacity" style={{ background: "var(--gradient-primary)" }}>دخول</button>

        <div className="mt-3 flex gap-2 text-[11px] text-[var(--color-text-faint)]">
          <span>أدوار للتجربة:</span>
          <code className="bg-[var(--color-card-soft)] px-1.5 py-0.5 rounded">admin</code>
          <code className="bg-[var(--color-card-soft)] px-1.5 py-0.5 rounded">editor</code>
          <code className="bg-[var(--color-card-soft)] px-1.5 py-0.5 rounded">viewer</code>
        </div>
        <Link to="/" className="mt-4 block text-center text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-ink)]">← العودة للرئيسية</Link>
      </form>
    </div>
  )
}
