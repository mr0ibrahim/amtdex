<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'icon',
        'title',
        'desc',
        'bullets',
        'tech',
        'detail',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'bullets' => 'array',
            'tech' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
