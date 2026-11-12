<?php

beforeEach(function () {
    $this->asDashboard();
});

use App\Models\BlogPost;
use App\Models\BlogTag;
use App\Models\User;
use App\Services\Blog\BlogJsonLdBuilder;
use App\Services\Blog\PostPublishSeoGuard;
use App\Services\Blog\SeoKeywords;
use Illuminate\Support\Facades\Hash;

function seoFieldAdmin(): User
{
    return User::create([
        'name' => 'محرر SEO',
        'email' => 'seo-fields-'.uniqid().'@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);
}

function seoFieldPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'دليل الكلمات المفتاحية وصورة المشاركة',
        'slug' => 'seo-keywords-og-'.uniqid(),
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>محتوى المقال لاختبار الكلمات المفتاحية وصورة Open Graph.</p>',
        'status' => 'draft',
        'meta_title' => 'دليل الكلمات المفتاحية',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح دون أخطاء في العنوان أو الوصف.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
    ], $overrides);
}

it('normalizes phrases, arabic commas, newlines, and duplicates', function () {
    $keywords = SeoKeywords::normalize("  تطوير المواقع، Laravel, SEO\nأمن سيبراني, seo ");

    expect($keywords)->toBe([
        'تطوير المواقع',
        'Laravel',
        'SEO',
        'أمن سيبراني',
    ]);
});

it('caps a long arabic keyword list instead of rejecting it', function () {
    $many = [];
    for ($i = 1; $i <= 50; $i++) {
        $many[] = "كلمة عربية {$i}";
    }
    $many[] = str_repeat('م', 180);

    $keywords = SeoKeywords::normalize($many);

    expect($keywords)->toHaveCount(40);
    expect(mb_strlen($keywords[39]))->toBeLessThanOrEqual(120);
});

it('saves multi-word arabic and english keywords and reloads them on edit', function () {
    $admin = seoFieldAdmin();
    $slug = 'keywords-persist-'.uniqid();

    $create = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', seoFieldPayload([
        'slug' => $slug,
        'seo_keywords' => [
            'تطوير المواقع',
            'تطوير المواقع',
            'web development',
            'SEO',
            'seo',
        ],
    ]));

    $create->assertCreated()
        ->assertJsonPath('post.seo_keywords', ['تطوير المواقع', 'web development', 'SEO'])
        ->assertJsonPath('post.focus_keyword', 'تطوير المواقع');

    $id = $create->json('post.id');

    $this->actingAs($admin, 'sanctum')
        ->getJson("/api/v1/admin/blog/posts/{$id}")
        ->assertOk()
        ->assertJsonPath('post.seo_keywords', ['تطوير المواقع', 'web development', 'SEO']);

    $this->actingAs($admin, 'sanctum')
        ->putJson("/api/v1/admin/blog/posts/{$id}", [
            'seo_keywords' => "Laravel، أمن التطبيقات\nweb development",
        ])
        ->assertOk()
        ->assertJsonPath('post.seo_keywords', ['Laravel', 'أمن التطبيقات', 'web development'])
        ->assertJsonPath('post.focus_keyword', 'Laravel');

    $stored = BlogPost::query()->findOrFail($id);
    expect($stored->seo_keywords)->toBe(['Laravel', 'أمن التطبيقات', 'web development']);
});

it('accepts a pasted comma-separated keyword string with many arabic phrases', function () {
    $admin = seoFieldAdmin();
    $phrases = [];
    for ($i = 1; $i <= 25; $i++) {
        $phrases[] = "عبارة عربية رقم {$i}";
    }

    $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', seoFieldPayload([
        'slug' => 'many-keywords-'.uniqid(),
        'seo_keywords' => implode('، ', $phrases),
    ]));

    $response->assertCreated();
    expect($response->json('post.seo_keywords'))->toHaveCount(25)
        ->and($response->json('post.seo_keywords.0'))->toBe('عبارة عربية رقم 1')
        ->and($response->json('post.seo_keywords.24'))->toBe('عبارة عربية رقم 25');
});

it('publishes keywords and an absolute og:image, and keeps a removed image empty on drafts', function () {
    $admin = seoFieldAdmin();
    $slug = 'og-keywords-'.uniqid();

    $create = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/blog/posts', seoFieldPayload([
        'slug' => $slug,
        'status' => 'published',
        'canonical_url' => "https://blog.amtdex.com/posts/{$slug}",
        'seo_keywords' => ['تطوير المواقع', 'Open Graph'],
        'og_image' => '/uploads/media/share-image.png',
        'cover_image' => '/uploads/media/cover.png',
    ]));

    $create->assertCreated()
        ->assertJsonPath('post.og_image', '/uploads/media/share-image.png');

    $id = $create->json('post.id');
    $post = BlogPost::query()->findOrFail($id);
    $post->published_at = now()->subMinute();
    $post->save();

    $public = $this->getJson("/api/v1/blog/posts/{$slug}");
    $public->assertOk()
        ->assertJsonPath('post.seo_keywords', ['تطوير المواقع', 'Open Graph'])
        ->assertJsonPath('post.og_image', '/uploads/media/share-image.png');

    $article = collect($public->json('json_ld'))->firstWhere('@type', 'BlogPosting');
    $expectedImage = PostPublishSeoGuard::absolutePublicUrl('/uploads/media/share-image.png');

    expect($article['keywords'])->toBe('تطوير المواقع, Open Graph')
        ->and($article['image'][0])->toBe($expectedImage)
        ->and($expectedImage)->toStartWith('http')
        ->and($expectedImage)->toContain('/uploads/media/share-image.png');

    $this->actingAs($admin, 'sanctum')
        ->putJson("/api/v1/admin/blog/posts/{$id}", [
            'status' => 'draft',
            'og_image' => null,
            'seo_keywords' => [],
        ])
        ->assertOk()
        ->assertJsonPath('post.og_image', null)
        ->assertJsonPath('post.seo_keywords', [])
        ->assertJsonPath('post.focus_keyword', null);

    $draft = BlogPost::query()->findOrFail($id);
    $graph = BlogJsonLdBuilder::forPost($draft);
    $draftArticle = BlogJsonLdBuilder::findByType($graph, 'BlogPosting');

    expect($draft->og_image)->toBeNull()
        ->and($draftArticle['image'][0])->toBe(PostPublishSeoGuard::absolutePublicUrl('/uploads/media/cover.png'));
});

it('falls back to tag names in schema keywords when no seo keywords are set', function () {
    $admin = seoFieldAdmin();
    $post = BlogPost::create([
        'author_id' => $admin->id,
        'title' => 'مقال بالوسوم فقط',
        'slug' => 'tags-only-'.uniqid(),
        'content' => '<p>محتوى</p>',
        'status' => 'published',
        'published_at' => now()->subMinute(),
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
        'og_image' => 'https://amtdex.com/images/screens/projects.webp',
    ]);
    $tag = BlogTag::create(['name' => 'هندسة البرمجيات', 'slug' => 'eng-'.uniqid()]);
    $post->tags()->sync([$tag->id]);

    expect(BlogJsonLdBuilder::keywordList($post->fresh()))->toBe(['هندسة البرمجيات']);
});
