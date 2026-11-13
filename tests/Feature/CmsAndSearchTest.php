<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\User;
use App\Support\ArabicText;
use App\Support\CmsStore;
use App\Support\CmsDefaults;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CmsAndSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_cms_hides_unpublished_pages_and_keeps_default_copy(): void
    {
        $response = $this->getJson('/api/v1/cms');
        $response->assertOk();
        $this->assertSame('اليمن - إب', $response->json('copy')['footer.city']);
        $this->assertContains('/services', array_column($response->json('pages'), 'path'));
    }

    public function test_editor_can_unpublish_a_page_and_it_leaves_the_public_payload(): void
    {
        $editor = User::create([
            'name' => 'ريم الدوسري',
            'email' => 'editor@amtdex.ye',
            'password' => Hash::make('Amtdex2026!'),
            'role' => 'editor',
        ]);
        Sanctum::actingAs($editor);
        $doc = CmsStore::full();
        foreach ($doc['pages'] as &$page) {
            if ($page['path'] === '/pricing') {
                $page['published'] = false;
            }
        }
        $this->asDashboard()->putJson('/api/v1/cms', $doc)->assertOk();
        $this->onDashboard = false;
        $this->assertNotContains('/pricing', CmsStore::publishedPaths());
        $this->getJson('/api/v1/cms')->assertJsonMissing(['path' => '/pricing']);
        $this->assertTrue(AuditLog::query()->where('action', 'تحديث محتوى الموقع')->exists());
    }

    public function test_viewer_cannot_update_cms(): void
    {
        $viewer = User::create([
            'name' => 'لينا عسيري',
            'email' => 'viewer@amtdex.ye',
            'password' => Hash::make('Amtdex2026!'),
            'role' => 'viewer',
        ]);
        Sanctum::actingAs($viewer);
        $this->asDashboard()->putJson('/api/v1/cms', CmsStore::full())->assertForbidden();
    }

    public function test_arabic_search_matches_normalized_title(): void
    {
        $author = User::create([
            'name' => 'أحمد الغامدي',
            'email' => 'admin@amtdex.ye',
            'password' => Hash::make('Amtdex2026!'),
            'role' => 'admin',
        ]);
        BlogPost::create([
            'author_id' => $author->id,
            'title' => 'إدارة الأعمال بالفاتورة',
            'slug' => 'invoice-ops',
            'summary' => 'ملخص قصير',
            'content' => '<p>محتوى</p>',
            'status' => 'published',
            'published_at' => now(),
            'reading_time_minutes' => 1,
        ]);

        $this->assertSame('اداره الاعمال بالفاتوره', ArabicText::normalize('إدارة الأعمال بالفاتورة'));
        $this->getJson('/api/v1/blog/posts?q='.urlencode('اداره'))
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'invoice-ops');
    }
    public function test_hidden_sections_and_navigation_stay_hidden_after_merge(): void
    {
        $doc = CmsDefaults::document();
        $doc['homeSections'][0]['visible'] = false;
        $doc['nav'][0]['visible'] = false;
        $merged = CmsStore::merge($doc);
        $this->assertFalse($merged['homeSections'][0]['visible']);
        $this->assertFalse($merged['nav'][0]['visible']);
        $ids = array_column($merged['homeSections'], 'id');
        $this->assertContains('contact', $ids);
        $this->assertNotContains('newsletter', $ids);
        $this->assertNotContains('marquee', $ids);
    }

    public function test_private_content_lists_include_inactive_records_for_editors(): void
    {
        $editor = User::create(['name' => 'Editor', 'email' => 'content-editor@example.com', 'password' => Hash::make('test-password'), 'role' => 'editor']);
        $record = \App\Models\Testimonial::create(['author' => 'Hidden customer', 'role' => '', 'company' => '', 'content' => 'Private inactive review', 'rating' => 5, 'sort_order' => 1, 'is_active' => false]);
        Sanctum::actingAs($editor);
        $this->asDashboard()->getJson('/api/v1/admin/content/testimonials')->assertOk()->assertJsonFragment(['id' => $record->id, 'is_active' => false]);
    }

    public function test_viewer_cannot_read_private_content_lists(): void
    {
        $viewer = User::create(['name' => 'Viewer', 'email' => 'content-viewer@example.com', 'password' => Hash::make('test-password'), 'role' => 'viewer']);
        Sanctum::actingAs($viewer);
        $this->asDashboard()->getJson('/api/v1/admin/content/testimonials')->assertForbidden();
    }

    public function test_editor_can_create_a_review_without_employer_or_job_title(): void
    {
        $editor = User::create(['name' => 'Editor', 'email' => 'review-editor@example.com', 'password' => Hash::make('test-password'), 'role' => 'editor']);
        Sanctum::actingAs($editor);
        $this->asDashboard()->postJson('/api/v1/testimonials', ['author' => 'Customer', 'content' => 'A genuine review', 'rating' => 5])->assertCreated()->assertJsonPath('data.role', '')->assertJsonPath('data.company', '');
    }

}
