<?php

namespace App\Support;

class PageVisibility
{
    public static function normalize(string $path): string
    {
        $path = parse_url($path, PHP_URL_PATH) ?: $path;
        $path = '/'.trim((string) $path, '/');

        return $path === '/' ? '/' : $path;
    }

    /**
     * The CMS page that owns this public path, including nested URLs such as /services/{slug}.
     */
    public static function pageFor(string $path): ?string
    {
        $path = self::normalize($path);
        $known = array_column(CmsDefaults::document()['pages'], 'path');
        if (in_array($path, $known, true)) {
            return $path;
        }
        foreach ($known as $page) {
            if ($page !== '/' && str_starts_with($path, $page.'/')) {
                return $page;
            }
        }

        return null;
    }

    /**
     * @return array<string, bool>
     */
    public static function flags(): array
    {
        $flags = [];
        foreach (CmsStore::full()['pages'] as $page) {
            $flags[$page['path']] = (bool) ($page['published'] ?? false);
        }

        return $flags;
    }

    public static function isPublished(string $path): bool
    {
        $page = self::pageFor($path);
        if ($page === null) {
            return true;
        }

        return (bool) (self::flags()[$page] ?? false);
    }

    /**
     * Payload inlined into the first HTML response. Hidden pages are omitted
     * so the client can 404 before it paints, with no second request.
     *
     * @return array<string, mixed>
     */
    public static function bootstrap(): array
    {
        $public = CmsStore::forPublic(false);

        return [
            'copy' => $public['copy'],
            'pages' => $public['pages'],
            'nav' => $public['nav'],
            'homeSections' => $public['homeSections'],
        ];
    }
}
