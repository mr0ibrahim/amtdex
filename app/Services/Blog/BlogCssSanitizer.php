<?php

namespace App\Services\Blog;

/**
 * Sanitizes inline styles and stylesheets stored with a blog post.
 *
 * Remote stylesheets are not fetched. `<link rel="stylesheet">` is ignored by
 * the HTML importer because those URLs can track readers or ship hostile rules.
 * `@import` is stripped for the same reason. Stored CSS stays unscoped; the
 * editor and the public page prefix selectors with the post wrapper.
 */
class BlogCssSanitizer
{
    private const MAX_CSS = 100000;

    private const MAX_VALUE = 800;

    /** @var list<string> */
    private const EXACT = [
        'color', 'background', 'border', 'outline', 'font', 'flex', 'grid', 'gap',
        'margin', 'padding', 'width', 'height', 'display', 'position', 'top', 'right',
        'bottom', 'left', 'inset', 'float', 'clear', 'overflow', 'opacity', 'visibility',
        'z-index', 'direction', 'cursor', 'transform', 'filter', 'transition', 'animation',
        'object-fit', 'object-position', 'vertical-align', 'text-align', 'text-decoration',
        'text-transform', 'text-indent', 'text-shadow', 'white-space', 'word-break',
        'line-height', 'letter-spacing', 'word-spacing', 'list-style', 'list-style-type',
        'list-style-position', 'list-style-image', 'table-layout', 'border-collapse',
        'border-spacing', 'caption-side', 'empty-cells', 'box-sizing', 'box-shadow',
        'border-radius', 'aspect-ratio', 'order', 'columns', 'column-count', 'column-width',
        'column-gap', 'column-span', 'column-rule', 'align-items', 'align-content',
        'align-self', 'justify-content', 'justify-items', 'justify-self', 'place-items',
        'place-content', 'place-self', 'row-gap', 'min-width', 'max-width', 'min-height',
        'max-height', 'unicode-bidi', 'isolation', 'mix-blend-mode', 'pointer-events',
        'user-select', 'text-overflow', 'hyphens', 'break-inside', 'clip-path',
        'backdrop-filter', 'transform-origin', 'flex-grow', 'flex-shrink', 'flex-basis',
        'flex-direction', 'flex-wrap', 'flex-flow', 'grid-template', 'grid-template-columns',
        'grid-template-rows', 'grid-template-areas', 'grid-column', 'grid-row', 'grid-area',
        'grid-auto-flow', 'grid-auto-columns', 'grid-auto-rows', 'src', 'unicode-range',
        'font-display', 'line-clamp', '-webkit-line-clamp', '-webkit-box-orient',
    ];

    /** @var list<string> */
    private const PREFIXES = [
        'background-', 'border-', 'outline-', 'font-', 'margin-', 'padding-', 'text-',
        'flex-', 'grid-', 'align-', 'justify-', 'place-', 'overflow-', 'inset-',
        'column-', 'animation-', 'transition-', 'mask-', 'scroll-', 'row-',
    ];

    public static function sanitize(?string $css): string
    {
        return self::render(self::prepare($css), null);
    }

    public static function scope(?string $css, string $scope): string
    {
        $scope = trim($scope);
        if (! preg_match('/^\.[A-Za-z_][\w-]*(?:\.[A-Za-z_][\w-]*)*$/', $scope)) {
            return '';
        }

        return self::render(self::prepare($css), $scope);
    }

    public static function sanitizeInline(?string $style): string
    {
        $kept = [];
        foreach (self::splitDeclarations((string) $style) as $part) {
            $decl = self::declaration($part);
            if ($decl !== null) {
                $kept[] = $decl;
            }
        }

        return implode('; ', $kept);
    }

    public static function sanitizeClass(?string $value): string
    {
        $kept = [];
        $seen = [];
        foreach (preg_split('/\s+/u', trim((string) $value)) ?: [] as $token) {
            if ($token === '' || isset($seen[$token]) || strlen($token) > 120) {
                continue;
            }
            if (! preg_match('/^[\p{L}_][\p{L}\p{N}_:\-\[\]%.#()\/*,]*$/u', $token)) {
                continue;
            }
            if (preg_match('/javascript|expression|url\s*\(|[<>{}"\'\\\\]/i', $token)) {
                continue;
            }
            $parts = explode(':', $token);
            $bare = ltrim((string) end($parts), '!');
            if (preg_match('/^(fixed|sticky)$/i', $bare)) {
                continue;
            }
            $seen[$token] = true;
            $kept[] = $token;
            if (count($kept) >= 40) {
                break;
            }
        }

        return implode(' ', $kept);
    }

    public static function sanitizeId(?string $value): string
    {
        $id = trim((string) $value);
        if (! preg_match('/^[\p{L}_][\p{L}\p{N}_-]{0,80}$/u', $id)) {
            return '';
        }

        return $id;
    }

    private static function prepare(?string $css): string
    {
        $css = (string) $css;
        $css = preg_replace('/\/\*[\s\S]*?\*\//', '', $css) ?? $css;
        $css = str_replace(['<!--', '-->'], '', $css);
        $css = preg_replace('/@import\b[^;{]*;?/i', '', $css) ?? $css;
        if (strlen($css) > self::MAX_CSS) {
            $css = substr($css, 0, self::MAX_CSS);
        }

        return $css;
    }

    private static function render(string $css, ?string $scope, bool $inKeyframes = false): string
    {
        $out = [];
        $i = 0;
        $n = strlen($css);

        while ($i < $n) {
            while ($i < $n && preg_match('/\s/', $css[$i])) {
                $i++;
            }
            if ($i >= $n) {
                break;
            }
            if ($css[$i] === '}') {
                $i++;

                continue;
            }

            $start = $i;
            $quote = null;
            $paren = 0;
            $found = 'end';
            while ($i < $n) {
                $char = $css[$i];
                if ($quote !== null) {
                    if ($char === '\\') {
                        $i += 2;

                        continue;
                    }
                    if ($char === $quote) {
                        $quote = null;
                    }
                    $i++;

                    continue;
                }
                if ($char === "'" || $char === '"') {
                    $quote = $char;
                    $i++;

                    continue;
                }
                if ($char === '(') {
                    $paren++;
                    $i++;

                    continue;
                }
                if ($char === ')') {
                    $paren = max(0, $paren - 1);
                    $i++;

                    continue;
                }
                if ($paren === 0 && ($char === ';' || $char === '{')) {
                    $found = $char === ';' ? 'semi' : 'brace';
                    break;
                }
                $i++;
            }

            $prelude = trim(substr($css, $start, $i - $start));
            if ($found === 'end') {
                if (! $inKeyframes && $prelude !== '' && ! str_starts_with($prelude, '@')) {
                    $decl = self::declaration($prelude);
                    if ($decl !== null) {
                        $out[] = $decl.';';
                    }
                }
                break;
            }
            $i++;
            if ($found === 'semi') {
                if (! str_starts_with($prelude, '@') && ! $inKeyframes) {
                    $decl = self::declaration($prelude);
                    if ($decl !== null) {
                        $out[] = $decl.';';
                    }
                }

                continue;
            }

            $bodyStart = $i;
            $depth = 1;
            $quote = null;
            while ($i < $n && $depth > 0) {
                $char = $css[$i];
                if ($quote !== null) {
                    if ($char === '\\') {
                        $i += 2;

                        continue;
                    }
                    if ($char === $quote) {
                        $quote = null;
                    }
                    $i++;

                    continue;
                }
                if ($char === "'" || $char === '"') {
                    $quote = $char;
                    $i++;

                    continue;
                }
                if ($char === '{') {
                    $depth++;
                } elseif ($char === '}') {
                    $depth--;
                }
                $i++;
            }
            $body = substr($css, $bodyStart, max(0, $i - 1 - $bodyStart));
            if ($prelude === '' || preg_match('/[<>]|javascript\s*:|expression\s*\(|-moz-binding|@import/i', $prelude)) {
                continue;
            }

            if (str_starts_with($prelude, '@')) {
                $name = '';
                if (preg_match('/^@([\w-]+)/', $prelude, $match)) {
                    $name = strtolower($match[1]);
                }
                if (in_array($name, ['import', 'charset', 'namespace'], true)) {
                    continue;
                }
                if ($name === 'keyframes' || $name === '-webkit-keyframes') {
                    $inner = self::render($body, null, true);
                    if ($inner !== '') {
                        $out[] = $prelude.'{'.$inner.'}';
                    }

                    continue;
                }
                if (in_array($name, ['media', 'supports', 'container', 'layer', 'document'], true)) {
                    $inner = self::render($body, $scope, false);
                    if ($inner !== '') {
                        $out[] = $prelude.'{'.$inner.'}';
                    }

                    continue;
                }
                if ($name === 'font-face' || $name === 'page') {
                    $inner = self::render($body, null, false);
                    if ($inner !== '') {
                        $out[] = $prelude.'{'.$inner.'}';
                    }
                }

                continue;
            }

            if ($inKeyframes) {
                $selectors = array_values(array_filter(
                    self::splitSelectors($prelude),
                    fn (string $item): bool => (bool) preg_match('/^(from|to|\d+(?:\.\d+)?%)$/i', $item)
                ));
                $inner = self::render($body, null, false);
                if ($selectors !== [] && $inner !== '') {
                    $out[] = implode(',', $selectors).'{'.$inner.'}';
                }

                continue;
            }

            $selectors = [];
            foreach (self::splitSelectors($prelude) as $selector) {
                $next = $scope === null ? trim($selector) : self::prefixSelector($selector, $scope);
                if ($next !== '') {
                    $selectors[] = $next;
                }
            }
            $inner = self::render($body, null, false);
            if ($selectors !== [] && $inner !== '') {
                $out[] = implode(',', $selectors).'{'.$inner.'}';
            }
        }

        $rendered = str_ireplace('position: fixed', 'position: absolute', implode('', $out));
        $rendered = preg_replace('/position\s*:\s*fixed/i', 'position: absolute', $rendered) ?? $rendered;

        return trim($rendered);
    }

    private static function prefixSelector(string $selector, string $scope): string
    {
        $selector = trim($selector);
        if ($selector === '' || preg_match('/[<>]|javascript\s*:|expression\s*\(|-moz-binding|@import/i', $selector)) {
            return '';
        }
        if (
            $selector === $scope
            || str_starts_with($selector, $scope.' ')
            || str_starts_with($selector, $scope.'.')
            || str_starts_with($selector, $scope.'#')
            || str_starts_with($selector, $scope.':')
            || str_starts_with($selector, $scope.'[')
        ) {
            return $selector;
        }

        $selector = preg_replace('/:root|:host/i', ' ', $selector) ?? $selector;
        $selector = preg_replace('/\b(?:html|body)\b/i', ' ', $selector) ?? $selector;
        $selector = preg_replace('/\s+/', ' ', $selector) ?? $selector;
        $selector = preg_replace('/\s*([>+~])\s*/', ' $1 ', $selector) ?? $selector;
        $selector = trim($selector, " \t\n\r\0\x0B>+~");
        if ($selector === '') {
            return $scope;
        }

        return $scope.' '.$selector;
    }

    /**
     * @return list<string>
     */
    private static function splitSelectors(string $input): array
    {
        $out = [];
        $current = '';
        $paren = 0;
        $bracket = 0;
        $quote = null;
        $length = strlen($input);
        for ($i = 0; $i < $length; $i++) {
            $char = $input[$i];
            if ($quote !== null) {
                $current .= $char;
                if ($char === '\\' && $i + 1 < $length) {
                    $current .= $input[++$i];

                    continue;
                }
                if ($char === $quote) {
                    $quote = null;
                }

                continue;
            }
            if ($char === "'" || $char === '"') {
                $quote = $char;
                $current .= $char;

                continue;
            }
            if ($char === '(') {
                $paren++;
            } elseif ($char === ')') {
                $paren = max(0, $paren - 1);
            } elseif ($char === '[') {
                $bracket++;
            } elseif ($char === ']') {
                $bracket = max(0, $bracket - 1);
            } elseif ($char === ',' && $paren === 0 && $bracket === 0) {
                if (trim($current) !== '') {
                    $out[] = trim($current);
                }
                $current = '';

                continue;
            }
            $current .= $char;
        }
        if (trim($current) !== '') {
            $out[] = trim($current);
        }

        return $out;
    }

    /**
     * @return list<string>
     */
    private static function splitDeclarations(string $style): array
    {
        $parts = [];
        $current = '';
        $quote = null;
        $paren = 0;
        $length = strlen($style);
        for ($i = 0; $i < $length; $i++) {
            $char = $style[$i];
            if ($quote !== null) {
                $current .= $char;
                if ($char === '\\' && $i + 1 < $length) {
                    $current .= $style[++$i];

                    continue;
                }
                if ($char === $quote) {
                    $quote = null;
                }

                continue;
            }
            if ($char === "'" || $char === '"') {
                $quote = $char;
                $current .= $char;

                continue;
            }
            if ($char === '(') {
                $paren++;
            } elseif ($char === ')' && $paren > 0) {
                $paren--;
            } elseif ($char === ';' && $paren === 0) {
                if (trim($current) !== '') {
                    $parts[] = trim($current);
                }
                $current = '';

                continue;
            }
            $current .= $char;
        }
        if (trim($current) !== '') {
            $parts[] = trim($current);
        }

        return $parts;
    }

    private static function declaration(string $part): ?string
    {
        $idx = strpos($part, ':');
        if ($idx === false || $idx === 0) {
            return null;
        }
        $prop = strtolower(trim(substr($part, 0, $idx)));
        if (! self::allowedProperty($prop)) {
            return null;
        }
        $value = self::cleanValue($prop, substr($part, $idx + 1));
        if ($value === null) {
            return null;
        }

        return $prop.': '.$value;
    }

    private static function allowedProperty(string $prop): bool
    {
        if ($prop === '' || $prop === 'behavior' || str_contains($prop, 'binding')) {
            return false;
        }
        if (str_starts_with($prop, '--')) {
            return (bool) preg_match('/^--[a-z0-9_-]{1,64}$/i', $prop);
        }
        if (in_array($prop, self::EXACT, true)) {
            return true;
        }
        $bare = str_starts_with($prop, '-webkit-') ? substr($prop, 8) : $prop;
        if (in_array($bare, self::EXACT, true)) {
            return true;
        }
        foreach (self::PREFIXES as $prefix) {
            if (str_starts_with($prop, $prefix) && preg_match('/^[a-z0-9-]+$/i', substr($prop, strlen($prefix)))) {
                return true;
            }
        }

        return false;
    }

    private static function cleanValue(string $prop, string $raw): ?string
    {
        $value = trim(preg_replace('/\s+/', ' ', $raw) ?? '');
        if ($value === '' || strlen($value) > self::MAX_VALUE) {
            return null;
        }
        if (preg_match('/expression\s*\(|javascript\s*:|vbscript\s*:|@import|behavior|-moz-binding|[<>{}\\\\]/i', $value)) {
            return null;
        }
        if (preg_match('/url\s*\(/i', $value) && ! self::urlsAreSafe($value)) {
            return null;
        }

        $important = false;
        if (preg_match('/!\s*important\s*$/i', $value)) {
            $important = true;
            $value = trim((string) preg_replace('/!\s*important\s*$/i', '', $value));
        }
        if (str_contains($value, '!')) {
            return null;
        }
        if ($prop === 'position') {
            $value = (string) preg_replace('/\bfixed\b/i', 'absolute', $value);
            if (! in_array(strtolower($value), ['static', 'relative', 'absolute', 'sticky'], true)) {
                return null;
            }
        }
        if ($prop === 'z-index' && ! preg_match('/^-?\d{1,4}$/', $value)) {
            return null;
        }
        if ($value === '') {
            return null;
        }

        return $important ? $value.' !important' : $value;
    }

    private static function urlsAreSafe(string $value): bool
    {
        preg_match_all('/url\s*\(/i', $value, $opens);
        $openCount = count($opens[0] ?? []);
        if ($openCount === 0) {
            return true;
        }
        preg_match_all('/url\s*\(\s*(?:\'([^\']*)\'|"([^"]*)"|([^)\'"\s]+))\s*\)/i', $value, $matches, PREG_SET_ORDER);
        if (count($matches) !== $openCount) {
            return false;
        }
        foreach ($matches as $match) {
            $url = $match[1] !== '' ? $match[1] : ($match[2] !== '' ? $match[2] : ($match[3] ?? ''));
            if (! self::safeUrl($url)) {
                return false;
            }
        }

        return true;
    }

    private static function safeUrl(string $url): bool
    {
        $url = trim($url);
        if ($url === '' || strlen($url) > 2000) {
            return false;
        }
        if (preg_match('/[\s\\\\<>{}]|javascript\s*:|vbscript\s*:|expression\s*\(/i', $url)) {
            return false;
        }
        if (preg_match('/^data:/i', $url)) {
            return (bool) preg_match('/^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+\/=\s]+$/i', $url)
                && strlen($url) <= 1500000;
        }
        if (str_starts_with($url, '//') || str_contains($url, '..')) {
            return false;
        }
        if (preg_match('/^[a-z][a-z0-9+.-]*:/i', $url)) {
            return (bool) preg_match('/^https?:\/\//i', $url);
        }

        return true;
    }
}
