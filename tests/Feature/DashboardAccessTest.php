<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardAccessTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $author;

    private User $viewer;

    protected function setUp(): void
    {
        parent::setUp();

        $password = Hash::make('Amtdex2026!');
        $this->admin = User::create(['name' => 'أحمد الغامدي', 'email' => 'admin@amtdex.ye', 'password' => $password, 'role' => 'admin']);
        $this->editor = User::create(['name' => 'ريم الدوسري', 'email' => 'editor@amtdex.ye', 'password' => $password, 'role' => 'editor']);
        $this->author = User::create(['name' => 'فيصل المطيري', 'email' => 'author@amtdex.ye', 'password' => $password, 'role' => 'author']);
        $this->viewer = User::create(['name' => 'لينا عسيري', 'email' => 'viewer@amtdex.ye', 'password' => $password, 'role' => 'viewer']);
    }

    public function test_guest_is_redirected_from_every_dashboard_screen(): void
    {
        foreach ($this->dashboardPaths() as $path) {
            $this->get($path)
                ->assertRedirect('/login?next='.rawurlencode($path));
        }
    }

    public function test_wrong_role_receives_403_on_restricted_screens(): void
    {
        $this->actingAs($this->viewer)->get('/dashboard/users')->assertRedirect('/403');
        $this->actingAs($this->viewer)->get('/dashboard/audit')->assertRedirect('/403');
        $this->actingAs($this->viewer)->get('/dashboard/settings')->assertRedirect('/403');
        $this->actingAs($this->author)->get('/dashboard/content')->assertRedirect('/403');
        $this->actingAs($this->editor)->get('/dashboard/users')->assertRedirect('/403');
        $this->actingAs($this->viewer)->get('/dashboard')->assertOk();
        $this->actingAs($this->author)->get('/dashboard/blog')->assertOk();
        $this->actingAs($this->admin)->get('/dashboard/settings')->assertOk();
    }

    public function test_guest_is_blocked_from_every_private_api(): void
    {
        foreach ($this->privateApi() as [$method, $uri]) {
            $this->json($method, $uri)->assertUnauthorized();
        }
    }

    public function test_wrong_role_is_forbidden_on_private_api(): void
    {
        Sanctum::actingAs($this->viewer);
        $this->getJson('/api/v1/users')->assertForbidden();
        $this->getJson('/api/v1/audit')->assertForbidden();
        $this->getJson('/api/v1/settings')->assertForbidden();
        $this->deleteJson('/api/v1/leads/1')->assertForbidden();

        Sanctum::actingAs($this->editor);
        $this->getJson('/api/v1/users')->assertForbidden();
        $this->getJson('/api/v1/audit')->assertForbidden();
        $this->getJson('/api/v1/leads')->assertOk();

        Sanctum::actingAs($this->author);
        $this->getJson('/api/v1/admin/blog/posts')->assertOk();
        $this->getJson('/api/v1/leads')->assertForbidden();
    }

    public function test_login_regenerates_the_session_and_rate_limits(): void
    {
        $this->postJson('/api/v1/login', [
            'email' => 'admin@amtdex.ye',
            'password' => 'Amtdex2026!',
        ])->assertOk()->assertJsonPath('user.role', 'admin');

        $this->assertAuthenticatedAs($this->admin);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/login', [
                'email' => 'admin@amtdex.ye',
                'password' => 'wrong-password',
            ]);
        }

        $this->postJson('/api/v1/login', [
            'email' => 'admin@amtdex.ye',
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }

    /**
     * @return list<string>
     */
    private function dashboardPaths(): array
    {
        return [
            '/dashboard',
            '/dashboard/overview',
            '/dashboard/blog',
            '/dashboard/content',
            '/dashboard/leads',
            '/dashboard/media',
            '/dashboard/seo',
            '/dashboard/users',
            '/dashboard/audit',
            '/dashboard/settings',
        ];
    }

    /**
     * @return list<array{0: string, 1: string}>
     */
    private function privateApi(): array
    {
        return [
            ['GET', '/api/v1/me'],
            ['POST', '/api/v1/logout'],
            ['GET', '/api/v1/dashboard/stats'],
            ['GET', '/api/v1/leads'],
            ['PATCH', '/api/v1/leads/1/status'],
            ['DELETE', '/api/v1/leads/1'],
            ['POST', '/api/v1/services'],
            ['PUT', '/api/v1/services/web'],
            ['DELETE', '/api/v1/services/web'],
            ['POST', '/api/v1/projects'],
            ['PUT', '/api/v1/projects/noon'],
            ['DELETE', '/api/v1/projects/noon'],
            ['POST', '/api/v1/pricing'],
            ['PUT', '/api/v1/pricing/1'],
            ['DELETE', '/api/v1/pricing/1'],
            ['POST', '/api/v1/testimonials'],
            ['PUT', '/api/v1/testimonials/1'],
            ['DELETE', '/api/v1/testimonials/1'],
            ['POST', '/api/v1/faqs'],
            ['PUT', '/api/v1/faqs/1'],
            ['DELETE', '/api/v1/faqs/1'],
            ['POST', '/api/v1/team'],
            ['PUT', '/api/v1/team/1'],
            ['DELETE', '/api/v1/team/1'],
            ['POST', '/api/v1/clients'],
            ['PUT', '/api/v1/clients/1'],
            ['DELETE', '/api/v1/clients/1'],
            ['GET', '/api/v1/seo/tools'],
            ['POST', '/api/v1/seo'],
            ['DELETE', '/api/v1/seo'],
            ['GET', '/api/v1/settings'],
            ['PUT', '/api/v1/settings'],
            ['GET', '/api/v1/users'],
            ['POST', '/api/v1/users'],
            ['PUT', '/api/v1/users/1'],
            ['DELETE', '/api/v1/users/1'],
            ['GET', '/api/v1/audit'],
            ['GET', '/api/v1/media'],
            ['POST', '/api/v1/media'],
            ['DELETE', '/api/v1/media/1'],
            ['GET', '/api/v1/admin/blog/stats'],
            ['GET', '/api/v1/admin/blog/posts'],
            ['GET', '/api/v1/admin/blog/posts/1'],
            ['POST', '/api/v1/admin/blog/posts'],
            ['PUT', '/api/v1/admin/blog/posts/1'],
            ['DELETE', '/api/v1/admin/blog/posts/1'],
            ['GET', '/api/v1/admin/blog/categories'],
            ['POST', '/api/v1/admin/blog/categories'],
            ['GET', '/api/v1/admin/blog/tags'],
            ['GET', '/api/v1/admin/blog/comments'],
            ['GET', '/api/v1/admin/blog/redirects'],
            ['GET', '/api/v1/admin/blog/settings'],
            ['PUT', '/api/v1/admin/blog/settings'],
        ];
    }
}
