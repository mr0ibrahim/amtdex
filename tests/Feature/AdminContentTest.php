<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use App\Support\CmsStore;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_and_non_editors_cannot_read_staff_collections(): void
    {
        $this->asDashboard();
        $this->getJson('/api/v1/admin/content/services')->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create(['role' => 'author']));
        $this->getJson('/api/v1/admin/content/services')->assertForbidden();
    }

    public function test_editors_can_manage_drafts_even_when_the_public_page_is_disabled(): void
    {
        $this->asDashboard();
        Sanctum::actingAs(User::factory()->create(['role' => 'editor']));
        $draft = Service::create([
            'slug' => 'draft-service',
            'title' => 'Draft service',
            'desc' => 'A hidden service',
            'is_published' => false,
        ]);
        $document = CmsStore::full();
        foreach ($document['pages'] as &$page) {
            if ($page['path'] === '/services') {
                $page['published'] = false;
            }
        }
        unset($page);
        CmsStore::save($document);

        $this->getJson('/api/v1/services')->assertNotFound();
        $this->getJson('/api/v1/admin/content/services')
            ->assertOk()
            ->assertJsonFragment(['slug' => $draft->slug, 'is_published' => false]);
    }

    public function test_staff_resource_names_are_explicitly_allowlisted(): void
    {
        $this->asDashboard();
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        foreach (['services', 'projects', 'testimonials', 'faqs', 'team', 'clients'] as $resource) {
            $this->getJson('/api/v1/admin/content/'.$resource)->assertOk()->assertJsonStructure(['data']);
        }
        $this->getJson('/api/v1/admin/content/users')->assertNotFound();
    }
}
