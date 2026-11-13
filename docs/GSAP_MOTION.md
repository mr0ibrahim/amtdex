# Public site: responsive product experience

The public layout now uses a white canvas, restrained lavender surfaces, a shared 1280px maximum container, and consistent section spacing. Current purple and gold brand colors and company/CMS copy remain unchanged.

- Hero: balanced desktop columns; stacked mobile composition with a bounded dashboard preview.
- Product studio: compact story and preview layout, readable type, a chart in its own grid region, wrapping status rows, and RTL keyboard-operated tabs. Floating labels return to document flow on phones.
- Gallery: staged screen reveals; single-column cards on small phones and native horizontal scrolling at tablet widths.
- Services: two equal columns on desktop, one on phones, consistent padding and focus/hover feedback.
- Workflow: two-column desktop composition, compact step grid, and a scroll-linked progress line. Technology chips have light-surface contrast.

GSAP loads asynchronously within MarketingLayout. Heading wipe reveals, screen perspective reveals, chart growth and workflow progress have distinct roles. Desktop parallax is subtle; there is no scroll hijacking. Reduced-motion changes revert active scenes. Route changes, CMS removals and tab switches release contexts and listeners. Dashboard and auth do not mount the marketing engine.

Validation: `npm test` (79 tests), `npm run build`, `git diff --check`. The previous live design was inspected in the browser; the new local preview was blocked by browser URL policy. Local Chromium is also unavailable under the execution policy, so responsive browser QA of this revision remains unverified. Existing unrelated build warnings remain.

## Uploaded video reference pass

Reference: the user's 111-second Arabic banking-site recording. Patterns observed:
layered cards and staggered entrance, expanding card groups, scroll-driven horizontal
cards, violet feature panels, fanned testimonials, and generous white section spacing.
The adaptation uses AMTDEX product UI and a contract illustration built with HTML/CSS;
it does not reuse the reference's banking brand, payment cards or robot artwork.

Home-only visual overrides live in `resources/css/reference-cards.css`. `ProductScene`
contains native UI layers with staggered GSAP entrance. The screenshot gallery expands
its active card on desktop and keeps native button activation. The process rail pins
only with desktop fine-pointer input and no reduced-motion preference. Touch and
reduced-motion users receive an ordinary grid. GSAP owns and reverts the rail and
layer scenes on route/DOM changes. Existing stats, ratings and removed-section choices
are preserved.

Validation: 81 tests pass, TypeScript/Vite production build and diff checks pass.
Browser visual verification remains unavailable: Playwright's bundled Chromium is
absent and system Chromium exits during launch. No pixel-identical match is claimed.

## Vector card system

Six original inline SVG illustration families (web, systems, shield, contact, plan,
launch) use per-instance gradient IDs and decorative accessibility semantics.
They are used in the home process/guarantee/contact sections, public page headers,
service cards/details, About values and quote page. Shared icons retain their familiar
silhouettes and add selective duotone fills; footer contact/social icons and home
stats use SVG. Text and form controls remain native HTML.

Public card styling is centralized in vector-system.css: borders, surface depth,
hover elevation, illustration response and breakpoint adjustments. Service copy is
grouped as a single grid item to keep feature images aligned. GSAP draws illustration
strokes once in view and cleans up with its existing scene ownership. Reduced-motion
content remains visible. Gradient-reference isolation has an automated regression test.
Visual browser verification is still unavailable in this environment.

## Reference interaction pass: desktop and touch

Replace the static studio preview with three persistent project cards whose x/y,
rotation, scale and stacking order interpolate with GSAP on selection. The same
controls work on touch: horizontal pointer gestures, previous/next buttons, and RTL
keyboard tabs. Actual existing shop/CRM/booking screenshots are used, rather than
payment imagery. Vertical touch scrolling is preserved with pan-y and a direction
threshold; cancelled gestures do not select. The selected tab and text panel are
synchronized. Each selection kills owned tweens/listeners; reduced-motion changes
apply card positions immediately. Lazy GSAP import failure leaves native controls.

The hero composition now scrubs its rotation/scale/translation with scroll on phone
and desktop. Mobile screenshot cards expand vertically on selection. Testimonial
changes animate the incoming quote. These are interaction/scroll changes rather than
additional generic fade-ins. Validation: 86 tests pass; production build and diff
checks pass. Live visual verification should follow deployment.
