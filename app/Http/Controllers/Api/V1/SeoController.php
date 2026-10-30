<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SeoMetadata;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoController extends Controller
{
    /**
     * List all SEO metadata rules.
     */
    public function index(): JsonResponse
    {
        $seo = SeoMetadata::all(['path', 'title', 'description', 'noindex', 'og_image']);

        return response()->json([
            'data' => $seo,
        ]);
    }

    /**
     * Upsert SEO entry for a given path.
     */
    public function upsert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'noindex' => ['nullable', 'boolean'],
            'og_image' => ['nullable', 'string', 'max:500'],
        ]);

        $entry = SeoMetadata::updateOrCreate(
            ['path' => $validated['path']],
            [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'noindex' => (bool) ($validated['noindex'] ?? false),
                'og_image' => $validated['og_image'] ?? null,
            ]
        );

        AuditLog::record("تحديث إعدادات السيو للمسار: {$entry->path}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $entry,
        ]);
    }

    /**
     * Delete SEO entry by path.
     */
    public function destroy(Request $request): JsonResponse
    {
        $path = $request->query('path');

        if (!$path) {
            return response()->json(['message' => 'Path parameter is required'], 422);
        }

        $entry = SeoMetadata::where('path', $path)->first();
        if ($entry) {
            $entry->delete();
            AuditLog::record("حذف إعداد السيو للمسار: {$path}", $request->user()?->email);
        }

        return response()->json([
            'ok' => true,
        ]);
    }
}

