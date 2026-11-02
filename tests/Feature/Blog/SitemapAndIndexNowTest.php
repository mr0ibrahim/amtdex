<?php

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use App\Models\User;
use App\Services\Blog\BlogSitemapBuilder;
use App\Services\Blog\IndexNowService;
use App\Services\Blog\PostPublishSeoGuard;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

function seoOpsAdmin(): User
{
    return User::create([
        'name' => 'مشرف الأرشفة',
        'email' => 'sitemap-admin@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);
}

it('serves a sitemap index that references child sitemaps', function () {
    $response = $this->get('/sitemap.xml');

    $response->assertOk();
    expect($response->headers->get('Content-Type'))->toContain('xml');

    $body = $response->getContent();
    expect($body)->toContain('<sitemapindex')
        ->and($body)->toContain('/sitemaps/pages.xml')
        ->and($body)->toContain('/sitemaps/blog-posts.xml')
        ->and($body)->toContain('/sitemaps/blog-categories.xml')
        ->and($body)->toContain('/sitemaps/blog-tags.xml')
        ->and($body)->toContain('<lastmod>');
});

it('includes published posts with lastmod in the blog posts sitemap', function () {
    $admin = seoOpsAdmin();
    $post = BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'مقال في الخريطة',
        'slug' => 'sitemap-post',
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>محتوى</p>',
        'status' => 'published',
        'published_at' => now()->subHour(),
        'meta_title' => 'مقال في الخريطة',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح ومطابقة الـ schema.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
        'canonical_url' => 'https://blog.amtdex.com/posts/sitemap-post',
    ]);

    $response = $this->get('/sitemaps/blog-posts.xml');
    $response->assertOk();
    $body = $response->getContent();

    expect($body)->toContain('/posts/sitemap-post')
        ->and($body)->toContain('<lastmod>')
        ->and($body)->toContain($post->updated_at->toAtomString());
});

it('serves robots.txt that points to the sitemap index', function () {
    $response = $this->get('/robots.txt');
    $response->assertOk();
    $body = $response->getContent();

    expect($body)->toContain('User-agent: *')
        ->and($body)->toContain('Disallow: /dashboard')
        ->and($body)->toContain('Disallow: /api/')
        ->and($body)->toContain('Sitemap: '.BlogSitemapBuilder::sitemapIndexUrl());
});

it('notifies IndexNow after a successful publish when configured', function () {
    config([
        'services.indexnow.enabled' => true,
        'services.indexnow.key' => 'test-indexnow-key-123456',
        'services.indexnow.host' => 'blog.amtdex.com',
    ]);

    Http::fake([
        'api.indexnow.org/*' => Http::response(['ok' => true], 200),
    ]);

    $admin = seoOpsAdmin();

    $payload = [
        'title' => 'نشر مع IndexNow',
        'slug' => 'indexnow-publish',
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>محتوى منشور</p>',
        'status' => 'published',
        'meta_title' => 'نشر مع IndexNow',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح ومطابقة الـ schema.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
    ];

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', $payload);
    $response->assertCreated();

    Http::assertSent(function ($request) {
        return str_contains($request->url(), 'api.indexnow.org')
            && ($request['key'] ?? null) === 'test-indexnow-key-123456'
            && is_array($request['urlList'] ?? null)
            && collect($request['urlList'])->contains(fn ($url) => str_contains($url, 'indexnow-publish'));
    });
});

it('does not fail publish when IndexNow is disabled', function () {
    config(['services.indexnow.key' => '']);

    Http::fake();

    $admin = seoOpsAdmin();
    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', [
        'title' => 'بدون IndexNow',
        'slug' => 'no-indexnow',
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>محتوى</p>',
        'status' => 'published',
        'meta_title' => 'بدون IndexNow',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح ومطابقة الـ schema.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
    ]);

    $response->assertCreated();
    Http::assertNothingSent();
});

it('serves the IndexNow ownership key file when configured', function () {
    config(['services.indexnow.key' => 'abcKEY12345678']);

    $this->get('/abcKEY12345678.txt')
        ->assertOk()
        ->assertSee('abcKEY12345678', false);

    $this->get('/wrong-key.txt')->assertNotFound();
});

it('includes categories and tags sitemaps with absolute locs', function () {
    BlogCategory::create(['name' => 'أرشفة', 'slug' => 'archiving', 'is_visible' => true]);
    BlogTag::create(['name' => 'SEO', 'slug' => 'seo']);

    $cats = $this->get('/sitemaps/blog-categories.xml');
    $tags = $this->get('/sitemaps/blog-tags.xml');

    $cats->assertOk();
    $tags->assertOk();
    expect($cats->getContent())->toContain('/categories/archiving');
    expect($tags->getContent())->toContain('/tags/seo');
});

it('builds absolute post url for IndexNow via publish guard helpers', function () {
    $url = PostPublishSeoGuard::buildCanonicalUrl('hello-world');
    expect(IndexNowService::enabled())->toBeFalse();
    expect($url)->toStartWith('http')
        ->and($url)->toContain('/posts/hello-world');
});
