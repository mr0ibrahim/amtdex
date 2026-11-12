<?php

beforeEach(function () {
    $this->asDashboard();
});

use App\Models\BlogPost;
use App\Models\User;
use App\Services\Blog\BlogCssSanitizer;
use App\Services\Blog\BlogHtmlSanitizer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

function blogHtmlAdmin(): User
{
    return User::create([
        'name' => 'محرر المقالات',
        'email' => 'html-admin@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);
}

it('keeps article formatting and strips active content', function () {
    $html = <<<'HTML'
<h2>عنوان</h2>
<p style="text-align: center">نص <strong>عريض</strong> <a href="javascript:alert(1)">خطر</a> <a href="https://amtdex.com" target="_blank">الموقع</a></p>
<script>alert(1)</script>
<img src="/uploads/media/a.png" alt="وصف" onerror="alert(1)">
<figure class="blog-figure align-left" style="width: 50%"><img src="/uploads/media/b.png" alt="صورة" class="blog-img"><figcaption>تعليق</figcaption></figure>
<table><thead><tr><th colspan="2">أ</th></tr></thead><tbody><tr><td>ب</td><td>ج</td></tr></tbody></table>
<iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"></iframe>
<iframe src="https://evil.example/embed/abcdef"></iframe>
<div data-youtube-video=""><iframe class="blog-editor-video" src="https://www.youtube-nocookie.com/embed/abcdefghijk" allowfullscreen="true"></iframe></div>
HTML;

    $clean = BlogHtmlSanitizer::sanitize($html);

    expect($clean)->toContain('<h2>عنوان</h2>')
        ->and($clean)->toContain('<strong>عريض</strong>')
        ->and($clean)->toContain('text-align: center')
        ->and($clean)->toContain('https://amtdex.com')
        ->and($clean)->not->toContain('javascript:')
        ->and($clean)->not->toContain('<script')
        ->and($clean)->not->toContain('onerror')
        ->and($clean)->toContain('align-left')
        ->and($clean)->toContain('width: 50%')
        ->and($clean)->toContain('تعليق')
        ->and($clean)->toContain('<table')
        ->and($clean)->toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ')
        ->and($clean)->toContain('data-youtube-video')
        ->and($clean)->not->toContain('evil.example');

    expect(BlogHtmlSanitizer::sanitize($clean))->toBe($clean);
});

it('preserves a normal arabic paragraph exactly across repeated sanitizing', function () {
    $html = '<p>محتوى المقال التجريبي لاختبار فحوص النشر المتعلقة بـ SEO.</p>';
    $once = BlogHtmlSanitizer::sanitize($html);

    expect($once)->toBe($html);
    expect(BlogHtmlSanitizer::sanitize($once))->toBe($once);
});

it('stores sanitized html and hides legacy script tags on read', function () {
    $admin = blogHtmlAdmin();

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', [
        'title' => 'مقال منسق',
        'slug' => 'sanitized-article',
        'content' => '<h2>قسم</h2><p onclick="alert(1)">نص</p><script>alert(1)</script><figure class="blog-figure align-right" style="width: 25%"><img src="/uploads/media/c.png" alt="غلاف داخلي" class="blog-img"><figcaption>شرح</figcaption></figure>',
        'status' => 'draft',
    ]);

    $response->assertCreated();

    $stored = (string) DB::table('blog_posts')->where('slug', 'sanitized-article')->value('content');
    expect($stored)->not->toContain('<script')
        ->and($stored)->not->toContain('onclick')
        ->and($stored)->toContain('<h2>قسم</h2>')
        ->and($stored)->toContain('align-right')
        ->and($stored)->toContain('width: 25%')
        ->and($stored)->toContain('شرح');

    DB::table('blog_posts')->insert([
        'author_id' => $admin->id,
        'title' => 'مقال قديم',
        'slug' => 'legacy-xss-post',
        'content' => '<p>نص آمن</p><script>alert(1)</script><img src="/uploads/media/z.png" alt="صورة" onerror="alert(1)">',
        'status' => 'draft',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $legacy = BlogPost::query()->where('slug', 'legacy-xss-post')->firstOrFail();
    expect($legacy->content)->toContain('نص آمن')
        ->and($legacy->content)->not->toContain('<script')
        ->and($legacy->content)->not->toContain('onerror')
        ->and($legacy->content)->toContain('/uploads/media/z.png');
});

it('keeps safe inline css and classes and strips dangerous declarations', function () {
    $html = <<<'HTML'
<section id="hero" class="card fixed md:flex" style="color: #16064F; font-size: 18px; margin: 12px; display: flex; position: fixed; background: url(javascript:alert(1)); behavior: url(#x); -moz-binding: url(https://evil.test/x.xml)">
  <p class="lead" style="padding: 8px; text-align: center">نص <span style="font-weight: 700">مهم</span></p>
</section>
HTML;

    $clean = BlogHtmlSanitizer::sanitize($html);

    expect($clean)->toContain('<section')
        ->and($clean)->toContain('id="hero"')
        ->and($clean)->toContain('card')
        ->and($clean)->toContain('md:flex')
        ->and($clean)->not->toContain('fixed')
        ->and($clean)->toContain('color: #16064F')
        ->and($clean)->toContain('font-size: 18px')
        ->and($clean)->toContain('margin: 12px')
        ->and($clean)->toContain('display: flex')
        ->and($clean)->toContain('position: absolute')
        ->and($clean)->toContain('class="lead"')
        ->and($clean)->toContain('padding: 8px')
        ->and($clean)->not->toContain('javascript:')
        ->and($clean)->not->toContain('behavior')
        ->and($clean)->not->toContain('-moz-binding')
        ->and($clean)->toContain('مهم');

    expect(BlogHtmlSanitizer::sanitize($clean))->toBe($clean);
});

it('extracts style blocks, drops remote imports, and scopes rules to the post', function () {
    $html = <<<'HTML'
<style>
@import url("https://evil.test/x.css");
.card { color: red; position: fixed; width: expression(alert(1)); background: url(javascript:alert(1)); }
body { margin: 0; }
</style>
@media ignored {}
<section class="card"><h2 class="title">عنوان</h2></section>
<link rel="stylesheet" href="https://cdn.example/a.css">
HTML;

    [$body, $css] = BlogHtmlSanitizer::extractStyleSheets($html);

    expect($body)->not->toContain('<style')
        ->and($css)->toContain('.card')
        ->and($css)->toContain('color: red')
        ->and($css)->toContain('position: absolute')
        ->and($css)->not->toContain('@import')
        ->and($css)->not->toContain('expression')
        ->and($css)->not->toContain('javascript:')
        ->and($css)->toContain('body')
        ->and(BlogCssSanitizer::sanitize($css))->toBe($css);

    $scoped = BlogCssSanitizer::scope($css, '.blog-prose.blog-post-content.post-content-4');
    expect($scoped)->toContain('.blog-prose.blog-post-content.post-content-4 .card')
        ->and($scoped)->toContain('.blog-prose.blog-post-content.post-content-4')
        ->and($scoped)->not->toContain(' body')
        ->and($scoped)->not->toContain('position: fixed');

    $media = BlogCssSanitizer::scope(
        '@media (max-width: 600px) { .hero { padding: 8px; } } @keyframes fade { from { opacity: 0; } to { opacity: 1; } }',
        '.blog-post-content'
    );
    expect($media)->toContain('@media (max-width: 600px){.blog-post-content .hero{padding: 8px;}}')
        ->and($media)->toContain('@keyframes fade{from{opacity: 0;}to{opacity: 1;}}')
        ->and($media)->not->toContain('.blog-post-content from');
});

it('stores custom css beside the article and strips hostile rules on read', function () {
    $admin = blogHtmlAdmin();

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', [
        'title' => 'مقال بتنسيق',
        'slug' => 'styled-article',
        'content' => '<style>.card{color:#16064F;position:fixed}</style><section class="card" style="padding: 12px">نص منسق</section>',
        'custom_css' => '.extra{font-size:14px} @import "https://evil.test/a.css";',
        'status' => 'draft',
    ]);

    $response->assertCreated();

    $storedCss = (string) DB::table('blog_posts')->where('slug', 'styled-article')->value('custom_css');
    $storedHtml = (string) DB::table('blog_posts')->where('slug', 'styled-article')->value('content');

    expect($storedCss)->toContain('.card')
        ->and($storedCss)->toContain('.extra')
        ->and($storedCss)->toContain('position: absolute')
        ->and($storedCss)->not->toContain('@import')
        ->and($storedCss)->not->toContain('fixed')
        ->and($storedHtml)->not->toContain('<style')
        ->and($storedHtml)->toContain('class="card"')
        ->and($storedHtml)->toContain('padding: 12px')
        ->and($storedHtml)->toContain('نص منسق');

    DB::table('blog_posts')->where('slug', 'styled-article')->update([
        'custom_css' => '@import url(https://evil.test/a.css); .ok{color:red; -moz-binding:url(https://evil.test/b.xml)}',
    ]);

    $post = BlogPost::query()->where('slug', 'styled-article')->firstOrFail();
    expect($post->custom_css)->toContain('.ok')
        ->and($post->custom_css)->toContain('color: red')
        ->and($post->custom_css)->not->toContain('@import')
        ->and($post->custom_css)->not->toContain('-moz-binding');
});
