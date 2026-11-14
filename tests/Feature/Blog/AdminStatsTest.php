<?php

namespace Tests\Feature\Blog;

use App\Models\BlogCategory;
use App\Models\BlogTag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_stats_returns_flat_totals_including_categories_and_tags(): void
    {
        $this->asDashboard();
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        BlogCategory::create(['name' => 'Development', 'slug' => 'development']);
        BlogTag::create(['name' => 'Laravel', 'slug' => 'laravel']);

        $this->getJson('/api/v1/admin/blog/stats')
            ->assertOk()
            ->assertJsonPath('total_posts', 0)
            ->assertJsonPath('published_posts', 0)
            ->assertJsonPath('categories_count', 1)
            ->assertJsonPath('tags_count', 1)
            ->assertJsonStructure(['total_views', 'pending_comments', 'top_posts', 'recent_comments']);
    }
}
