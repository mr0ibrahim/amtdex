<?php

namespace App\Http\Middleware;

use App\Support\PageVisibility;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePublishedPage
{
    public function handle(Request $request, Closure $next, string $page): Response
    {
        if (! PageVisibility::isPublished($page)) {
            abort(404);
        }

        return $next($request);
    }
}
