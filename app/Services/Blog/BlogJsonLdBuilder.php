<?php

namespace App\Services\Blog;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogSetting;
use App\Models\BlogTag;

/**
 * Builds schema.org JSON-LD graphs from the same Laravel content models
 * that power the public blog API — so crawlers and the UI stay in sync.
 */
class BlogJsonLdBuilder
{
    public const DEFAULT_ORG_NAME = 'AMTDEX SOFT';

    public const DEFAULT_ORG_LOGO = 'https://amtdex.com/favicon.svg';

    public const DEFAULT_SITE_URL = 'https://amtdex.com';

    /**
     * Absolute blog base URL (scheme + subdomain), no trailing slash.
     */
    public static function blogBaseUrl(): string
    {
        $subdomain = BlogSetting::get('blog_subdomain', env('BLOG_SUBDOMAIN', 'blog.amtdex.com'));
        $appUrl = (string) config('app.url', self::DEFAULT_SITE_URL);
        $scheme = parse_url($appUrl, PHP_URL_SCHEME) ?: 'https';

        return rtrim("{$scheme}://{$subdomain}", '/');
    }

    /**
     * SEO keywords, then the legacy focus keyword, then tag names.
     *
     * @return list<string>
     */
    public static function keywordList(BlogPost $post): array
    {
        $keywords = SeoKeywords::normalize($post->seo_keywords);
        if ($keywords !== []) {
            return $keywords;
        }

        $keywords = SeoKeywords::normalize($post->focus_keyword);
        if ($keywords !== []) {
            return $keywords;
        }

        if ($post->tags && $post->tags->isNotEmpty()) {
            return SeoKeywords::normalize($post->tags->pluck('name')->all());
        }

        return [];
    }

    /**
     * Organization + WebSite (with SearchAction) for the blog home.
     *
     * @return list<array<string, mixed>>
     */
    public static function forBlogHome(?array $settings = null): array
    {
        $settings ??= BlogSetting::getAll();
        $blogUrl = self::blogBaseUrl().'/';
        $title = (string) ($settings['blog_title'] ?? 'المدونة التقنية — Amtdex');
        $description = (string) ($settings['blog_description'] ?? 'أفكار عملية وتجارب حية في هندسة البرمجيات.');

        return [
            self::organization(),
            [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                'name' => $title,
                'description' => $description,
                'url' => $blogUrl,
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => self::DEFAULT_ORG_NAME,
                    'url' => self::DEFAULT_SITE_URL,
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => self::DEFAULT_ORG_LOGO,
                    ],
                ],
                'inLanguage' => 'ar',
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => [
                        '@type' => 'EntryPoint',
                        'urlTemplate' => $blogUrl.'?q={search_term_string}',
                    ],
                    'query-input' => 'required name=search_term_string',
                ],
            ],
        ];
    }

    /**
     * BlogPosting + BreadcrumbList (+ FAQPage when faq_schema exists).
     *
     * @return list<array<string, mixed>>
     */
    public static function forPost(BlogPost $post): array
    {
        $post->loadMissing(['author:id,name,avatar,bio,social_links', 'category:id,name,slug', 'tags:id,name,slug']);

        $canonical = trim((string) ($post->canonical_url ?? ''));
        if ($canonical === '' || ! PostPublishSeoGuard::isAbsoluteUrl($canonical)) {
            $canonical = PostPublishSeoGuard::buildCanonicalUrl($post->slug);
        }

        $headline = trim((string) ($post->meta_title ?: $post->title));
        $description = trim((string) ($post->meta_description ?: $post->summary ?: $post->title));
        $image = trim((string) ($post->og_image ?: $post->cover_image ?: ''));
        if ($image === '') {
            $image = (string) (BlogSetting::get('default_og_image', 'https://amtdex.com/images/screens/projects.webp'));
        }
        $image = PostPublishSeoGuard::absolutePublicUrl($image);

        $datePublished = optional($post->published_at)->toAtomString()
            ?? optional($post->created_at)->toAtomString()
            ?? now()->toAtomString();
        $dateModified = optional($post->updated_at)->toAtomString() ?? $datePublished;

        $authorName = $post->author?->name ?: 'فريق Amtdex التقني';
        $authorUrl = data_get($post->author?->social_links, 'twitter')
            ?: data_get($post->author?->social_links, 'linkedin')
            ?: self::DEFAULT_SITE_URL;

        $schemaType = $post->schema_type ?: 'BlogPosting';
        if (! in_array($schemaType, ['BlogPosting', 'Article', 'NewsArticle', 'TechArticle'], true)) {
            $schemaType = 'BlogPosting';
        }

        $article = [
            '@context' => 'https://schema.org',
            '@type' => $schemaType,
            'headline' => $headline,
            'description' => $description,
            'image' => [$image],
            'datePublished' => $datePublished,
            'dateModified' => $dateModified,
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $canonical,
            ],
            'author' => [
                '@type' => 'Person',
                'name' => $authorName,
                'url' => $authorUrl,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => self::DEFAULT_ORG_NAME,
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => self::DEFAULT_ORG_LOGO,
                ],
            ],
            'url' => $canonical,
            'inLanguage' => 'ar',
        ];

        if ($post->category) {
            $article['articleSection'] = $post->category->name;
        }

        $keywords = self::keywordList($post);
        if ($keywords !== []) {
            $article['keywords'] = implode(', ', $keywords);
        }

        $graph = [
            $article,
            self::breadcrumbsForPost($post, $canonical),
            self::organization(),
        ];

        $faq = self::faqPage($post);
        if ($faq !== null) {
            $graph[] = $faq;
        }

        return $graph;
    }

    /**
     * @return array<string, mixed>
     */
    public static function organization(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => self::DEFAULT_ORG_NAME,
            'alternateName' => 'امتدكس سوفت للبرمجيات وتقنية المعلومات والأنظمة',
            'url' => self::DEFAULT_SITE_URL,
            'email' => 'Info@amtdex.com',
            'telephone' => '+967784440429',
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => 'إب',
                'addressCountry' => 'YE',
            ],
            'logo' => [
                '@type' => 'ImageObject',
                'url' => self::DEFAULT_ORG_LOGO,
            ],
            'sameAs' => [
                'https://www.instagram.com/amtdex/',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function breadcrumbsForPost(BlogPost $post, string $canonical): array
    {
        $items = [
            [
                '@type' => 'ListItem',
                'position' => 1,
                'name' => 'المدونة',
                'item' => self::blogBaseUrl().'/',
            ],
        ];

        if ($post->category) {
            $items[] = [
                '@type' => 'ListItem',
                'position' => 2,
                'name' => $post->category->name,
                'item' => self::blogBaseUrl().'/categories/'.$post->category->slug,
            ];
            $items[] = [
                '@type' => 'ListItem',
                'position' => 3,
                'name' => $post->title,
                'item' => $canonical,
            ];
        } else {
            $items[] = [
                '@type' => 'ListItem',
                'position' => 2,
                'name' => $post->title,
                'item' => $canonical,
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $items,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function faqPage(BlogPost $post): ?array
    {
        $faq = $post->faq_schema;
        if (! is_array($faq) || $faq === []) {
            return null;
        }

        $entities = [];
        foreach ($faq as $item) {
            $question = trim((string) ($item['question'] ?? ''));
            $answer = trim((string) ($item['answer'] ?? ''));
            if ($question === '' || $answer === '') {
                continue;
            }
            $entities[] = [
                '@type' => 'Question',
                'name' => $question,
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $answer,
                ],
            ];
        }

        if ($entities === []) {
            return null;
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $entities,
        ];
    }

    /**
     * CollectionPage + ItemList + BreadcrumbList for a category archive.
     *
     * @param  list<BlogPost>|iterable<BlogPost>  $posts
     * @return list<array<string, mixed>>
     */
    public static function forCategory(BlogCategory $category, iterable $posts = []): array
    {
        $canonical = trim((string) ($category->canonical_url ?? ''));
        if ($canonical === '' || ! PostPublishSeoGuard::isAbsoluteUrl($canonical)) {
            $canonical = TaxonomySlugService::categoryCanonical($category->slug);
        }

        $name = trim((string) ($category->meta_title ?: $category->name));
        $description = trim((string) ($category->meta_description ?: $category->description ?: "مقالات تصنيف {$category->name}"));

        return [
            [
                '@context' => 'https://schema.org',
                '@type' => 'CollectionPage',
                'name' => $name,
                'description' => $description,
                'url' => $canonical,
                'isPartOf' => [
                    '@type' => 'WebSite',
                    'name' => 'مدونة Amtdex',
                    'url' => self::blogBaseUrl().'/',
                ],
                'inLanguage' => 'ar',
            ],
            self::itemList($posts, $canonical),
            [
                '@context' => 'https://schema.org',
                '@type' => 'BreadcrumbList',
                'itemListElement' => [
                    [
                        '@type' => 'ListItem',
                        'position' => 1,
                        'name' => 'المدونة',
                        'item' => self::blogBaseUrl().'/',
                    ],
                    [
                        '@type' => 'ListItem',
                        'position' => 2,
                        'name' => $category->name,
                        'item' => $canonical,
                    ],
                ],
            ],
            self::organization(),
        ];
    }

    /**
     * CollectionPage + ItemList + BreadcrumbList for a tag archive.
     *
     * @param  list<BlogPost>|iterable<BlogPost>  $posts
     * @return list<array<string, mixed>>
     */
    public static function forTag(BlogTag $tag, iterable $posts = []): array
    {
        $canonical = TaxonomySlugService::tagCanonical($tag->slug);
        $name = trim((string) ($tag->meta_title ?: "مقالات وسم #{$tag->name}"));
        $description = trim((string) ($tag->meta_description ?: $tag->description ?: "مقالات مرتبطة بوسم #{$tag->name}"));

        return [
            [
                '@context' => 'https://schema.org',
                '@type' => 'CollectionPage',
                'name' => $name,
                'description' => $description,
                'url' => $canonical,
                'inLanguage' => 'ar',
            ],
            self::itemList($posts, $canonical),
            [
                '@context' => 'https://schema.org',
                '@type' => 'BreadcrumbList',
                'itemListElement' => [
                    [
                        '@type' => 'ListItem',
                        'position' => 1,
                        'name' => 'المدونة',
                        'item' => self::blogBaseUrl().'/',
                    ],
                    [
                        '@type' => 'ListItem',
                        'position' => 2,
                        'name' => '#'.$tag->name,
                        'item' => $canonical,
                    ],
                ],
            ],
            self::organization(),
        ];
    }

    /**
     * @param  iterable<BlogPost>  $posts
     * @return array<string, mixed>
     */
    public static function itemList(iterable $posts, string $canonical): array
    {
        $elements = [];
        $position = 1;
        foreach ($posts as $post) {
            $url = trim((string) ($post->canonical_url ?? ''));
            if ($url === '') {
                $url = PostPublishSeoGuard::buildCanonicalUrl($post->slug);
            }
            $elements[] = [
                '@type' => 'ListItem',
                'position' => $position++,
                'url' => $url,
                'name' => $post->title,
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'ItemList',
            'itemListOrder' => 'https://schema.org/ItemListOrderDescending',
            'numberOfItems' => count($elements),
            'url' => $canonical,
            'itemListElement' => $elements,
        ];
    }

    /**
     * Find the first node of a given @type in a graph.
     *
     * @param  list<array<string, mixed>>  $graph
     * @return array<string, mixed>|null
     */
    public static function findByType(array $graph, string $type): ?array
    {
        foreach ($graph as $node) {
            if (($node['@type'] ?? null) === $type) {
                return $node;
            }
        }

        return null;
    }
}
