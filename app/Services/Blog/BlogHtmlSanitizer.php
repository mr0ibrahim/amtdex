<?php

namespace App\Services\Blog;

use DOMDocument;
use DOMElement;
use DOMNode;

/**
 * Allowlist sanitizer for stored blog HTML.
 * Keeps article formatting (headings, lists, tables, aligned figures) and drops active content.
 */
class BlogHtmlSanitizer
{
    /** @var list<string> */
    private const ALLOWED_TAGS = [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'a',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'img', 'figure', 'figcaption', 'hr', 'span', 'div',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
        'iframe', 'video', 'audio', 'source', 'mark',
    ];

    /** @var list<string> */
    private const DROP_TAGS = [
        'script', 'style', 'object', 'embed', 'form', 'input', 'textarea', 'button',
        'select', 'option', 'link', 'meta', 'base', 'svg', 'math', 'noscript', 'iframe',
    ];

    /** @var list<string> */
    private const STYLE_PROPS = [
        'color', 'background-color', 'text-align', 'text-decoration',
        'width', 'height', 'font-weight', 'font-style', 'font-size', 'vertical-align',
    ];

    public static function sanitize(?string $html): string
    {
        $html = trim((string) $html);
        if ($html === '') {
            return '';
        }

        $previous = libxml_use_internal_errors(true);
        $dom = new DOMDocument('1.0', 'UTF-8');
        $wrapped = '<?xml encoding="UTF-8"><div id="blog-html-root">'.$html.'</div>';
        $loaded = $dom->loadHTML($wrapped, LIBXML_HTML_NODEFDTD | LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $loaded ? $dom->getElementById('blog-html-root') : null;
        if (! $root instanceof DOMElement) {
            return self::fallbackStrip($html);
        }

        self::sanitizeChildren($root);

        $out = '';
        foreach ($root->childNodes as $child) {
            $piece = $dom->saveHTML($child);
            if (is_string($piece)) {
                $out .= $piece;
            }
        }

        return trim(self::decodeNonAsciiEntities($out));
    }

    private static function sanitizeChildren(DOMNode $parent): void
    {
        $children = [];
        foreach ($parent->childNodes as $child) {
            $children[] = $child;
        }
        foreach ($children as $child) {
            self::sanitizeNode($child);
        }
    }

    private static function sanitizeNode(DOMNode $node): void
    {
        if ($node->nodeType === XML_COMMENT_NODE || $node->nodeType === XML_PI_NODE) {
            $node->parentNode?->removeChild($node);

            return;
        }

        if (! $node instanceof DOMElement) {
            return;
        }

        self::sanitizeChildren($node);

        $tag = strtolower($node->tagName);
        if (in_array($tag, self::DROP_TAGS, true) && $tag !== 'iframe') {
            $node->parentNode?->removeChild($node);

            return;
        }

        if (! in_array($tag, self::ALLOWED_TAGS, true)) {
            self::unwrap($node);

            return;
        }

        self::filterAttributes($node);

        if (self::mustRemove($node)) {
            $node->parentNode?->removeChild($node);
        }
    }

    private static function unwrap(DOMElement $node): void
    {
        $parent = $node->parentNode;
        if (! $parent) {
            return;
        }
        while ($node->firstChild) {
            $parent->insertBefore($node->firstChild, $node);
        }
        $parent->removeChild($node);
    }

    private static function filterAttributes(DOMElement $node): void
    {
        $tag = strtolower($node->tagName);
        $allowed = self::allowedAttributes($tag);
        $remove = [];

        foreach ($node->attributes ?? [] as $attr) {
            $name = strtolower($attr->nodeName);
            if (! in_array($name, $allowed, true)) {
                $remove[] = $attr->nodeName;

                continue;
            }
            $clean = self::cleanAttribute($tag, $name, (string) $attr->nodeValue);
            if ($clean === null) {
                $remove[] = $attr->nodeName;

                continue;
            }
            if ($clean !== (string) $attr->nodeValue) {
                $node->setAttribute($attr->nodeName, $clean);
            }
        }

        foreach ($remove as $name) {
            $node->removeAttribute($name);
        }

        if ($tag === 'a' && strtolower($node->getAttribute('target')) === '_blank') {
            $node->setAttribute('rel', 'noopener noreferrer');
        }
        if ($tag === 'iframe') {
            $node->setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        }
    }

    private static function mustRemove(DOMElement $node): bool
    {
        $tag = strtolower($node->tagName);
        $src = trim($node->getAttribute('src'));

        if ($tag === 'img' || $tag === 'source') {
            return $src === '';
        }
        if ($tag === 'iframe') {
            return ! self::isYouTubeEmbed($src);
        }
        if ($tag === 'audio' || $tag === 'video') {
            if ($src !== '') {
                return false;
            }

            foreach ($node->getElementsByTagName('source') as $source) {
                if (trim($source->getAttribute('src')) !== '') {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    /**
     * @return list<string>
     */
    private static function allowedAttributes(string $tag): array
    {
        $common = ['class', 'title', 'dir'];

        return match ($tag) {
            'a' => ['href', 'target', 'rel', 'title', 'download'],
            'img' => ['src', 'alt', 'title', 'class', 'width', 'height', 'loading', 'style'],
            'figure' => ['class', 'style'],
            'div' => ['class', 'style', 'dir', 'data-youtube-video'],
            'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'li', 'mark' => [...$common, 'style'],
            'td', 'th' => ['colspan', 'rowspan', 'colwidth', 'style', 'class', 'dir'],
            'col' => ['style', 'width'],
            'iframe' => ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'referrerpolicy', 'class'],
            'audio', 'video' => ['src', 'controls', 'class'],
            'source' => ['src', 'type'],
            'ul', 'ol' => ['class', 'dir'],
            default => $common,
        };
    }

    private static function cleanAttribute(string $tag, string $name, string $value): ?string
    {
        $value = trim($value);

        return match ($name) {
            'class' => self::cleanClass($value),
            'style' => self::cleanStyle($value),
            'dir' => in_array(strtolower($value), ['ltr', 'rtl', 'auto'], true) ? strtolower($value) : null,
            'href' => self::isSafeHref($value) ? $value : null,
            'src' => self::cleanSrc($tag, $value),
            'target' => in_array($value, ['_blank', '_self'], true) ? $value : null,
            'rel' => self::cleanRel($value),
            'alt', 'title' => self::cleanText($value, 500),
            'width', 'height' => preg_match('/^\d{1,4}(%|px)?$/', $value) ? $value : null,
            'colspan', 'rowspan' => preg_match('/^\d{1,2}$/', $value) ? $value : null,
            'colwidth' => preg_match('/^\d+(,\d+)*$/', $value) ? $value : null,
            'loading' => in_array($value, ['lazy', 'eager'], true) ? $value : null,
            'frameborder' => in_array($value, ['0', '1'], true) ? $value : null,
            'allowfullscreen', 'controls' => '',
            'download' => self::cleanDownload($value),
            'type' => preg_match('#^(audio|video)/[a-z0-9.+-]+$#i', $value) ? strtolower($value) : null,
            'referrerpolicy' => 'strict-origin-when-cross-origin',
            'allow' => 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            'data-youtube-video' => $tag === 'div' ? '' : null,
            default => null,
        };
    }

    private static function cleanClass(string $value): ?string
    {
        $kept = [];
        foreach (preg_split('/\s+/', $value) ?: [] as $token) {
            if (preg_match('/^(blog-figure|blog-img|blog-content-banner|blog-editor-image|blog-editor-video|align-left|align-center|align-right|language-[a-z0-9_+-]+)$/', $token)) {
                $kept[] = $token;
            }
        }

        return $kept === [] ? null : implode(' ', $kept);
    }

    private static function cleanStyle(string $style): ?string
    {
        $kept = [];
        foreach (explode(';', $style) as $part) {
            if (! str_contains($part, ':')) {
                continue;
            }
            [$prop, $value] = array_map('trim', explode(':', $part, 2));
            $prop = strtolower($prop);
            if (! in_array($prop, self::STYLE_PROPS, true)) {
                continue;
            }
            if (preg_match('/expression|javascript|vbscript|url\s*\(|@import|behavior|-moz-binding/i', $value)) {
                continue;
            }
            if (! preg_match('/^[#a-z0-9(),.%\s\'"\/+-]+$/i', $value)) {
                continue;
            }
            if ($prop === 'text-align' && ! preg_match('/^(left|right|center|justify|start|end)$/i', $value)) {
                continue;
            }
            $kept[] = $prop.': '.$value;
        }

        return $kept === [] ? null : implode('; ', $kept);
    }

    private static function cleanSrc(string $tag, string $value): ?string
    {
        if ($tag === 'iframe') {
            return self::isYouTubeEmbed($value) ? $value : null;
        }
        if ($tag === 'img' && preg_match('#^data:image/(png|jpe?g|gif|webp);base64,#i', $value)) {
            return strlen($value) <= 1500000 ? $value : null;
        }
        if (preg_match('/^(javascript|vbscript|data|blob):/i', $value)) {
            return null;
        }

        return self::isSafeUrl($value) ? $value : null;
    }

    private static function isSafeHref(string $url): bool
    {
        if (preg_match('/^(javascript|vbscript|data):/i', $url)) {
            return false;
        }
        if (preg_match('/^(mailto:|tel:)/i', $url)) {
            return ! preg_match('/[\x00-\x1F]/', $url);
        }

        return self::isSafeUrl($url);
    }

    private static function isSafeUrl(string $url): bool
    {
        if ($url === '' || strlen($url) > 2000 || preg_match('/[\x00-\x1F]/', $url)) {
            return false;
        }
        if (str_starts_with($url, '//') || str_contains($url, '\\') || str_contains($url, '..')) {
            return false;
        }
        if (str_starts_with($url, '/')) {
            return true;
        }
        if (preg_match('#^https?://#i', $url)) {
            return true;
        }

        return ! preg_match('/^[a-z][a-z0-9+.-]*:/i', $url);
    }

    private static function isYouTubeEmbed(string $url): bool
    {
        return (bool) preg_match(
            '~^https://(?:www\.)?(?:youtube\.com|youtube-nocookie\.com)/embed/[A-Za-z0-9_-]{6,64}(?:[?#].*)?$~',
            $url
        );
    }

    private static function cleanRel(string $value): ?string
    {
        $tokens = preg_split('/\s+/', strtolower($value)) ?: [];
        $kept = array_values(array_intersect($tokens, ['noopener', 'noreferrer', 'nofollow']));

        return $kept === [] ? null : implode(' ', $kept);
    }

    private static function cleanDownload(string $value): ?string
    {
        if ($value === '') {
            return '';
        }
        $value = self::cleanText($value, 180) ?? '';
        if ($value === '' || str_contains($value, ':') || str_contains($value, '/') || str_contains($value, '\\')) {
            return null;
        }

        return $value;
    }

    private static function cleanText(string $value, int $limit): ?string
    {
        $value = trim(strip_tags($value));
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $value) ?? '';
        if ($value === '') {
            return null;
        }

        return mb_substr($value, 0, $limit);
    }

    private static function decodeNonAsciiEntities(string $html): string
    {
        $decoded = preg_replace_callback('/&#(\d+);|&#x([0-9a-f]+);/i', function (array $match): string {
            $codepoint = $match[1] !== '' ? intval($match[1], 10) : intval($match[2], 16);
            if ($codepoint < 128 || $codepoint > 0x10FFFF) {
                return $match[0];
            }

            return mb_chr($codepoint, 'UTF-8');
        }, $html);

        return is_string($decoded) ? $decoded : $html;
    }

    private static function fallbackStrip(string $html): string
    {
        $stripped = preg_replace('#<(script|style|iframe|object|embed|svg|math)\b[^>]*>.*?</\1>#is', '', $html) ?? '';
        $stripped = preg_replace('/\son\w+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $stripped) ?? '';
        $stripped = preg_replace('/\s(href|src)\s*=\s*("|\')\s*(javascript|data|vbscript):/i', ' $1=$2', $stripped) ?? '';

        return trim($stripped);
    }
}
