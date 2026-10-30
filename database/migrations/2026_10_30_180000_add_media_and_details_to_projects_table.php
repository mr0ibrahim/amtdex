<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('cover_image')->nullable()->after('summary');
            $table->string('cover_image_alt')->nullable()->after('cover_image');
            $table->json('gallery')->nullable()->after('cover_image_alt');
            $table->text('challenge')->nullable()->after('gallery');
            $table->json('deliverables')->nullable()->after('challenge');
            $table->json('metrics')->nullable()->after('deliverables');
            $table->string('duration', 50)->nullable()->after('metrics');
            $table->string('team_size', 50)->nullable()->after('duration');
            $table->string('project_url')->nullable()->after('team_size');
            $table->string('meta_title')->nullable()->after('project_url');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('og_image')->nullable()->after('meta_description');
            $table->softDeletes();

            $table->index(['is_published', 'sort_order']);
            $table->index('cat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'sort_order']);
            $table->dropIndex(['cat']);
            $table->dropSoftDeletes();
            $table->dropColumn([
                'cover_image',
                'cover_image_alt',
                'gallery',
                'challenge',
                'deliverables',
                'metrics',
                'duration',
                'team_size',
                'project_url',
                'meta_title',
                'meta_description',
                'og_image',
            ]);
        });
    }
};
