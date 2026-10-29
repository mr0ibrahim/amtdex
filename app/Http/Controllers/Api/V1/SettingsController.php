<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Retrieve site settings.
     */
    public function get(): JsonResponse
    {
        return response()->json(SiteSetting::getAsMap());
    }

    /**
     * Update site settings (Admin only).
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'siteName' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string', 'max:50'],
        ]);

        SiteSetting::updateFromMap($validated);

        AuditLog::record('تحديث إعدادات الموقع العامة', $request->user()?->email);

        return response()->json([
            'ok' => true,
        ]);
    }
}

