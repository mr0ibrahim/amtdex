<?php

use App\Models\Service;
use App\Support\CompanyServices;
use Illuminate\Database\Migrations\Migration;

/**
 * Google Ads, social media management and design are named explicitly, and services are
 * ordered development → marketing and design → hosting and protection. The public site reads
 * services from the database, so the copy in CompanyServices must be written to it.
 */
return new class extends Migration
{
    public function up(): void
    {
        foreach (CompanyServices::all() as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }
    }

    public function down(): void
    {
        // Content update only; the previous wording is not restored.
    }
};
