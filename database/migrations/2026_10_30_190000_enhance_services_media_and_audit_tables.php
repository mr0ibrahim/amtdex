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
        Schema::table('services', function (Blueprint $table) {
            $table->string('meta_title')->nullable()->after('detail');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('og_image')->nullable()->after('meta_description');
            $table->softDeletes();

            $table->index(['is_published', 'sort_order']);
        });

        Schema::table('media', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
            $table->string('alt_text')->nullable()->after('mime');
            $table->unsignedInteger('width')->nullable()->after('alt_text');
            $table->unsignedInteger('height')->nullable()->after('width');
            $table->string('disk', 50)->default('public')->after('height');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'sort_order']);
            $table->dropSoftDeletes();
            $table->dropColumn(['meta_title', 'meta_description', 'og_image']);
        });

        Schema::table('media', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['alt_text', 'width', 'height', 'disk']);
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
