<?php

namespace App\Http\Middleware;

use App\Support\DashboardHost;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConfigureDashboardSession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (DashboardHost::matches($request)) {
            config([
                'session.cookie' => config('amtdex.dashboard_session_cookie'),
                'session.domain' => null,
            ]);
        }

        return $next($request);
    }
}
