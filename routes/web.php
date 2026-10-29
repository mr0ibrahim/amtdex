<?php

use App\Http\Controllers\Api\V1\Blog\PublicBlogController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// Health check endpoint for database diagnosis
Route::get('/api/health-check', function () {
    try {
        DB::connection()->getPdo();
        return response()->json([
            'status' => 'ok',
            'database' => 'connected',
            'posts_count' => DB::table('blog_posts')->count(),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'host' => config('database.connections.mysql.host'),
            'port' => config('database.connections.mysql.port'),
            'user' => config('database.connections.mysql.username'),
        ], 500);
    }
});

// Dynamic RSS 2.0 Feed for Blog
Route::get('/feed', [PublicBlogController::class, 'feed']);

// Dynamic Blog XML Sitemap
Route::get('/sitemap-blog.xml', [PublicBlogController::class, 'sitemap']);

// 301 Permanent Redirect: /blog and /blog/* -> Subdomain
Route::get('/blog/{path?}', function (?string $path = null) {
    $host = request()->getHost();
    $subdomain = env('BLOG_SUBDOMAIN', 'blog.amtdex.com');
    if (str_starts_with($host, 'blog.')) {
        return view('app');
    }
    $scheme = request()->getScheme();
    $target = "{$scheme}://{$subdomain}/" . ltrim($path ?? '', '/');
    return redirect($target, 301);
})->where('path', '.*');

// SPA Fallback Route
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!(api|sanctum|storage|build|hot|_debugbar|feed|sitemap-blog\.xml)).*$');
