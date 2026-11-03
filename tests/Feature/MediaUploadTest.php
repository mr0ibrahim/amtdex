<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        foreach (glob(public_path('uploads/media/*')) ?: [] as $file) {
            if (is_file($file)) {
                @unlink($file);
            }
        }

        parent::tearDown();
    }

    public function test_blog_image_is_stored_in_the_public_uploads_directory(): void
    {
        $admin = User::create([
            'name' => 'أحمد الغامدي',
            'email' => 'admin@amtdex.ye',
            'password' => Hash::make('Amtdex2026!'),
            'role' => 'admin',
        ]);

        $upload = UploadedFile::fake()->image('cover.png', 1200, 630);

        $response = $this->actingAs($admin, 'sanctum')->post('/api/v1/media', [
            'file' => $upload,
        ]);

        $response->assertCreated()
            ->assertJsonPath('ok', true);

        $url = $response->json('url');
        $this->assertIsString($url);
        $this->assertMatchesRegularExpression('#^/uploads/media/[A-Za-z0-9]{24}\.png$#', $url);
        $this->assertStringNotContainsString('localhost', $url);

        $absolute = public_path(ltrim($url, '/'));
        $this->assertFileExists($absolute);

        $media = Media::query()->first();
        $this->assertNotNull($media);
        $this->assertSame($url, $media->url);
        $this->assertSame('uploads', $media->disk);
        $this->assertFalse(Storage::disk('public')->exists($media->path));

        $this->actingAs($admin, 'sanctum')
            ->deleteJson('/api/v1/media/'.$media->id)
            ->assertOk();

        $this->assertFileDoesNotExist($absolute);
        $this->assertDatabaseMissing('media', ['id' => $media->id]);
    }

    public function test_audio_attachment_is_stored_with_a_safe_extension(): void
    {
        $admin = User::create([
            'name' => 'أحمد الغامدي',
            'email' => 'audio-admin@amtdex.ye',
            'password' => Hash::make('Amtdex2026!'),
            'role' => 'admin',
        ]);

        $upload = UploadedFile::fake()->create('voice.mp3', 40, 'audio/mpeg');

        $response = $this->actingAs($admin, 'sanctum')->post('/api/v1/media', [
            'file' => $upload,
        ]);

        $response->assertCreated();
        $url = $response->json('url');
        $this->assertIsString($url);
        $this->assertMatchesRegularExpression('#^/uploads/media/[A-Za-z0-9]{24}\.mp3$#', $url);
        $this->assertFileExists(public_path(ltrim($url, '/')));
    }
}
