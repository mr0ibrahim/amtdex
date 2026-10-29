<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'cat',
        'title',
        'client',
        'year',
        'stack',
        'color',
        'accent',
        'summary',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'stack' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
