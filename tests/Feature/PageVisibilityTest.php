<?php

namespace Tests\Feature;

use App\Support\CmsStore;
use App\Support\PageVisibility;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_each_hidden_page_is_a_real_404_and_leaves_navigation(): void
    {
        $apis = [
            '/services' => '/api/v1/services',
            '/portfolio' => '/api/v1/projects',
            '/pricing' => '/api/v1/pricing',
            '/about' => '/api/v1/faqs',
            '/blog' => '/api/v1/blog/posts',
        ];

        foreach (array_column(CmsStore::full()['pages'], 'path') as $path) {
            $doc = CmsStore::full();
            foreach ($doc['pages'] as &$page) {
                $page['published'] = $page['path'] !== $path;
            }
            unset($page);
            CmsStore::save($doc);

            $this->get($path === '/' ? '/' : $path)->assertNotFound();
            $html = $this->get($path === '/' ? '/' : $path)->getContent();
            $this->assertStringContainsString('__CMS_VISIBILITY__', $html);
            $this->assertStringNotContainsString('"path":"'.$path.'"', $html);

            if (isset($apis[$path])) {
                $this->getJson($apis[$path])->assertNotFound();
            }

            $sitemap = $this->get('/sitemap.xml')->assertOk()->getContent();
            if ($path !== '/') {
                $this->assertStringNotContainsString($path, $sitemap);
            }
        }
    }

    public function test_public_host_hides_dashboard_and_login(): void
    {
        $this->get('/dashboard')->assertNotFound();
        $this->get('/login')->assertNotFound();
        $this->postJson('/api/v1/login', [
            'email' => 'admin@amtdex.ye',
            'password' => 'Amtdex2026!',
        ])->assertNotFound();
        $this->get('/')->assertOk();
    }

    public function test_dashboard_host_serves_login_and_marks_it_noindex(): void
    {
        $this->asDashboard();
        $this->get('/login')
            ->assertOk()
            ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
        $this->get('/pricing')->assertNotFound();
    }

    public function test_visibility_helper_treats_nested_urls_as_their_page(): void
    {
        $doc = CmsStore::full();
        foreach ($doc['pages'] as &$page) {
            if ($page['path'] === '/services') {
                $page['published'] = false;
            }
        }
        unset($page);
        CmsStore::save($doc);

        $this->assertFalse(PageVisibility::isPublished('/services/web'));
        $this->get('/services/web')->assertNotFound();
    }
}
