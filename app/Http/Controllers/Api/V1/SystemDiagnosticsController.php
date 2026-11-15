<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SystemDiagnosticsController extends Controller
{

    public function diagnose(Request $request): JsonResponse
    {
        // Signed-in administrators only. A shared secret in the code was readable by anyone with
        // the repository, and with it the database could be re-seeded (resetting staff passwords).
        if (! $request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'ok' => false,
                'message' => 'Unauthorized access to system diagnostics.',
            ], 403);
        }

        $action = $request->query('action', 'status');
        $result = [
            'ok' => true,
            'timestamp' => now()->toIso8601String(),
            'php_version' => PHP_VERSION,
            'action' => $action,
        ];

        // 1. Check Database connection
        try {
            $pdo = DB::connection()->getPdo();
            $driver = DB::connection()->getDriverName();
            $database = DB::connection()->getDatabaseName();

            $tables = DB::select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
            $tableNames = array_map(function ($row) {
                return array_values((array) $row)[0];
            }, $tables);

            $result['database'] = [
                'status' => 'connected',
                'driver' => $driver,
                'database' => $database,
                'tables_count' => count($tableNames),
                'tables' => $tableNames,
            ];
        } catch (\Throwable $e) {
            $result['database'] = [
                'status' => 'error',
                'error' => $e->getMessage(),
            ];
        }

        // 2. Perform requested maintenance action
        if ($action === 'migrate') {
            try {
                Artisan::call('migrate', ['--force' => true]);
                $result['migrate_output'] = trim(Artisan::output());
            } catch (\Throwable $e) {
                $result['migrate_error'] = $e->getMessage();
            }
        } elseif ($action === 'clear') {
            try {
                Artisan::call('optimize:clear');
                $result['clear_output'] = trim(Artisan::output());
            } catch (\Throwable $e) {
                $result['clear_error'] = $e->getMessage();
            }
        }

        return response()->json($result);
    }

    /**
     * Run pending migrations and report which ones ran. Admin-only (route middleware),
     * POST with the dashboard's CSRF token, so a link alone cannot trigger it.
     */
    public function updateDatabase(): JsonResponse
    {
        try {
            $before = DB::table('migrations')->pluck('migration')->all();
            Artisan::call('migrate', ['--force' => true]);
            $applied = array_values(array_diff(DB::table('migrations')->pluck('migration')->all(), $before));

            return response()->json(['ok' => true, 'applied' => $applied]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('System database update failed: '.$e->getMessage());

            return response()->json(['ok' => false, 'message' => 'تعذّر تحديث قاعدة البيانات. راجع سجل الأخطاء في الخادم.'], 500);
        }
    }
}
