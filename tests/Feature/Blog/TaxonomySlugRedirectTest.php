<?php

beforeEach(function () {
    $this->asDashboard();
});

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogRedirect;
use App\Models\BlogTag;
use App\Models\User;
use App\Services\Blog\BlogJsonLdBuilder;
use App\Services\Blog\TaxonomySlugService;
use Illuminate\Support\Facades\Hash;

function taxonomyAdmin(): User
{
    return User::create([
        'name' => 'محرر التصنيفات',
        'email' => 'taxonomy-admin@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);
}

it('creates unique category slugs and fills absolute canonical', function () {
    $admin = taxonomyAdmin();

    $first = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/categories', [
        'name' => 'هندسة البيانات',
        'slug' => 'data-engineering',
        'description' => 'تصنيف عن هندسة البيانات',
    ]);

    $first->assertCreated()
        ->assertJsonPath('category.slug', 'data-engineering');

    expect($first->json('category.canonical_url'))->toStartWith('http')
        ->and($first->json('category.canonical_url'))->toContain('/categories/data-engineering');

    $second = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/categories', [
        'name' => 'هندسة البيانات نسخة',
        'slug' => 'data-engineering',
    ]);

    $second->assertCreated();
    expect($second->json('category.slug'))->toBe('data-engineering-1');
});

it('creates a 301 redirect record when category slug changes', function () {
    $admin = taxonomyAdmin();

    $category = BlogCategory::create([
        'name' => 'قديم',
        'slug' => 'old-category',
        'is_visible' => true,
        'canonical_url' => TaxonomySlugService::categoryCanonical('old-category'),
    ]);

    $response = $this->actingAs($admin, 'sanctum')->putJson("/api/v1/admin/blog/categories/{$category->id}", [
        'name' => 'جديد',
        'slug' => 'new-category',
        'description' => 'تم التحديث',
    ]);

    $response->assertOk()->assertJsonPath('category.slug', 'new-category');

    $this->assertDatabaseHas('blog_redirects', [
        'source_path' => '/categories/old-category',
        'target_path' => '/categories/new-category',
        'status_code' => 301,
    ]);
});

it('exposes category slug redirect via public API payload', function () {
    BlogRedirect::create([
        'source_path' => '/categories/legacy-cat',
        'target_path' => '/categories/modern-cat',
        'status_code' => 301,
    ]);

    $response = $this->getJson('/api/v1/blog/categories/legacy-cat');

    $response->assertOk()
        ->assertJsonPath('redirect', true)
        ->assertJsonPath('target', '/categories/modern-cat')
        ->assertJsonPath('status_code', 301);
});

it('returns paginated category posts with CollectionPage json_ld', function () {
    $admin = taxonomyAdmin();
    $category = BlogCategory::create([
        'name' => 'سحابة',
        'slug' => 'cloud',
        'is_visible' => true,
        'meta_title' => 'تصنيف السحابة',
        'meta_description' => 'مقالات السحابة والبنية التحتية الحديثة لمشاريع البرمجيات العربية.',
        'canonical_url' => TaxonomySlugService::categoryCanonical('cloud'),
    ]);

    for ($i = 1; $i <= 11; $i++) {
        BlogPost::create([
            'author_id' => $admin->id,
            'category_id' => $category->id,
            'title' => "مقال سحابة {$i}",
            'slug' => "cloud-post-{$i}",
            'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
            'content' => '<p>محتوى</p>',
            'status' => 'published',
            'published_at' => now()->subMinutes($i),
            'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
            'meta_title' => "مقال سحابة {$i}",
            'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح ومطابقة الـ schema.',
            'canonical_url' => "https://blog.amtdex.com/posts/cloud-post-{$i}",
        ]);
    }

    $page1 = $this->getJson('/api/v1/blog/categories/cloud?page=1&per_page=9');
    $page1->assertOk()
        ->assertJsonPath('meta.current_page', 1)
        ->assertJsonPath('meta.last_page', 2)
        ->assertJsonPath('meta.total', 11)
        ->assertJsonCount(9, 'posts');

    $types = collect($page1->json('json_ld'))->pluck('@type')->all();
    expect($types)->toContain('CollectionPage')
        ->and($types)->toContain('ItemList')
        ->and($types)->toContain('BreadcrumbList');

    $collection = BlogJsonLdBuilder::findByType($page1->json('json_ld'), 'CollectionPage');
    expect($collection['name'])->toBe('تصنيف السحابة');
    expect($collection['url'])->toContain('/categories/cloud');

    $page2 = $this->getJson('/api/v1/blog/categories/cloud?page=2&per_page=9');
    $page2->assertOk()->assertJsonCount(2, 'posts');
});

it('creates tag slug redirect and blocks deleting tags with posts', function () {
    $admin = taxonomyAdmin();

    $tag = BlogTag::create([
        'name' => 'Laravel',
        'slug' => 'laravel',
        'meta_title' => 'Laravel',
    ]);

    $this->actingAs($admin, 'sanctum')->putJson("/api/v1/admin/blog/tags/{$tag->id}", [
        'name' => 'Laravel Framework',
        'slug' => 'laravel-framework',
    ])->assertOk()->assertJsonPath('tag.slug', 'laravel-framework');

    $this->assertDatabaseHas('blog_redirects', [
        'source_path' => '/tags/laravel',
        'target_path' => '/tags/laravel-framework',
        'status_code' => 301,
    ]);

    $post = BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'مقال وسم',
        'slug' => 'tag-linked-post',
        'content' => '<p>x</p>',
        'status' => 'draft',
    ]);
    $post->tags()->sync([$tag->id]);

    $this->actingAs($admin, 'sanctum')
        ->deleteJson("/api/v1/admin/blog/tags/{$tag->id}")
        ->assertStatus(422);
});

it('blocks deleting categories that still have posts', function () {
    $admin = taxonomyAdmin();
    $category = BlogCategory::create([
        'name' => 'محمي',
        'slug' => 'protected-cat',
        'is_visible' => true,
    ]);

    BlogPost::create([
        'author_id' => $admin->id,
        'category_id' => $category->id,
        'title' => 'مقال مرتبط',
        'slug' => 'linked-post',
        'content' => '<p>x</p>',
        'status' => 'draft',
    ]);

    $this->actingAs($admin, 'sanctum')
        ->deleteJson("/api/v1/admin/blog/categories/{$category->id}")
        ->assertStatus(422);
});

it('produces a non-empty clean taxonomy slug for arabic names', function () {
    $slug = TaxonomySlugService::makeSlug('الذكاء الاصطناعي');
    expect($slug)->not->toBe('')
        ->and($slug)->not->toContain(' ')
        ->and($slug)->not->toContain('/');
});
