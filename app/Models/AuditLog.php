<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user',
        'action',
        'ip',
        'details',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
        ];
    }

    public function userModel(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function record(string $action, ?string $user = null, ?array $details = null): static
    {
        return static::create([
            'user_id' => auth()->id(),
            'user' => $user ?? auth()->user()?->email ?? 'guest',
            'action' => $action,
            'ip' => request()->ip() ?? '127.0.0.1',
            'details' => $details,
        ]);
    }

    public function toApiResponse(): array
    {
        return [
            'id' => $this->id,
            'user' => $this->user,
            'action' => $this->action,
            'ip' => $this->ip,
            'at' => $this->created_at?->format('Y-m-d H:i') ?? now()->format('Y-m-d H:i'),
        ];
    }
}
