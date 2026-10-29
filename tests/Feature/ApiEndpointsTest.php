<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Project;
use App\Models\SeoMetadata;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $editor;
    protected User $viewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'أحمد الغامدي',
            'email' => 'admin@amtdex.ye',
            'password' => Hash::make('Amtdex2026!'),
            'role' => 'admin',
        ]);

        $this->editor = User::create([
            'name' => 'ريم الدوسري',
            'email' => 'editor@amtdex.ye',
            'password' => Hash::make('Amtdex2026!'),
            'role' => 'editor',
        ]);

        $this->viewer = User::create([
            'name' => 'لينا عسيري',
            'email' => 'viewer@amtdex.ye',
            'password' => Hash::make('Amtdex2026!'),
            'role' => 'viewer',
        ]);
    }

    public function test_contact_form_submits_successfully(): void
    {
        $payload = [
            'name' => 'سارة العتيبي',
            'email' => 'sara@example.com',
            'phone' => '+966500000000',
            'subject' => 'web',
            'message' => 'طلب تطوير منصة تجارية متكاملة مع بوابات دفع.',
        ];

        $response = $this->postJson('/api/v1/contact', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'ok' => true,
                'message' => 'تم استلام رسالتك بنجاح، وسنتواصل معك خلال 24 ساعة.',
            ]);

        $this->assertDatabaseHas('leads', [
            'email' => 'sara@example.com',
            'source' => 'contact',
            'status' => 'جديد',
        ]);
    }

    public function test_contact_form_validation_errors(): void
    {
        $response = $this->postJson('/api/v1/contact', [
            'name' => 'A', // too short
            'email' => 'invalid-email',
            'phone' => '12', // too short
            'message' => 'short', // too short
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'phone', 'message']);
    }

    public function test_quote_request_submits_successfully(): void
    {
        $payload = [
            'service' => 'mobile',
            'budget' => '30K — 80K',
            'timeline' => 'مرن — 3 أشهر',
            'name' => 'عمر الحربي',
            'email' => 'omar@example.com',
            'phone' => '+967770000000',
            'details' => 'تطبيق لتوصيل طلبات المطاعم مع لوحة إدارة ولوحة مناديب.',
        ];

        $response = $this->postJson('/api/v1/quotes', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'ok' => true,
                'message' => 'تم تقديم طلب عرض السعر بنجاح.',
            ]);

        $this->assertDatabaseHas('leads', [
            'email' => 'omar@example.com',
            'source' => 'quote',
        ]);
    }

    public function test_newsletter_subscription(): void
    {
        $response = $this->postJson('/api/v1/newsletter', [
            'email' => 'subscriber@example.com',
        ]);

        $response->assertStatus(201)
            ->assertJson(['ok' => true]);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'subscriber@example.com',
            'is_active' => true,
        ]);
    }

    public function test_public_content_endpoints(): void
    {
        Service::create([
            'slug' => 'web-test',
            'title' => 'تطوير المواقع التجريبية',
            'desc' => 'وصف تجريبي',
            'icon' => 'web',
            'is_published' => true,
        ]);

        Project::create([
            'slug' => 'project-test',
            'title' => 'مشروع تجريبي',
            'cat' => 'web',
            'client' => 'عميل تجريبي',
            'summary' => 'ملخص تجريبي',
            'is_published' => true,
        ]);

        SiteSetting::updateFromMap(['siteName' => 'Amtdex Pro']);

        $this->getJson('/api/v1/services')
            ->assertStatus(200)
            ->assertJsonFragment(['slug' => 'web-test']);

        $this->getJson('/api/v1/projects')
            ->assertStatus(200)
            ->assertJsonFragment(['slug' => 'project-test']);

        $this->getJson('/api/v1/settings/public')
            ->assertStatus(200)
            ->assertJson(['siteName' => 'Amtdex Pro']);
    }

    public function test_authentication_flow(): void
    {
        // Unauthenticated access to /me
        $this->getJson('/api/v1/me')->assertStatus(401);

        // Failed login
        $this->postJson('/api/v1/login', [
            'email' => 'admin@amtdex.ye',
            'password' => 'WrongPassword!',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['email']);

        // Successful login
        $response = $this->postJson('/api/v1/login', [
            'email' => 'admin@amtdex.ye',
            'password' => 'Amtdex2026!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'email' => 'admin@amtdex.ye',
                    'role' => 'admin',
                ],
            ]);

        // Authenticated access to /me
        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/me')
            ->assertStatus(200)
            ->assertJson([
                'user' => [
                    'email' => 'admin@amtdex.ye',
                    'role' => 'admin',
                ],
            ]);

        // Logout
        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/logout')
            ->assertStatus(200)
            ->assertJson(['ok' => true]);
    }

    public function test_dashboard_stats_and_leads_rbac(): void
    {
        $lead = Lead::create([
            'name' => 'طلب للتجربة',
            'email' => 'lead@test.com',
            'phone' => '+966555555555',
            'message' => 'رسالة تجريبية للتأكد من الصلاحيات',
            'status' => 'جديد',
            'source' => 'contact',
        ]);

        // Unauthenticated
        $this->getJson('/api/v1/dashboard/stats')->assertStatus(401);
        $this->getJson('/api/v1/leads')->assertStatus(401);

        // Viewer can view
        $this->actingAs($this->viewer, 'sanctum')
            ->getJson('/api/v1/dashboard/stats')
            ->assertStatus(200);

        $this->actingAs($this->viewer, 'sanctum')
            ->getJson('/api/v1/leads')
            ->assertStatus(200)
            ->assertJsonFragment(['email' => 'lead@test.com']);

        // Viewer CANNOT update status (403)
        $this->actingAs($this->viewer, 'sanctum')
            ->patchJson("/api/v1/leads/{$lead->id}/status", ['status' => 'تم التواصل'])
            ->assertStatus(403);

        // Editor CAN update status (200)
        $this->actingAs($this->editor, 'sanctum')
            ->patchJson("/api/v1/leads/{$lead->id}/status", ['status' => 'تم التواصل'])
            ->assertStatus(200)
            ->assertJson(['ok' => true]);

        // Editor CANNOT delete lead (403)
        $this->actingAs($this->editor, 'sanctum')
            ->deleteJson("/api/v1/leads/{$lead->id}")
            ->assertStatus(403);

        // Admin CAN delete lead (200)
        $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/v1/leads/{$lead->id}")
            ->assertStatus(200)
            ->assertJson(['ok' => true]);

        $this->assertDatabaseMissing('leads', ['id' => $lead->id]);
    }

    public function test_content_and_seo_management_rbac(): void
    {
        // Editor creates service
        $servicePayload = [
            'slug' => 'cyber-sec',
            'title' => 'الأمن السيبراني',
            'desc' => 'حماية متقدمة',
            'icon' => 'security',
        ];

        $this->actingAs($this->editor, 'sanctum')
            ->postJson('/api/v1/services', $servicePayload)
            ->assertStatus(201);

        // Editor CANNOT delete service (403)
        $this->actingAs($this->editor, 'sanctum')
            ->deleteJson('/api/v1/services/cyber-sec')
            ->assertStatus(403);

        // Admin CAN delete service (200)
        $this->actingAs($this->admin, 'sanctum')
            ->deleteJson('/api/v1/services/cyber-sec')
            ->assertStatus(200);

        // SEO Upsert
        $this->actingAs($this->editor, 'sanctum')
            ->postJson('/api/v1/seo', [
                'path' => '/custom-path',
                'title' => 'صفحة تجريبية',
                'description' => 'وصف الصفحة التجريبية',
                'noindex' => false,
            ])
            ->assertStatus(200);

        $this->assertDatabaseHas('seo_metadata', ['path' => '/custom-path']);

        // Settings update (Admin only)
        $this->actingAs($this->editor, 'sanctum')
            ->putJson('/api/v1/settings', [
                'siteName' => 'Hack Attempt',
                'email' => 'hack@test.com',
                'phone' => '+123456',
            ])
            ->assertStatus(403);

        $this->actingAs($this->admin, 'sanctum')
            ->putJson('/api/v1/settings', [
                'siteName' => 'Amtdex Official',
                'email' => 'info@amtdex.ye',
                'phone' => '+967 711 000 000',
            ])
            ->assertStatus(200)
            ->assertJson(['ok' => true]);
    }
}
