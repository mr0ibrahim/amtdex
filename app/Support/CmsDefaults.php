<?php

namespace App\Support;

class CmsDefaults
{
    public static function document(): array
    {
        return [
            'copy' => [
                'footer.blurb' => 'حلول برمجية متكاملة — من الفكرة للكود للإطلاق. نبني مواقع، تطبيقات، وأنظمة أعمال بمعايير عالمية.',
                'footer.city' => 'صنعاء — الجمهورية اليمنية',
            ],
            'pages' => [
                ['path' => '/', 'label' => 'الرئيسية', 'published' => true, 'seoTitle' => 'الرئيسية', 'seoDescription' => 'Amtdex - شركة يمنية للحلول البرمجية: مواقع، تطبيقات، ERP/CRM، ذكاء اصطناعي.'],
                ['path' => '/services', 'label' => 'الخدمات', 'published' => true, 'seoTitle' => 'الخدمات', 'seoDescription' => 'كل ما تحتاجه لبناء منتجك الرقمي المتكامل.'],
                ['path' => '/portfolio', 'label' => 'أعمالنا', 'published' => true, 'seoTitle' => 'اعمالنا', 'seoDescription' => 'نماذج من مشاريع ومنصات رقمية قمنا بتطويرها وإطلاقها بنجاح.'],
                ['path' => '/blog', 'label' => 'المدونة', 'published' => true, 'seoTitle' => 'مدونة Amtdex التقنية', 'seoDescription' => 'أفكار عملية وتجارب حية في هندسة البرمجيات، الذكاء الاصطناعي، والأنظمة السحابية.'],
                ['path' => '/about', 'label' => 'من نحن', 'published' => true, 'seoTitle' => 'من نحن', 'seoDescription' => 'نبني برمجيات تخدم الناس.'],
                ['path' => '/pricing', 'label' => 'الأسعار', 'published' => true, 'seoTitle' => 'الاسعار', 'seoDescription' => 'استثمار برمجي واضح وشفاف بدون مفاجآت.'],
                ['path' => '/contact', 'label' => 'تواصل', 'published' => true, 'seoTitle' => 'تواصل معنا', 'seoDescription' => 'لنتحدث عن مشروعك التقني القادم.'],
                ['path' => '/quote', 'label' => 'اطلب عرض سعر', 'published' => true, 'seoTitle' => 'اطلب عرض سعر', 'seoDescription' => 'اطلب عرض سعر مخصص.'],
            ],
            'nav' => [
                ['id' => 'services', 'label' => 'الخدمات', 'to' => '/services', 'visible' => true],
                ['id' => 'portfolio', 'label' => 'أعمالنا', 'to' => '/portfolio', 'visible' => true],
                ['id' => 'blog', 'label' => 'المدونة', 'to' => '/blog', 'visible' => true],
                ['id' => 'tech', 'label' => 'التقنيات', 'to' => '/services', 'visible' => true],
                ['id' => 'about', 'label' => 'من نحن', 'to' => '/about', 'visible' => true],
                ['id' => 'pricing', 'label' => 'الأسعار', 'to' => '/pricing', 'visible' => true],
                ['id' => 'contact', 'label' => 'تواصل معنا', 'to' => '/contact', 'visible' => true],
                ['id' => 'quote', 'label' => 'اطلب عرض سعر', 'to' => '/quote', 'visible' => true],
            ],
            'homeSections' => [
                ['id' => 'hero', 'label' => 'الافتتاح', 'visible' => true, 'fields' => [
                    'kicker' => 'AMTDEX — شريكك للتحول الرقمي والحلول البرمجية',
                    'title' => "نحوّل أفكارك\nإلى برمجيات تنمو.",
                    'lede' => 'شركة برمجيات يمنية نطوّر أنظمة مخصصة، تطبيقات جوال، ومنصات سحابية — من الفكرة إلى الإطلاق والدعم، بجودة مؤسسية وسرعة تنفيذ.',
                    'cta' => 'اطلب استشارة مجانية',
                    'cta2' => 'استعرض أعمالنا',
                    'proof' => '4.9/5 من 300+ عميل في الخليج يثقون بنا',
                ]],
                ['id' => 'marquee', 'label' => 'الشريط المتحرك', 'visible' => true, 'fields' => [
                    'label' => 'شركاؤنا في التحول الرقمي — من صنعاء إلى المنطقة',
                ]],
                ['id' => 'stats', 'label' => 'الأرقام', 'visible' => true, 'fields' => []],
                ['id' => 'gallery', 'label' => 'واجهات المنتجات', 'visible' => true, 'fields' => [
                    'kicker' => 'واجهات تصنع الفرق',
                    'title' => 'من فكرتك، إلى تجربة متكاملة.',
                    'lede' => 'متاجر، تطبيقات، وأنظمة أعمال — نصمّم لكل منتج واجهة تخدم مستخدميه، وتعبّر عن هويته.',
                ]],
                ['id' => 'spotlight', 'label' => 'قصة النجاح', 'visible' => true, 'fields' => [
                    'kicker' => 'قصة نجاح — من ورشة الى منصة',
                    'title' => '“AMTDEX لم تبن لنا نظاما، بنت لنا قدرة على النمو.”',
                ]],
                ['id' => 'workflow', 'label' => 'منهجية العمل', 'visible' => true, 'fields' => [
                    'kicker' => 'منهجية العمل',
                    'title' => "من الفكرة إلى الإطلاق\nفي ثلاث خطوات.",
                ]],
                ['id' => 'orbit', 'label' => 'التقنيات', 'visible' => true, 'fields' => [
                    'kicker' => 'تقنياتنا تدور حول عملك — لا العكس',
                    'title' => 'من الفكرة الى الـ API في اسابيع',
                ]],
                ['id' => 'guarantee', 'label' => 'الضمان', 'visible' => true, 'fields' => [
                    'title' => 'ضمان AMTDEX — اذا لم نسلم حسب الاتفاق، نعيد الدفعة الاخيرة كاملة.',
                ]],
                ['id' => 'services', 'label' => 'لماذا AMTDEX', 'visible' => true, 'fields' => [
                    'kicker' => 'لماذا AMTDEX',
                    'title' => "حلول برمجية\nمصممة لنموك.",
                    'lede' => 'لا نبيع قوالب جاهزة. نحلل عملك، نصمم الحل، ونبنيه ليخدمك لسنوات — آمن، قابل للتوسع، وسهل الاستخدام.',
                    'link' => 'تعرّف على خدماتنا',
                ]],
                ['id' => 'cta', 'label' => 'دعوة الإجراء', 'visible' => true, 'fields' => [
                    'title' => "جاهز لبناء\nبرمجيتك القادمة؟",
                ]],
                ['id' => 'newsletter', 'label' => 'النشرة', 'visible' => true, 'fields' => [
                    'title' => "عندك فكرة؟\nنحوّلها لمنتج.",
                    'lede' => 'احجز استشارة مجانية 30 دقيقة — نرسم خارطة طريق، نقدّر التكلفة، ونبدأ خلال أيام.',
                ]],
            ],
        ];
    }
}
