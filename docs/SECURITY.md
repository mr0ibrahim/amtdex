# Amtdex — دليل الأمان والحماية (Security & Compliance Guide)

> **الإصدار**: 1.0.0  
> **الجمهور المستهدف**: مطورو الواجهة الأمامية ومهندسو خادم Laravel  

يحدد هذا الدليل تدابير الأمان المطبقة في الواجهة الأمامية، والمتطلبات الإلزامية التي يجب تفعيلها في خادم Laravel لحماية بيانات الشركة والمستخدمين.

---

## 1. أمان الواجهة الأمامية (Frontend Security Measures)

1. **انعدام الأسرار والمفاتيح (Zero Secrets in Frontend)**:
   * لا توجد أي مفاتيح تشفير، كلمات مرور إنتاجية، أو رموز سرية داخل مستودع الواجهة الأمامية.
   * المتغيرات المتاحة هي متغيرات عامة مثل `VITE_API_URL` و `VITE_ROUTER_BASENAME`.
2. **حدود وضوابط رفع الملفات (File Upload Boundaries)**:
   * **الحد الأقصى للحجم**: 10 ميجابايت (يتم التحقق منه في المتصفح قبل بدء الإرسال).
   * **الأنواع المسموحة**: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `application/pdf`.
3. **الحماية التلقائية من هجمات XSS**:
   * الاعتماد على نظام التعقيم التلقائي لـ React (JSX auto-escaping).
   * عدم استخدام `dangerouslySetInnerHTML` على مدخلات المستخدم.
4. **حماية جلسات الكوكيز (HttpOnly & SameSite)**:
   * تدار الجلسة بالكامل عبر كوكيز مشفرة من نوع `HttpOnly` صادرة من Laravel Sanctum، مما يجعلها غير قابلة للقراءة عبر جافاسكريبت وبالتالي منيعة ضد سرقة الجلسات.

---

## 2. متطلبات الخادم الإلزامية في Laravel (Server-Side Requirements)

### 2.1 حماية هجمات التكرار (Rate Limiting)
يجب تطبيق خنق الطلبات عبر `routes/api.php` في Laravel:
* **نماذج التواصل وعروض الأسعار**:
  ```php
  Route::middleware(['throttle:5,1'])->group(function () {
      Route::post('/contact', [LeadController::class, 'storeContact']);
      Route::post('/quotes', [QuoteController::class, 'storeQuote']);
  });
  ```
* **تسجيل الدخول (Login Brute Force Protection)**:
  ```php
  Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
  ```
* **واجهات القراءة العامة**: `throttle:60,1` (60 طلباً بالدقيقة).

### 2.2 حماية السبام (Spam & Bot Protection)
* **تقنية مصيدة الروبوتات (Honeypot)**:
  إضافة حقل مخفي في نماذج التواصل (مثل `website_url_hp`)؛ إذا تم ملء هذا الحقل من قبل روبوتات الإعلانات، يرفض الطلب فوراً برمز `200` صامت أو `422`.
* **Cloudflare Turnstile أو Google reCAPTCHA v3**:
  يُوصى بإدراج مفتاح التحقق غير المرئي في طلبات `POST /api/v1/contact` و `POST /api/v1/quotes`.

### 2.3 إعدادات CORS و Sanctum Stateful Domains
في ملف `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => [env('FRONTEND_URL', 'https://amtdex.ye')],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

وفي ملف `.env` في Laravel:
```env
SANCTUM_STATEFUL_DOMAINS=amtdex.ye,127.0.0.1:5173,127.0.0.1:8000
SESSION_DOMAIN=.amtdex.ye
```

