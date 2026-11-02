<?php

namespace App\Services\Blog;

use App\Models\BlogPost;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IndexNowService
{
    public static function enabled(): bool
    {
        $key = (string) config('services.indexnow.key', '');

        return $key !== '' && (bool) config('services.indexnow.enabled', true);
    }

    public static function key(): string
    {
        return (string) config('services.indexnow.key', '');
    }

    public static function host(): string
    {
        $configured = trim((string) config('services.indexnow.host', ''));
        if ($configured !== '') {
            return $configured;
        }

        $blogHost = parse_url(BlogJsonLdBuilder::blogBaseUrl(), PHP_URL_HOST);

        return is_string($blogHost) && $blogHost !== '' ? $blogHost : 'blog.amtdex.com';
    }

    /**
     * Notify search engines about one or more absolute URLs (best-effort).
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

        $payload = [
            'host' => self::host(),
            'key' => self::key(),
            'keyLocation' => 'https://'.self::host().'/'.self::key().'.txt',
            'urlList' => $urls,
        ];

        try {
            $response = Http::timeout(8)
                ->acceptJson()
                ->asJson()
                ->post('https://api.indexnow.org/indexnow', $payload);

            if ($response->successful() || in_array($response->status(), [200, 202], true)) {
                return true;
            }

            Log::warning('IndexNow submission failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'urls' => $urls,
            ]);
        } catch (\Throwable $e) {
            Log::warning('IndexNow submission exception: '.$e->getMessage(), ['urls' => $urls]);
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
}
