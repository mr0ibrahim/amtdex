<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class CmsStore
{
    public const KEY = 'cms_document';

    public static function full(): array
    {
        return Cache::remember('cms.full', 3600, function () {
            $row = SiteSetting::query()->where('key', self::KEY)->value('value');
            $stored = is_string($row) ? json_decode($row, true) : null;

            return self::merge(is_array($stored) ? $stored : []);
        });
    }

    public static function forPublic(bool $preview = false): array
    {
        $full = self::full();
        if ($preview) {
            return $full;
        }

        $full['pages'] = array_values(array_filter($full['pages'], fn ($page) => ! empty($page['published'])));
        $published = array_column($full['pages'], 'path');
        $full['nav'] = array_values(array_filter(
            $full['nav'],
            fn ($item) => ! empty($item['visible']) && in_array($item['to'], $published, true)
        ));
        $full['homeSections'] = array_values(array_filter($full['homeSections'], fn ($section) => ! empty($section['visible'])));

        return $full;
    }

    public static function publishedPaths(): array
    {
        return array_column(self::forPublic(false)['pages'], 'path');
    }

    public static function save(array $document): array
    {
        $merged = self::merge($document);
        SiteSetting::updateOrCreate(
            ['key' => self::KEY],
            ['value' => json_encode($merged, JSON_UNESCAPED_UNICODE)]
        );
        Cache::forget('cms.full');
        Cache::forget('cms.bootstrap');

        return $merged;
    }

    /** Copy that shipped before the Instagram company record. Kept so a saved draft of those lines does not override the real text. */
    private const RETIRED = [
        'حلول برمجية متكاملة — من الفكرة للكود للإطلاق. نبني مواقع، تطبيقات، وأنظمة أعمال بمعايير عالمية.',
        'صنعاء — الجمهورية اليمنية',
        'Amtdex - شركة يمنية للحلول البرمجية: مواقع، تطبيقات، ERP/CRM، ذكاء اصطناعي.',
        'كل ما تحتاجه لبناء منتجك الرقمي المتكامل.',
        'نماذج من مشاريع ومنصات رقمية قمنا بتطويرها وإطلاقها بنجاح.',
        'أفكار عملية وتجارب حية في هندسة البرمجيات، الذكاء الاصطناعي، والأنظمة السحابية.',
        'نبني برمجيات تخدم الناس.',
        'استثمار برمجي واضح وشفاف بدون مفاجآت.',
        'لنتحدث عن مشروعك التقني القادم.',
        'اطلب عرض سعر مخصص.',
        'AMTDEX — شريكك للتحول الرقمي والحلول البرمجية',
        "نحوّل أفكارك\nإلى برمجيات تنمو.",
        'شركة برمجيات يمنية نطوّر أنظمة مخصصة، تطبيقات جوال، ومنصات سحابية — من الفكرة إلى الإطلاق والدعم، بجودة مؤسسية وسرعة تنفيذ.',
        'اطلب استشارة مجانية',
        'استعرض أعمالنا',
        '4.9/5 من 300+ عميل في الخليج يثقون بنا',
        'شركاؤنا في التحول الرقمي — من صنعاء إلى المنطقة',
        'واجهات تصنع الفرق',
        'من فكرتك، إلى تجربة متكاملة.',
        'متاجر، تطبيقات، وأنظمة أعمال — نصمّم لكل منتج واجهة تخدم مستخدميه، وتعبّر عن هويته.',
        'قصة نجاح — من ورشة الى منصة',
        '“AMTDEX لم تبن لنا نظاما، بنت لنا قدرة على النمو.”',
        'منهجية العمل',
        "من الفكرة إلى الإطلاق\nفي ثلاث خطوات.",
        'تقنياتنا تدور حول عملك — لا العكس',
        'من الفكرة الى الـ API في اسابيع',
        'ضمان AMTDEX — اذا لم نسلم حسب الاتفاق، نعيد الدفعة الاخيرة كاملة.',
        'لماذا AMTDEX',
        "حلول برمجية\nمصممة لنموك.",
        'لا نبيع قوالب جاهزة. نحلل عملك، نصمم الحل، ونبنيه ليخدمك لسنوات — آمن، قابل للتوسع، وسهل الاستخدام.',
        'تعرّف على خدماتنا',
        "جاهز لبناء\nبرمجيتك القادمة؟",
        "عندك فكرة؟\nنحوّلها لمنتج.",
        'احجز استشارة مجانية 30 دقيقة — نرسم خارطة طريق، نقدّر التكلفة، ونبدأ خلال أيام.',
    ];

    private static function keep(mixed $stored, mixed $fallback): mixed
    {
        if (is_string($stored) && in_array($stored, self::RETIRED, true)) {
            return $fallback;
        }

        return $stored ?? $fallback;
    }

    public static function merge(array $stored): array
    {
        $defaults = CmsDefaults::document();
        $storedPages = collect($stored['pages'] ?? [])->keyBy('path');
        $pages = collect($defaults['pages'])->map(function ($page) use ($storedPages) {
            $override = $storedPages->get($page['path'], []);
            $merged = array_merge($page, $override);
            foreach (['label', 'seoTitle', 'seoDescription'] as $key) {
                $merged[$key] = self::keep($merged[$key] ?? null, $page[$key]);
            }
            if (in_array($page['path'], ['/portfolio', '/pricing'], true) && in_array($override['seoDescription'] ?? '', self::RETIRED, true)) {
                $merged['published'] = false;
            }
            if (! $page['published'] && ($override['seoDescription'] ?? null) === null) {
                $merged['published'] = false;
            }

            return $merged;
        })->values()->all();

        $publishedByPath = collect($pages)->keyBy('path');
        $storedNav = collect($stored['nav'] ?? [])->keyBy('id');
        $nav = collect($defaults['nav'])->map(function ($item) use ($storedNav, $publishedByPath) {
            $merged = array_merge($item, $storedNav->get($item['id'], []));
            $page = $publishedByPath->get($item['to']);
            if ($page && ! $page['published']) {
                $merged['visible'] = false;
            }
            if ($item['id'] === 'tech' && ($storedNav->get('tech')['label'] ?? 'التقنيات') === 'التقنيات') {
                $merged['visible'] = false;
            }

            return $merged;
        });
        if (! empty($stored['nav'])) {
            $order = array_column($stored['nav'], 'id');
            $nav = $nav->sortBy(fn ($item) => array_search($item['id'], $order, true) === false ? 999 : array_search($item['id'], $order, true));
        }

        $storedSections = collect($stored['homeSections'] ?? [])->keyBy('id');
        $sections = collect($defaults['homeSections'])->map(function ($section) use ($storedSections) {
            $override = $storedSections->get($section['id'], []);
            $fields = array_merge($section['fields'], $override['fields'] ?? []);
            foreach ($fields as $key => $value) {
                $fields[$key] = self::keep($value, $section['fields'][$key] ?? '');
            }
            $custom = false;
            foreach ($override['fields'] ?? [] as $value) {
                if (is_string($value) && $value !== '' && ! in_array($value, self::RETIRED, true)) {
                    $custom = true;
                }
            }
            $section['visible'] = $custom
                ? ($override['visible'] ?? $section['visible'])
                : $section['visible'];
            $section['fields'] = $fields;
            if (! empty($override['image'])) {
                $section['image'] = $override['image'];
            }

            return $section;
        });
        if (! empty($stored['homeSections'])) {
            $order = array_column($stored['homeSections'], 'id');
            $sections = $sections->sortBy(fn ($section) => ($i = array_search($section['id'], $order, true)) === false ? 999 : $i);
        }

        return [
            'copy' => collect($defaults['copy'])->merge($stored['copy'] ?? [])->map(function ($value, $key) use ($defaults) {
                return self::keep($value, $defaults['copy'][$key] ?? $value);
            })->all(),
            'pages' => $pages,
            'nav' => $nav->values()->all(),
            'homeSections' => $sections->values()->all(),
        ];
    }
}
