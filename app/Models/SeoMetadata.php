<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoMetadata extends Model
{
    use HasFactory;

    protected $table = 'seo_metadata';

    protected $fillable = [
        'path',
        'title',
        'description',
        'noindex',
        'og_image',
    ];

    protected function casts(): array
    {
        return [
            'noindex' => 'boolean',
        ];
    }
}
