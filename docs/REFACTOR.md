# Site and dashboard refactor

The public React application and staff dashboard share one Vite entry, `resources/js/app.tsx`. Laravel serves `resources/views/app.blade.php`; the retired standalone Blade pages are not routed by the application.

## Structure

| Responsibility | Location |
| --- | --- |
| Dashboard routes and staff navigation permissions | `resources/js/routing/dashboard.ts`, `dashboardRoutes.tsx` |
| Query hooks grouped by domain | `resources/js/lib/queries/` |
| Shared content collection loading and public/admin cache separation | `resources/js/lib/queries/collection.ts` |
| Services and projects screens | `resources/js/pages/Dashboard/Content/ServicesTab.tsx`, `ProjectsTab.tsx` |
| Project editor state, validation and uploads | `resources/js/pages/Dashboard/Content/useProjectEditor.ts` |
| Project editor fields | `resources/js/pages/Dashboard/Content/ProjectEditor.tsx` |
| Blog categories, tags, comments, redirects and settings | Separate tab files under `resources/js/pages/Dashboard/Blog/` |
| Reusable modal focus/scroll management and query errors | `resources/js/components/ui/Modal.tsx`, `QueryError.tsx` |
| Administrative collection endpoint | `app/Http/Controllers/Api/V1/AdminContentController.php` |

The old content page was 1,210 lines; its coordinator is now 33 lines. The 670-line blog coordinator is now 131 lines. Their forms and business logic live in dedicated modules. Tabs load on demand; the rich article editor loads only when an editor is opened, rather than with the post list.

## Correctness changes

- Staff reads use authenticated `/api/v1/admin/content/{resource}` endpoints. Editors can see drafts and inactive records even when a public page is disabled. Public reads retain publication filters. Allowed resource names and roles are restricted on the server.
- Public and administrative collections have distinct cache keys. A successful empty collection remains empty. Administrative errors do not fall back to seed data.
- Failed writes stay failures. A missing update target does not silently create a new record. Slug changes update the original URL before adopting the new slug.
- Project uploads merge into the latest editor state and ignore responses from an editor that was closed or replaced.
- Login always uses the server; simulated credentials and login hints were removed from application code. Test fixtures live under `tests/`.
- Session snapshots are stable for React subscriptions. Navigation uses the same role metadata as dashboard routes.
- Contact and quote submissions no longer duplicate personal data in an unused browser-side leads store.
- Blog mutation errors are displayed; taxonomy/comment changes invalidate the summary statistics. Duplicate toast notifications were removed.

## Removed code

The cleanup removes the obsolete legacy dashboard (the URL redirects to the current dashboard), unrouted pricing screens and hooks, unused home sections, unused UI/motion components, the retired Blade site/partials and its stylesheet/synchronization script, and obsolete local content/leads stores. A TypeScript dependency walk verifies that remaining application modules are reachable from the Vite entry, including literal dynamic imports and type imports. Test files and declarations are excluded from unused-module failures. This check does not claim to prove individual exports or arbitrary CMS-authored selectors unused.

Database migrations, persisted content, registered Laravel auth/team infrastructure, public media and existing hashed build assets are retained. Removing those based only on frontend imports could break server features or cached clients.

## Validation and release

Run `npm ci`, `npm run check`, `npm test`, and `npm run build`. `npm run check` runs TypeScript, lint, and the unused-module check. Lint excludes compiled build artifacts.

The change adds frontend regressions for staff collections, empty results, failed writes, slug updates, modal focus, reactive session snapshots, navigation roles and asynchronous uploads. `tests/Feature/AdminContentTest.php` covers server authorization and visibility-independent staff reads. PHP and Composer are unavailable in this environment, so the Laravel feature suite must run in a PHP-enabled environment before release. Browser visual/FPS validation was also unavailable in this environment.

Only source changes belong in this refactor commit. Build and deploy the frontend together with the new Laravel route/controller; old JavaScript cannot use the new administrative collection boundary. No production database changes or live deployment were performed.
