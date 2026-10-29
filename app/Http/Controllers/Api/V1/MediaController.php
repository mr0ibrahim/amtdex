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
        $extension = $file->getClientOriginalExtension();
        $safeName = Str::random(24) . '.' . $extension;

        // Store into public disk
        $path = $file->storeAs('media', $safeName, 'public');
        $url = Storage::url($path);

        $media = Media::create([
            'name' => $originalName,
            'path' => $path,
            'url' => $url,
            'size' => $file->getSize(),
            'mime' => $file->getMimeType() ?? 'application/octet-stream',
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

