import * as React from "react"

const fieldBase =
  "mt-1.5 w-full bg-[var(--color-card-soft)]/30 border rounded-xl px-4 py-3 text-[13px] outline-none transition-colors placeholder:text-[var(--color-text-faint)]"
const fieldOk = "border-[var(--color-border)] focus:border-[var(--color-primary)]"
const fieldErr = "border-rose-400 bg-rose-50/20 focus:border-rose-400"
const labelClass = "text-[12.5px] font-bold text-[var(--color-ink)]"
const errorClass = "mt-1.5 text-[11px] font-semibold text-rose-500"

function fieldId(id: string | undefined, label: string | undefined) {
  if (id) return id
  if (label) return `input-${label.replace(/\s+/g, "-")}`
  return undefined
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, id, className = "", required, ...props }, ref) => {
    const inputId = fieldId(id, label)
    const errorId = error && inputId ? `${inputId}-error` : undefined

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
            {required && <span className="text-rose-500 ms-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`${fieldBase} ${error ? fieldErr : fieldOk} ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className={errorClass}>
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
  ({ error, label, id, className = "", required, ...props }, ref) => {
    const inputId = fieldId(id, label)
    const errorId = error && inputId ? `${inputId}-error` : undefined

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
            {required && <span className="text-rose-500 ms-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`${fieldBase} resize-none ${error ? fieldErr : fieldOk} ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className={errorClass}>
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
  required,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  const inputId = fieldId(id, label)
  const errorId = error && inputId ? `${inputId}-error` : undefined

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className={labelClass}>
          {label}
          {required && <span className="text-rose-500 ms-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`${fieldBase} ${error ? fieldErr : fieldOk} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} role="alert" className={errorClass}>
          {error}
        </p>
      )}
    </div>
  )
}
