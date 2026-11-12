<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\User;
use App\Support\ArabicText;
use App\Support\CmsStore;
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
        $this->assertSame('صنعاء — الجمهورية اليمنية', $response->json('copy')['footer.city']);
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
        $this->putJson('/api/v1/cms', $doc)->assertOk();
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
        $this->putJson('/api/v1/cms', CmsStore::full())->assertForbidden();
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
}
