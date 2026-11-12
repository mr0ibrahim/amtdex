<?php

namespace App\Http\Middleware;

use App\Support\DashboardHost;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TagDashboardRobots
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        if (DashboardHost::matches($request)) {
            $response->headers->set('X-Robots-Tag', 'noindex, nofollow');
        }

        return $response;
    }
}
