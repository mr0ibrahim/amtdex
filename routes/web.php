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
    $host = request()->getHost();
    $subdomain = env('BLOG_SUBDOMAIN', 'blog.amtdex.com');
    if (str_starts_with($host, 'blog.')) {
        return view('app');
    }
    $scheme = request()->getScheme();
    $target = "{$scheme}://{$subdomain}/" . ltrim($path ?? '', '/');
    return redirect($target, 301);
})->where('path', '.*');

$spaExclude = '^(?!(api|sanctum|storage|build|hot|_debugbar|feed|robots\.txt|sitemap\.xml|sitemap-blog\.xml|sitemaps/)).*$';

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
})->where('any', $spaExclude);
