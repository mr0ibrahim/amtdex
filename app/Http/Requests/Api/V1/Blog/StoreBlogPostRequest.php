<?php

namespace App\Http\Requests\Api\V1\Blog;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogPostRequest extends FormRequest
{
    use NormalizesSeoKeywords;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blog_posts,slug'],
            'category_id' => ['nullable', 'exists:blog_categories,id'],
            'author_id' => ['nullable', 'exists:users,id'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'string'],
            'custom_css' => ['nullable', 'string', 'max:100000'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'cover_image_alt' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:draft,published,scheduled,archived'],
            'published_at' => ['nullable', 'date'],
            'is_featured' => ['boolean'],
            'allow_comments' => ['boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:blog_tags,id'],
            'focus_keyword' => ['nullable', 'string', 'max:255'],
            'seo_keywords' => ['nullable', 'array', 'max:40'],
            'seo_keywords.*' => ['string', 'max:120'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'string', 'max:500'],
            'robots_index' => ['boolean'],
            'robots_follow' => ['boolean'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:500'],
            'og_image' => ['nullable', 'string', 'max:2048'],
            'og_type' => ['nullable', 'string', 'max:50'],
            'twitter_card' => ['nullable', 'string', 'max:50'],
            'twitter_title' => ['nullable', 'string', 'max:255'],
            'twitter_description' => ['nullable', 'string', 'max:500'],
            'twitter_image' => ['nullable', 'string', 'max:2048'],
            'schema_type' => ['nullable', 'string', 'max:50'],
            'faq_schema' => ['nullable', 'array'],
        ];
    }
}
