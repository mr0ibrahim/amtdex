import * as React from "react"

const fieldBase =
  "mt-1.5 w-full bg-[var(--input-bg)] text-[var(--input-text)] border rounded-xl px-4 py-3 text-[13px] outline-none transition-colors placeholder:text-[var(--placeholder)]"
const fieldOk = "border-[var(--border)] focus:border-[var(--focus-ring)]"
const fieldErr = "border-[var(--danger)] bg-[var(--danger-bg)] focus:border-[var(--danger)]"
const labelClass = "text-[12.5px] font-bold text-[var(--text)]"
const errorClass = "mt-1.5 text-[11px] font-semibold text-[var(--danger)]"

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
