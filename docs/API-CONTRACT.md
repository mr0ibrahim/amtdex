# Amtdex — وثيقة عقد واجهات البرمجة (API Contract)

> **الإصدار**: 1.0.0 — REST API v1  
> **البيئة المستهدفة**: Laravel 11/12 (Sanctum SPA Session + FormRequest)  
> **تاريخ الاعتماد**: 2026-10-29  

هذه الوثيقة تمثل **العقد الإلزامي (Single Source of Truth)** بين الواجهة الأمامية React وخلفية Laravel.  
كل نقطة نهاية (Endpoint) موثقة بالتفصيل: المسار، طريقة HTTP، ترويسات الطلب، هيكل الجسم، كود الاستجابة، مصفوفة الصلاحيات (RBAC)، وجدول المقارنة الدقيق بين قواعد **Zod** في الواجهة الأمامية وقواعد **Laravel FormRequest**.

---

## 1. القواعد العامة (Global Standards)

1. **الرابط الأساسي**: `/api/v1` (نسبي مع كوكيز الجلسة).
2. **المصادقة وحماية CSRF**:
   * المصادقة تتم عبر جلسات الكوكيز بواسطة **Laravel Sanctum**.
   * قبل أي طلب تعديلي (`POST`, `PUT`, `PATCH`, `DELETE`)، تطلب الواجهة `GET /sanctum/csrf-cookie` لجلب رمز `XSRF-TOKEN` وتمريره في الترويسة `X-XSRF-TOKEN`.
   * ترويسة الطلب: `Accept: application/json` و `Content-Type: application/json` (أو `multipart/form-data` للملفات).
3. **تنسيق أخطاء التحقق (HTTP 422 Unprocessable Content)**:
   ```json
   {
     "message": "البيانات المقدمة غير صالحة.",
     "errors": {
       "email": [
         "البريد الإلكتروني المدخل غير صالح أو مستخدم بالفعل."
       ],
       "phone": [
         "رقم الهاتف مطلوب ويجب أن يكون رقماً صحيحاً."
       ]
     }
   }
   ```
4. **أكواد الاستجابة القياسية**:
   * `200 OK`: نجاح مع إرجاع بيانات.
   * `201 Created`: نجاح إنشاء مورد جديد.
   * `204 No Content`: نجاح دون محتوى معزز.
   * `401 Unauthorized`: انتهاء الجلسة أو غياب المصادقة (تعيد الواجهة التوجيه إلى `/login`).
   * `403 Forbidden`: نقص الصلاحيات المطلوبة للمستخدم.
   * `419 Page Expired / CSRF Token Mismatch`: فشل تطابق الـ CSRF (الواجهة تعيد الطلب تلقائياً لمرة واحدة بعد تحديث الرمز).
   * `422 Unprocessable Content`: فشل قواعد التحقق.
   * `429 Too Many Requests`: تجاوز حد معدل الطلبات المسموح (Rate Limiting).

---

## 2. جدول مطابقة قواعد التحقق (Zod vs Laravel FormRequest)

| الحقل | نوع البيانات | قاعدة التحقق في React (Zod) | قاعدة التحقق في Laravel (FormRequest) | رسالة الخطأ النموذجية |
|---|---|---|---|---|
| `name` | نص | `z.string().trim().min(2).max(100)` | `['required', 'string', 'min:2', 'max:100']` | الاسم مطلوب ولا يقل عن حرفين. |
| `email` | بريد | `z.string().trim().email().max(150)` | `['required', 'email:rfc,dns', 'max:150']` | الرجاء إدخال بريد إلكتروني صحيح. |
| `phone` | هاتف | `z.string().regex(/^[0-9+\s-]{7,20}$/)` | `['required', 'regex:/^[0-9+\s-]{7,20}$/']` | رقم الهاتف غير صحيح (7 إلى 20 رقماً). |
| `subject` | نص | `z.string().optional()` | `['nullable', 'string', 'max:100']` | موضوع اختياري لا يتجاوز 100 حرف. |
| `message` | نص | `z.string().trim().min(10).max(3000)` | `['required', 'string', 'min:10', 'max:3000']` | الرسالة مطلوبة (10 إلى 3000 حرف). |
| `service` | خيار | `z.enum(['web','mobile','erp','ai','security','cloud'])` | `['required', Rule::in(['web','mobile','erp','ai','security','cloud'])]` | يرجى اختيار نوع الخدمة من القائمة. |
| `budget` | خيار | `z.enum(['10K — 30K','30K — 80K','80K — 200K','+200K'])` | `['required', 'string']` | يرجى تحديد الميزانية المتوقعة. |
| `timeline`| خيار | `z.enum(['عاجل — شهر','مرن — 3 أشهر','تأسيسي — 6 أشهر'])` | `['required', 'string']` | يرجى تحديد الجدول الزمني المناسب. |
| `password`| نص سري | `z.string().min(6)` | `['required', 'string', 'min:6']` | كلمة المرور لا تقل عن 6 أحرف. |
| `file` (وسائط) | ملف | حد أقصى 10MB + امتدادات صور/pdf | `['required', 'file', 'mimes:jpeg,jpg,png,webp,svg,pdf', 'max:10240']` | الملف يجب ألا يتجاوز 10MB ومن نوع معتمد. |

---

## 3. نقاط النهاية العامة (Public Endpoints)

### 3.1 إرسال نموذج التواصل (Contact Form)
* **المسار**: `POST /api/v1/contact`
* **معدل الطلبات**: `throttle:5,1` (5 طلبات لكل دقيقة لكل عنوان IP).
* **نوع الجسم**: `multipart/form-data` أو `application/json`.
* **جسم الطلب**:
  ```json
  {
    "name": "سارة العتيبي",
    "email": "sara@example.com",
    "phone": "+966500000000",
    "subject": "web",
    "message": "طلب تطوير منصة تجارية متكاملة"
  }
  ```
* **الاستجابة (201 Created)**:
  ```json
  {
    "ok": true,
    "message": "تم استلام رسالتك بنجاح، وسنتواصل معك خلال 24 ساعة."
  }
  ```

---

### 3.2 إرسال طلب عرض السعر (3-Step Quote Request)
* **المسار**: `POST /api/v1/quotes`
* **معدل الطلبات**: `throttle:5,1`.
* **جسم الطلب (JSON)**:
  ```json
  {
    "service": "mobile",
    "budget": "30K — 80K",
    "timeline": "مرن — 3 أشهر",
    "name": "عمر الحربي",
    "email": "omar@example.com",
    "phone": "+967770000000",
    "details": "تطبيق لتوصيل طلبات المطاعم مع لوحة إدارة"
  }
  ```
* **الاستجابة (201 Created)**:
  ```json
  {
    "ok": true,
    "message": "تم تقديم طلب عرض السعر بنجاح."
  }
  ```

---

### 3.3 الاشتراك في النشرة البريدية (Newsletter)
* **المسار**: `POST /api/v1/newsletter`
* **معدل الطلبات**: `throttle:10,1`.
* **جسم الطلب (JSON)**:
  ```json
  {
    "email": "newsletter@example.com"
  }
  ```
* **الاستجابة (201 Created / 200 OK)**:
  ```json
  {
    "ok": true,
    "message": "تم الاشتراك في النشرة البريدية بنجاح."
  }
  ```

---

## 4. المصادقة والجلسات (Authentication Endpoints)

### 4.1 جلب رمز حماية الـ CSRF
* **المسار**: `GET /sanctum/csrf-cookie`
* **الاستجابة (204 No Content)**: يضع الكوكي المشفر `XSRF-TOKEN` في المتصفح.

### 4.2 تسجيل الدخول (Login)
* **المسار**: `POST /api/v1/login`
* **معدل الطلبات**: `throttle:5,1` لمنع هجمات التخمين (Brute-force).
* **جسم الطلب**:
  ```json
  {
    "email": "admin@amtdex.ye",
    "password": "Password123!"
  }
  ```
* **الاستجابة (200 OK)**:
  ```json
  {
    "user": {
      "id": "1",
      "name": "أحمد الغامدي",
      "email": "admin@amtdex.ye",
      "role": "admin"
    }
  }
  ```

### 4.3 جلب بيانات المستخدم الحالي (Current User)
* **المسار**: `GET /api/v1/me`
* **الترخيص**: `auth:sanctum`.
* **الاستجابة (200 OK)**:
  ```json
  {
    "user": {
      "id": "1",
      "name": "أحمد الغامدي",
      "email": "admin@amtdex.ye",
      "role": "admin"
    }
  }
  ```
* **في حال انتهاء الجلسة (401 Unauthorized)**:
  ```json
  {
    "message": "Unauthenticated."
  }
  ```

### 4.4 تسجيل الخروج (Logout)
* **المسار**: `POST /api/v1/logout`
* **الترخيص**: `auth:sanctum`.
* **الاستجابة (200 OK)**:
  ```json
  {
    "ok": true
  }
  ```

---

## 5. لوحة التحكم والإدارة (Dashboard Endpoints)

### 5.1 إحصائيات لوحة التحكم (Overview Stats)
* **المسار**: `GET /api/v1/dashboard/stats`
* **الترخيص**: `auth:sanctum` — الأدوار المسموحة: `admin`, `editor`, `viewer`.
* **الاستجابة (200 OK)**:
  ```json
  {
    "activeProjects": { "value": 12, "sub": "4 قيد التنفيذ" },
    "contactRequests": { "value": 8, "sub": "2 جديدة اليوم" },
    "quotes": { "value": 5, "sub": "بانتظار الرد" }
  }
  ```

### 5.2 إدارة الطلبات (Leads Management)
* **المسار**: `GET /api/v1/leads`
* **الفلاتر المدعومة**: `?status=جديد&source=contact&page=1&per_page=15`
* **الترخيص**: `auth:sanctum` — مسموح لـ `admin`, `editor`, `viewer`.
* **الاستجابة (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "1",
        "name": "سارة العتيبي",
        "email": "sara@example.com",
        "phone": "+966500000000",
        "subject": "web",
        "message": "طلب متجر",
        "status": "جديد",
        "source": "contact",
        "createdAt": "2026-10-29T10:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "total": 1
    }
  }
  ```
* **تعديل حالة طلب**: `PATCH /api/v1/leads/{id}/status`
  * الصلاحية المطلوبة: `admin` أو `editor`.
  * الجسم: `{"status": "تم التواصل"}`
* **حذف طلب**: `DELETE /api/v1/leads/{id}`
  * الصلاحية المطلوبة: `admin` حصراً.

### 5.3 إدارة الخدمات والأعمال (Content Management)
* `GET /api/v1/services` (عام أو للمشاهدة).
* `POST /api/v1/services` (إضافة خدمة — `admin`/`editor`).
* `PUT /api/v1/services/{slug}` (تعديل خدمة — `admin`/`editor`).
* `DELETE /api/v1/services/{slug}` (حذف خدمة — `admin`).
* `GET /api/v1/projects` (عام أو للمشاهدة).
* `POST /api/v1/projects` (إضافة مشروع — `admin`/`editor`).
* `PUT /api/v1/projects/{slug}` (تعديل مشروع — `admin`/`editor`).
* `DELETE /api/v1/projects/{slug}` (حذف مشروع — `admin`).

### 5.4 إدارة محركات البحث (SEO Routes)
* `GET /api/v1/seo`: قائمة بالمسارات وإعدادات العناوين والأوصاف والـ noindex.
* `POST /api/v1/seo`: إضافة أو تحديث إعداد مسار (Upsert).
* `DELETE /api/v1/seo?path=/custom`: حذف إعداد المسار (`admin`).

### 5.5 مستودع الوسائط (Media Library)
* `GET /api/v1/media`: استعراض الصور والملفات المرفوعة.
* `POST /api/v1/media`: رفع ملف جديد (`multipart/form-data`, file <= 10MB).
* `DELETE /api/v1/media/{id}`: حذف وسيط (`admin`).

### 5.6 الإعدادات العامة (Settings)
* `GET /api/v1/settings`: قراءة إعدادات الموقع.
* `PUT /api/v1/settings`: تحديث إعدادات الموقع (`admin` فقط).

### 5.7 المستخدمون والسجل الأمني (Users & Audit)
* `GET /api/v1/users`: قائمة المستخدمين وأدوارهم (`admin` فقط).
* `GET /api/v1/audit`: سجل العمليات ومحاولات الدخول وقائمة IPs المحظورة (`admin` فقط).

