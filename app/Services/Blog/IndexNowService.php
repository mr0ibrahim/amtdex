<?php

namespace App\Services\Blog;

use App\Models\BlogPost;
use App\Models\BlogSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IndexNowService
{
    public const BATCH_SIZE = 100;

    public static function enabled(): bool
    {
        return self::key() !== '' && (bool) config('services.indexnow.enabled', true);
    }

    public static function key(): string
    {
        $fromEnv = trim((string) config('services.indexnow.key', ''));
        if ($fromEnv !== '') {
            return $fromEnv;
        }

        try {
            $stored = BlogSetting::get('indexnow_key', '');
            if (is_string($stored) && trim($stored) !== '') {
                return trim($stored);
            }
        } catch (\Throwable) {
            // DB may be unavailable during early boot/tests.
        }

        return '';
    }

    public static function host(): string
    {
        $configured = trim((string) config('services.indexnow.host', ''));
        if ($configured !== '') {
            return $configured;
        }

        try {
            $storedHost = BlogSetting::get('indexnow_host', '');
            if (is_string($storedHost) && trim($storedHost) !== '') {
                return trim($storedHost);
            }
        } catch (\Throwable) {
            // ignore
        }

        $blogHost = parse_url(BlogJsonLdBuilder::blogBaseUrl(), PHP_URL_HOST);

        return is_string($blogHost) && $blogHost !== '' ? $blogHost : 'blog.amtdex.com';
    }

    /**
     * Ensure an IndexNow ownership key exists (env or DB). Generates one when missing.
     *
     * @return array{key: string, host: string, generated: bool, key_location: string}
     */
    public static function ensureConfigured(?string $preferredKey = null): array
    {
        $host = self::host();
        $existing = self::key();
        if ($existing !== '') {
            return [
                'key' => $existing,
                'host' => $host,
                'generated' => false,
                'key_location' => 'https://'.$host.'/'.$existing.'.txt',
            ];
        }

        $key = $preferredKey !== null && preg_match('/^[A-Za-z0-9_-]{8,128}$/', $preferredKey)
            ? $preferredKey
            : bin2hex(random_bytes(16));

        BlogSetting::set('indexnow_key', $key);
        BlogSetting::set('indexnow_host', $host);

        return [
            'key' => $key,
            'host' => $host,
            'generated' => true,
            'key_location' => 'https://'.$host.'/'.$key.'.txt',
        ];
    }

    /**
     * Notify search engines about one or more absolute URLs (best-effort).
     * URLs are grouped by host because IndexNow requires a single host per request.
     *
     * @param  list<string>  $urls
     */
    public static function submit(array $urls): bool
    {
        if (! self::enabled()) {
            return false;
        }

        $urls = array_values(array_unique(array_filter($urls, function ($url) {
            return is_string($url) && PostPublishSeoGuard::isAbsoluteUrl($url);
        })));

        if ($urls === []) {
            return false;
        }

        $byHost = [];
        foreach ($urls as $url) {
            $host = parse_url($url, PHP_URL_HOST);
            if (! is_string($host) || $host === '') {
                continue;
            }
            $byHost[$host][] = $url;
        }

        $ok = true;
        foreach ($byHost as $host => $hostUrls) {
            foreach (array_chunk($hostUrls, self::BATCH_SIZE) as $batch) {
                if (! self::submitBatch($host, $batch)) {
                    $ok = false;
                }
            }
        }

        return $ok;
    }

    /**
     * @param  list<string>  $urls
     */
    public static function submitBatch(string $host, array $urls): bool
    {
        if (! self::enabled() || $urls === []) {
            return false;
        }

        $payload = [
            'host' => $host,
            'key' => self::key(),
            'keyLocation' => 'https://'.$host.'/'.self::key().'.txt',
            'urlList' => array_values($urls),
        ];

        try {
            $response = Http::timeout(12)
                ->acceptJson()
                ->asJson()
                ->post('https://api.indexnow.org/indexnow', $payload);

            if ($response->successful() || in_array($response->status(), [200, 202], true)) {
                return true;
            }

            Log::warning('IndexNow submission failed', [
                'host' => $host,
                'status' => $response->status(),
                'body' => $response->body(),
                'count' => count($urls),
            ]);
        } catch (\Throwable $e) {
            Log::warning('IndexNow submission exception: '.$e->getMessage(), [
                'host' => $host,
                'count' => count($urls),
            ]);
        }

        return false;
    }

    public static function submitPost(BlogPost $post): bool
    {
        $canonical = trim((string) ($post->canonical_url ?? ''));
        if ($canonical === '' || ! PostPublishSeoGuard::isAbsoluteUrl($canonical)) {
            $canonical = PostPublishSeoGuard::buildCanonicalUrl($post->slug);
        }

        return self::submit([$canonical]);
    }

    /**
     * Full-site reindex: IndexNow for every public URL + sitemap ping to Google/Bing.
     *
     * @return array{
     *   ok: bool,
     *   enabled: bool,
     *   url_count: int,
     *   submitted: int,
     *   failed_batches: int,
     *   hosts: list<string>,
     *   sitemap_pings: array<string, bool>,
     *   message: string,
     *   last_reindex_at: string|null
     * }
     */
    public static function reindexSite(): array
    {
        $urls = BlogSitemapBuilder::allIndexableUrls();
        $urlCount = count($urls);
        $hosts = [];
        foreach ($urls as $url) {
            $host = parse_url($url, PHP_URL_HOST);
            if (is_string($host) && $host !== '') {
                $hosts[$host] = true;
            }
        }
        $hostList = array_keys($hosts);

        $submitted = 0;
        $failedBatches = 0;

        if (! self::enabled()) {
            $pings = self::pingSitemaps();
            $result = [
                'ok' => false,
                'enabled' => false,
                'url_count' => $urlCount,
                'submitted' => 0,
                'failed_batches' => 0,
                'hosts' => $hostList,
                'sitemap_pings' => $pings,
                'message' => 'IndexNow غير مضبوط (INDEXNOW_KEY). تم إرسال إشعار خرائط الموقع فقط إن أمكن.',
                'last_reindex_at' => null,
            ];
            self::storeLastReindex($result);

            return $result;
        }

        $byHost = [];
        foreach ($urls as $url) {
            $host = parse_url($url, PHP_URL_HOST);
            if (! is_string($host) || $host === '') {
                continue;
            }
            $byHost[$host][] = $url;
        }

        foreach ($byHost as $host => $hostUrls) {
            foreach (array_chunk($hostUrls, self::BATCH_SIZE) as $batch) {
                if (self::submitBatch($host, $batch)) {
                    $submitted += count($batch);
                } else {
                    $failedBatches++;
                }
            }
        }

        $pings = self::pingSitemaps();
        $ok = $failedBatches === 0 && $submitted > 0;
        $result = [
            'ok' => $ok,
            'enabled' => true,
            'url_count' => $urlCount,
            'submitted' => $submitted,
            'failed_batches' => $failedBatches,
            'hosts' => $hostList,
            'sitemap_pings' => $pings,
            'message' => $ok
                ? "تم إرسال {$submitted} رابطاً لمحركات البحث عبر IndexNow."
                : ($submitted > 0
                    ? "أُرسل {$submitted} رابطاً مع فشل {$failedBatches} دفعة."
                    : 'تعذر إرسال الروابط إلى IndexNow.'),
            'last_reindex_at' => now()->toIso8601String(),
        ];
        self::storeLastReindex($result);

        return $result;
    }

    /**
     * @return array<string, bool>
     */
    public static function pingSitemaps(): array
    {
        $sitemap = BlogSitemapBuilder::sitemapIndexUrl();
        $targets = [
            'google' => 'https://www.google.com/ping?sitemap='.urlencode($sitemap),
            'bing' => 'https://www.bing.com/ping?sitemap='.urlencode($sitemap),
        ];

        $out = [];
        foreach ($targets as $name => $pingUrl) {
            try {
                $response = Http::timeout(8)->get($pingUrl);
                $out[$name] = $response->successful() || in_array($response->status(), [200, 204, 301, 302], true);
            } catch (\Throwable $e) {
                Log::warning("Sitemap ping failed ({$name}): ".$e->getMessage());
                $out[$name] = false;
            }
        }

        return $out;
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function lastReindex(): ?array
    {
        $stored = BlogSetting::get('seo_last_full_reindex');

        return is_array($stored) ? $stored : null;
    }

    /**
     * @param  array<string, mixed>  $result
     */
    protected static function storeLastReindex(array $result): void
    {
        BlogSetting::set('seo_last_full_reindex', [
            'ok' => (bool) ($result['ok'] ?? false),
            'enabled' => (bool) ($result['enabled'] ?? false),
            'url_count' => (int) ($result['url_count'] ?? 0),
            'submitted' => (int) ($result['submitted'] ?? 0),
            'failed_batches' => (int) ($result['failed_batches'] ?? 0),
            'hosts' => $result['hosts'] ?? [],
            'sitemap_pings' => $result['sitemap_pings'] ?? [],
            'message' => (string) ($result['message'] ?? ''),
            'last_reindex_at' => $result['last_reindex_at'] ?? now()->toIso8601String(),
        ]);
    }
}
