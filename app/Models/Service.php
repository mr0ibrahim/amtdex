<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug',
        'icon',
        'title',
        'desc',
        'bullets',
        'tech',
        'detail',
        'meta_title',
        'meta_description',
        'og_image',
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
