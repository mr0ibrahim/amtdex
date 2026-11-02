<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

it('requires auth for seo tools', function () {
    $this->getJson('/api/v1/seo/tools')->assertUnauthorized();
});

it('returns live sitemap robots links and IndexNow status for admins', function () {
    config([
        'app.url' => 'https://amtdex.com',
        'services.indexnow.enabled' => true,
        'services.indexnow.key' => 'demo-indexnow-key',
        'services.indexnow.host' => 'blog.amtdex.com',
    ]);

    $admin = User::create([
        'name' => 'مشرف SEO',
        'email' => 'seo-tools-admin@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/seo/tools');

    $response->assertOk()
        ->assertJsonPath('site_base', 'https://amtdex.com')
        ->assertJsonPath('links.robots', 'https://amtdex.com/robots.txt')
        ->assertJsonPath('links.sitemap_index', 'https://amtdex.com/sitemap.xml')
        ->assertJsonPath('links.sitemap_blog_posts', 'https://amtdex.com/sitemaps/blog-posts.xml')
        ->assertJsonPath('indexnow.enabled', true)
        ->assertJsonPath('indexnow.configured', true)
        ->assertJsonPath('indexnow.host', 'blog.amtdex.com')
        ->assertJsonPath('indexnow.key_location', 'https://blog.amtdex.com/demo-indexnow-key.txt');
});

it('auto-provisions an IndexNow key into blog settings when env key is empty', function () {
    config([
        'app.url' => 'https://amtdex.com',
        'services.indexnow.enabled' => true,
        'services.indexnow.key' => '',
        'services.indexnow.host' => 'blog.amtdex.com',
    ]);

    $admin = User::create([
        'name' => 'مشرف تفعيل IndexNow',
        'email' => 'seo-autokey-admin@amtdex.test',
        'password' => Hash::make('Amtdex2026!'),
        'role' => 'admin',
    ]);

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/seo/tools');

    $response->assertOk()
        ->assertJsonPath('indexnow.configured', true)
        ->assertJsonPath('indexnow.generated', true)
        ->assertJsonPath('indexnow.enabled', true);

    $location = $response->json('indexnow.key_location');
    expect($location)->toStartWith('https://blog.amtdex.com/')
        ->and($location)->toEndWith('.txt');

    $key = basename(parse_url($location, PHP_URL_PATH), '.txt');
    expect(\App\Models\BlogSetting::get('indexnow_key'))->toBe($key);
    $this->get('/'.$key.'.txt')->assertOk()->assertSee($key, false);
});
