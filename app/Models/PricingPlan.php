<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PricingPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'badge',
        'description',
        'price',
        'currency',
        'period',
        'cta',
        'highlight',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'highlight' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function features(): HasMany
    {
        return $this->hasMany(PricingFeature::class, 'plan_id')->orderBy('sort_order');
    }
}

