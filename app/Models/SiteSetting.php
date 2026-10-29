<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Retrieve current settings as a clean key-value dictionary with defaults.
     */
    public static function getAsMap(): array
    {
        $settings = static::pluck('value', 'key')->toArray();

        return [
            'siteName' => $settings['siteName'] ?? 'Amtdex',
            'email' => $settings['email'] ?? 'hello@amtdex.ye',
            'phone' => $settings['phone'] ?? '+967 7xx xxx xxx',
        ];
    }

    /**
     * Update settings from key-value pairs.
     */
    public static function updateFromMap(array $map): void
    {
        foreach ($map as $key => $value) {
            static::updateOrCreate(
                ['key' => $key],
                ['value' => (string) $value]
            );
        }
    }
}
