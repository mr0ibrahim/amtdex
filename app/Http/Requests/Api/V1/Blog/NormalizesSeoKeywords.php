<?php

namespace App\Http\Requests\Api\V1\Blog;

use App\Services\Blog\SeoKeywords;

trait NormalizesSeoKeywords
{
    protected function prepareForValidation(): void
    {
        if (! $this->exists('seo_keywords')) {
            return;
        }

        $keywords = SeoKeywords::normalize($this->input('seo_keywords'));

        $this->merge([
            'seo_keywords' => $keywords,
            'focus_keyword' => $keywords[0] ?? null,
        ]);
    }
}
