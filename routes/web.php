
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

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!(api|sanctum|storage|build|hot|_debugbar|feed|sitemap-blog\.xml)).*$');
