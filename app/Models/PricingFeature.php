<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PricingFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'text',
        'included',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'included' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(PricingPlan::class, 'plan_id');
    }
}
