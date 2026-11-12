<?php

namespace App\Support;

use Illuminate\Http\Request;

class DashboardHost
{
    public static function name(): string
    {
        return strtolower(trim((string) config('amtdex.dashboard_domain', '')));
    }

    /**
     * Host isolation is opt-in. An empty domain keeps /dashboard and /login
     * on the main host. A *.localhost value is ignored in production so a
     * local default cannot hide the dashboard on the live site.
     */
    public static function isolated(): bool
    {
        $name = self::name();
        if ($name === '') {
            return false;
        }
        if (app()->environment('production') && str_ends_with($name, '.localhost')) {
            return false;
        }

        return true;
    }

    public static function matches(?Request $request = null): bool
    {
        if (! self::isolated()) {
            return false;
        }
        $request ??= request();

        return strtolower($request->getHost()) === self::name();
    }
}
