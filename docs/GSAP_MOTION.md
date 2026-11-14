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

## Violet geometric cards and two-way scroll motion

Every public card now shares one skin and carries a geometric layer; every heading,
card and footer column animates in on scroll and leaves by running the same tween
backwards.

- `resources/css/geo-cards.css`: light and dark violet card surfaces, animated top
  hairline, pointer spotlight, hover lift, and the layer animations.
- `resources/js/lib/motion/geoLayer.ts`: `GEO_CARD_SELECTOR` (the list of card
  surfaces) and five SVG figures built from their equations: orbits, sine waves,
  nested polygons, Lissajous/rose curves and a plotted grid.
- `resources/js/hooks/useGeoCards.ts`: tags cards with `data-geo-card="light|dark"`,
  appends the decorative layer, runs it only while the card is on screen
  (`data-geo-live`) and tracks fine pointers. Add class `geo-card` to turn any block
  into a card; `data-geo="orbit|wave|poly|curve|grid"` picks the figure.
- `brandScenes.ts`: reveals are no longer `once`. `inOut()` plays a paused tween on
  `onEnter`/`onEnterBack` and reverses it (1.7x) on `onLeave`/`onLeaveBack`. Content
  in the first viewport starts at its end state, so nothing flashes on load. Cards
  fan in from their own side of the page on desktop and rise straight on touch.

Reduced motion and the pause toggle keep all content visible and static; the layer
is `aria-hidden` and ignores pointer events. Validation: 122 tests, type-check and
production build pass; desktop (1440px) and phone (390px) checked in Chrome on all
public pages with local fallback content.

### Direction-aware pass, touch focus and phone hero fix

- `inOut()` no longer reverses one tween. Elements enter from below when scrolling
  down and from above when scrolling up, and leave in the direction of travel
  (`mirror()` derives the upper state). Cards add depth, tilt and, on desktop, blur;
  their geometric figure drifts and turns with a scrubbed ScrollTrigger.
- A fixed scroll progress line (`[data-scroll-progress]`) is scrubbed to page scroll.
- Touch screens have no hover: `useGeoCards` marks the card crossing the middle of the
  screen with `data-geo-active`, which takes the hover look; `:active` gives press feedback.
- Phone layout: the home hero grid track could not shrink below the platform marquee's
  710px track, pushing the hero off-screen. The track is now `minmax(0,1fr)`.
  All public pages were scanned at 360px and 412px for elements wider than the viewport.

### Glass pass

`resources/css/glass.css` (loaded last): a fixed three-blob aurora (`.glass-aurora`),
frosted header and footer, translucent glass cards (backdrop blur from 1024px up only),
and a sheen band (`.geo-sheen`) that crosses a card on arrival, hover and touch focus.
Motion budget: heading shimmer, kicker halo, floating hero icons,
the custom cursor ring and the second marquee are off; the pause control sits under the
footer. Brand purples are unified (`#6a2c9f` violet, `#31144d` ink), muted text is
darker (`#675777`), and type below 14px steps up on public pages.

### Home structure

Seven blocks: hero (now carrying the product scene, two columns from 1024px), stats,
services, project showcase, workflow, testimonials, and a closing pair (guarantee +
contact). The separate intro block and the second screenshot gallery are no longer
rendered on the home page; the `intro` visibility switch now controls the hero scene.
