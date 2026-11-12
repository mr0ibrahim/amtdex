<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class CmsStore
{
    public const KEY = 'cms_document';

    public static function full(): array
    {
        return Cache::remember('cms.full', 3600, function () {
            $row = SiteSetting::query()->where('key', self::KEY)->value('value');
            $stored = is_string($row) ? json_decode($row, true) : null;

            return self::merge(is_array($stored) ? $stored : []);
        });
    }

    public static function forPublic(bool $preview = false): array
    {
        $full = self::full();
        if ($preview) {
            return $full;
        }

        $full['pages'] = array_values(array_filter($full['pages'], fn ($page) => ! empty($page['published'])));
        $published = array_column($full['pages'], 'path');
        $full['nav'] = array_values(array_filter(
            $full['nav'],
            fn ($item) => ! empty($item['visible']) && in_array($item['to'], $published, true)
        ));
        $full['homeSections'] = array_values(array_filter($full['homeSections'], fn ($section) => ! empty($section['visible'])));

        return $full;
    }

    public static function publishedPaths(): array
    {
        return array_column(self::forPublic(false)['pages'], 'path');
    }

    public static function save(array $document): array
    {
        $merged = self::merge($document);
        SiteSetting::updateOrCreate(
            ['key' => self::KEY],
            ['value' => json_encode($merged, JSON_UNESCAPED_UNICODE)]
        );
        Cache::forget('cms.full');

        return $merged;
    }

    public static function merge(array $stored): array
    {
        $defaults = CmsDefaults::document();
        $storedPages = collect($stored['pages'] ?? [])->keyBy('path');
        $pages = collect($defaults['pages'])->map(function ($page) use ($storedPages) {
            return array_merge($page, $storedPages->get($page['path'], []));
        })->values()->all();

        $storedNav = collect($stored['nav'] ?? [])->keyBy('id');
        $nav = collect($defaults['nav'])->map(function ($item) use ($storedNav) {
            return array_merge($item, $storedNav->get($item['id'], []));
        });
        if (! empty($stored['nav'])) {
            $order = array_column($stored['nav'], 'id');
            $nav = $nav->sortBy(fn ($item) => array_search($item['id'], $order, true) === false ? 999 : array_search($item['id'], $order, true));
        }

        $storedSections = collect($stored['homeSections'] ?? [])->keyBy('id');
        $sections = collect($defaults['homeSections'])->map(function ($section) use ($storedSections) {
            $override = $storedSections->get($section['id'], []);
            $section['visible'] = $override['visible'] ?? $section['visible'];
            $section['fields'] = array_merge($section['fields'], $override['fields'] ?? []);
            if (! empty($override['image'])) {
                $section['image'] = $override['image'];
            }

            return $section;
        });
        if (! empty($stored['homeSections'])) {
            $order = array_column($stored['homeSections'], 'id');
            $sections = $sections->sortBy(fn ($section) => ($i = array_search($section['id'], $order, true)) === false ? 999 : $i);
        }

        return [
            'copy' => array_merge($defaults['copy'], $stored['copy'] ?? []),
            'pages' => $pages,
            'nav' => $nav->values()->all(),
            'homeSections' => $sections->values()->all(),
        ];
    }
}
