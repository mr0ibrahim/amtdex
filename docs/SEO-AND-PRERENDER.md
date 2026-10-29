# Amtdex — دليل الأرشفة والتهيئة المسبقة (SEO & Prerender Guide)

> **الإصدار**: 1.0.0  
> **الهدف**: تحقيق أرشفة 100% لمحركات البحث (Google, Bing) وشبكات التواصل (OpenGraph, Twitter Cards) مع الحفاظ على React SPA.

---

## 1. استراتيجية الأرشفة للصفحات العامة (Public SEO)

المشروع يعتمد بنية SPA سريعة، ولضمان قراءة روبوتات البحث لكامل المحتوى العربي والنصوص دون انتظار تنفيذ جافاسكريبت، يُتبع أحد الخيارين المعتمدين مع Laravel:

### الخيار أ (الموصى به في Laravel): حزمة `spatie/laravel-crawler` أو `spatie/laravel-prerender`
تعتمد على كشف هوية الزائر (User-Agent). إذا كان الزائر محرك بحث (`Googlebot`, `bingbot`, `Twitterbot`, `facebookexternalhit`)، يقوم الخادم بتقديم نسخة HTML مولدة ومخبأة مسبقاً (Pre-rendered HTML cache).

**خطوات التفعيل في Laravel:**
```bash
composer require spatie/laravel-prerender
```
في `config/prerender.php`:
```php
return [
    'prerender_url' => env('PRERENDER_URL', 'http://service.prerender.io'),
    'prerender_token' => env('PRERENDER_TOKEN'),
    'whitelist' => [
        '/',
        '/services',
        '/services/*',
        '/portfolio',
        '/portfolio/*',
        '/pricing',
        '/about',
        '/contact',
        '/quote',
    ],
    'blacklist' => [
        '/dashboard*',
        '/login',
        '/403',
        '/api/*',
    ],
];
```

### الخيار ب: Static Snapshot Prerendering عبر Vite
قبل النشر على الإنتاج، يتم أخذ لقطات HTML ثابتة للمسارات العامة الأساسية وحفظها في مجلد `public/` لتخدمها خوادم Nginx مباشرة لموزعات الويب، مع إبقاء التطبيق تفاعلياً (Hydration).

---

## 2. إدارة noindex ومسارات لوحة التحكم

* جميع مسارات لوحة التحكم الإدارية (`/dashboard/*`) وصفحة تسجيل الدخول (`/login`) وصفحة غير مصرح (`/403`) مزودة بـ:
  1. وسم HTML تلقائي في الرأس: `<meta name="robots" content="noindex, nofollow" />`.
  2. منع صريح في ملف [`public/robots.txt`](file:///d:/default-workspace/default-workspace/public/robots.txt):
     ```txt
     Disallow: /dashboard/
     Disallow: /dashboard
     Disallow: /login
     Disallow: /403
     Disallow: /api/
     Disallow: /sanctum/
     ```

---

## 3. ملفات الفهرسة المعتمدة
* **خريطة الموقع**: متوفرة في الرابط الثابت `https://amtdex.ye/sitemap.xml` وتحتوي على جميع مسارات الخدمات، الأعمال، والصفحات التسويقية.
* **ملف الروبوتات**: متوفر في `https://amtdex.ye/robots.txt`.

