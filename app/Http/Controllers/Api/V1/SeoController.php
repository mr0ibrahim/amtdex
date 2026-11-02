<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SeoMetadata;
use App\Services\Blog\BlogJsonLdBuilder;
use App\Services\Blog\BlogSitemapBuilder;
use App\Services\Blog\IndexNowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SeoController extends Controller
{
    /**
     * List all SEO metadata rules.
     */
    public function index(): JsonResponse
    {
        try {
            $seo = SeoMetadata::all(['path', 'title', 'description', 'noindex', 'og_image']);

            return response()->json([
                'data' => $seo,
            ]);
        } catch (\Throwable $e) {
            Log::warning('SeoController@index fallback: '.$e->getMessage());

            return response()->json([
                'data' => [],
                'warning' => 'Unable to read SEO from database, falling back to static config.',
            ], 200);
        }
    }

    /**
     * Live SEO tooling status: real sitemap/robots URLs + IndexNow config (no secrets beyond public key location).
     */
    public function tools(): JsonResponse
    {
        $siteBase = rtrim((string) config('app.url', BlogJsonLdBuilder::DEFAULT_SITE_URL), '/');
        $blogBase = BlogJsonLdBuilder::blogBaseUrl();
        // Auto-provision IndexNow key on first authenticated tools load when missing.
        $ensured = IndexNowService::ensureConfigured();
        $indexNowKey = $ensured['key'];
        $indexNowHost = $ensured['host'];
        $indexNowEnabled = IndexNowService::enabled();

        return response()->json([
            'site_base' => $siteBase,
            'blog_base' => $blogBase,
            'links' => [
                'robots' => $siteBase.'/robots.txt',
                'sitemap_index' => $siteBase.'/sitemap.xml',
                'sitemap_pages' => $siteBase.'/sitemaps/pages.xml',
                'sitemap_blog_posts' => $siteBase.'/sitemaps/blog-posts.xml',
                'sitemap_blog_categories' => $siteBase.'/sitemaps/blog-categories.xml',
                'sitemap_blog_tags' => $siteBase.'/sitemaps/blog-tags.xml',
                'sitemap_blog_legacy' => $siteBase.'/sitemap-blog.xml',
            ],
            'indexnow' => [
                'enabled' => $indexNowEnabled,
                'configured' => $indexNowKey !== '',
                'generated' => (bool) ($ensured['generated'] ?? false),
                'host' => $indexNowHost,
                'key_location' => $indexNowKey !== ''
                    ? 'https://'.$indexNowHost.'/'.$indexNowKey.'.txt'
                    : null,
            ],
            'last_reindex' => IndexNowService::lastReindex(),
            'url_count' => count(BlogSitemapBuilder::allIndexableUrls()),
        ]);
    }

    /**
     * Submit every public site URL to IndexNow and ping search-engine sitemaps.
     */
    public function reindex(Request $request): JsonResponse
    {
        $result = IndexNowService::reindexSite();

        AuditLog::record(
            'أرشفة كاملة للموقع عبر IndexNow: '.($result['message'] ?? ''),
            $request->user()?->email
        );

        return response()->json([
            'ok' => (bool) ($result['ok'] ?? false),
            'data' => $result,
        ], ($result['enabled'] ?? false) && ! ($result['ok'] ?? false) && ($result['submitted'] ?? 0) === 0
            ? 502
            : 200);
    }

    /**
     * Upsert SEO entry for a given path.
     */
    public function upsert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'noindex' => ['nullable', 'boolean'],
            'og_image' => ['nullable', 'string', 'max:500'],
        ]);

        $entry = SeoMetadata::updateOrCreate(
            ['path' => $validated['path']],
            [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'noindex' => (bool) ($validated['noindex'] ?? false),
                'og_image' => $validated['og_image'] ?? null,
            ]
        );

        AuditLog::record("تحديث إعدادات السيو للمسار: {$entry->path}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $entry,
        ]);
    }

    /**
     * Delete SEO entry by path.
     */
    public function destroy(Request $request): JsonResponse
    {
        $path = $request->query('path');

        if (!$path) {
            return response()->json(['message' => 'Path parameter is required'], 422);
        }

        $entry = SeoMetadata::where('path', $path)->first();
        if ($entry) {
            $entry->delete();
            AuditLog::record("حذف إعداد السيو للمسار: {$path}", $request->user()?->email);
        }

        return response()->json([
            'ok' => true,
        ]);
    }
}

