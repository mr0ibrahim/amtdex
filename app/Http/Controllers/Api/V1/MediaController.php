<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * List uploaded media files.
     */
    public function index(): JsonResponse
    {
        $media = Media::latest()->get()->map(function (Media $item) {
            return [
                'id' => (string) $item->id,
                'url' => $item->url,
                'name' => $item->name,
                'size' => $item->size,
                'mime' => $item->mime,
                'alt_text' => $item->alt_text,
            ];
        });

        return response()->json([
            'data' => $media,
        ]);
    }

    /**
     * Upload new media asset.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:10240', // 10MB max
                'mimes:jpeg,jpg,png,webp,gif,svg,pdf,mp3,wav,ogg,m4a,webm',
            ],
        ], [
            'file.required' => 'يرجى اختيار ملف لرفعه.',
            'file.max' => 'حجم الملف يتجاوز الحد المسموح (10 ميجابايت).',
            'file.mimes' => 'نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, GIF, SVG, PDF, MP3, WAV, OGG, M4A, WebM.',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $mime = strtolower((string) ($file->getMimeType() ?? ''));
        $extension = $this->extensionForMime($mime);

        if ($extension === null) {
            return response()->json([
                'message' => 'نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, GIF, SVG, PDF, MP3, WAV, OGG, M4A, WebM.',
                'errors' => ['file' => ['نوع الملف غير مدعوم.']],
            ], 422);
        }

        // Web security hardening: Prevent Stored XSS via malicious SVG files
        if ($extension === 'svg' || str_contains($mime, 'svg')) {
            $content = file_get_contents($file->getRealPath());
            if ($content !== false) {
                if (
                    preg_match('/<script[\s>]/i', $content) ||
                    preg_match('/on\w+\s*=/i', $content) ||
                    preg_match('/javascript\s*:/i', $content) ||
                    preg_match('/<!ENTITY/i', $content) ||
                    preg_match('/<foreignObject[\s>]/i', $content)
                ) {
                    return response()->json([
                        'message' => 'ملف SVG المرفوع يحتوي على وسوم غير آمنة.',
                        'errors' => ['file' => ['ملف SVG المرفوع يحتوي على وسوم أو عناصر غير آمنة (Stored XSS Prevention).']],
                    ], 422);
                }
            }
        }

        $directory = public_path('uploads/media');
        if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
            return response()->json([
                'message' => 'تعذر إنشاء مجلد الرفع. تأكد أن public/uploads قابل للكتابة.',
            ], 500);
        }

        $safeName = Str::random(24).'.'.$extension;

        // Store inside the web root so the file is served at /uploads/media/{name}
        // without depending on `php artisan storage:link` (unreliable on Hostinger).
        $path = $file->storeAs('media', $safeName, 'uploads');
        if ($path === false) {
            return response()->json([
                'message' => 'تعذر حفظ الصورة. تأكد من صلاحيات الكتابة على مجلد public/uploads.',
            ], 500);
        }

        $url = Storage::disk('uploads')->url($path);

        $media = Media::create([
            'user_id' => $request->user()?->id,
            'name' => $originalName,
            'path' => $path,
            'url' => $url,
            'size' => $file->getSize(),
            'mime' => $mime !== '' ? $mime : 'application/octet-stream',
            'disk' => 'uploads',
            'alt_text' => $request->input('alt_text'),
        ]);

        AuditLog::record("رفع ملف وسائط جديد: {$originalName}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'url' => $media->url,
            'id' => (string) $media->id,
        ], 201);
    }

    /**
     * Delete media asset.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        $disk = $media->disk ?: 'public';
        if (Storage::disk($disk)->exists($media->path)) {
            Storage::disk($disk)->delete($media->path);
        }

        $name = $media->name;
        $media->delete();

        AuditLog::record("حذف ملف وسائط: {$name}", $request->user()?->email);

        return response()->json([
            'ok' => true,
        ]);
    }

    /**
     * Map a detected MIME type to a safe stored extension.
     * Client-supplied extensions are ignored so a renamed payload cannot land as .php.
     */
    private function extensionForMime(string $mime): ?string
    {
        return match ($mime) {
            'image/jpeg', 'image/jpg', 'image/pjpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/svg+xml', 'image/svg' => 'svg',
            'application/pdf' => 'pdf',
            'audio/mpeg', 'audio/mp3' => 'mp3',
            'audio/wav', 'audio/x-wav', 'audio/wave' => 'wav',
            'audio/ogg', 'application/ogg' => 'ogg',
            'audio/mp4', 'audio/x-m4a', 'audio/m4a' => 'm4a',
            'audio/webm', 'video/webm' => 'webm',
            default => null,
        };
    }
}
