# Amtdex — دليل ترحيل وهيكلة Laravel (Laravel Migration Architecture)

> **الإصدار**: 1.0.0  
> **الإطار المستهدف**: Laravel 11.x أو Laravel 12.x  
> **حزم التوصية**: `laravel/sanctum`, `spatie/laravel-permission` (أو سياسات مدمجة), `spatie/laravel-medialibrary`  

يقدم هذا الدليل جدول ربط كامل بين كيانات الواجهة الأمامية في React والمكونات المقترحة في Laravel Backend:
جداول وقواعد البيانات (Migrations)، النماذج (Eloquent Models)، متحكمات واجهة البرمجة (API Controllers)، طلبات التحقق (FormRequests)، الموارد (API Resources)، وسياسات الصلاحيات (Policies).

---

## 1. جدول ربط الكيانات الشامل (Entity Mapping Matrix)

| الكيان (Entity) | جدول الترحيل (Migration Table) | نموذج Eloquent (Model) | المتحكم (Controller) | طلب التحقق (FormRequest) | مورد الاستجابة (API Resource) | السياسة (Policy / Gates) |
|---|---|---|---|---|---|---|
| **طلب تواصل (Contact Lead)** | `leads` (type=contact) | `App\Models\Lead` | `Api\V1\LeadController` | `StoreContactRequest` | `LeadResource` | `LeadPolicy` (`viewAny`, `update`, `delete`) |
| **طلب عرض سعر (Quote Lead)** | `leads` (type=quote) + `lead_quotes` | `App\Models\Lead`, `App\Models\QuoteDetail` | `Api\V1\QuoteController` | `StoreQuoteRequest` | `QuoteResource` | `LeadPolicy` |
| **النشرة البريدية (Newsletter)**| `newsletter_subscribers` | `App\Models\NewsletterSubscriber` | `Api\V1\NewsletterController` | `SubscribeNewsletterRequest`| `NewsletterResource` | متاح للعامة / إدارة للأدمن |
| **المستخدمون (Users & RBAC)** | `users` + `role` column | `App\Models\User` | `Api\V1\UserController` | `UserRequest` | `UserResource` | `UserPolicy` (`manage-users`) |
| **المصادقة (Sanctum Auth)** | `personal_access_tokens` / sessions | `App\Models\User` | `Api\V1\AuthController` | `LoginRequest` | `UserResource` | — |
| **الخدمات (Services)** | `services` | `App\Models\Service` | `Api\V1\ServiceController` | `ServiceRequest` | `ServiceResource` | `ServicePolicy` (`editor`/`admin`) |
| **الأعمال والمشاريع (Projects)** | `projects` | `App\Models\Project` | `Api\V1\ProjectController` | `ProjectRequest` | `ProjectResource` | `ProjectPolicy` (`editor`/`admin`) |
| **إدارة السيو (SEO Metadata)** | `seo_metadata` | `App\Models\SeoMetadata` | `Api\V1\SeoController` | `SeoMetadataRequest` | `SeoResource` | `SeoPolicy` |
| **الوسائط والملفات (Media)** | `media` (Spatie MediaLibrary) | `Spatie\MediaLibrary\MediaCollections\Models\Media` | `Api\V1\MediaController` | `UploadMediaRequest` | `MediaResource` | `MediaPolicy` |
| **إعدادات الموقع (Settings)** | `site_settings` | `App\Models\SiteSetting` | `Api\V1\SettingsController` | `UpdateSettingsRequest` | `SettingsResource` | `admin` فقط |
| **سجل الأمان (Audit Logs)** | `audit_logs` | `App\Models\AuditLog` | `Api\V1\AuditController` | — | `AuditLogResource` | `admin` فقط |

---

## 2. تفاصيل ترحيل قواعد البيانات (Database Migrations Schema)

### 2.1 جدول المستخدمين والأدوار (`users`)
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->enum('role', ['admin', 'editor', 'viewer'])->default('viewer');
    $table->rememberToken();
    $table->timestamps();
});
```

### 2.2 جدول الطلبات والتواصل (`leads`)
```php
Schema::create('leads', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email');
    $table->string('phone', 30)->nullable();
    $table->string('subject', 150)->nullable();
    $table->text('message');
    $table->enum('status', ['جديد', 'قيد المراجعة', 'تم التواصل', 'مغلق'])->default('جديد');
    $table->enum('source', ['contact', 'quote', 'newsletter'])->default('contact');
    $table->json('meta')->nullable(); // يحفظ تفاصيل الميزانية، والجدول الزمني لطلبات الأسعار
    $table->timestamps();

    $table->index(['status', 'source']);
    $table->index('created_at');
});
```

### 2.3 جدول النشرة البريدية (`newsletter_subscribers`)
```php
Schema::create('newsletter_subscribers', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

### 2.4 جدول الخدمات (`services`)
```php
Schema::create('services', function (Blueprint $table) {
    $table->id();
    $table->string('slug')->unique();
    $table->string('icon', 50)->default('web');
    $table->string('title');
    $table->string('desc', 500);
    $table->json('bullets')->nullable();
    $table->json('tech')->nullable();
    $table->text('detail')->nullable();
    $table->integer('sort_order')->default(0);
    $table->boolean('is_published')->default(true);
    $table->timestamps();
});
```

### 2.5 جدول المشاريع والأعمال (`projects`)
```php
Schema::create('projects', function (Blueprint $table) {
    $table->id();
    $table->string('slug')->unique();
    $table->string('cat'); // web, mobile, erp, etc.
    $table->string('title');
    $table->string('client');
    $table->string('year', 10)->default('2026');
    $table->json('stack')->nullable();
    $table->string('color', 20)->default('#16064F');
    $table->string('accent', 20)->default('#FFBF08');
    $table->text('summary');
    $table->text('content')->nullable();
    $table->boolean('is_featured')->default(false);
    $table->timestamps();
});
```

### 2.6 جدول بيانات محركات البحث (`seo_metadata`)
```php
Schema::create('seo_metadata', function (Blueprint $table) {
    $table->id();
    $table->string('path')->unique(); // e.g. '/', '/services/web'
    $table->string('title');
    $table->string('description', 500);
    $table->string('canonical')->nullable();
    $table->string('og_image')->nullable();
    $table->boolean('noindex')->default(false);
    $table->json('json_ld')->nullable();
    $table->timestamps();
});
```

### 2.7 جدول سجل العمليات والأمان (`audit_logs`)
```php
Schema::create('audit_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
    $table->string('user_email')->nullable();
    $table->string('action');
    $table->string('ip_address', 45);
    $table->text('user_agent')->nullable();
    $table->json('payload')->nullable();
    $table->timestamp('created_at')->useCurrent();
});
```

---

## 3. أوامر Artisan المقترحة للإنشاء المباشر (Quick Artisan Generation)

انسخ هذه الأوامر ونفذها في مشروع Laravel الجديد لتوليد جميع الملفات فورياً:

```bash
# Auth & Users
php artisan make:controller Api/V1/AuthController
php artisan make:request LoginRequest
php artisan make:controller Api/V1/UserController --api
php artisan make:policy UserPolicy --model=User

# Leads & Quotes
php artisan make:model Lead -m
php artisan make:controller Api/V1/LeadController --api
php artisan make:controller Api/V1/QuoteController
php artisan make:request StoreContactRequest
php artisan make:request StoreQuoteRequest
php artisan make:resource LeadResource
php artisan make:policy LeadPolicy --model=Lead

# Newsletter
php artisan make:model NewsletterSubscriber -m
php artisan make:controller Api/V1/NewsletterController
php artisan make:request SubscribeNewsletterRequest

# Content (Services & Projects)
php artisan make:model Service -m
php artisan make:controller Api/V1/ServiceController --api
php artisan make:request ServiceRequest
php artisan make:resource ServiceResource

php artisan make:model Project -m
php artisan make:controller Api/V1/ProjectController --api
php artisan make:request ProjectRequest
php artisan make:resource ProjectResource

# SEO & Settings & Audit
php artisan make:model SeoMetadata -m
php artisan make:controller Api/V1/SeoController
php artisan make:model AuditLog -m
php artisan make:controller Api/V1/AuditController
php artisan make:controller Api/V1/SettingsController
php artisan make:controller Api/V1/DashboardOverviewController
```

---

## 4. مسارات API المقترحة (`routes/api.php`)

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{
    AuthController,
    LeadController,
    QuoteController,
    NewsletterController,
    ServiceController,
    ProjectController,
    SeoController,
    MediaController,
    SettingsController,
    UserController,
    AuditController,
    DashboardOverviewController
};

Route::prefix('v1')->group(function () {
    // Public Lead & Newsletter routes with Rate Limiting
    Route::post('/contact', [LeadController::class, 'storeContact'])->middleware('throttle:5,1');
    Route::post('/quotes', [QuoteController::class, 'storeQuote'])->middleware('throttle:5,1');
    Route::post('/newsletter', [NewsletterController::class, 'subscribe'])->middleware('throttle:10,1');

    // Public catalog read routes
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);

    // Sanctum authentication
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // Authenticated Dashboard Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Metrics & Stats
        Route::get('/dashboard/stats', [DashboardOverviewController::class, 'stats']);

        // Leads Management
        Route::apiResource('/leads', LeadController::class)->except(['store']);
        Route::patch('/leads/{lead}/status', [LeadController::class, 'updateStatus']);

        // Content Management
        Route::apiResource('/services', ServiceController::class)->except(['index']);
        Route::apiResource('/projects', ProjectController::class)->except(['index']);

        // SEO Routes
        Route::get('/seo', [SeoController::class, 'index']);
        Route::post('/seo', [SeoController::class, 'upsert']);
        Route::delete('/seo', [SeoController::class, 'destroy']);

        // Media Library
        Route::get('/media', [MediaController::class, 'index']);
        Route::post('/media', [MediaController::class, 'upload']);
        Route::delete('/media/{id}', [MediaController::class, 'destroy']);

        // Settings (Admin Only)
        Route::get('/settings', [SettingsController::class, 'show']);
        Route::put('/settings', [SettingsController::class, 'update']);

        // Users & Security Audit (Admin Only)
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/audit', [AuditController::class, 'index']);
    });
});
```

