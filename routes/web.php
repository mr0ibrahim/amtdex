<?php

use App\Http\Controllers\Api\V1\Blog\PublicBlogController;
use Illuminate\Support\Facades\Route;

// Dynamic RSS 2.0 Feed for Blog
Route::get('/feed', [PublicBlogController::class, 'feed']);

// Dynamic Blog XML Sitemap
Route::get('/sitemap-blog.xml', [PublicBlogController::class, 'sitemap']);

// 301 Permanent Redirect: /blog and /blog/* on main domain -> Subdomain
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

// Subdomain redirection for non-blog routes & SPA fallback
Route::get('/{any?}', function (?string $any = null) {
    $host = request()->getHost();

    // If request arrives at the blog subdomain
    if (str_starts_with($host, 'blog.')) {
        $path = ltrim($any ?? '', '/');

        // Root or paths that belong to the blog
        if ($path === '' || preg_match('#^(posts|categories|tags)(/|$)#', $path)) {
            return view('app');
        }

        // Any non-blog route on blog subdomain (e.g. /about, /services, /dashboard, etc.)
        // permanently redirects (301) to the main domain
        $scheme = request()->getScheme();
        $mainDomain = preg_replace('/^blog\./', '', $host);
        return redirect("{$scheme}://{$mainDomain}/{$path}", 301);
    }

    return view('app');
})->where('any', '^(?!(api|sanctum|storage|build|hot|_debugbar|feed|sitemap-blog\.xml)).*$');
