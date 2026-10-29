import * as React from "react"

type Props = { children: React.ReactNode; fallback?: React.ReactNode }
type State = { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // لا نطبع PII — فقط نوع الخطأ
    console.error("[Amtdex ErrorBoundary]", error.message, info.componentStack?.slice(0, 500))
  }

  handleReset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="mx-auto max-w-[640px] px-6 py-16 text-center">
          <div className="size-12 rounded-full bg-[var(--color-beige)] grid place-items-center text-[20px] mx-auto">⚠</div>
          <h2 className="mt-4 text-[18px] font-bold text-[var(--color-text)]">حدث خطأ غير متوقع</h2>
          <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-muted)]">
            فشل تحميل هذا القسم. جرّب إعادة التحميل، أو ارجع للرئيسية.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="bg-[var(--color-ink)] text-white px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-black transition-colors">
              إعادة التحميل
            </button>
            <button onClick={this.handleReset} className="bg-white border border-[var(--color-border)] px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-[var(--color-bg)] transition-colors">
              المحاولة مرة أخرى
            </button>
          </div>
          {this.state.error && (
            <p className="mt-4 text-[11px] font-mono text-[var(--color-text-faint)] break-all">{this.state.error.message}</p>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
