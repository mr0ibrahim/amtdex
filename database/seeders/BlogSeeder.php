<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogComment;
use App\Models\BlogPost;
use App\Models\BlogSetting;
use App\Models\BlogTag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure an author user exists
        $admin = User::first() ?? User::create([
            'name' => 'م. إبراهيم — كبير مهندسي الحلول',
            'email' => 'admin@amtdex.com',
            'password' => bcrypt('Admin#2026!Sec'),
            'role' => 'admin',
            'bio' => 'مهندس نظم ومستشار حلول برمجية في Amtdex. متخصص في معمارية الأنظمة السحابية والذكاء الاصطناعي.',
            'avatar' => 'https://amtdex.com/images/screens/crm-480.webp',
            'social_links' => [
                'twitter' => 'https://x.com/amtdex',
                'github' => 'https://github.com/mr0ibrahim',
                'linkedin' => 'https://linkedin.com/company/amtdex',
            ],
        ]);

        if (empty($admin->bio)) {
            $admin->update([
                'bio' => 'مهندس نظم ومستشار حلول برمجية في Amtdex. متخصص في معمارية الأنظمة السحابية والذكاء الاصطناعي.',
                'avatar' => 'https://amtdex.com/images/screens/crm-480.webp',
                'social_links' => [
                    'twitter' => 'https://x.com/amtdex',
                    'github' => 'https://github.com/mr0ibrahim',
                    'linkedin' => 'https://linkedin.com/company/amtdex',
                ],
            ]);
        }

        // 2. Create 3 Main Categories + 1 Child Category
        $catSoftware = BlogCategory::updateOrCreate(['slug' => 'software-engineering'], [
            'name' => 'هندسة البرمجيات',
            'description' => 'أفضل الممارسات في بناء البرمجيات الحديثة، معمارية الأنظمة، وتطوير الويب والجوال.',
            'image' => 'https://amtdex.com/images/screens/business.webp',
            'sort_order' => 1,
            'is_visible' => true,
            'meta_title' => 'مقالات هندسة البرمجيات وتطوير التطبيقات | مدونة Amtdex',
            'meta_description' => 'دليل عملي حول هندسة البرمجيات ومعمارية الأنظمة وتطوير تطبيقات المؤسسات.',
            'canonical_url' => 'https://blog.amtdex.com/categories/software-engineering',
            'noindex' => false,
        ]);

        $catAi = BlogCategory::updateOrCreate(['slug' => 'artificial-intelligence'], [
            'name' => 'الذكاء الاصطناعي',
            'description' => 'تطبيقات الذكاء الاصطناعي التوليدي، نماذج اللغة LLMs، وحلول أتمتة الأعمال.',
            'image' => 'https://amtdex.com/images/screens/projects.webp',
            'sort_order' => 2,
            'is_visible' => true,
            'meta_title' => 'الذكاء الاصطناعي وأتمتة الأعمال للشركات | مدونة Amtdex',
            'meta_description' => 'استكشف أحدث حلول الذكاء الاصطناعي، نماذج RAG وتكامل الوكلاء الذكيين في بيئات الأعمال.',
            'canonical_url' => 'https://blog.amtdex.com/categories/artificial-intelligence',
            'noindex' => false,
        ]);

        $catCloud = BlogCategory::updateOrCreate(['slug' => 'cloud-security'], [
            'name' => 'السحابة والأمن السيبراني',
            'description' => 'البنية التحتية السحابية، خطوط CI/CD، وحماية الأنظمة وقواعد البيانات من الاختراق.',
            'image' => 'https://amtdex.com/images/screens/wallet.webp',
            'sort_order' => 3,
            'is_visible' => true,
            'meta_title' => 'الحوسبة السحابية والأمن السيبراني للمؤسسات | مدونة Amtdex',
            'meta_description' => 'طرق تأمين السيرفرات وقواعد البيانات وبناء أنظمة مراقبة واستعادة كوارث عالية الاعتمادية.',
            'canonical_url' => 'https://blog.amtdex.com/categories/cloud-security',
            'noindex' => false,
        ]);

        // Child Category
        $catLaravel = BlogCategory::updateOrCreate(['slug' => 'laravel-ecosystem'], [
            'parent_id' => $catSoftware->id,
            'name' => 'منظومة Laravel',
            'description' => 'شروحات وتطبيقات متقدمة في بيئة عمل Laravel وPHP 8 الحديث.',
            'image' => 'https://amtdex.com/images/screens/shop.webp',
            'sort_order' => 4,
            'is_visible' => true,
            'meta_title' => 'تطوير تطبيقات الويب الاحترافية باستخدام Laravel | مدونة Amtdex',
            'meta_description' => 'مقالات معمقة حول تحسين أداء وتأمين تطبيقات Laravel في الإنتاج.',
            'canonical_url' => 'https://blog.amtdex.com/categories/laravel-ecosystem',
            'noindex' => false,
        ]);

        // 3. Create Tags
        $tags = [
            'Laravel' => 'laravel',
            'React' => 'react',
            'الذكاء الاصطناعي' => 'ai',
            'الأمن السيبراني' => 'security',
            'DevOps' => 'devops',
            'قواعد البيانات' => 'databases',
        ];

        $tagModels = [];
        foreach ($tags as $name => $slug) {
            $tagModels[$slug] = BlogTag::updateOrCreate(['slug' => $slug], [
                'name' => $name,
                'description' => "كل ما يتعلق بـ {$name} والحلول العملية المرتبطة بها.",
                'meta_title' => "مقالات {$name} | مدونة Amtdex",
                'meta_description' => "مجموعة مقالات وأدلة تقنية حول {$name}.",
                'noindex' => false,
            ]);
        }

        // 4. Create 6 Comprehensive Seed Posts
        $postsData = [
            [
                'title' => 'معمارية النظم المتكاملة: كيف تبني منصة تتحمل 100 ألف طلب بالدقيقة؟',
                'slug' => 'scalable-system-architecture-guide',
                'category_id' => $catSoftware->id,
                'tags' => ['laravel', 'devops', 'databases'],
                'is_featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(5),
                'reading_time_minutes' => 7,
                'views_count' => 1420,
                'cover_image' => 'https://amtdex.com/images/screens/business.webp',
                'cover_image_alt' => 'رسم تخطيطي لمعمارية الأنظمة عالية التحمل',
                'summary' => 'دليل هندسي عملي يوضح كيفية تصميم البنية التحتية، موازنة الأحمال، واستراتيجيات التخزين المؤقت للتعامل مع طفرات الزيارات دون توقف.',
                'focus_keyword' => 'معمارية النظم',
                'meta_title' => 'معمارية النظم المتكاملة: دليل تحمل طفرات الزيارات العالية | Amtdex',
                'meta_description' => 'تعرف على أفضل ممارسات تصميم معمارية النظم البرمجية، كاش Redis، وتوزيع قراءة قواعد البيانات لتحقيق أداء 99.99%.',
                'content' => <<<HTML
<h2>المقدمة: لماذا تنهار الأنظمة عند طفرات الاستخدام؟</h2>
<p>غالباً ما تبدأ التطبيقات بتصميم بسيط يتألف من خادم تطبيق واحد وقاعدة بيانات متصلة مباشرة. ومع ازدياد عدد المستخدمين وعمليات الدفع والطلبات المتزامنة، تظهر اختناقات غير متوقعة في الذاكرة ومنافذ الاتصال بشبكة الخوادم.</p>

<h2>الركائز الأربع للبنية التحتية القابلة للتوسع</h2>
<ul>
  <li><strong>موازنة الأحمال العكسية (Reverse Proxy & Load Balancer):</strong> استخدام NGINX أو Cloudflare لتوزيع حركة المرور وحجب هجمات حجب الخدمة (DDoS).</li>
  <li><strong>فصل جلسات المستخدمين والتخزين المؤقت:</strong> الاعتماد على Redis Cluster لحفظ الجلسات وتخزين استعلامات الـ ORM المتكررة.</li>
  <li><strong>النسخ المتطابق لقواعد البيانات (Read/Write Replicas):</strong> توجيه عمليات الكتابة للخادم الأساسي وعمليات القراءة إلى خوادم مساعدة سريعة.</li>
  <li><strong>طوابير المهام غير المتزامنة (Queues & Workers):</strong> إرسال الإشعارات، معالجة الصور، وإصدار الفواتير في الخلفية دون تعطيل استجابة المتصفح.</li>
</ul>

<h2>استراتيجيات التخزين المؤقت الذكي (Multi-Tier Caching)</h2>
<p>التخزين المؤقت لا يعني فقط حفظ مخرجات الاستعلامات، بل يتعداه إلى التخزين على مستوى حافة الشبكة (Edge CDN) والتخزين اللحظي للبيانات الوصفية في ذاكرة الوصول العشوائي للعمليات الحسابية المتكررة.</p>

<h2>الخلاصة والتطبيق العملي</h2>
<p>النجاح في إدارة الأحمال الضخمة يرتكز على مراقبة المؤشرات الأساسية مثل وقت استجابة الخادم (P95 و P99)، والتقليل من حجم الاتصالات المباشرة بقاعدة البيانات.</p>
HTML
            ],
            [
                'title' => 'تطبيقات الذكاء الاصطناعي في قطاع التجارة الإلكترونية: من الدردشة إلى التخصيص الكامل',
                'slug' => 'ai-in-ecommerce-personalization',
                'category_id' => $catAi->id,
                'tags' => ['ai'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(4),
                'reading_time_minutes' => 6,
                'views_count' => 980,
                'cover_image' => 'https://amtdex.com/images/screens/shop.webp',
                'cover_image_alt' => 'واجهة متجر إلكتروني ذكي مدعوم بالذكاء الاصطناعي',
                'summary' => 'كيف تستفيد المتاجر الإلكترونية من نماذج التوصية الذكية والبحث الدلالي لرفع متوسط قيمة السلة ومعدل التحويل بأكثر من 30%.',
                'focus_keyword' => 'الذكاء الاصطناعي في التجارة',
                'meta_title' => 'الذكاء الاصطناعي في التجارة الإلكترونية ورفع التحويلات | Amtdex',
                'meta_description' => 'استراتيجيات دمج الذكاء الاصطناعي التوليدي والبحث الدلالي في المتاجر لتقديم تجربة تسوق فائقة التخصيص.',
                'content' => <<<HTML
<h2>ما الذي تغيّر في تجربة الشراء الرقمي؟</h2>
<p>لم يعد المتسوق يبحث بالكلمات المفتاحية الجامدة؛ بل أصبح يطلب بعبارات طبيعية مثل "حقيبة عمل جلدية مقاومة للماء تتسع لحاسوب 16 بوصة". وهنا يأتي دور البحث المتجهي (Vector Search) والنماذج الدلالية.</p>

<h2>أبرز حالات الاستخدام الناجحة</h2>
<ul>
  <li><strong>محركات التوصية الديناميكية:</strong> عرض منتجات مكملة تتوافق مع ذوق العميل وسجل تصفحه اللحظي.</li>
  <li><strong>المساعد البيعي الافتراضي:</strong> روبوت محادثة مدرب على كتالوج المتجر يوضح الفروق بين المنتجات ويجيب عن استفسارات المقاسات والشحن.</li>
  <li><strong>التسعير المرن:</strong> احتساب العروض والخصومات بناءً على مستوى الطلب وحجم المخزون.</li>
</ul>

<h2>حماية خصوصية بيانات العملاء</h2>
<p>عند بناء حلول ذكاء اصطناعي للشركات، نحرص في Amtdex على عدم تسريب بيانات المستخدمين واستخدام نماذج مستضافة محلياً تضمن أقصى درجات السرية.</p>
HTML
            ],
            [
                'title' => 'دليل تأمين تطبيقات الويب وقواعد البيانات ضد ثغرات SQLi وXSS وCSRF',
                'slug' => 'web-security-owasp-top-10-guide',
                'category_id' => $catCloud->id,
                'tags' => ['security', 'databases'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(3),
                'reading_time_minutes' => 8,
                'views_count' => 1850,
                'cover_image' => 'https://amtdex.com/images/screens/wallet.webp',
                'cover_image_alt' => 'درع حماية وأمن سيبراني للبرمجيات',
                'summary' => 'شرح تفصيلي لأخطر الثغرات الأمنية الشائعة وفق معيار OWASP Top 10 وكيفية تطبيق الحماية الطبقية على مستوى الكود والسيرفر.',
                'focus_keyword' => 'تأمين تطبيقات الويب',
                'meta_title' => 'دليل تأمين تطبيقات الويب وقواعد البيانات للمطورين | Amtdex',
                'meta_description' => 'تعلم كيفية إغلاق ثغرات الحقن وتزوير الطلبات وتشفير البيانات الحساسة وفق أفضل ممارسات الأمن السيبراني.',
                'content' => <<<HTML
<h2>الأمن ليس مرحلة نهائية، بل أسلوب كتابة كود</h2>
<p>أغلب الاختراقات الرقمية لا تنتج عن استهداف خوادم عملاقة، بل عن أخطاء صغيرة في تنقية المدخلات أو إعدادات غير محكمة في جدران الحماية.</p>

<h2>ثلاث ثغرات يجب التأكد من إغلاقها فوراً</h2>
<ol>
  <li><strong>حقن قواعد البيانات (SQL Injection):</strong> الاعتماد الإلزامي على Prepared Statements وعدم دمج نصوص الاستعلامات يدوياً أبداً.</li>
  <li><strong>البرمجة النصية عبر المواقع (XSS):</strong> تطهير مدخلات المستخدمين (HTML Purifier) واستخدام رؤوس أمان مثل Content-Security-Policy.</li>
  <li><strong>تزوير الطلبات عبر المواقع (CSRF):</strong> تفعيل رموز التحقق CSRF Tokens لجميع الطلبات ذات التأثير على الحالة (POST, PUT, DELETE).</li>
</ol>

<h2>حماية الاتصالات عبر شهادات SSL وHSTS</h2>
<p>فرض بروتوكول HTTPS مع تفعيل Strict-Transport-Security يمنع هجمات اعتراض حركة المرور (Man-in-the-Middle) ويحمي ملفات تعريف الارتباط الحساسة.</p>
HTML
            ],
            [
                'title' => 'إطلاق المتاجر والتطبيقات في السحابة: أفضل ممارسات CI/CD وأتمتة النشر',
                'slug' => 'cloud-deployment-cicd-best-practices',
                'category_id' => $catCloud->id,
                'tags' => ['devops'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(2),
                'reading_time_minutes' => 5,
                'views_count' => 740,
                'cover_image' => 'https://amtdex.com/images/screens/projects.webp',
                'cover_image_alt' => 'مسار أتمتة النشر البرمجي السحابي',
                'summary' => 'كيف تبني خط ناتج برمجي يقوم باختبار الكود، بناء الحزم المجمعة، ونشرها على الخوادم خلال دقائق دون انقطاع الخدمة.',
                'focus_keyword' => 'أتمتة النشر CI/CD',
                'meta_title' => 'أتمتة النشر البرمجي السحابي وخطوط CI/CD | Amtdex',
                'meta_description' => 'دليل مهندسي DevOps لبناء خطوط النشر الآلي وتفادي الأخطاء اليدوية في بيئات الإنتاج الحية.',
                'content' => <<<HTML
<h2>النشر اليدوي عبر FTP أصبح من الماضي</h2>
<p>الاعتماد على رفع الملفات يدوياً يحمل مخاطر جسيمة مثل نسيان ملف أو تضارب الإصدارات. خطوط التكامل والنشر المستمر (CI/CD) تجعل كل تحديث آمناً وقابلاً للاختبار التلقائي.</p>

<h2>مراحل خط النشر الناجح</h2>
<ul>
  <li>فحص جودة وتنسيق الكود (Linting & Static Analysis).</li>
  <li>تشغيل الاختبارات الأوتوماتيكية الكاملة (Unit & Feature Tests).</li>
  <li>بناء ملفات الواجهة الأمامية وتحسين ضغط الصور والأصول.</li>
  <li>تشغيل ترقيات قاعدة البيانات بنمط عدم التوقف (Zero-Downtime Migration).</li>
</ul>
HTML
            ],
            [
                'title' => 'التحول من الأنظمة القديمة إلى Laravel الحديث: متى وكيف تبدأ؟',
                'slug' => 'modernizing-legacy-php-to-laravel',
                'category_id' => $catLaravel->id,
                'tags' => ['laravel'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDay(),
                'reading_time_minutes' => 6,
                'views_count' => 1100,
                'cover_image' => 'https://amtdex.com/images/screens/crm.webp',
                'cover_image_alt' => 'لوحة تحكم حديثة مطورة بـ Laravel',
                'summary' => 'دليل عملي للمدراء التقنيين وأصحاب الأعمال الراغبين في ترقية برمجياتهم القديمة إلى بيئة آمنة وقابلة للتطوير المستمر.',
                'focus_keyword' => 'ترقية الأنظمة إلى Laravel',
                'meta_title' => 'دليل تحديث الأنظمة البرمجية القديمة إلى Laravel | Amtdex',
                'meta_description' => 'خطوات عملية لنقل قواعد البيانات والميزات الحيوية من الأنظمة القديمة إلى إطار عمل Laravel الحديث.',
                'content' => <<<HTML
<h2>متى يصبح النظام القديم عبئاً على الشركة؟</h2>
<p>عندما يستغرق إضافة ميزة بسيطة أسابيع من الوقت، أو يتكرر توقف النظام عند زيادة العمليات، تكون الإشارة واضحة بأن وقت التحديث قد حان.</p>

<h2>استراتيجية الخنق (Strangler Fig Pattern)</h2>
<p>لا تنصح Amtdex بهدم النظام القديم دفعة واحدة وبنائه من الصفر؛ بل ننصح بعزل الخدمات ونقلها تدريجياً عبر واجهات برمجية (APIs) لضمان استمرارية النشاط التجاري.</p>
HTML
            ],
            [
                'title' => 'تصميم تجربة مستخدم عربية متميزة: قواعد إتقان واجهات RTL والأداء الفائق',
                'slug' => 'mastering-arabic-rtl-ui-ux-design',
                'category_id' => $catSoftware->id,
                'tags' => ['react'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now(),
                'reading_time_minutes' => 5,
                'views_count' => 620,
                'cover_image' => 'https://amtdex.com/images/screens/health.webp',
                'cover_image_alt' => 'تصميم واجهة مستخدم عربية أنيقة ومتجاوبة',
                'summary' => 'العوامل الأساسية التي تجعل الواجهات العربية مريحة للعين، متوافقة ثقافياً، وسريعة الاستجابة على الهواتف والأجهزة المختلفة.',
                'focus_keyword' => 'تصميم واجهات RTL',
                'meta_title' => 'أسرار تصميم واجهات المستخدم العربية RTL والأداء العالي | Amtdex',
                'meta_description' => 'قواعد اختيار الخطوط العربية ومراعاة التباين البصري وتدفق الحركة في تجربة المستخدم من اليمين إلى اليسار.',
                'content' => <<<HTML
<h2>خصوصية تجربة المستخدم باللغة العربية</h2>
<p>الترجمة الحرفية للواجهات الأجنبية لا تصنع تجربة ناجحة. اللغة العربية تتطلب اهتماماً خاصاً بالمسافات الرأسية (Line-Height) بسبب امتداد الحروف وتباين أوزان الخطوط.</p>

<h2>أهم المعايير التصميمية</h2>
<ul>
  <li>اختيار خطوط شاشات مخصصة وواضحة مثل IBM Plex Sans Arabic.</li>
  <li>عكس اتجاه الأيقونات ذات الدلالة الاتجاهية (كأسهم التنقل والتدرجات).</li>
  <li>الحفاظ على سلاسة الحركة والتحميل السريع لتفادي ارتداد الزوار.</li>
</ul>
HTML
            ],
        ];

        foreach ($postsData as $p) {
            $post = BlogPost::updateOrCreate(['slug' => $p['slug']], [
                'author_id' => $admin->id,
                'category_id' => $p['category_id'],
                'title' => $p['title'],
                'summary' => $p['summary'],
                'content' => $p['content'],
                'cover_image' => $p['cover_image'],
                'cover_image_alt' => $p['cover_image_alt'],
                'status' => $p['status'],
                'published_at' => $p['published_at'],
                'reading_time_minutes' => $p['reading_time_minutes'],
                'views_count' => $p['views_count'],
                'is_featured' => $p['is_featured'],
                'allow_comments' => true,
                'focus_keyword' => $p['focus_keyword'],
                'meta_title' => $p['meta_title'],
                'meta_description' => $p['meta_description'],
                'canonical_url' => "https://blog.amtdex.com/posts/{$p['slug']}",
                'robots_index' => true,
                'robots_follow' => true,
                'og_title' => $p['meta_title'],
                'og_description' => $p['meta_description'],
                'og_image' => $p['cover_image'],
                'og_type' => 'article',
                'twitter_card' => 'summary_large_image',
                'twitter_title' => $p['meta_title'],
                'twitter_description' => $p['meta_description'],
                'twitter_image' => $p['cover_image'],
                'schema_type' => 'BlogPosting',
                'faq_schema' => [
                    [
                        'question' => 'هل تدعم هذه الحلول التوسع في بيئات المؤسسات؟',
                        'answer' => 'نعم، جميع الحلول المقدمة في Amtdex مبنية وفق معايير الجودة العالمية ومعمارية السحابة القابلة للتوسع اللانهائي.',
                    ],
                ],
            ]);

            // Attach tags
            $attachIds = [];
            foreach ($p['tags'] as $tagSlug) {
                if (isset($tagModels[$tagSlug])) {
                    $attachIds[] = $tagModels[$tagSlug]->id;
                }
            }
            $post->tags()->sync($attachIds);

            // Add sample comment
            BlogComment::updateOrCreate([
                'post_id' => $post->id,
                'author_email' => 'reader@example.com',
            ], [
                'author_name' => 'م. طارق الصعفاني',
                'content' => 'مقال استثنائي ودقيق جداً، خاصة نقطة توزيع قراءة قواعد البيانات واستخدام الكاش. شكراً لفريق Amtdex على هذا المحتوى القيم!',
                'status' => 'approved',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0',
            ]);
        }

        // 5. Initialize Blog Settings
        BlogSetting::set('blog_title', 'المدونة التقنية — Amtdex');
        BlogSetting::set('blog_description', 'أفكار عملية وتجارب حية في هندسة البرمجيات، الذكاء الاصطناعي، والأنظمة السحابية.');
        BlogSetting::set('blog_subdomain', env('BLOG_SUBDOMAIN', 'blog.amtdex.com'));
        BlogSetting::set('posts_per_page', 9);
        BlogSetting::set('default_og_image', 'https://amtdex.com/images/screens/projects.webp');
        BlogSetting::set('title_template', '{title} | مدونة Amtdex');
        BlogSetting::set('desc_template', '{summary}');
        BlogSetting::set('comments_enabled', true);
        BlogSetting::set('comments_require_approval', true);
        BlogSetting::set('rss_enabled', true);
    }
}
