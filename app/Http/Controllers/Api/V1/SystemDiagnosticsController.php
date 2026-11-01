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
    private const SECRET = 'Amtdex#SecCheck2026';

    public function diagnose(Request $request): JsonResponse
    {
        $token = $request->query('secret') ?? $request->header('X-Diagnostics-Secret');
        $isAdmin = $request->user() && $request->user()->role === 'admin';

        if ($token !== self::SECRET && !$isAdmin) {
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
        } elseif ($action === 'seed') {
            try {
                Artisan::call('db:seed', ['--force' => true]);
                $result['seed_output'] = trim(Artisan::output());
            } catch (\Throwable $e) {
                $result['seed_error'] = $e->getMessage();
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
}
