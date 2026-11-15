<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemDiagnosticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_and_query_secrets_are_refused(): void
    {
        $this->getJson('/api/v1/system/diagnose')->assertForbidden();
        $this->getJson('/api/v1/system/diagnose?secret=anything&action=migrate')->assertForbidden();
    }

    public function test_non_admin_staff_are_refused(): void
    {
        $editor = $this->user('editor');

        $this->actingAs($editor)->getJson('/api/v1/system/diagnose')->assertForbidden();
    }

    public function test_seeding_is_no_longer_available(): void
    {
        $admin = $this->user('admin');

        $this->actingAs($admin)->getJson('/api/v1/system/diagnose?action=seed')
            ->assertOk()
            ->assertJsonMissingPath('seed_output');
    }

    public function test_database_update_requires_an_admin(): void
    {
        $this->postJson('/api/v1/admin/system/update-database')->assertUnauthorized();
        $this->actingAs($this->user('editor'))->postJson('/api/v1/admin/system/update-database')->assertForbidden();
    }

    public function test_admin_can_apply_pending_database_updates(): void
    {
        $this->actingAs($this->user('admin'))->postJson('/api/v1/admin/system/update-database')
            ->assertOk()
            ->assertJson(['ok' => true])
            ->assertJsonStructure(['applied']);
    }

    private function user(string $role): User
    {
        return User::create([
            'name' => ucfirst($role),
            'email' => $role.'@example.test',
            'password' => 'password-for-tests',
            'role' => $role,
        ]);
    }
}
