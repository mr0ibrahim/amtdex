<?php

use App\Models\BlogSetting;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Database\Migrations\Migration;

/**
 * Brand spelling in content saved before the site settled on «امتدكس سوفت» / «AMTDEX SOFT»:
 * the stretched «أمـتـدِكس» in testimonials, and «Amtdex» in blog and site settings
 * (blog heading, page-title template, site name).
 */
return new class extends Migration
{
    public function up(): void
    {
        foreach (Testimonial::all() as $testimonial) {
            $changed = false;
            foreach (['content', 'company', 'role'] as $field) {
                $value = (string) $testimonial->{$field};
                $fixed = str_replace('أمـتـدِكس', 'امتدكس سوفت', $value);
                if ($fixed !== $value) {
                    $testimonial->{$field} = $fixed;
                    $changed = true;
                }
            }
            if ($changed) {
                $testimonial->save();
            }
        }

        foreach ([BlogSetting::class, SiteSetting::class] as $model) {
            foreach ($model::all() as $setting) {
                $value = (string) $setting->value;
                $fixed = preg_replace('/\bAmtdex\b(?! SOFT)/u', 'AMTDEX SOFT', $value);
                if ($fixed !== null && $fixed !== $value) {
                    $setting->value = $fixed;
                    $setting->save();
                }
            }
        }
    }

    public function down(): void
    {
        // Spelling fix only; the previous text is not restored.
    }
};
