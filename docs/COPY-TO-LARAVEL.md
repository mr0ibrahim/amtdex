# Amtdex — دليل النسخ والدمج في مشروع Laravel جديد (Copy-to-Laravel Guide)

> **الهدف**: نقل واجهات مشروع Amtdex (الموقع التسويقي ولوحة التحكم React) إلى مشروع **Laravel 11 أو 12** جديد دون الحاجة لكتابة أو تعديل أي سطر في الواجهة.

---

## 1. الخطوات التحضيرية في مشروع Laravel الجديد

إذا لم تكن قد أنشأت مشروع Laravel بعد، أنشئه بواسطة Composer:

```bash
composer create-project laravel/laravel amtdex-backend
cd amtdex-backend
```

### 1.1 تثبيت حزم Laravel الأساسية (Sanctum)
```bash
composer require laravel/sanctum
php artisan sanctum:install
```

---

## 2. نسخ الملفات بالترتيب الدقيق (File Copy Matrix)

انسخ المجلدات والملفات من مستودع `amtdex` إلى مشروع Laravel كالتالي:

| المصدر في مشروع Amtdex | الوجهة في مشروع Laravel | الغرض |
|---|---|---|
| `resources/js/` | `resources/js/` | كافة شيفرات React، المكونات، الصفحات، وعميل API |
| `resources/css/` | `resources/css/` | ملف `app.css` ومتغيرات الهوية والتنسيقات (`tokens.css` وغيرها) |
| `laravel-stubs/resources/views/app.blade.php` | `resources/views/app.blade.php` | قالب Blade الأساسي الحاوي لـ `@vite` وحاوية React `#root` |
| `laravel-stubs/routes/web.php` | `routes/web.php` | مسار الـ SPA Catch-All الموجه لـ `app.blade.php` |
| `public/favicon.svg` & `public/icons.svg` | `public/` | الأيقونات والشعارات الأساسية |
| `public/robots.txt` & `public/sitemap.xml` | `public/` | ملفات السيو المجهزة بالأذونات ومنع أرشفة اللوحة |
| `vite.config.ts` | `vite.config.ts` | ضبط Vite مع `laravel-vite-plugin` و `@tailwindcss/vite` |
| `tsconfig.json` & `tsconfig.app.json` | في الجذر | ربط مسارات TypeScript والـ `@/` alias |
| `docs/` & `openapi.yaml` | في الجذر (للتوثيق) | مواصفات الـ API وجداول الـ Migration المقترحة |

---

## 3. دمج التبعيات في `package.json`

في مشروع Laravel، افتح `package.json` وأضف التبعيات التالية، ثم نفذ `npm install`:

```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@tanstack/react-query": "^5.105.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "react-helmet-async": "^3.0.0",
    "react-router-dom": "^7.18.4",
    "tailwindcss": "^4.3.3",
    "zod": "^4.6.7"
  },
  "devDependencies": {
    "@types/node": "^24.19.2",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.2",
    "laravel-vite-plugin": "^3.2.0",
    "typescript": "~6.0.3",
    "vite": "^8.3.4"
  }
}
```

قم بالتثبيت:
```bash
npm install
```

---

## 4. إعداد بيئة Laravel (`.env`)

أضف أو عدّل المتغيرات التالية في ملف `.env` في Laravel لدعم جلسات Sanctum والـ CSRF:

```env
APP_NAME=Amtdex
APP_URL=http://127.0.0.1:8000

# Sanctum SPA Stateful Domains
SANCTUM_STATEFUL_DOMAINS=127.0.0.1:8000,localhost:8000,127.0.0.1:5173
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
```

---

## 5. التشغيل والتحقق

### أ) في بيئة التطوير المدمجة (Laravel + Vite HMR):
افتح نافذتي طرفية (Terminal):

* **النافذة 1 (خادم Laravel)**:
  ```bash
  php artisan serve
  ```
* **النافذة 2 (خادم تطوير أصول Vite)**:
  ```bash
  npm run dev
  ```
افتح المتصفح على: `http://127.0.0.1:8000` — ستعمل الواجهة فورياً بكامل ميزاتها مع إعادة التحميل الحي (HMR).

### ب) بناء أصول الإنتاج (Production Build):
```bash
npm run build
```
سيقوم Vite بإنشاء ملفات الإنتاج داخل مجلد `public/build/` مع تجزئة الحزم وتوليد `manifest.json`.

---

## 6. بناء مسارات الـ API الخلفية

ارجع إلى الملفات المرفقة لبناء منطق الخادم خطوة بخطوة:
* [`docs/API-CONTRACT.md`](file:///d:/default-workspace/default-workspace/docs/API-CONTRACT.md): للاطلاع على أسماء الحقول وقواعد التحقق لكل مسار.
* [`docs/LARAVEL-MIGRATION.md`](file:///d:/default-workspace/default-workspace/docs/LARAVEL-MIGRATION.md): لتوليد جداول قواعد البيانات والمتحكمات بأوامر `artisan`.
* [`docs/SECURITY.md`](file:///d:/default-workspace/default-workspace/docs/SECURITY.md): لتفعيل الـ Rate Limiting وحماية السبام.

