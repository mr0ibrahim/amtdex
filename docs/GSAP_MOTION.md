# Public site: product studio and GSAP

- MarketingLayout loads the GSAP engine asynchronously. Route changes revert all animations and pointer listeners. Dashboard/auth layouts do not mount this engine.
- Existing `data-motion` attributes now use GSAP + ScrollTrigger: rise, fade, signal, bar and normalized SVG draw. Reveals run once with bounded delays; content remains readable if the motion module fails to load.
- `prefers-reduced-motion` disables motion and reverts active scenes. Pointer tilt and scroll parallax are desktop-only; native scrolling is preserved. Removed CMS/tab nodes release their contexts and listeners.
- ExperienceStudio adds three accessible RTL tabs: commerce, operations and bookings. All displayed figures are explicitly illustrative. Quote links use the existing CMS-aware link component.
- Studio and the original gallery share the existing `gallery` visibility/order setting. Existing sections and company copy are preserved. Typography, colors and surfaces use current site tokens.
- Hero composition and service cards are restyled in `experience.css`; other marketing pages retain their content and receive the shared reveal engine.

Validation: `npm test` (79 tests), `npm run build`, `git diff --check`.
Browser-based visual review could not run in the implementation environment because Chromium socket creation was blocked. Before merging, review at 320/375/768/1024/1440px, switch all tabs, navigate away/back, and toggle reduced motion. Check touch scrolling and quote links on a real phone. Existing Vite chunk-size/dynamic-import warnings remain outside this change.
