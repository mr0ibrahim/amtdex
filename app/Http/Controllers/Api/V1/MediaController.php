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
                'mimes:jpeg,jpg,png,webp,svg,pdf',
            ],
        ], [
            'file.required' => 'يرجى اختيار ملف لرفعه.',
            'file.max' => 'حجم الملف يتجاوز الحد المسموح (10 ميجابايت).',
            'file.mimes' => 'نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, SVG, PDF.',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = strtolower($file->getClientOriginalExtension());

        // Web security hardening: Prevent Stored XSS via malicious SVG files
        if (in_array($extension, ['svg', 'svgz'], true) || str_contains(strtolower($file->getMimeType() ?? ''), 'svg')) {
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

        $safeName = Str::random(24) . '.' . $extension;

        // Store into public disk
        $path = $file->storeAs('media', $safeName, 'public');
        $url = Storage::url($path);

        $media = Media::create([
            'user_id' => $request->user()?->id,
            'name' => $originalName,
            'path' => $path,
            'url' => $url,
            'size' => $file->getSize(),
            'mime' => $file->getMimeType() ?? 'application/octet-stream',
            'disk' => 'public',
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

        if (Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }

        $name = $media->name;
        $media->delete();

        AuditLog::record("حذف ملف وسائط: {$name}", $request->user()?->email);

        return response()->json([
            'ok' => true,
        ]);
    }
}

