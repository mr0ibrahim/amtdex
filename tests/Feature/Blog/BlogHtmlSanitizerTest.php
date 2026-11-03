<?php

use App\Models\BlogPost;
use App\Models\User;
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
