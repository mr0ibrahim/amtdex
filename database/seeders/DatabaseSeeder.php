<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Faq;
use App\Models\Lead;
use App\Models\PricingFeature;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\SeoMetadata;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        $defaultPassword = Hash::make('Amtdex2026!');

        User::updateOrCreate(
            ['email' => 'admin@amtdex.ye'],
            [
                'name' => 'أحمد الغامدي',
                'password' => $defaultPassword,
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'editor@amtdex.ye'],
            [
                'name' => 'ريم الدوسري',
                'password' => $defaultPassword,
                'role' => 'editor',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'viewer@amtdex.ye'],
            [
                'name' => 'لينا عسيري',
                'password' => $defaultPassword,
                'role' => 'viewer',
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed Services
        $services = [
            [
                'slug' => 'web',
                'icon' => 'web',
                'title' => 'تطوير المواقع',
                'desc' => 'مواقع سريعة، متجاوبة، ومحسّنة للتحويل — من الهبوط إلى المتاجر والمنصات.',
                'bullets' => ['Next.js / Laravel / WordPress', 'تحسين سرعة 95+ Lighthouse', 'SEO تقني + تحليلات'],
                'tech' => ['Next.js', 'Laravel', 'Tailwind'],
                'detail' => 'نبني مواقع تبيع. نبدأ بفهم هدفك التجاري، ثم نصمم رحلة مستخدم تحوّل الزائر لعميل — مع لوحة تحكم Laravel لإدارة كل شيء بدون مطوّر.',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'slug' => 'mobile',
                'icon' => 'mobile',
                'title' => 'تطبيقات الجوال',
                'desc' => 'iOS و Android بتجربة أصلية — Flutter أو Native حسب احتياجك.',
                'bullets' => ['Flutter / Swift / Kotlin', 'إشعارات، دفع، خرائط', 'نشر على المتاجر'],
                'tech' => ['Flutter', 'Firebase', 'Stripe'],
                'detail' => 'تطبيق واحد يعمل كأنه اثنان. نركز على الأداء، استهلاك البطارية، وتجربة استخدام تشبه تطبيقات الشركات الكبرى.',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'slug' => 'erp',
                'icon' => 'erp',
                'title' => 'أنظمة ERP و CRM',
                'desc' => 'أنظمة مخصصة لإدارة المبيعات، المخزون، الموارد البشرية والمالية.',
                'bullets' => ['Laravel + Filament', 'صلاحيات وأدوار دقيقة', 'تقارير ولوحات تحكم'],
                'tech' => ['Laravel', 'Filament', 'MySQL'],
                'detail' => 'نحوّل عملياتك الورقية لنظام رقمي متكامل. كل قسم يرى ما يخصه، والمدير يرى الصورة الكاملة لحظياً.',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'slug' => 'ai',
                'icon' => 'ai',
                'title' => 'الذكاء الاصطناعي',
                'desc' => 'مساعدات ذكية، تحليل بيانات، وأتمتة مهام متكررة.',
                'bullets' => ['Chatbots و RAG', 'تحليل نصوص وصور', 'تكامل مع أنظمتك'],
                'tech' => ['OpenAI', 'Python', 'Pinecone'],
                'detail' => 'ليس مجرد شات بوت. نبني مساعداً يفهم بيانات شركتك ويجيب من مصادرك الخاصة — آمن ومستضاف على خوادمك إن رغبت.',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'slug' => 'security',
                'icon' => 'security',
                'title' => 'الأمن السيبراني',
                'desc' => 'اختبار اختراق، حماية تطبيقات، وامتثال.',
                'bullets' => ['Penetration Testing', 'WAF & Hardening', 'SOC 2 / ISO 27001'],
                'tech' => ['OWASP', 'Cloudflare', 'Vault'],
                'detail' => 'نحمي ما بنيناه وما ستبنيه. فحص ثغرات، إصلاح، وتقرير تنفيذي يفهمه مجلس الإدارة.',
                'sort_order' => 5,
                'is_published' => true,
            ],
            [
                'slug' => 'cloud',
                'icon' => 'cloud',
                'title' => 'الحوسبة السحابية',
                'desc' => 'استضافة، CI/CD، مراقبة، وتوسع تلقائي.',
                'bullets' => ['AWS / GCP / DigitalOcean', 'Docker + CI/CD', 'مراقبة 24/7'],
                'tech' => ['Docker', 'AWS', 'Grafana'],
                'detail' => 'موقعك لا ينام. ننشر بنيتك على خوادم عالمية مع نسخ احتياطي واستعادة كوارث.',
                'sort_order' => 6,
                'is_published' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }

        // 3. Seed Projects
        $projects = [
            [
                'slug' => 'noon-replatform',
                'cat' => 'التجارة الإلكترونية',
                'title' => 'إعادة بناء منصة نون — 40% تسريع',
                'client' => 'نون',
                'year' => '2024',
                'stack' => ['Next.js', 'Laravel API', 'Algolia'],
                'color' => '#0B0B0B',
                'accent' => '#FF3B30',
                'summary' => 'هجرة متجر ضخم من نظام قديم لمنصة حديثة مع بحث فوري ودفع متعدد.',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'slug' => 'sadad-wallet',
                'cat' => 'التقنية المالية',
                'title' => 'محفظة سداد — تطبيق دفع موحد',
                'client' => 'سداد',
                'year' => '2024',
                'stack' => ['Flutter', 'Laravel', 'STC Pay SDK'],
                'color' => '#0E2A47',
                'accent' => '#2ECC71',
                'summary' => 'محفظة تدعم مدى، أبل باي، وتحويل لحظي مع مصادقة بيومترية.',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'slug' => 'shifa-platform',
                'cat' => 'الصحة',
                'title' => 'منصة شفاء — حجز ومتابعة طبية',
                'client' => 'شفاء',
                'year' => '2023',
                'stack' => ['React', 'Laravel', 'WebRTC'],
                'color' => '#1A1B2E',
                'accent' => '#7C5CFF',
                'summary' => 'حجز أطباء، استشارات مرئية، وملف طبي موحد للمريض.',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'slug' => 'rawa-erp',
                'cat' => 'أنظمة أعمال',
                'title' => 'نظام رواء — ERP للمصانع',
                'client' => 'رواء',
                'year' => '2023',
                'stack' => ['Laravel', 'Filament', 'MySQL'],
                'color' => '#111827',
                'accent' => '#F59E0B',
                'summary' => 'إدارة مخزون، مشتريات، ومبيعات لمصنع يعمل بثلاث ورديات.',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'slug' => 'tawasul-crm',
                'cat' => 'خدمة العملاء',
                'title' => 'تواصل — CRM ومركز اتصال',
                'client' => 'تواصل',
                'year' => '2024',
                'stack' => ['Vue', 'Laravel', 'WebSocket'],
                'color' => '#0F1F1A',
                'accent' => '#10B981',
                'summary' => 'تتبع تذاكر، ربط واتساب، ولوحة تحكم للمشرفين لحظياً.',
                'sort_order' => 5,
                'is_published' => true,
            ],
            [
                'slug' => 'aqar-map',
                'cat' => 'العقار',
                'title' => 'عقار ماب — بحث عقاري ذكي',
                'client' => 'عقار ماب',
                'year' => '2024',
                'stack' => ['Next.js', 'Mapbox', 'Laravel'],
                'color' => '#1C1917',
                'accent' => '#E11D48',
                'summary' => 'بحث بالخريطة، تصفية ذكية، وحفظ عمليات البحث مع تنبيهات.',
                'sort_order' => 6,
                'is_published' => true,
            ],
        ];

        foreach ($projects as $project) {
            Project::updateOrCreate(['slug' => $project['slug']], $project);
        }

        // 4. Seed Site Settings
        SiteSetting::updateFromMap([
            'siteName' => 'Amtdex',
            'email' => 'hello@amtdex.ye',
            'phone' => '+967 7xx xxx xxx',
        ]);

        // 5. Seed SEO Metadata
        $seoRoutes = [
            ['path' => '/', 'title' => 'Amtdex — حلول تقنية وبرمجية متكاملة', 'description' => 'شريكك التقني لتطوير مواقع الويب، تطبيقات الجوال، أنظمة ERP المتقدمة، وحلول الذكاء الاصطناعي والأمن السيبراني.'],
            ['path' => '/about', 'title' => 'من نحن — Amtdex', 'description' => 'تعرف على فريق ومهام وقيم شركة Amtdex الرائدة في تقديم الحلول البرمجية.'],
            ['path' => '/services', 'title' => 'خدماتنا التقنية — Amtdex', 'description' => 'استكشف حزمة خدماتنا البرمجية المتقدمة المصممة لنمو أعمالك.'],
            ['path' => '/projects', 'title' => 'أعمالنا ومشاريعنا — Amtdex', 'description' => 'شاهد نماذج من المشاريع والمنصات الرقمية التي قمنا بتطويرها بنجاح.'],
            ['path' => '/contact', 'title' => 'تواصل معنا — Amtdex', 'description' => 'ابدأ محادثة معنا اليوم لمناقشة مشروعك القادم وتحدياتك التقنية.'],
            ['path' => '/quote', 'title' => 'طلب عرض سعر — Amtdex', 'description' => 'احصل على تسعير وتقدير زمني مخصص لمشروعك الرقمي خلال دقائق.'],
        ];

        foreach ($seoRoutes as $seo) {
            SeoMetadata::updateOrCreate(['path' => $seo['path']], $seo);
        }

        // 6. Seed Sample Leads
        Lead::updateOrCreate(
            ['email' => 'sara@example.com'],
            [
                'name' => 'سارة العتيبي',
                'phone' => '+966500000000',
                'subject' => 'web',
                'message' => 'طلب تطوير منصة تجارية متكاملة مع بوابات دفع محلية ودولية.',
                'status' => 'جديد',
                'source' => 'contact',
            ]
        );

        Lead::updateOrCreate(
            ['email' => 'omar@example.com'],
            [
                'name' => 'عمر الحربي',
                'phone' => '+967770000000',
                'subject' => 'mobile',
                'message' => 'تطبيق لتوصيل طلبات المطاعم مع لوحة إدارة ولوحة مناديب.',
                'status' => 'قيد المراجعة',
                'source' => 'quote',
                'meta' => [
                    'service' => 'mobile',
                    'budget' => '30K — 80K',
                    'timeline' => 'مرن — 3 أشهر',
                    'details' => 'تطبيق لتوصيل طلبات المطاعم مع لوحة إدارة ولوحة مناديب.',
                ],
            ]
        );

        // 7. Seed Sample Audit Logs
        AuditLog::create([
            'user' => 'admin@amtdex.ye',
            'action' => 'تهيئة النظام والبيانات الأساسية',
            'ip' => '127.0.0.1',
        ]);

        // 8. Seed Pricing Plans & Features
        $plans = [
            [
                'name' => 'الانطلاقة',
                'slug' => 'starter',
                'badge' => null,
                'description' => 'للمشاريع الناشئة والمتاجر البسيطة التي تحتاج وجوداً رقمياً قوياً وسريعاً.',
                'price' => '4,900',
                'currency' => 'SAR',
                'period' => 'مرة واحدة',
                'cta' => 'اطلب الآن',
                'highlight' => false,
                'sort_order' => 1,
                'features' => [
                    'موقع تعريفي 5 صفحات بتصميم متجاوب',
                    'لوحة تحكم إدارية سريعة',
                    'استضافة سحابية 6 أشهر + شهادة SSL مجاناً',
                    'دعم فني وضمان برمجي لمدة شهر كامل',
                ],
            ],
            [
                'name' => 'النمو',
                'slug' => 'growth',
                'badge' => 'الأكثر طلباً',
                'description' => 'للشركات والمتاجر التي تتطلب منصة متكاملة وربطاً مع بوابات الدفع والشحن.',
                'price' => '14,900',
                'currency' => 'SAR',
                'period' => 'مرة واحدة',
                'cta' => 'الأكثر طلباً — اطلب الآن',
                'highlight' => true,
                'sort_order' => 2,
                'features' => [
                    'متجر إلكتروني أو منصة ويب متكاملة',
                    'تكامل بوابات دفع (مدى، أبل باي، STC Pay)',
                    'تطبيق ويب تقدمي (PWA) للعملاء',
                    'تكامل شركات الشحن وإصدار الفواتير التلقائية',
                    'دعم فني مستمر لمدة 3 أشهر + تدريب الفريق',
                ],
            ],
            [
                'name' => 'المؤسسي',
                'slug' => 'enterprise',
                'badge' => 'حلول مخصصة',
                'description' => 'للمؤسسات والجهات الكبرى التي تحتاج بنية تحتية مخصصة وتطبيقات جوال.',
                'price' => 'حسب الطلب',
                'currency' => 'SAR',
                'period' => 'عقد شهري / مشروع',
                'cta' => 'تحدث مع مستشارنا',
                'highlight' => false,
                'sort_order' => 3,
                'features' => [
                    'نظام أعمال متقدم (ERP / CRM) مخصص بالكامل',
                    'تطبيقات جوال أصلية (iOS + Android)',
                    'اتفاقية مستوى الخدمة (SLA 99.9%) + مدير حساب مخصص',
                    'بنية تحتية سحابية عالية التوافر ومراقبة أمنية 24/7',
                ],
            ],
        ];

        foreach ($plans as $pData) {
            $features = $pData['features'];
            unset($pData['features']);

            $plan = PricingPlan::updateOrCreate(['slug' => $pData['slug']], $pData);

            // Re-seed features
            $plan->features()->delete();
            foreach ($features as $fIndex => $fText) {
                PricingFeature::create([
                    'plan_id' => $plan->id,
                    'text' => $fText,
                    'included' => true,
                    'sort_order' => $fIndex + 1,
                ]);
            }
        }

        // 9. Seed Testimonials
        $testimonials = [
            [
                'author' => 'سارة العتيبي',
                'role' => 'مديرة المنتج',
                'company' => 'stc pay',
                'content' => 'أمـتـدِكس سلّمت قبل الموعد، والكود نظيف لدرجة أن فريقنا أكمل عليه بدون أي احتكاك.',
                'avatar' => null,
                'rating' => 5,
                'sort_order' => 1,
            ],
            [
                'author' => 'عمر الحربي',
                'role' => 'المؤسس',
                'company' => 'متجر زاد',
                'content' => 'المتجر الجديد ضاعف التحويل 2.1×. الدعم الفني متجاوب خلال دقائق حتى في ساعات المساء.',
                'avatar' => null,
                'rating' => 5,
                'sort_order' => 2,
            ],
            [
                'author' => 'نورة القحطاني',
                'role' => 'المدير التقني CTO',
                'company' => 'شركة رواء',
                'content' => 'نظام الـ ERP غيّر إدارة العمليات بالكامل. كل البيانات مرئية لحظياً والتقارير المالية شديدة الدقة.',
                'avatar' => null,
                'rating' => 5,
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::updateOrCreate(['author' => $t['author'], 'company' => $t['company']], $t);
        }

        // 10. Seed FAQs
        $faqs = [
            [
                'question' => 'كم يستغرق بناء وتطوير المشروع البرمجي عادةً؟',
                'answer' => 'يعتمد ذلك على حجم النطاق: المشاريع التعريفية ومتاجر MVP تستغرق عادة من 4 إلى 6 أسابيع، بينما المنصات الكبيرة وتطبيقات الجوال تتراوح بين 8 إلى 16 أسبوعاً مع تسليم نسخ تجريبية أسبوعية.',
                'category' => 'general',
                'sort_order' => 1,
            ],
            [
                'question' => 'كيف تتم آلية الدفع وتقسيم الدفعات؟',
                'answer' => 'نعتمد نظام الدفعات المرحلية المرتبط بإنجاز معالم واضحة (Milestones)، عادة 30% دفعة أولى، و40% بعد تسليم النسخة التجريبية الأولى، و30% بعد الإطلاق والاعتماد النهائي.',
                'category' => 'pricing',
                'sort_order' => 2,
            ],
            [
                'question' => 'هل نحصل على الكود المصدري وحقوق الملكية الفكرية؟',
                'answer' => 'نعم بالكامل. الكود المصدري يُسلم كاملاً على مستودع خاص بك مع كامل الحقوق الفكرية والتراخيص بمجرد سداد الدفعة النهائية.',
                'category' => 'legal',
                'sort_order' => 3,
            ],
            [
                'question' => 'هل توفرون ضماناً ودعماً فنياً بعد إطلاق المشروع؟',
                'answer' => 'نعم، جميع مشاريعنا تشمل فترة ضمان ودعم فني مجانية بعد الإطلاق لمعالجة أي ملاحظات وضمان استقرار النظام تحت الضغط الفعلي.',
                'category' => 'support',
                'sort_order' => 4,
            ],
        ];

        foreach ($faqs as $f) {
            Faq::updateOrCreate(['question' => $f['question']], $f);
        }

        // 11. Seed Company Team Members
        $team = [
            [
                'name' => 'أحمد الغامدي',
                'role' => 'المؤسس والرئيس التنفيذي — CEO',
                'bio' => 'أكثر من 12 عاماً في قيادة وتطوير المنتجات التقنية والمنصات السحابية للشركات الناشئة والمؤسسات.',
                'avatar' => null,
                'social_links' => ['linkedin' => 'https://linkedin.com', 'twitter' => 'https://x.com'],
                'sort_order' => 1,
            ],
            [
                'name' => 'ريم الدوسري',
                'role' => 'رئيسة التصميم وتجربة المستخدم — Head of Design',
                'bio' => 'متخصصة في بناء هويات رقمية متميزة وتجارب مستخدم فائقة البساطة تعزز معدلات التحويل.',
                'avatar' => null,
                'social_links' => ['linkedin' => 'https://linkedin.com'],
                'sort_order' => 2,
            ],
            [
                'name' => 'فيصل المطيري',
                'role' => 'المدير التقني — CTO & Cloud Architect',
                'bio' => 'خبير في معمارية الأنظمة السحابية الموزعة وLaravel/Next.js والبنية التحتية المقاومة للأعطال.',
                'avatar' => null,
                'social_links' => ['github' => 'https://github.com'],
                'sort_order' => 3,
            ],
            [
                'name' => 'لينا عسيري',
                'role' => 'مديرة المنتجات والمشاريع — Product Lead',
                'bio' => 'شغوفة بتوجيه فرق العمل الرشيقة وضمان تسليم المشاريع بدقة متناهية وفي الوقت المحدد.',
                'avatar' => null,
                'social_links' => ['linkedin' => 'https://linkedin.com'],
                'sort_order' => 4,
            ],
        ];

        foreach ($team as $tm) {
            TeamMember::updateOrCreate(['name' => $tm['name']], $tm);
        }

        // 12. Seed Clients & Partners
        $clients = [
            ['name' => 'شركة نون', 'logo' => 'https://amtdex.com/logos/noon.svg', 'sort_order' => 1],
            ['name' => 'شركة STC', 'logo' => 'https://amtdex.com/logos/stc.svg', 'sort_order' => 2],
            ['name' => 'شركة أرامكو', 'logo' => 'https://amtdex.com/logos/aramco.svg', 'sort_order' => 3],
            ['name' => 'شركة سابك', 'logo' => 'https://amtdex.com/logos/sabic.svg', 'sort_order' => 4],
            ['name' => 'مصرف الراجحي', 'logo' => 'https://amtdex.com/logos/rajhi.svg', 'sort_order' => 5],
            ['name' => 'تطبيق جاهز', 'logo' => 'https://amtdex.com/logos/jahez.svg', 'sort_order' => 6],
            ['name' => 'تطبيق مرسول', 'logo' => 'https://amtdex.com/logos/mrsool.svg', 'sort_order' => 7],
            ['name' => 'هنقرستيشن', 'logo' => 'https://amtdex.com/logos/hungerstation.svg', 'sort_order' => 8],
        ];

        foreach ($clients as $cl) {
            Client::updateOrCreate(['name' => $cl['name']], $cl);
        }

        // 13. Seed Blog System
        $this->call(BlogSeeder::class);
    }
}

