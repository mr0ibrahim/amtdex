<?php

use App\Models\BlogPost;
use App\Models\BlogSetting;
use App\Models\User;
use App\Services\Blog\BlogSitemapBuilder;
use App\Services\Blog\IndexNowService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

function reindexAdmin(): User
{
    return User::create([
        'name' => 'مشرف الأرشفة الكاملة',
        'email' => 'seo-reindex-admin@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);
}

it('collects marketing pages posts categories and tags for full reindex', function () {
    config(['app.url' => 'https://amtdex.com']);

    $admin = reindexAdmin();
    BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'مقال للأرشفة',
        'slug' => 'reindex-post',
        'summary' => 'ملخص بطول كافٍ لوصف الميتا عند جمع الروابط للفهرسة الكاملة للموقع.',
        'content' => '<p>محتوى</p>',
        'status' => 'published',
        'published_at' => now()->subHour(),
        'meta_title' => 'مقال للأرشفة',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح ومطابقة الـ schema.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
        'schema_type' => 'BlogPosting',
    ]);

    $urls = BlogSitemapBuilder::allIndexableUrls();

    expect($urls)->toContain('https://amtdex.com/')
        ->and($urls)->toContain('https://amtdex.com/services')
        ->and($urls)->toContain('https://amtdex.com/quote')
        ->and($urls)->toContain(BlogSitemapBuilder::blogBaseUrl().'/')
        ->and($urls)->toContain(BlogSitemapBuilder::blogBaseUrl().'/posts/reindex-post');
});

it('requires auth for full reindex', function () {
    $this->postJson('/api/v1/seo/reindex')->assertUnauthorized();
});

it('runs a full site IndexNow reindex for admins', function () {
    config([
        'app.url' => 'https://amtdex.com',
        'services.indexnow.enabled' => true,
        'services.indexnow.key' => 'full-reindex-key',
        'services.indexnow.host' => 'blog.amtdex.com',
    ]);

    Http::fake([
        'api.indexnow.org/*' => Http::response(['ok' => true], 200),
        'www.google.com/*' => Http::response('ok', 200),
        'www.bing.com/*' => Http::response('ok', 200),
    ]);

    $admin = reindexAdmin();
    BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'نشر كامل',
        'slug' => 'full-site-reindex',
        'summary' => 'ملخص بطول كافٍ لوصف الميتا عند جمع الروابط للفهرسة الكاملة للموقع.',
        'content' => '<p>محتوى</p>',
        'status' => 'published',
        'published_at' => now()->subHour(),
        'meta_title' => 'نشر كامل',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح ومطابقة الـ schema.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
        'schema_type' => 'BlogPosting',
    ]);

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/seo/reindex');

    $response->assertOk()
        ->assertJsonPath('ok', true)
        ->assertJsonPath('data.enabled', true);

    expect($response->json('data.submitted'))->toBeGreaterThan(0)
        ->and($response->json('data.url_count'))->toBeGreaterThan(0);

    Http::assertSent(fn ($request) => str_contains($request->url(), 'api.indexnow.org'));

    $stored = IndexNowService::lastReindex();
    expect($stored)->not->toBeNull()
        ->and($stored['submitted'] ?? 0)->toBeGreaterThan(0)
        ->and(BlogSetting::get('seo_last_full_reindex'))->toBeArray();
});

it('still pings sitemaps when IndexNow is disabled', function () {
    config([
        'app.url' => 'https://amtdex.com',
        'services.indexnow.key' => '',
        'services.indexnow.enabled' => true,
    ]);

    Http::fake([
        'www.google.com/*' => Http::response('ok', 200),
        'www.bing.com/*' => Http::response('ok', 200),
    ]);

    $admin = reindexAdmin();
    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/seo/reindex');

    $response->assertOk()
        ->assertJsonPath('ok', false)
        ->assertJsonPath('data.enabled', false);

    expect($response->json('data.sitemap_pings.google'))->toBeTrue();
});
