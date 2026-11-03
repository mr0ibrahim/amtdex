<?php

namespace App\Models;

use App\Services\Blog\BlogCssSanitizer;
use App\Services\Blog\BlogHtmlSanitizer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'category_id',
        'title',
        'slug',
        'summary',
        'content',
        'custom_css',
        'cover_image',
        'cover_image_alt',
        'status',
        'published_at',
        'reading_time_minutes',
        'views_count',
        'is_featured',
        'allow_comments',
        'focus_keyword',
        'meta_title',
        'meta_description',
        'canonical_url',
        'robots_index',
        'robots_follow',
        'og_title',
        'og_description',
        'og_image',
        'og_type',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'schema_type',
        'faq_schema',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'reading_time_minutes' => 'integer',
        'views_count' => 'integer',
        'is_featured' => 'boolean',
        'allow_comments' => 'boolean',
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
        'faq_schema' => 'array',
    ];

    protected $appends = [
        'reading_time',
    ];

    public function getReadingTimeAttribute(): int
    {
        return (int) ($this->reading_time_minutes ?: 3);
    }

    /**
     * Stored and displayed article HTML is passed through the same allowlist.
     *
     * @return Attribute<string, string>
     */
    protected function content(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): string => BlogHtmlSanitizer::sanitize($value),
            set: fn (?string $value): string => BlogHtmlSanitizer::sanitize($value),
        );
    }

    /**
     * Per-post stylesheet. Sanitized on read and write; scoped only when rendered.
     *
     * @return Attribute<?string, ?string>
     */
    protected function customCss(): Attribute
    {
        return Attribute::make(
            get: function (?string $value): ?string {
                $clean = BlogCssSanitizer::sanitize($value);

                return $clean === '' ? null : $clean;
            },
            set: function (?string $value): ?string {
                $clean = BlogCssSanitizer::sanitize($value);

                return $clean === '' ? null : $clean;
            },
        );
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(BlogTag::class, 'blog_post_tag', 'post_id', 'tag_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class, 'post_id');
    }

    public function approvedComments(): HasMany
    {
        return $this->hasMany(BlogComment::class, 'post_id')
            ->where('status', 'approved')
            ->whereNull('parent_id')
            ->with('approvedReplies')
            ->latest();
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(BlogRevision::class, 'post_id')->latest();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            });
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
                ->orWhere('summary', 'like', "%{$term}%")
                ->orWhere('content', 'like', "%{$term}%")
                ->orWhere('focus_keyword', 'like', "%{$term}%");
        });
    }

    public static function calculateReadingTime(string $content): int
    {
        $clean = strip_tags($content);
        $wordCount = count(preg_split('/\s+/u', trim($clean), -1, PREG_SPLIT_NO_EMPTY) ?: []);

        return max(1, (int) ceil($wordCount / 180));
    }
}
