<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Amtdex React SPA
|--------------------------------------------------------------------------
|
| Catch-all route for the Amtdex React SPA.
| Serves app.blade.php for all web frontend paths while ensuring that:
| - /api (API routes)
| - /sanctum (Sanctum CSRF & authentication routes)
| - /storage (Uploaded user assets)
| - /build (Compiled Vite production assets)
| - /hot (Vite dev server marker)
| are preserved and handled by their dedicated backend handlers.
|
*/

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!(api|sanctum|storage|build|hot|_debugbar)).*$');
