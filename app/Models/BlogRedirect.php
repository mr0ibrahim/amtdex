<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogRedirect extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_path',
        'target_path',
        'status_code',
        'hits_count',
    ];

    protected $casts = [
        'status_code' => 'integer',
        'hits_count' => 'integer',
    ];

    public static function trackAndRedirect(string $path): ?self
    {
        $normalized = '/' . ltrim($path, '/');
        $redirect = self::where('source_path', $normalized)->first();
        if ($redirect) {
            $redirect->increment('hits_count');
            return $redirect;
        }
        return null;
    }
}
