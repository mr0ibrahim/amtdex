<?php

namespace App\Support;

class CmsDefaults
{
    public static function document(): array
    {
        return [
            'copy' => [
                'footer.blurb' => 'نحن شركة برمجيات وتقنية معلومات، نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو.',
                'footer.city' => 'اليمن - إب',
            ],
            'pages' => [
                ['path' => '/', 'label' => 'الرئيسية', 'published' => true, 'seoTitle' => 'AMTDEX SOFT — امتدكس سوفت', 'seoDescription' => 'هندسة الفكرة قبل برمجتها. من الفكرة إلى التنفيذ.'],
                ['path' => '/services', 'label' => 'الخدمات', 'published' => true, 'seoTitle' => 'ماذا نقدم؟ — AMTDEX SOFT', 'seoDescription' => 'مواقع، تطبيقات، متاجر، أنظمة إدارة، تسويق، هوية بصرية، وحماية المواقع والأنظمة.'],
                ['path' => '/portfolio', 'label' => 'أعمالنا', 'published' => true, 'seoTitle' => 'اعمالنا', 'seoDescription' => 'نماذج من مشاريع ومنصات رقمية قمنا بتطويرها وإطلاقها بنجاح.'],
                ['path' => '/blog', 'label' => 'المدونة', 'published' => true, 'seoTitle' => 'المدونة — AMTDEX SOFT', 'seoDescription' => 'ملاحظات وأفكار من امتدكس سوفت.'],
                ['path' => '/about', 'label' => 'من نحن', 'published' => true, 'seoTitle' => 'من نحن — امتدكس سوفت', 'seoDescription' => 'نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو.'],
                ['path' => '/contact', 'label' => 'تواصل', 'published' => true, 'seoTitle' => 'تواصل معنا — AMTDEX SOFT', 'seoDescription' => 'اليمن - إب. Info@amtdex.com. +967 784 440 429.'],
                ['path' => '/quote', 'label' => 'ابدأ مشروعك', 'published' => true, 'seoTitle' => 'ابدأ مشروعك — AMTDEX SOFT', 'seoDescription' => 'أخبرنا عن فكرتك ونعود إليك.'],
            ],
            'nav' => [
                ['id' => 'services', 'label' => 'الخدمات', 'to' => '/services', 'visible' => true],
                ['id' => 'portfolio', 'label' => 'أعمالنا', 'to' => '/portfolio', 'visible' => true],
                ['id' => 'blog', 'label' => 'المدونة', 'to' => '/blog', 'visible' => true],
                ['id' => 'tech', 'label' => 'التقنيات', 'to' => '/services', 'visible' => true],
                ['id' => 'about', 'label' => 'من نحن', 'to' => '/about', 'visible' => true],
                ['id' => 'contact', 'label' => 'تواصل معنا', 'to' => '/contact', 'visible' => true],
                ['id' => 'quote', 'label' => 'ابدأ مشروعك', 'to' => '/quote', 'visible' => true],
            ],
            'homeSections' => [
                ['id' => 'hero', 'label' => 'الافتتاح', 'visible' => true, 'fields' => [
                    'kicker' => 'امتدكس سوفت — هندسة الفكرة قبل برمجتها.',
                    'title' => "هندسة الفكرة\nقبل برمجتها.",
                    'lede' => 'حيث تلتقي الأفكار بالتقنية، وتتحول الطموحات إلى مشاريع قابلة للتحقيق.',
                    'cta' => 'تواصل معنا',
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
                ['id' => 'workflow', 'label' => 'من الفكرة إلى الإنجاز', 'visible' => true, 'fields' => [
                    'kicker' => 'من الفكرة إلى الإنجاز',
                    'title' => "خمس خطوات\nمن الفكرة إلى الإنجاز.",
                ]],
                ['id' => 'orbit', 'label' => 'التقنيات', 'visible' => true, 'fields' => [
                    'kicker' => 'تقنياتنا تدور حول عملك — لا العكس',
                    'title' => 'من الفكرة الى الـ API في اسابيع',
                ]],
                ['id' => 'guarantee', 'label' => 'الضمان', 'visible' => true, 'fields' => [
                    'title' => 'ضمان AMTDEX — اذا لم نسلم حسب الاتفاق، نعيد الدفعة الاخيرة كاملة.',
                ]],
                ['id' => 'services', 'label' => 'ماذا نقدم؟', 'visible' => true, 'fields' => [
                    'kicker' => 'ماذا نقدم؟',
                    'title' => "حلول رقمية\nلمشروعك.",
                    'lede' => 'نساعد الأفراد والشركات على تطوير أعمالهم: مواقع، تطبيقات، متاجر، أنظمة، تسويق، هوية، وحماية.',
                    'link' => 'كل الخدمات',
                ]],
                ['id' => 'cta', 'label' => 'دعوة الإجراء', 'visible' => true, 'fields' => [
                    'title' => "من الفكرة\nإلى التنفيذ.",
                ]],
                ['id' => 'newsletter', 'label' => 'النشرة', 'visible' => true, 'fields' => [
                    'title' => "عندك فكرة؟\nراسلنا.",
                    'lede' => 'من الفكرة إلى التنفيذ. اكتب بريدك أو تواصل معنا مباشرة.',
                ]],
            ],
        ];
    }
}
