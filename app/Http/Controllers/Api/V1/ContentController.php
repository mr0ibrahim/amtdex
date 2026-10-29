<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ContentController extends Controller
{
    // ── SERVICES ──

    public function services(): JsonResponse
    {
        $services = Service::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $services,
        ]);
    }

    public function storeService(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'unique:services,slug'],
            'icon' => ['nullable', 'string', 'max:50'],
            'desc' => ['required', 'string'],
            'bullets' => ['nullable', 'array'],
            'tech' => ['nullable', 'array'],
            'detail' => ['nullable', 'string'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['icon'] = $validated['icon'] ?? 'web';
        $validated['is_published'] = true;

        $service = Service::create($validated);

        AuditLog::record("إضافة خدمة جديدة: {$service->title}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $service,
        ], 201);
    }

    public function updateService(Request $request, string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'desc' => ['sometimes', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'bullets' => ['nullable', 'array'],
            'tech' => ['nullable', 'array'],
            'detail' => ['nullable', 'string'],
        ]);

        $service->update($validated);

        AuditLog::record("تعديل خدمة: {$service->slug}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $service,
        ]);
    }

    public function destroyService(Request $request, string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)->firstOrFail();
        $title = $service->title;
        $service->delete();

        AuditLog::record("حذف خدمة: {$title}", $request->user()?->email);

        return response()->json([
            'ok' => true,
        ]);
    }

    // ── PROJECTS ──

    public function projects(): JsonResponse
    {
        $projects = Project::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $projects,
        ]);
    }

    public function storeProject(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'unique:projects,slug'],
            'cat' => ['required', 'string'],
            'client' => ['required', 'string'],
            'year' => ['nullable', 'string'],
            'stack' => ['nullable', 'array'],
            'color' => ['nullable', 'string'],
            'accent' => ['nullable', 'string'],
            'summary' => ['required', 'string'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['is_published'] = true;

        $project = Project::create($validated);

        AuditLog::record("إضافة مشروع جديد: {$project->title}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $project,
        ], 201);
    }

    public function updateProject(Request $request, string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'cat' => ['sometimes', 'string'],
            'client' => ['sometimes', 'string'],
            'year' => ['nullable', 'string'],
            'stack' => ['nullable', 'array'],
            'color' => ['nullable', 'string'],
            'accent' => ['nullable', 'string'],
            'summary' => ['sometimes', 'string'],
        ]);

        $project->update($validated);

        AuditLog::record("تعديل مشروع: {$project->slug}", $request->user()?->email);

        return response()->json([
            'ok' => true,
            'data' => $project,
        ]);
    }

    public function destroyProject(Request $request, string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        $title = $project->title;
        $project->delete();

        AuditLog::record("حذف مشروع: {$title}", $request->user()?->email);

        return response()->json([
            'ok' => true,
        ]);
    }
}

