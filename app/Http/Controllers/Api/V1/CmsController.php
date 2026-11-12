<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Support\CmsStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $preview = $request->boolean('preview') && $request->user() && in_array($request->user()->role, ['admin', 'editor'], true);

        return response()->json(CmsStore::forPublic($preview));
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'copy' => 'sometimes|array',
            'copy.*' => 'nullable|string|max:5000',
            'pages' => 'required|array|min:1',
            'pages.*.path' => 'required|string|starts_with:/|max:120',
            'pages.*.label' => 'required|string|max:80',
            'pages.*.published' => 'required|boolean',
            'pages.*.seoTitle' => 'nullable|string|max:160',
            'pages.*.seoDescription' => 'nullable|string|max:320',
            'nav' => 'required|array|min:1',
            'nav.*.id' => 'required|string|max:40',
            'nav.*.label' => 'required|string|max:80',
            'nav.*.to' => 'required|string|starts_with:/|max:120',
            'nav.*.visible' => 'required|boolean',
            'homeSections' => 'required|array|min:1',
            'homeSections.*.id' => 'required|string|max:40',
            'homeSections.*.label' => 'required|string|max:80',
            'homeSections.*.visible' => 'required|boolean',
            'homeSections.*.image' => 'nullable|string|max:500',
            'homeSections.*.fields' => 'nullable|array',
            'homeSections.*.fields.*' => 'nullable|string|max:5000',
        ]);

        $saved = CmsStore::save($data);
        AuditLog::record('تحديث محتوى الموقع', $request->user()?->email, [
            'pages' => count($saved['pages']),
            'sections' => count($saved['homeSections']),
        ]);

        return response()->json($saved);
    }
}
