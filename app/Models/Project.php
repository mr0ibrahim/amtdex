<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

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
        'cover_image',
        'cover_image_alt',
        'gallery',
        'challenge',
        'deliverables',
        'metrics',
        'duration',
        'team_size',
        'project_url',
        'meta_title',
        'meta_description',
        'og_image',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'stack' => 'array',
            'gallery' => 'array',
            'deliverables' => 'array',
            'metrics' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
