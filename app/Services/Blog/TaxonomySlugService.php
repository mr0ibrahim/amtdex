<?php

namespace App\Services\Blog;

use App\Models\BlogCategory;
use App\Models\BlogRedirect;
use App\Models\BlogTag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaxonomySlugService
{
    /**
     * Build a clean URL slug that keeps Arabic letters when Latin slug would be empty.
     */
    public static function makeSlug(string $value): string
    {
        $slug = Str::slug($value);
        if ($slug !== '') {
            return $slug;
        }

        $slug = preg_replace('/\s+/u', '-', trim($value)) ?? '';
        $slug = preg_replace('/[^\p{L}\p{N}\-_]+/u', '', $slug) ?? '';
        $slug = mb_strtolower(trim($slug, '-_'));

        return $slug !== '' ? $slug : 'item-'.substr(md5($value), 0, 8);
    }

    /**
     * Ensure uniqueness within categories or tags.
     *
     * @param  class-string<Model>  $modelClass
     */
    public static function uniqueSlug(string $modelClass, string $slug, ?int $ignoreId = null): string
    {
        $base = self::makeSlug($slug);
        $candidate = $base;
        $counter = 1;

        while (
            $modelClass::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = "{$base}-{$counter}";
            $counter++;
        }

        return $candidate;
    }

    public static function uniqueCategorySlug(string $slug, ?int $ignoreId = null): string
    {
        return self::uniqueSlug(BlogCategory::class, $slug, $ignoreId);
    }

    public static function uniqueTagSlug(string $slug, ?int $ignoreId = null): string
    {
        return self::uniqueSlug(BlogTag::class, $slug, $ignoreId);
    }

    /**
     * Create/update a 301 redirect when taxonomy slug changes.
     */
    public static function redirectOnSlugChange(string $prefix, string $oldSlug, string $newSlug): void
    {
        $oldSlug = trim($oldSlug, '/');
        $newSlug = trim($newSlug, '/');

        if ($oldSlug === '' || $newSlug === '' || $oldSlug === $newSlug) {
            return;
        }

        $prefix = '/'.trim($prefix, '/');
        $source = "{$prefix}/{$oldSlug}";
        $target = "{$prefix}/{$newSlug}";

        BlogRedirect::updateOrCreate(
            ['source_path' => $source],
            ['target_path' => $target, 'status_code' => 301]
        );

        // Avoid redirect loops: if something pointed at the old slug, retarget it.
        BlogRedirect::where('target_path', $source)->update(['target_path' => $target]);
    }

    public static function categoryCanonical(string $slug): string
    {
        return BlogJsonLdBuilder::blogBaseUrl().'/categories/'.ltrim($slug, '/');
    }

    public static function tagCanonical(string $slug): string
    {
        return BlogJsonLdBuilder::blogBaseUrl().'/tags/'.ltrim($slug, '/');
    }
}
