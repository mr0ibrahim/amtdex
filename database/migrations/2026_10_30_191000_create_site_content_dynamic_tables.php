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
        // 1. Pricing Plans
        if (!Schema::hasTable('pricing_plans')) {
            Schema::create('pricing_plans', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('badge')->nullable();
                $table->text('description');
                $table->string('price', 50);
                $table->string('currency', 3)->default('SAR');
                $table->string('period', 50)->default('مشروع كامل');
                $table->string('cta', 100)->default('ابدأ مشروعك');
                $table->boolean('highlight')->default(false);
                $table->integer('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->softDeletes();
                $table->timestamps();

                $table->index(['is_active', 'sort_order']);
            });
        }

        // 2. Pricing Features
        if (!Schema::hasTable('pricing_features')) {
            Schema::create('pricing_features', function (Blueprint $table) {
                $table->id();
                $table->foreignId('plan_id')->constrained('pricing_plans')->cascadeOnDelete();
                $table->string('text');
                $table->boolean('included')->default(true);
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->index(['plan_id', 'sort_order']);
            });
        }

        // 3. Testimonials
        if (!Schema::hasTable('testimonials')) {
            Schema::create('testimonials', function (Blueprint $table) {
                $table->id();
                $table->string('author');
                $table->string('role');
                $table->string('company');
                $table->text('content');
                $table->string('avatar')->nullable();
                $table->unsignedTinyInteger('rating')->default(5);
                $table->integer('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->softDeletes();
                $table->timestamps();

                $table->index(['is_active', 'sort_order']);
            });
        }

        // 4. FAQs
        if (!Schema::hasTable('faqs')) {
            Schema::create('faqs', function (Blueprint $table) {
                $table->id();
                $table->string('question');
                $table->text('answer');
                $table->string('category', 50)->default('general');
                $table->integer('sort_order')->default(0);
                $table->boolean('is_published')->default(true);
                $table->softDeletes();
                $table->timestamps();

                $table->index(['is_published', 'category', 'sort_order']);
            });
        }

        // 5. Company Team Members
        if (!Schema::hasTable('company_team_members')) {
            Schema::create('company_team_members', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('role');
                $table->text('bio')->nullable();
                $table->string('avatar')->nullable();
                $table->json('social_links')->nullable();
                $table->integer('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->softDeletes();
                $table->timestamps();

                $table->index(['is_active', 'sort_order']);
            });
        }

        // 6. Clients & Partners
        if (!Schema::hasTable('clients')) {
            Schema::create('clients', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('logo');
                $table->string('url')->nullable();
                $table->integer('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->softDeletes();
                $table->timestamps();

                $table->index(['is_active', 'sort_order']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
        Schema::dropIfExists('company_team_members');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('pricing_features');
        Schema::dropIfExists('pricing_plans');
    }
};
