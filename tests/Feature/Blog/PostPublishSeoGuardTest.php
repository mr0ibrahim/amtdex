<?php

use App\Models\BlogPost;
use App\Models\User;
use App\Services\Blog\PostPublishSeoGuard;
use Illuminate\Support\Facades\Hash;

function makeAdminUser(): User
{
    return User::create([
        'name' => 'مدير الاختبار',
        'email' => 'seo-admin@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);
}

function validSeoPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'دليل نشر مقالات SEO في Amtdex',
        'slug' => 'seo-publish-guide',
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>محتوى المقال التجريبي لاختبار فحوص النشر المتعلقة بـ SEO.</p>',
        'status' => 'published',
        'meta_title' => 'دليل نشر مقالات SEO',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح دون أخطاء في العنوان أو الوصف.',
        'canonical_url' => 'https://blog.amtdex.com/posts/seo-publish-guide',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
        'og_image' => 'https://amtdex.com/images/screens/projects.webp',
    ], $overrides);
}

it('allows saving a draft without complete SEO fields', function () {
    $admin = makeAdminUser();

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', [
        'title' => 'مسودة بدون SEO',
        'slug' => 'draft-without-seo',
        'content' => '<p>محتوى المسودة</p>',
        'status' => 'draft',
    ]);

    $response->assertCreated()
        ->assertJsonPath('ok', true)
        ->assertJsonPath('post.status', 'draft');

    expect(BlogPost::where('slug', 'draft-without-seo')->exists())->toBeTrue();
});

it('blocks publishing when SEO fields are missing', function () {
    $admin = makeAdminUser();

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', [
        'title' => 'عنوان مقال للنشر بدون وصف أو صورة',
        'slug' => 'publish-missing-seo',
        'content' => '<p>محتوى</p>',
        'status' => 'published',
        // no summary/meta_description, no image, no canonical
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['meta_description', 'og_image']);

    expect(BlogPost::where('slug', 'publish-missing-seo')->exists())->toBeFalse();
});

it('blocks publishing when SEO title exceeds 60 characters', function () {
    $admin = makeAdminUser();
    $longTitle = str_repeat('ع', 61);

    $response = $this->actingAs($admin, 'sanctum')->postJson(
        '/api/v1/admin/blog/posts',
        validSeoPayload([
            'title' => $longTitle,
            'meta_title' => $longTitle,
            'slug' => 'title-too-long',
        ])
    );

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['meta_title']);
});

it('publishes successfully when SEO requirements are met and fills canonical/og fallbacks', function () {
    $admin = makeAdminUser();

    $response = $this->actingAs($admin, 'sanctum')->postJson(
        '/api/v1/admin/blog/posts',
        validSeoPayload([
            'canonical_url' => null,
            'og_title' => null,
            'og_description' => null,
            'og_image' => null, // cover_image present as fallback
        ])
    );

    $response->assertCreated()
        ->assertJsonPath('ok', true)
        ->assertJsonPath('post.status', 'published');

    $post = BlogPost::where('slug', 'seo-publish-guide')->first();
    expect($post)->not->toBeNull();
    expect($post->canonical_url)->toStartWith('http');
    expect($post->canonical_url)->toContain('/posts/seo-publish-guide');
    expect($post->og_image)->toBe($post->cover_image);
    expect($post->meta_title)->not->toBeEmpty();
    expect($post->meta_description)->not->toBeEmpty();
});

it('blocks quick status publish when existing draft lacks SEO', function () {
    $admin = makeAdminUser();

    $post = BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'مسودة ناقصة',
        'slug' => 'draft-incomplete',
        'content' => '<p>نص</p>',
        'status' => 'draft',
    ]);

    $response = $this->actingAs($admin, 'sanctum')
        ->putJson("/api/v1/admin/blog/posts/{$post->id}", ['status' => 'published']);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['meta_description', 'og_image']);

    expect($post->fresh()->status)->toBe('draft');
});

it('allows quick status publish when existing draft already has SEO', function () {
    $admin = makeAdminUser();

    $post = BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'دليل جاهز للنشر',
        'slug' => 'ready-to-publish',
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>محتوى جاهز</p>',
        'status' => 'draft',
        'meta_title' => 'دليل جاهز للنشر',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح دون أخطاء في العنوان أو الوصف.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
    ]);

    $response = $this->actingAs($admin, 'sanctum')
        ->putJson("/api/v1/admin/blog/posts/{$post->id}", ['status' => 'published']);

    $response->assertOk()->assertJsonPath('post.status', 'published');

    $fresh = $post->fresh();
    expect($fresh->status)->toBe('published');
    expect($fresh->canonical_url)->toContain('/posts/ready-to-publish');
    expect($fresh->og_image)->toBe($fresh->cover_image);
});

it('rejects relative canonical urls on publish', function () {
    $errors = PostPublishSeoGuard::validate(validSeoPayload([
        'canonical_url' => '/posts/relative-only',
    ]));

    expect($errors)->toHaveKey('canonical_url');
});

it('blocks bulk publish when any selected post fails SEO checks', function () {
    $admin = makeAdminUser();

    $good = BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'مقال مكتمل',
        'slug' => 'bulk-good',
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>جيد</p>',
        'status' => 'draft',
        'meta_title' => 'مقال مكتمل',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح دون أخطاء في العنوان أو الوصف.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
        'canonical_url' => 'https://blog.amtdex.com/posts/bulk-good',
    ]);

    $bad = BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'مقال ناقص',
        'slug' => 'bulk-bad',
        'content' => '<p>ناقص</p>',
        'status' => 'draft',
    ]);

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts/bulk', [
        'ids' => [$good->id, $bad->id],
        'action' => 'publish',
    ]);

    $response->assertStatus(422)
        ->assertJsonPath('failed_posts.0.id', $bad->id);

    expect($good->fresh()->status)->toBe('draft');
    expect($bad->fresh()->status)->toBe('draft');
});
