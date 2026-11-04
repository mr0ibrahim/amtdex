<?php

namespace App\Services\Blog;

/**
 * Normalizes the SEO keyword list stored on a blog post.
 *
 * Spaces stay inside a phrase. Commas (Latin and Arabic) and newlines separate
 * keywords. Duplicates are dropped case-insensitively, and the list is capped
 * so a long paste cannot fail validation.
 */
class SeoKeywords
{
    public const MAX_ITEMS = 40;

    public const MAX_LENGTH = 120;

    /**
     * @return list<string>
     */
    public static function normalize(mixed $value): array
    {
        $parts = self::flatten($value);
        $keywords = [];
        $seen = [];

        foreach ($parts as $part) {
            $keyword = preg_replace('/\s+/u', ' ', trim((string) $part)) ?? '';
            if ($keyword === '') {
                continue;
            }

            if (mb_strlen($keyword) > self::MAX_LENGTH) {
                $keyword = mb_substr($keyword, 0, self::MAX_LENGTH);
            }

            $key = mb_strtolower($keyword);
            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $keywords[] = $keyword;

            if (count($keywords) >= self::MAX_ITEMS) {
                break;
            }
        }

        return $keywords;
    }

    /**
     * @return list<string>
     */
    private static function flatten(mixed $value): array
    {
        if ($value === null) {
            return [];
        }

        if (is_string($value)) {
            $trim = trim($value);
            if ($trim === '') {
                return [];
            }

            if (str_starts_with($trim, '[')) {
                $decoded = json_decode($trim, true);
                if (is_array($decoded)) {
                    return self::flatten($decoded);
                }
            }

            $parts = preg_split('/[,،\n\r]+/u', $trim);

            return is_array($parts) ? array_map(strval(...), $parts) : [];
        }

        if (! is_array($value)) {
            if (is_numeric($value)) {
                return [(string) $value];
            }

            return [];
        }

        $parts = [];
        foreach ($value as $item) {
            if (is_array($item)) {
                $parts = array_merge($parts, self::flatten($item));

                continue;
            }

            if (is_string($item) || is_numeric($item)) {
                $parts = array_merge($parts, self::flatten((string) $item));
            }
        }

        return $parts;
    }
}
