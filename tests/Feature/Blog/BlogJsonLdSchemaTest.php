<?php

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\User;
use App\Services\Blog\BlogJsonLdBuilder;
use App\Services\Blog\PostPublishSeoGuard;
use Illuminate\Support\Facades\Hash;

function schemaAdmin(): User
{
    return User::create([
        'name' => 'كاتب Schema',
        'email' => 'schema-author@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);
}

function publishedPostWithSeo(User $author, array $overrides = []): BlogPost
{
    $category = BlogCategory::create([
        'name' => 'هندسة البرمجيات',
        'slug' => 'software-engineering-schema',
        'description' => 'تصنيف اختبار Schema',
        'is_visible' => true,
        'sort_order' => 1,
    ]);

    return BlogPost::create(array_merge([
        'author_id' => $author->id,
        'category_id' => $category->id,
        'title' => 'بناء Schema من الخادم',
        'slug' => 'server-jsonld-schema',
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>محتوى مقال لاختبار JSON-LD من Laravel.</p><h2>قسم</h2><p>تفاصيل.</p>',
        'status' => 'published',
        'published_at' => now()->subDay(),
        'meta_title' => 'بناء Schema من الخادم',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح ومطابقة الـ schema.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
        'og_image' => 'https://amtdex.com/images/screens/projects.webp',
        'canonical_url' => 'https://blog.amtdex.com/posts/server-jsonld-schema',
        'schema_type' => 'BlogPosting',
        'faq_schema' => [
            ['question' => 'ما هو JSON-LD؟', 'answer' => 'صيغة بيانات منظمة لمحركات البحث.'],
        ],
    ], $overrides));
}

it('builds BlogPosting with all required fields matching the post content', function () {
    $author = schemaAdmin();
    $post = publishedPostWithSeo($author);

    $graph = BlogJsonLdBuilder::forPost($post);
    $article = BlogJsonLdBuilder::findByType($graph, 'BlogPosting');

    expect($article)->not->toBeNull();
    expect($article['headline'])->toBe($post->meta_title);
    expect($article['description'])->toBe($post->meta_description);
    expect($article['datePublished'])->toBe($post->published_at->toAtomString());
    expect($article['dateModified'])->toBe($post->updated_at->toAtomString());
    expect($article['author']['@type'])->toBe('Person');
    expect($article['author']['name'])->toBe($author->name);
    expect($article['image'])->toBe([$post->og_image]);
    expect($article['publisher']['@type'])->toBe('Organization');
    expect($article['publisher']['name'])->toBe('AMTDEX SOFT');
    expect($article['mainEntityOfPage']['@id'])->toBe($post->canonical_url);
    expect($article['articleSection'])->toBe('هندسة البرمجيات');
});

it('includes BreadcrumbList, Organization, and FAQPage when faq_schema exists', function () {
    $post = publishedPostWithSeo(schemaAdmin());
    $graph = BlogJsonLdBuilder::forPost($post);

    expect(BlogJsonLdBuilder::findByType($graph, 'BreadcrumbList'))->not->toBeNull();
    expect(BlogJsonLdBuilder::findByType($graph, 'Organization'))->not->toBeNull();

    $faq = BlogJsonLdBuilder::findByType($graph, 'FAQPage');
    expect($faq)->not->toBeNull();
    expect($faq['mainEntity'][0]['name'])->toBe('ما هو JSON-LD؟');
    expect($faq['mainEntity'][0]['acceptedAnswer']['text'])->toBe('صيغة بيانات منظمة لمحركات البحث.');
});

it('omits FAQPage when faq_schema is empty', function () {
    $post = publishedPostWithSeo(schemaAdmin(), [
        'slug' => 'no-faq-post',
        'canonical_url' => 'https://blog.amtdex.com/posts/no-faq-post',
        'faq_schema' => [],
    ]);

    $graph = BlogJsonLdBuilder::forPost($post);
    expect(BlogJsonLdBuilder::findByType($graph, 'FAQPage'))->toBeNull();
});

it('builds Organization and WebSite with SearchAction for blog home', function () {
    $graph = BlogJsonLdBuilder::forBlogHome([
        'blog_title' => 'مدونة الاختبار',
        'blog_description' => 'وصف المدونة للاختبار',
        'blog_subdomain' => 'blog.amtdex.com',
    ]);

    $org = BlogJsonLdBuilder::findByType($graph, 'Organization');
    $site = BlogJsonLdBuilder::findByType($graph, 'WebSite');

    expect($org)->not->toBeNull();
    expect($site)->not->toBeNull();
    expect($site['name'])->toBe('مدونة الاختبار');
    expect($site['potentialAction']['@type'])->toBe('SearchAction');
    expect($site['potentialAction']['target']['urlTemplate'])->toContain('?q={search_term_string}');
});

it('returns json_ld on public post API that matches published content', function () {
    $author = schemaAdmin();
    $post = publishedPostWithSeo($author, [
        'slug' => 'api-jsonld-post',
        'canonical_url' => 'https://blog.amtdex.com/posts/api-jsonld-post',
    ]);

    $response = $this->getJson('/api/v1/blog/posts/api-jsonld-post');

    $response->assertOk()
        ->assertJsonPath('post.slug', 'api-jsonld-post')
        ->assertJsonStructure(['json_ld']);

    $graph = $response->json('json_ld');
    $article = collect($graph)->firstWhere('@type', 'BlogPosting');

    expect($article['headline'])->toBe($post->meta_title);
    expect($article['author']['name'])->toBe($author->name);
    expect($article['mainEntityOfPage']['@id'])->toBe($post->canonical_url);
    expect($article['image'][0])->toBe($post->og_image);
});

it('returns json_ld on blog settings for Organization and WebSite', function () {
    $response = $this->getJson('/api/v1/blog/settings');

    $response->assertOk()->assertJsonStructure(['settings', 'json_ld']);

    $types = collect($response->json('json_ld'))->pluck('@type')->all();
    expect($types)->toContain('Organization');
    expect($types)->toContain('WebSite');
});

it('keeps schema headline aligned after publish enrichment', function () {
    $author = schemaAdmin();

    $payload = [
        'title' => 'مقال محاذاة Schema',
        'slug' => 'schema-align-publish',
        'summary' => 'ملخص تجريبي بطول كافٍ لوصف الميتا عند النشر ويغطي المتطلبات الأساسية لمحركات البحث.',
        'content' => '<p>محتوى</p>',
        'status' => 'published',
        'meta_title' => 'مقال محاذاة Schema',
        'meta_description' => 'وصف ميتا بطول مناسب تقريباً مئة وخمسين حرفاً لتمرير فحص النشر بنجاح ومطابقة الـ schema.',
        'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
    ];

    $errors = PostPublishSeoGuard::validate($payload);
    expect($errors)->toBe([]);

    $enriched = array_merge($payload, PostPublishSeoGuard::enrich($payload));
    $post = BlogPost::create(array_merge($enriched, [
        'author_id' => $author->id,
        'published_at' => now(),
    ]));

    $article = BlogJsonLdBuilder::findByType(BlogJsonLdBuilder::forPost($post), 'BlogPosting');
    expect($article['headline'])->toBe($post->meta_title);
    expect($article['description'])->toBe($post->meta_description);
    expect($article['mainEntityOfPage']['@id'])->toBe($post->canonical_url);
    expect($article['image'][0])->toBe($post->cover_image);
});
