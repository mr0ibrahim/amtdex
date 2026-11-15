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
