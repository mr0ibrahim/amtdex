<?php

use App\Http\Controllers\Api\V1\Blog\PublicBlogController;
use App\Http\Controllers\BlogSeoController;
use Illuminate\Support\Facades\Route;

// Dynamic RSS 2.0 Feed for Blog
Route::get('/feed', [PublicBlogController::class, 'feed']);

// SEO: robots + sitemap index + child sitemaps
Route::get('/robots.txt', [BlogSeoController::class, 'robots']);
Route::get('/sitemap.xml', [BlogSeoController::class, 'sitemapIndex']);
Route::get('/sitemaps/pages.xml', [BlogSeoController::class, 'sitemapPages']);
Route::get('/sitemaps/blog-posts.xml', [BlogSeoController::class, 'sitemapBlogPosts']);
Route::get('/sitemaps/blog-posts-{chunk}.xml', [BlogSeoController::class, 'sitemapBlogPosts'])
    ->whereNumber('chunk');
Route::get('/sitemaps/blog-categories.xml', [BlogSeoController::class, 'sitemapBlogCategories']);
Route::get('/sitemaps/blog-tags.xml', [BlogSeoController::class, 'sitemapBlogTags']);

// Back-compat blog urlset
Route::get('/sitemap-blog.xml', [BlogSeoController::class, 'sitemapBlogLegacy']);

// IndexNow key ownership file
Route::get('/{key}.txt', [BlogSeoController::class, 'indexNowKey'])
    ->where('key', '[A-Za-z0-9_-]{8,128}');

// 301 Permanent Redirect: /blog and /blog/* on main domain -> Subdomain
Route::get('/blog/{path?}', function (?string $path = null) {
    if (! \App\Support\PageVisibility::isPublished('/blog')) {
        return response()->view('app', [], 404);
    }
    $host = request()->getHost();
    $subdomain = env('BLOG_SUBDOMAIN', 'blog.amtdex.com');
    if (str_starts_with($host, 'blog.')) {
        return view('app');
    }
    $scheme = request()->getScheme();
    $target = "{$scheme}://{$subdomain}/" . ltrim($path ?? '', '/');
    return redirect($target, 301);
})->where('path', '.*');

Route::get('/google-site-verification.html', function () {
    $path = public_path('google-site-verification.html');
    abort_unless(is_file($path), 404);

    return response(file_get_contents($path), 200, ['Content-Type' => 'text/html; charset=UTF-8']);
});

$registerDashboard = function () {
    Route::middleware('dashboard.access')->get('/dashboard/{path?}', function () {
        return view('app');
    })->where('path', '.*');
    Route::get('/login', fn () => view('app'));
    Route::get('/403', fn () => view('app'));
};

// Host isolation is opt-in. An empty DASHBOARD_DOMAIN serves the dashboard
// on the main host. A dedicated host 404s these paths everywhere else.
if (\App\Support\DashboardHost::isolated()) {
    Route::domain(\App\Support\DashboardHost::name())->group($registerDashboard);
    Route::get('/dashboard/{path?}', fn () => abort(404))->where('path', '.*');
    Route::get('/login', fn () => abort(404));
    Route::get('/403', fn () => view('app'));
} else {
    $registerDashboard();
}

$spaExclude = '^(?!(api|sanctum|storage|build|hot|_debugbar|feed|robots\.txt|sitemap\.xml|sitemap-blog\.xml|sitemaps/|dashboard|login)).*$';

// Subdomain redirection for non-blog routes & SPA fallback
Route::get('/{any?}', function (?string $any = null) {
    $host = request()->getHost();

    if (\App\Support\DashboardHost::matches(request())) {
        abort(404);
    }

    $path = '/'.ltrim($any ?? '', '/');

    // If request arrives at the blog subdomain
    if (str_starts_with($host, 'blog.')) {
        $bare = ltrim($any ?? '', '/');

        if ($bare === '' || preg_match('#^(posts|categories|tags)(/|$)#', $bare)) {
            if (! \App\Support\PageVisibility::isPublished('/blog')) {
                return response()->view('app', [], 404);
            }

            return view('app');
        }

        if ($bare === 'dashboard' || str_starts_with($bare, 'dashboard/') || $bare === 'login') {
            abort(404);
        }

        $scheme = request()->getScheme();
        $mainDomain = preg_replace('/^blog\./', '', $host);
        return redirect("{$scheme}://{$mainDomain}/{$bare}", 301);
    }

    if (! \App\Support\PageVisibility::isPublished($path)) {
        return response()->view('app', [], 404);
    }

    return view('app');
})->where('any', $spaExclude);
