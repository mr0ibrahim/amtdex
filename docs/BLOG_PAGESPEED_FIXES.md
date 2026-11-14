# Blog PageSpeed fixes — 2026-11-14

Live mobile baseline: https://pagespeed.web.dev/analysis/https-blog-amtdex-com/4plu3qymj3?form_factor=mobile

- Performance 74; accessibility 97; best practices 100; SEO 92.
- FCP 0.9s; LCP 2.4s; TBT 0ms; CLS 0.404; Speed Index 5.7s.
- SEO's sole failing audit: canonical `/` is not absolute. The shared Seo component now resolves canonical paths and breadcrumb URLs against the current origin; blog home JSON-LD also uses an absolute URL.
- CLS's largest entry (0.372) was the articles section moving when featured content arrived. A matching responsive featured placeholder reserves cover/text space before the request resolves. Article skeletons now use the same card structure, metadata space, and cover aspect ratio as loaded cards. Category buttons scroll horizontally instead of adding rows after loading.
- Fixed a broad `.blog-featured img` rule that applied a 260px minimum height to the small author avatar. Cover sizing is now scoped to the cover, with explicit avatar and cover dimensions.
- Article metadata contrast increased from 4.24:1 to 5.86:1 against white, exceeding WCAG AA's 4.5:1 requirement for normal text.
- Added 80px WebP thumbnails for the four owned screenshot assets used as avatars. Only known first-party screenshot URLs are rewritten; uploaded and external media are unchanged. The live CRM avatar now uses a 958-byte thumbnail instead of its full screenshot. Applied to cards, featured article and article author profiles.
- Removed article-body CSS from blog home; article pages still load it.

Validation: 92 tests pass, including canonical URL regression, thumbnail URL safety and a delayed featured-request regression. Production TypeScript/Vite build passes. The local browser could not launch in this execution environment (socket restriction), so no local visual or numeric CLS result is claimed. The above scores are the pre-change live baseline, not post-deployment results.

After deployment, purge the host/CDN HTML cache and run PageSpeed again. Live CDN responses used a 7-day TTL for some assets even though Apache rules request a longer TTL; the deployment/CDN policy controls that behavior. Uploaded cover media is managed at runtime and was not rewritten in the repository. A score of 100 requires verification on the deployed site and is not guaranteed by passing local tests.
