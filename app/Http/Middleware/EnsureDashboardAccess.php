<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureDashboardAccess
{
    /**
     * Roles allowed to open each dashboard screen.
     * The first matching prefix wins. Overview is the fallback.
     *
     * @var array<string, list<string>>
     */
    public const ROLES = [
        'dashboard/users' => ['admin'],
        'dashboard/audit' => ['admin'],
        'dashboard/settings' => ['admin'],
        'dashboard/legacy' => ['admin'],
        'dashboard/content' => ['admin', 'editor'],
        'dashboard/site' => ['admin', 'editor'],
        'dashboard/seo' => ['admin', 'editor'],
        'dashboard/leads' => ['admin', 'editor', 'viewer'],
        'dashboard/media' => ['admin', 'editor', 'author'],
        'dashboard/blog' => ['admin', 'editor', 'author'],
    ];

    public const ANY_DASHBOARD = ['admin', 'editor', 'author', 'viewer'];

    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        if (str_starts_with($host, 'blog.')) {
            $scheme = $request->getScheme();
            $main = preg_replace('/^blog\./', '', $host);
            $path = ltrim($request->path(), '/');

            return redirect("{$scheme}://{$main}/{$path}", 301);
        }

        $user = $request->user();
        if (!$user) {
            $nextUrl = $request->getRequestUri();

            return redirect('/login?next='.rawurlencode($nextUrl));
        }

        $allowed = self::rolesFor(trim($request->path(), '/'));
        if (!in_array($user->role, $allowed, true)) {
            return redirect('/403');
        }

        return $next($request);
    }

    /**
     * @return list<string>
     */
    public static function rolesFor(string $path): array
    {
        foreach (self::ROLES as $prefix => $roles) {
            if ($path === $prefix || str_starts_with($path, $prefix.'/')) {
                return $roles;
            }
        }

        return self::ANY_DASHBOARD;
    }
}
