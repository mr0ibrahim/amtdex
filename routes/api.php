<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AuditLogController;
use App\Http\Controllers\Api\V1\ContentController;
use App\Http\Controllers\Api\V1\DashboardOverviewController;
use App\Http\Controllers\Api\V1\LeadController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\SeoController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── Public Endpoints ──
    Route::post('/contact', [LeadController::class, 'storeContact'])->middleware('throttle:10,1');
    Route::post('/quotes', [LeadController::class, 'storeQuote'])->middleware('throttle:10,1');
    Route::post('/newsletter', [NewsletterController::class, 'store'])->middleware('throttle:10,1');

    Route::get('/services', [ContentController::class, 'services']);
    Route::get('/projects', [ContentController::class, 'projects']);
    Route::get('/settings/public', [SettingsController::class, 'get']);

    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    // ── Protected Endpoints (Auth: Sanctum) ──
    Route::middleware('auth:sanctum')->group(function () {

        // Session & Current User
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Dashboard Stats
        Route::get('/dashboard/stats', [DashboardOverviewController::class, 'stats']);

        // Leads Management
        Route::get('/leads', [LeadController::class, 'index']);
        Route::patch('/leads/{id}/status', [LeadController::class, 'updateStatus'])->middleware('role:admin,editor');
        Route::delete('/leads/{id}', [LeadController::class, 'destroy'])->middleware('role:admin');

        // Content Management: Services
        Route::post('/services', [ContentController::class, 'storeService'])->middleware('role:admin,editor');
        Route::put('/services/{slug}', [ContentController::class, 'updateService'])->middleware('role:admin,editor');
        Route::delete('/services/{slug}', [ContentController::class, 'destroyService'])->middleware('role:admin');

        // Content Management: Projects
        Route::post('/projects', [ContentController::class, 'storeProject'])->middleware('role:admin,editor');
        Route::put('/projects/{slug}', [ContentController::class, 'updateProject'])->middleware('role:admin,editor');
        Route::delete('/projects/{slug}', [ContentController::class, 'destroyProject'])->middleware('role:admin');

        // SEO Metadata Management
        Route::get('/seo', [SeoController::class, 'index']);
        Route::post('/seo', [SeoController::class, 'upsert'])->middleware('role:admin,editor');
        Route::delete('/seo', [SeoController::class, 'destroy'])->middleware('role:admin');

        // Settings Management
        Route::get('/settings', [SettingsController::class, 'get']);
        Route::put('/settings', [SettingsController::class, 'update'])->middleware('role:admin');

        // User Management (Admin only)
        Route::get('/users', [UserController::class, 'index'])->middleware('role:admin');
        Route::post('/users', [UserController::class, 'store'])->middleware('role:admin');
        Route::put('/users/{id}', [UserController::class, 'update'])->middleware('role:admin');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('role:admin');

        // Audit Logs (Admin only)
        Route::get('/audit', [AuditLogController::class, 'index'])->middleware('role:admin');

        // Media Library
        Route::get('/media', [MediaController::class, 'index']);
        Route::post('/media', [MediaController::class, 'upload'])->middleware('role:admin,editor');
        Route::delete('/media/{id}', [MediaController::class, 'destroy'])->middleware('role:admin');
    });
});
