<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    /**
     * List recent audit logs and security stats.
     */
    public function index(): JsonResponse
    {
        $logs = AuditLog::query()
            ->latest('id')
            ->take(100)
            ->get()
            ->map(fn (AuditLog $log) => $log->toApiResponse());

        return response()->json([
            'data' => $logs,
            'blockedIps' => [],
        ]);
    }
}

