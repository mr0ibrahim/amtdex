import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Icon } from "@/components/ui/Icon"
import { highlightMatch, normalizeArabic } from "@/search/arabic"

export interface SearchSelectOption {
  value: string
  label: string
  /** Short secondary text shown at the end of the row: a dialling code, a currency code. */
  hint?: string
  /** Leading glyph: a flag, a currency symbol. */
  icon?: ReactNode
  /** Extra search terms that are not displayed (English names, ISO codes). */
  keywords?: string
}

export interface SearchSelectProps {
  id: string
  label?: string
  labelClassName?: string
  options: SearchSelectOption[]
  /** Controlled value. Omit and pass defaultValue for use with native form submission. */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Adds a hidden input so FormData and form.reset() keep working. */
  name?: string
  placeholder?: string
  searchPlaceholder?: string
  /** Sheet title on phones; falls back to the label. */
  title?: string
  /** Defaults to on when there are more than seven options. */
  searchable?: boolean
  required?: boolean
  disabled?: boolean
  error?: string
}

const SHEET_QUERY = "(max-width: 639px)"

/**
 * A searchable select: a popover under the field on wide screens and a bottom sheet on phones.
 * Keyboard: Enter/Space/arrows open; arrows, Home and End move; Enter picks; Escape closes.
 */
export function SearchSelect({
  id, label, labelClassName = "", options, value, defaultValue = "", onChange, name, placeholder = "اختر", searchPlaceholder = "ابحث…",
  title, searchable, required, disabled, error,
}: SearchSelectProps) {
  const [inner, setInner] = useState(defaultValue)
  const current = value ?? inner
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [sheet, setSheet] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(SHEET_QUERY).matches)
  const [place, setPlace] = useState<{ top: number; left: number; width: number; maxHeight: number; above: boolean }>()
  const trigger = useRef<HTMLButtonElement>(null)
  const hidden = useRef<HTMLInputElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const uid = useId()
  const listId = `${id}-list`
  const errorId = error ? `${id}-error` : undefined
  const withSearch = searchable ?? options.length > 7

  const selected = options.find(option => option.value === current)
  const results = useMemo(() => {
    const needle = normalizeArabic(query.trim())
    if (!needle) return options
    return options.filter(option => normalizeArabic(`${option.label} ${option.hint ?? ""} ${option.keywords ?? ""} ${option.value}`).includes(needle))
  }, [options, query])

  const close = (focus = true) => {
    setOpen(false)
    setQuery("")
    if (focus) trigger.current?.focus()
  }
  const pick = (next: string) => {
    if (value === undefined) setInner(next)
    onChange?.(next)
    close()
  }
  const show = () => {
    if (disabled) return
    setActive(Math.max(0, options.findIndex(option => option.value === current)))
    setOpen(true)
  }

  // A native reset must restore the default, as it would for a <select>.
  useEffect(() => {
    const form = hidden.current?.form
    if (!form || value !== undefined) return
    const reset = () => setInner(defaultValue)
    form.addEventListener("reset", reset)
    return () => form.removeEventListener("reset", reset)
  }, [defaultValue, value])

  useEffect(() => {
    const media = window.matchMedia?.(SHEET_QUERY)
    if (!media) return
    const sync = () => setSheet(media.matches)
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  // Popover geometry follows the field while the page scrolls or resizes.
  useLayoutEffect(() => {
    if (!open || sheet) return
    let frame = 0
    const measure = () => {
      const rect = trigger.current?.getBoundingClientRect()
      if (!rect) return
      const below = window.innerHeight - rect.bottom - 16
      const above = rect.top - 16
      const flip = below < 260 && above > below
      const width = Math.min(Math.max(rect.width, 300), window.innerWidth - 24)
      const left = Math.min(Math.max(12, rect.right - width), window.innerWidth - width - 12)
      setPlace({ top: flip ? rect.top - 8 : rect.bottom + 8, left, width, maxHeight: Math.max(220, Math.min(420, flip ? above : below)), above: flip })
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    measure()
    window.addEventListener("scroll", schedule, true)
    window.addEventListener("resize", schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule, true); window.removeEventListener("resize", schedule) }
  }, [open, sheet])

  useEffect(() => {
    if (!open) return
    // On phones the keyboard would cover half the sheet, so the search field waits for a tap there.
    const focusFrame = requestAnimationFrame(() => (withSearch && !sheet ? search.current : list.current)?.focus({ preventScroll: true }))
    const outside = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panel.current?.contains(target) && !trigger.current?.contains(target)) close(false)
    }
    document.addEventListener("pointerdown", outside)
    // The sheet covers the page; the page behind it should not scroll.
    const overflow = document.body.style.overflow
    if (sheet) document.body.style.overflow = "hidden"
    return () => { cancelAnimationFrame(focusFrame); document.removeEventListener("pointerdown", outside); document.body.style.overflow = overflow }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sheet, withSearch])

  useEffect(() => { setActive(0) }, [query])
  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView?.({ block: "nearest" })
  }, [active, open, place?.maxHeight, sheet])

  const keys = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive(index => Math.min(results.length - 1, index + 1)) }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive(index => Math.max(0, index - 1)) }
    else if (event.key === "Home") { event.preventDefault(); setActive(0) }
    else if (event.key === "End") { event.preventDefault(); setActive(results.length - 1) }
    else if (event.key === "Enter") { event.preventDefault(); if (results[active]) pick(results[active].value) }
    else if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close() }
    else if (event.key === "Tab") close(false)
  }
  const activeId = results[active] ? `${uid}-option-${active}` : undefined

  const body = open && (
    <div className={`ss-layer${sheet ? " ss-layer--sheet" : ""}`} dir="rtl">
      {sheet && <div className="ss-dim" onClick={() => close()} aria-hidden="true" />}
      <div
        ref={panel}
        className={`ss-panel${sheet ? " ss-panel--sheet" : place?.above ? " ss-panel--above" : ""}`}
        role="dialog"
        aria-label={title ?? label ?? placeholder}
        style={sheet || !place ? undefined : { top: place.top, left: place.left, width: place.width, maxHeight: place.maxHeight }}
      >
        {sheet && <div className="ss-sheet-head"><span className="ss-grip" aria-hidden="true" /><strong>{title ?? label ?? placeholder}</strong><button type="button" className="ss-close" onClick={() => close()} aria-label="إغلاق"><Icon name="close" size={18} /></button></div>}
        {withSearch && (
          <div className="ss-search">
            <Icon name="search" size={18} />
            <input
              ref={search}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={keys}
            />
            {query && <button type="button" className="ss-clear" onClick={() => { setQuery(""); search.current?.focus() }} aria-label="مسح البحث"><Icon name="close" size={14} /></button>}
          </div>
        )}
        <ul
          ref={list}
          id={listId}
          role="listbox"
          className="ss-list"
          aria-label={label ?? placeholder}
          tabIndex={withSearch && !sheet ? -1 : 0}
          aria-activedescendant={activeId}
          onKeyDown={keys}
        >
          {results.map((option, index) => (
            <li
              key={option.value}
              id={`${uid}-option-${index}`}
              role="option"
              data-index={index}
              aria-selected={option.value === current}
              className={`ss-option${index === active ? " is-active" : ""}`}
              onPointerMove={() => { if (index !== active) setActive(index) }}
              onClick={() => pick(option.value)}
            >
              {option.icon && <span className="ss-option-icon" aria-hidden="true">{option.icon}</span>}
              <span className="ss-option-label">{highlightMatch(option.label, query)}</span>
              {option.hint && <span className="ss-option-hint" dir="ltr">{option.hint}</span>}
              <span className="ss-option-check" aria-hidden="true">{option.value === current && <Icon name="check" size={16} />}</span>
            </li>
          ))}
          {!results.length && <li className="ss-empty" role="presentation">لا توجد نتائج لـ «{query}»</li>}
        </ul>
        {withSearch && <div className="ss-foot" aria-live="polite">{results.length} من {options.length}</div>}
      </div>
    </div>
  )

  return (
    <div className="ss-field">
      {label && <label htmlFor={id} className={`ss-label ${labelClassName}`}>{label}{required && <span className="text-rose-500 ms-1">*</span>}</label>}
      <button
        ref={trigger}
        id={id}
        type="button"
        className="ss-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-invalid={!!error}
        aria-describedby={errorId}
        data-value={current}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={event => { if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) { event.preventDefault(); show() } }}
      >
        {selected?.icon && <span className="ss-option-icon" aria-hidden="true">{selected.icon}</span>}
        <span className={`ss-value${selected ? "" : " is-placeholder"}`}>{selected?.label ?? placeholder}</span>
        {selected?.hint && <span className="ss-option-hint" dir="ltr">{selected.hint}</span>}
        <span className="ss-chevron" aria-hidden="true"><Icon name="chevronDown" size={18} /></span>
      </button>
      {name && <input ref={hidden} type="hidden" name={name} value={current} />}
      {error && <p id={errorId} role="alert" className="mt-1.5 text-[11px] font-semibold text-[var(--danger)]">{error}</p>}
      {body && createPortal(body, document.body)}
    </div>
  )
}
