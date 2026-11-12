<?php

use App\Models\Client;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Project::whereIn('slug', [
            'noon-replatform',
            'sadad-wallet',
            'shifa-platform',
            'rawa-erp',
            'tawasul-crm',
            'aqar-map',
        ])->update(['is_published' => true]);

        Testimonial::whereIn('author', ['سارة العتيبي', 'عمر الحربي', 'نورة القحطاني'])->update(['is_active' => true]);

        TeamMember::whereIn('name', ['أحمد الغامدي', 'ريم الدوسري', 'فيصل المطيري', 'لينا عسيري'])->update(['is_active' => true]);

        Client::whereIn('name', [
            'شركة نون',
            'شركة STC',
            'شركة أرامكو',
            'شركة سابك',
            'مصرف الراجحي',
            'تطبيق جاهز',
            'تطبيق مرسول',
            'هنقرستيشن',
        ])->update(['is_active' => true]);
    }

    public function down(): void
    {
        Project::whereIn('slug', [
            'noon-replatform',
            'sadad-wallet',
            'shifa-platform',
            'rawa-erp',
            'tawasul-crm',
            'aqar-map',
        ])->update(['is_published' => false]);

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
    }
};
