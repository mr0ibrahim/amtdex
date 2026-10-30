<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeamMember extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'company_team_members';

    protected $fillable = [
        'name',
        'role',
        'bio',
        'avatar',
        'social_links',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}

