<?php

namespace App\Services\Blog;

use App\Models\BlogPost;
use App\Models\BlogSetting;

/**
 * Validates and enriches SEO fields required before a blog post can be published.
 * Draft/scheduled/archived statuses skip these checks.
 */
class PostPublishSeoGuard
{
    public const TITLE_MAX = 60;

    public const DESCRIPTION_MIN = 50;

    public const DESCRIPTION_MAX = 160;

    /**
     * Merge request payload over an existing post (for partial updates / quick publish).
     *
     * @param  array<string, mixed>  $incoming
     * @return array<string, mixed>
     */
    public static function resolve(array $incoming, ?BlogPost $existing = null): array
    {
        $base = $existing ? [
            'title' => $existing->title,
            'slug' => $existing->slug,
            'summary' => $existing->summary,
            'content' => $existing->content,
            'cover_image' => $existing->cover_image,
            'cover_image_alt' => $existing->cover_image_alt,
            'status' => $existing->status,
            'meta_title' => $existing->meta_title,
            'meta_description' => $existing->meta_description,
            'canonical_url' => $existing->canonical_url,
            'og_title' => $existing->og_title,
            'og_description' => $existing->og_description,
            'og_image' => $existing->og_image,
            'twitter_title' => $existing->twitter_title,
            'twitter_description' => $existing->twitter_description,
            'twitter_image' => $existing->twitter_image,
        ] : [];

        foreach ($incoming as $key => $value) {
            $base[$key] = $value;
        }

        return $base;
    }

    /**
     * @param  array<string, mixed>  $incoming
     * @return array<string, array<int, string>>  Laravel-style validation messages
     */
    public static function validate(array $incoming, ?BlogPost $existing = null): array
    {
        $data = self::resolve($incoming, $existing);
        $errors = [];

        $seoTitle = self::effectiveTitle($data);
        if ($seoTitle === '') {
            $errors['meta_title'][] = 'عنوان SEO مطلوب قبل النشر (meta_title أو عنوان المقال).';
        } elseif (mb_strlen($seoTitle) > self::TITLE_MAX) {
            $errors['meta_title'][] = 'عنوان SEO يجب ألا يتجاوز '.self::TITLE_MAX.' حرفاً (حالياً: '.mb_strlen($seoTitle).').';
        }

        $seoDescription = self::effectiveDescription($data);
        if ($seoDescription === '') {
            $errors['meta_description'][] = 'وصف SEO مطلوب قبل النشر (meta_description أو ملخص المقال).';
        } else {
            $len = mb_strlen($seoDescription);
            if ($len < self::DESCRIPTION_MIN) {
                $errors['meta_description'][] = 'وصف SEO قصير جداً (الحد الأدنى '.self::DESCRIPTION_MIN.' حرفاً، حالياً: '.$len.').';
            } elseif ($len > self::DESCRIPTION_MAX) {
                $errors['meta_description'][] = 'وصف SEO طويل جداً (الحد الأقصى '.self::DESCRIPTION_MAX.' حرفاً، حالياً: '.$len.').';
            }
        }

        $image = self::effectiveImage($data);
        if ($image === '') {
            $errors['og_image'][] = 'صورة المشاركة (og_image) أو صورة الغلاف مطلوبة قبل النشر.';
        }

        $canonical = trim((string) ($data['canonical_url'] ?? ''));
        if ($canonical === '') {
            $slug = trim((string) ($data['slug'] ?? ''));
            if ($slug === '') {
                $errors['canonical_url'][] = 'الرابط الأساسي (canonical) مطلوب، أو وفّر slug لتوليده تلقائياً.';
            }
        } elseif (! self::isAbsoluteUrl($canonical)) {
            $errors['canonical_url'][] = 'الرابط الأساسي (canonical) يجب أن يكون مطلقاً ويبدأ بـ http:// أو https://.';
        }

        return $errors;
    }

    /**
     * Fill missing SEO fields from fallbacks / generated canonical before save.
     *
     * @param  array<string, mixed>  $incoming
     * @return array<string, mixed>  Fields to merge into the save payload
     */
    public static function enrich(array $incoming, ?BlogPost $existing = null): array
    {
        $data = self::resolve($incoming, $existing);
        $out = [];

        $seoTitle = self::effectiveTitle($data);
        if (empty($data['meta_title']) && $seoTitle !== '') {
            $out['meta_title'] = mb_substr($seoTitle, 0, self::TITLE_MAX);
        }

        $seoDescription = self::effectiveDescription($data);
        if (empty($data['meta_description']) && $seoDescription !== '') {
            $out['meta_description'] = mb_substr($seoDescription, 0, self::DESCRIPTION_MAX);
        }

        $slug = trim((string) ($data['slug'] ?? ''));
        $canonical = trim((string) ($data['canonical_url'] ?? ''));
        if ($canonical === '' && $slug !== '') {
            $out['canonical_url'] = self::buildCanonicalUrl($slug);
        }

        $image = self::effectiveImage($data);
        if (empty($data['og_image']) && $image !== '') {
            $out['og_image'] = $image;
        }

        if (empty($data['og_title']) && $seoTitle !== '') {
            $out['og_title'] = $seoTitle;
        }

        if (empty($data['og_description']) && $seoDescription !== '') {
            $out['og_description'] = mb_substr($seoDescription, 0, self::DESCRIPTION_MAX);
        }

        if (empty($data['twitter_title']) && $seoTitle !== '') {
            $out['twitter_title'] = $seoTitle;
        }

        if (empty($data['twitter_description']) && $seoDescription !== '') {
            $out['twitter_description'] = mb_substr($seoDescription, 0, self::DESCRIPTION_MAX);
        }

        if (empty($data['twitter_image']) && $image !== '') {
            $out['twitter_image'] = $image;
        }

        return $out;
    }

    public static function buildCanonicalUrl(string $slug): string
    {
        $subdomain = BlogSetting::get('blog_subdomain', env('BLOG_SUBDOMAIN', 'blog.amtdex.com'));
        $appUrl = (string) config('app.url', 'https://amtdex.com');
        $scheme = parse_url($appUrl, PHP_URL_SCHEME) ?: 'https';

        return rtrim("{$scheme}://{$subdomain}", '/').'/posts/'.ltrim($slug, '/');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function effectiveTitle(array $data): string
    {
        $meta = trim((string) ($data['meta_title'] ?? ''));
        if ($meta !== '') {
            return $meta;
        }

        return trim((string) ($data['title'] ?? ''));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function effectiveDescription(array $data): string
    {
        $meta = trim((string) ($data['meta_description'] ?? ''));
        if ($meta !== '') {
            return $meta;
        }

        return trim((string) ($data['summary'] ?? ''));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function effectiveImage(array $data): string
    {
        $og = trim((string) ($data['og_image'] ?? ''));
        if ($og !== '') {
            return $og;
        }

        return trim((string) ($data['cover_image'] ?? ''));
    }

    public static function isAbsoluteUrl(string $url): bool
    {
        return (bool) preg_match('#^https?://#i', $url);
    }
}
