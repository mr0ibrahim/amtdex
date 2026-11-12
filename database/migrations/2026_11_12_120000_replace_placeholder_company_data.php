<?php

use App\Models\Client;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Support\CompanyServices;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        foreach (CompanyServices::all() as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }

        Service::whereNotIn('slug', array_column(CompanyServices::all(), 'slug'))
            ->update(['is_published' => false]);

        Project::whereIn('slug', [
            'noon-replatform',
            'sadad-wallet',
            'shifa-platform',
            'rawa-erp',
            'tawasul-crm',
            'aqar-map',
        ])->update(['is_published' => false]);

        PricingPlan::whereIn('slug', ['starter', 'growth', 'enterprise'])->update(['is_active' => false]);

        Testimonial::whereIn('author', ['سارة العتيبي', 'عمر الحربي', 'نورة القحطاني'])->update(['is_active' => false]);

        TeamMember::whereIn('name', ['أحمد الغامدي', 'ريم الدوسري', 'فيصل المطيري', 'لينا عسيري'])->update(['is_active' => false]);

        Client::whereIn('name', [
            'شركة نون',
            'شركة STC',
            'شركة أرامكو',
            'شركة سابك',
            'مصرف الراجحي',
            'تطبيق جاهز',
            'تطبيق مرسول',
            'هنقرستيشن',
        ])->update(['is_active' => false]);

        $settings = SiteSetting::pluck('value', 'key');
        $placeholders = [
            'email' => ['hello@amtdex.ye', 'hello@amtdex.com', 'hello@amtdex.sa', ''],
            'phone' => ['+967 7xx xxx xxx', '+966 50 000 0000', ''],
            'siteName' => ['Amtdex', 'Laravel', ''],
        ];
        $replacements = [
            'email' => 'Info@amtdex.com',
            'phone' => '+967 784 440 429',
            'siteName' => 'AMTDEX SOFT',
        ];
        foreach ($replacements as $key => $value) {
            $current = (string) ($settings[$key] ?? '');
            if (in_array($current, $placeholders[$key], true)) {
                SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }
    }

    public function down(): void
    {
        // The previous copy was placeholder content. Leaving the company record in place.
    }
};
