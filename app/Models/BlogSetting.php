<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    public static function get(string $key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        $decoded = json_decode($setting->value, true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : $setting->value;
    }

    public static function set(string $key, $value): self
    {
        $val = is_array($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : (string) $value;
        return self::updateOrCreate(['key' => $key], ['value' => $val]);
    }

    public static function getAll(): array
    {
        $defaults = [
            'blog_title' => 'المدونة التقنية — Amtdex',
            'blog_description' => 'أفكار عملية وتجارب حية في هندسة البرمجيات، الذكاء الاصطناعي، والأنظمة السحابية.',
            'blog_subdomain' => env('BLOG_SUBDOMAIN', 'blog.amtdex.com'),
            'posts_per_page' => 9,
            'default_og_image' => 'https://amtdex.com/images/screens/projects.webp',
            'title_template' => '{title} | مدونة Amtdex',
            'desc_template' => '{summary}',
            'robots_txt' => "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /dashboard/\nSitemap: https://blog.amtdex.com/sitemap.xml",
            'rss_enabled' => true,
            'comments_enabled' => true,
            'comments_require_approval' => true,
            'google_analytics_id' => '',
            'gtm_id' => '',
            'google_search_console' => '',
            'bing_verification' => '',
        ];

        $stored = self::all()->pluck('value', 'key')->toArray();
        foreach ($stored as $k => $v) {
            $decoded = json_decode($v, true);
            $stored[$k] = json_last_error() === JSON_ERROR_NONE ? $decoded : $v;
        }

        return array_merge($defaults, $stored);
    }
}
