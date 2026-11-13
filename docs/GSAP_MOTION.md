# Public site: responsive product experience

The public layout now uses a white canvas, restrained lavender surfaces, a shared 1280px maximum container, and consistent section spacing. Current purple and gold brand colors and company/CMS copy remain unchanged.

- Hero: balanced desktop columns; stacked mobile composition with a bounded dashboard preview.
- Product studio: compact story and preview layout, readable type, a chart in its own grid region, wrapping status rows, and RTL keyboard-operated tabs. Floating labels return to document flow on phones.
- Gallery: staged screen reveals; single-column cards on small phones and native horizontal scrolling at tablet widths.
- Services: two equal columns on desktop, one on phones, consistent padding and focus/hover feedback.
- Workflow: two-column desktop composition, compact step grid, and a scroll-linked progress line. Technology chips have light-surface contrast.

GSAP loads asynchronously within MarketingLayout. Heading wipe reveals, screen perspective reveals, chart growth and workflow progress have distinct roles. Desktop parallax is subtle; there is no scroll hijacking. Reduced-motion changes revert active scenes. Route changes, CMS removals and tab switches release contexts and listeners. Dashboard and auth do not mount the marketing engine.

Validation: `npm test` (79 tests), `npm run build`, `git diff --check`. The previous live design was inspected in the browser; the new local preview was blocked by browser URL policy. Local Chromium is also unavailable under the execution policy, so responsive browser QA of this revision remains unverified. Existing unrelated build warnings remain.
