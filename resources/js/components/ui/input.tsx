import * as React from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, id, className = "", ...props }, ref) => {
    const inputId = id ?? label ? `input-${label?.replace(/\s+/g, "-")}` : undefined
    const errorId = error && inputId ? `${inputId}-error` : undefined

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-medium">
            {label}
            {props.required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`mt-1.5 w-full bg-[var(--color-bg)] border rounded-xl px-4 py-3 text-[13px] outline-none placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-ink)]/20 transition-colors ${error ? "border-red-400 focus:border-red-400" : "border-[var(--color-border)]"} ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-[11px] text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
  label?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, id, className = "", ...props }, ref) => {
    const inputId = id ?? label ? `input-${label?.replace(/\s+/g, "-")}` : undefined
    const errorId = error && inputId ? `${inputId}-error` : undefined

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-medium">
            {label}
            {props.required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`mt-1.5 w-full bg-[var(--color-bg)] border rounded-xl px-4 py-3 text-[13px] outline-none placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-ink)]/20 resize-none transition-colors ${error ? "border-red-400 focus:border-red-400" : "border-[var(--color-border)]"} ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-[11px] text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Textarea.displayName = "Textarea"

export function Select({
  label,
  error,
  id,
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  const inputId = id ?? label ? `input-${label?.replace(/\s+/g, "-")}` : undefined
  const errorId = error && inputId ? `${inputId}-error` : undefined

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="text-[12px] font-medium">
          {label}
        </label>
      )}
      <select
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`mt-1.5 w-full bg-[var(--color-bg)] border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[var(--color-ink)]/20 transition-colors ${error ? "border-red-400" : "border-[var(--color-border)]"} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-[11px] text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
