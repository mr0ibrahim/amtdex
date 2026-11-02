<?php

namespace App\Services\Blog;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogSetting;
use App\Models\BlogTag;
use App\Models\Project;
use App\Models\SeoMetadata;
use App\Models\Service;
use Illuminate\Support\Carbon;

class BlogSitemapBuilder
{
    public const CHUNK_SIZE = 1000;

    public static function blogBaseUrl(): string
    {
        return BlogJsonLdBuilder::blogBaseUrl();
    }

    public static function siteBaseUrl(): string
    {
        return rtrim((string) config('app.url', 'https://amtdex.com'), '/');
    }

    /**
     * Absolute URL used in robots Sitemap: directive (index).
     */
    public static function sitemapIndexUrl(): string
    {
        return self::siteBaseUrl().'/sitemap.xml';
    }

    public static function robotsTxt(): string
    {
        $sitemap = self::sitemapIndexUrl();
        $blogSitemap = self::blogBaseUrl().'/sitemap.xml';

        $stored = BlogSetting::get('robots_txt');
        if (is_string($stored) && trim($stored) !== '') {
            // Ensure Sitemap lines exist even if custom robots overrides body.
            $body = trim($stored);
            if (! str_contains($body, 'Sitemap:')) {
                $body .= "\n\nSitemap: {$sitemap}\nSitemap: {$blogSitemap}";
            }

            return $body."\n";
        }

        return <<<TXT
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /dashboard
Disallow: /login
Disallow: /403
Disallow: /api/
Disallow: /sanctum/

# Primary combined urlset (submit this exact URL in Search Console)
Sitemap: {$sitemap}

TXT;
    }

    /**
     * Single urlset with every public URL — preferred for Search Console because
     * some hosts block Googlebot on nested /sitemaps/* PHP routes (403 HTML).
     */
    public static function combinedUrlsetXml(): string
    {
        $now = now()->toAtomString();
        $urls = [];
        foreach (self::allIndexableUrls() as $loc) {
            $priority = '0.7';
            $changefreq = 'weekly';
            if (preg_match('#://[^/]+/?$#', $loc) || str_ends_with($loc, '/')) {
                $priority = '1.0';
                $changefreq = str_contains($loc, 'blog.') ? 'daily' : 'weekly';
            } elseif (str_contains($loc, '/posts/')) {
                $priority = '0.8';
            } elseif (str_contains($loc, '/services')) {
                $priority = '0.9';
            }

            $urls[] = [
                'loc' => $loc,
                'lastmod' => $now,
                'changefreq' => $changefreq,
                'priority' => $priority,
            ];
        }

        return self::urlset($urls);
    }

    /**
     * Write the combined sitemap to public/sitemap.xml so the web server can
     * serve pure XML without hitting PHP (avoids bot-protection HTML 403s).
     */
    public static function writePublicSitemap(?string $path = null): string
    {
        $path ??= public_path('sitemap.xml');
        $xml = self::combinedUrlsetXml();
        file_put_contents($path, $xml."\n");

        return $path;
    }

    public static function indexXml(): string
    {
        $now = now()->toAtomString();
        $site = self::siteBaseUrl();
        $entries = [
            ['loc' => "{$site}/sitemaps/pages.xml", 'lastmod' => $now],
        ];

        $postCount = BlogPost::published()->count();
        $chunks = max(1, (int) ceil($postCount / self::CHUNK_SIZE));
        if ($postCount === 0) {
            $entries[] = ['loc' => "{$site}/sitemaps/blog-posts.xml", 'lastmod' => $now];
        } else {
            for ($i = 1; $i <= $chunks; $i++) {
                $path = $chunks === 1
                    ? "{$site}/sitemaps/blog-posts.xml"
                    : "{$site}/sitemaps/blog-posts-{$i}.xml";
                $entries[] = ['loc' => $path, 'lastmod' => $now];
                if ($chunks === 1) {
                    break;
                }
            }
        }

        $catLast = BlogCategory::visible()->max('updated_at');
        $tagLast = BlogTag::query()->max('updated_at');
        $entries[] = [
            'loc' => "{$site}/sitemaps/blog-categories.xml",
            'lastmod' => self::atom($catLast) ?? $now,
        ];
        $entries[] = [
            'loc' => "{$site}/sitemaps/blog-tags.xml",
            'lastmod' => self::atom($tagLast) ?? $now,
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($entries as $entry) {
            $xml .= '<sitemap>';
            $xml .= '<loc>'.self::esc($entry['loc']).'</loc>';
            $xml .= '<lastmod>'.self::esc($entry['lastmod']).'</lastmod>';
            $xml .= '</sitemap>';
        }
        $xml .= '</sitemapindex>';

        return $xml;
    }

    public static function pagesXml(): string
    {
        $base = self::siteBaseUrl();
        $blog = self::blogBaseUrl();
        $now = now()->toAtomString();

        $urls = [
            ['loc' => "{$base}/", 'priority' => '1.0', 'changefreq' => 'weekly', 'lastmod' => $now],
            ['loc' => "{$base}/services", 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => $now],
            ['loc' => "{$base}/portfolio", 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => $now],
            ['loc' => "{$base}/pricing", 'priority' => '0.8', 'changefreq' => 'monthly', 'lastmod' => $now],
            ['loc' => "{$base}/about", 'priority' => '0.7', 'changefreq' => 'monthly', 'lastmod' => $now],
            ['loc' => "{$base}/contact", 'priority' => '0.7', 'changefreq' => 'monthly', 'lastmod' => $now],
            ['loc' => "{$base}/quote", 'priority' => '0.7', 'changefreq' => 'monthly', 'lastmod' => $now],
            ['loc' => "{$blog}/", 'priority' => '0.9', 'changefreq' => 'daily', 'lastmod' => $now],
        ];

        return self::urlset($urls);
    }

    /**
     * Every public absolute URL that should be announced to search engines.
     *
     * @return list<string>
     */
    public static function allIndexableUrls(): array
    {
        $urls = self::marketingPageUrls();

        $blog = self::blogBaseUrl();
        foreach (BlogPost::published()->orderBy('id')->pluck('slug') as $slug) {
            $urls[] = "{$blog}/posts/{$slug}";
        }
        foreach (BlogCategory::visible()->orderBy('id')->pluck('slug') as $slug) {
            $urls[] = "{$blog}/categories/{$slug}";
        }
        foreach (BlogTag::query()->orderBy('id')->pluck('slug') as $slug) {
            $urls[] = "{$blog}/tags/{$slug}";
        }

        try {
            foreach (Service::query()->where('is_published', true)->orderBy('id')->pluck('slug') as $slug) {
                if ($slug) {
                    $urls[] = self::siteBaseUrl().'/services/'.$slug;
                }
            }
            foreach (Project::query()->where('is_published', true)->orderBy('id')->pluck('slug') as $slug) {
                if ($slug) {
                    $urls[] = self::siteBaseUrl().'/portfolio/'.$slug;
                }
            }
        } catch (\Throwable) {
            // Tables may be missing in partial test envs.
        }

        try {
            foreach (SeoMetadata::query()->where('noindex', false)->pluck('path') as $path) {
                $path = '/'.ltrim((string) $path, '/');
                if ($path === '/' || $path === '') {
                    continue;
                }
                $urls[] = self::siteBaseUrl().rtrim($path, '/');
            }
        } catch (\Throwable) {
            // ignore
        }

        $urls = array_values(array_unique(array_filter($urls, fn ($u) => is_string($u) && $u !== '')));
        sort($urls);

        return $urls;
    }

    /**
     * @return list<string>
     */
    public static function marketingPageUrls(): array
    {
        $base = self::siteBaseUrl();
        $blog = self::blogBaseUrl();

        return [
            "{$base}/",
            "{$base}/services",
            "{$base}/portfolio",
            "{$base}/pricing",
            "{$base}/about",
            "{$base}/contact",
            "{$base}/quote",
            "{$blog}/",
        ];
    }

    public static function postsXml(int $chunk = 1): string
    {
        $chunk = max(1, $chunk);
        $blog = self::blogBaseUrl();

        $query = BlogPost::published()
            ->select('slug', 'cover_image', 'updated_at', 'published_at')
            ->orderBy('id');

        if ($chunk > 1 || BlogPost::published()->count() > self::CHUNK_SIZE) {
            $query->forPage($chunk, self::CHUNK_SIZE);
        }

        $urls = [];
        foreach ($query->get() as $post) {
            $lastmod = self::atom($post->updated_at) ?? self::atom($post->published_at) ?? now()->toAtomString();
            $entry = [
                'loc' => "{$blog}/posts/{$post->slug}",
                'lastmod' => $lastmod,
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
            if ($post->cover_image) {
                $entry['image'] = $post->cover_image;
            }
            $urls[] = $entry;
        }

        return self::urlset($urls, withImages: true);
    }

    public static function categoriesXml(): string
    {
        $blog = self::blogBaseUrl();
        $urls = [];
        foreach (BlogCategory::visible()->orderBy('id')->get(['slug', 'updated_at']) as $cat) {
            $urls[] = [
                'loc' => "{$blog}/categories/{$cat->slug}",
                'lastmod' => self::atom($cat->updated_at) ?? now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.6',
            ];
        }

        return self::urlset($urls);
    }

    public static function tagsXml(): string
    {
        $blog = self::blogBaseUrl();
        $urls = [];
        foreach (BlogTag::query()->orderBy('id')->get(['slug', 'updated_at']) as $tag) {
            $urls[] = [
                'loc' => "{$blog}/tags/{$tag->slug}",
                'lastmod' => self::atom($tag->updated_at) ?? now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.4',
            ];
        }

        return self::urlset($urls);
    }

    /**
     * Legacy single urlset used by /sitemap-blog.xml
     */
    public static function legacyBlogUrlset(): string
    {
        $blog = self::blogBaseUrl();
        $urls = [
            [
                'loc' => "{$blog}/",
                'changefreq' => 'daily',
                'priority' => '1.0',
                'lastmod' => now()->toAtomString(),
            ],
        ];

        foreach (BlogPost::published()->select('slug', 'cover_image', 'updated_at', 'published_at')->orderBy('id')->get() as $post) {
            $entry = [
                'loc' => "{$blog}/posts/{$post->slug}",
                'lastmod' => self::atom($post->updated_at) ?? self::atom($post->published_at) ?? now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
            if ($post->cover_image) {
                $entry['image'] = $post->cover_image;
            }
            $urls[] = $entry;
        }

        foreach (BlogCategory::visible()->get(['slug', 'updated_at']) as $cat) {
            $urls[] = [
                'loc' => "{$blog}/categories/{$cat->slug}",
                'lastmod' => self::atom($cat->updated_at) ?? now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.6',
            ];
        }

        foreach (BlogTag::all(['slug', 'updated_at']) as $tag) {
            $urls[] = [
                'loc' => "{$blog}/tags/{$tag->slug}",
                'lastmod' => self::atom($tag->updated_at) ?? now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.4',
            ];
        }

        return self::urlset($urls, withImages: true);
    }

    /**
     * @param  list<array<string, string>>  $urls
     */
    protected static function urlset(array $urls, bool $withImages = false): string
    {
        $ns = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
        if ($withImages) {
            $ns .= ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= "<urlset {$ns}>";
        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>'.self::esc($url['loc']).'</loc>';
            if (! empty($url['lastmod'])) {
                $xml .= '<lastmod>'.self::esc($url['lastmod']).'</lastmod>';
            }
            if (! empty($url['changefreq'])) {
                $xml .= '<changefreq>'.self::esc($url['changefreq']).'</changefreq>';
            }
            if (! empty($url['priority'])) {
                $xml .= '<priority>'.self::esc($url['priority']).'</priority>';
            }
            if ($withImages && ! empty($url['image'])) {
                $xml .= '<image:image><image:loc>'.self::esc($url['image']).'</image:loc></image:image>';
            }
            $xml .= '</url>';
        }
        $xml .= '</urlset>';

        return $xml;
    }

    protected static function esc(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }

    protected static function atom(mixed $value): ?string
    {
        if ($value instanceof Carbon) {
            return $value->toAtomString();
        }
        if (is_string($value) && $value !== '') {
            try {
                return Carbon::parse($value)->toAtomString();
            } catch (\Throwable) {
                return null;
            }
        }

        return null;
    }
}
