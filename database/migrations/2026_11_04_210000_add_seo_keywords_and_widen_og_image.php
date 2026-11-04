<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            if (! Schema::hasColumn('blog_posts', 'seo_keywords')) {
                $table->json('seo_keywords')->nullable()->after('focus_keyword');
            }
        });

        // Pasted CDN URLs are often longer than the original varchar(255),
        // while validation previously allowed 500 characters.
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('og_image', 2048)->nullable()->change();
            $table->string('twitter_image', 2048)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            if (Schema::hasColumn('blog_posts', 'seo_keywords')) {
                $table->dropColumn('seo_keywords');
            }
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('og_image')->nullable()->change();
            $table->string('twitter_image')->nullable()->change();
        });
    }
};
