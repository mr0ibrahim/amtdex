<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $table = 'media';

    protected $fillable = [
        'name',
        'path',
        'url',
        'size',
        'mime',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }
}
