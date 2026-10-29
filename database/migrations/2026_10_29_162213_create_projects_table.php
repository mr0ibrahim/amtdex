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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('cat'); // web, mobile, erp, ai, security, cloud
            $table->string('title');
            $table->string('client');
            $table->string('year', 10)->default('2026');
            $table->json('stack')->nullable();
            $table->string('color', 50)->default('#00e5ff');
            $table->string('accent', 50)->default('emerald');
            $table->text('summary');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
