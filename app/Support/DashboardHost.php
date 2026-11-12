<?php

namespace App\Support;

use Illuminate\Http\Request;

class DashboardHost
{
    public static function name(): string
    {
        return strtolower((string) config('amtdex.dashboard_domain', 'admin.localhost'));
    }

    public static function matches(?Request $request = null): bool
    {
        $request ??= request();
        $host = strtolower($request->getHost());

        return $host !== '' && $host === self::name();
    }
}
