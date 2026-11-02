# تقرير إعادة هيكلة الواجهة الأمامية — Amtdex

**التاريخ:** 2 نوفمبر 2026 (Asia/Riyadh)  
**الفرع:** `cursor/frontend-refactor-ec3b`  
**النطاق:** Frontend Engineering / Design System / Responsive / Code Quality  
**القاعدة:** الحفاظ الكامل على الهوية البصرية المعتمدة — تحسين هندسي دون إعادة تصميم.

---

## 1. المشكلات التي اكتُشفت

| # | المشكلة | الخطورة |
|---|---------|---------|
| 1 | نظام Tokens ناقص (لا مسافات / حاويات / مقياس خطوط / ألوان ثانوية للمدونة) | عالية |
| 2 | ثلاث طبقات تنسيق متوازية (tokens + Tailwind arbitrary + CSS مخصّص) دون جسر موحّد | عالية |
| 3 | `PageShell` ميت ومكرر لـ `MarketingLayout` مع `<style>` مضمّن | متوسطة |
| 4 | بدائل hex قديمة في صفحات المدونة (`#FAF8F6` / `#E2E0DF` / `#605856`) تخالف الهوية | عالية |
| 5 | بقايا ألوان زرقاء من هوية سابقة في `FinalCTA` وشارات الهيرو | عالية |
| 6 | حاويات وصفحات غير موحّدة (`lg:px-8` vs `lg:px-10` vs `px-10` ثابت) | متوسطة |
| 7 | مكوّنات UI موجودة لكن غير مستخدمة في التسويق (`Input` / جزء من `Button`/`Card`) | متوسطة |
| 8 | أسماء ملفات UI بحروف صغيرة بينما الاستيراد PascalCase (هشاشة على Linux CI) | عالية |
| 9 | رابط ضمان معطوب `#pricing` على الصفحة الرئيسية | متوسطة |
| 10 | `OrbitSection` بعرض ثابت `sm:w-[340px]` يضغط التخطيط | متوسطة |
| 11 | FAQ في About بعمود `400px` ثابت؛ Pricing يستخدم `scale` على كل الشاشات | منخفضة |
| 12 | مشاكل RTL في بحث 404 المدونة و`paddingRight` و`translate-x` الفيزيائي | متوسطة |

---

## 2. الملفات التي تم تعديلها / إضافتها

### أُضيفت
- `resources/js/components/layout/Container.tsx`
- `resources/js/components/layout/PageHeader.tsx`
- `scripts/visual-audit.mjs`
- `FRONTEND_REFACTOR_REPORT.md`

### حُذفت
- `resources/js/components/layout/PageShell.tsx`

### أُعيدت تسميتها (حساسية حالة الملفات)
- `icon/button/card/badge/input.tsx` → `Icon/Button/Card/Badge/Input.tsx`

### حُدّثت (أبرزها)
- `resources/css/tokens.css`, `app.css`, `cards.css`, `motion.css`
- Layout: `Header`, `Footer`, `MarketingLayout`
- UI: `Button`, `Card`, `Input`
- الصفحات: Home (وأقسامها), Services, Portfolio, Contact, Quote, Pricing, About, Auth/Login
- Blog: Category / Tag / Post / NotFound + Dashboard Blog fallbacks

---

## 3. المكونات التي أُعيدت هيكلتها

1. **`Container` + `.page-container`** — حاوية تسويقية موحّدة (`marketing` / `wide` / `narrow`).
2. **`PageHeader`** — ترويسة صفحة قابلة لإعادة الاستخدام (eyebrow + عنوان + وصف).
3. **`Input` / `Textarea` / `Select`** — طُبّقت على Contact وQuote بنفس الشكل البصري السابق.
4. **`Button` / `Card`** — ظلال وتدرجات عبر tokens/utilities بدل inline styles.
5. **`FinalCTA` / `GuaranteeBanner` / أقسام Home** — تدرجات وألوان من الهوية + تجاوب أفضل.
6. **نظام `cards.css`** — يعتمد على متغيرات tokens للمسافات/الحواف/الظلال.

---

## 4. الأكواد المكررة التي أُزيلت أو خُفّضت

- حذف `PageShell` المكرر بالكامل.
- نقل `@keyframes toastIn/fadeIn` من layouts إلى `motion.css`.
- توحيد أنماط حقول النماذج عبر `Input` (بدل تكرار class strings في Contact/Quote).
- توحيد حاويات الصفحات عبر `page-container` / `Container` / `PageHeader`.
- إزالة عشرات fallbacks الألوان المكررة في صفحات المدونة.

---

## 5. مشكلات CSS التي عولجت

- توسيع `tokens.css`: spacing 4/8، containers، type scale، shadows موحّدة، ألوان ثانوية (`bg-subtle`, `signal`, `live`, `cta-dark-border`).
- Utilities: `.bg-gradient-*`, `.font-display`, `.page-container*`.
- `cards.css` مربوط بالمتغيرات بدل قيم سحرية متفرقة.
- إزالة بقايا `#0958E0` / ظل أزرق LinkedIn من FinalCTA.
- تقليل الاعتماد على `style={{ background: var(--gradient-*) }}`.

---

## 6. تحسينات التجاوب

- FinalCTA: حشو متجاوب + `clamp()` للعناوين بدل `px-10` و`text-[42px]` الثابتين.
- OrbitSection: `flex-1 min-w-0` بدل عرض 340px ثابت.
- About FAQ: `minmax(0,360px)_1fr` بدل `400px` ثابت.
- Pricing popular: `lg:scale-[1.02]` فقط على الشاشات الكبيرة.
- Header/Footer/Home: محاذاة الحاوية عبر نفس نظام `page-container--wide`.
- اختبار Playwright على: 320 / 375 / 425 / 768 / 1024 / 1280 / 1440 — **بدون horizontal overflow**.

---

## 7. تحسينات الأداء وجودة الكود

- لا مكتبات جديدة للواجهة (فقط `playwright` كـ devDependency لأدوات التدقيق).
- بناء الإنتاج ناجح؛ Vitest: **49/49** ناجح.
- Chunk جديد `PageHeader`/`Input` قابل للمشاركة.
- Lazy loading للصور في الهيرو محفوظ.
- إصلاح استيرادات case-sensitive لبيئة Linux CI.
- الحفاظ على وظائف Laravel/API كما هي.

---

## 8. نتائج اختبارات Playwright

| المقياس | قبل | بعد |
|---------|-----|-----|
| صفحات × نقاط توقف | 7 × 7 = 49 | 49 |
| Horizontal overflow | 0 | 0 |
| أخطاء Console | 0 | 0 |
| فشل تنقّل | 0 | 0 |

اللقطات محفوظة في:
- `/opt/cursor/artifacts/screenshots/before/`
- `/opt/cursor/artifacts/screenshots/after/`

---

## 9. مقارنة بصرية قبل / بعد

الهوية محفوظة (بنفسجي/ذهبي Amtdex، نفس التراكيب). التغييرات الظاهرة تقتصر على:
- إصلاح ألوان CTA الداكنة لتطابق الهوية بدل الأزرق القديم.
- حشوات أوضح على الجوال في FinalCTA.
- اتساق محاذاة الهيدر/الفوتر مع محتوى الصفحات.

---

## 10. المتبقي والتوصيات المستقبلية

1. تبني `Button asChild`/`Link` لجميع CTA التسويقية تدريجياً.
2. أرشفة Blade القديم تحت `resources/views/pages` و`public/css/amtdex.css` بعد التأكد من عدم وجود مستهلك SSR.
3. توحيد FAQ في About مع `Accordion` عبر variant يحافظ على الشكل الحالي.
4. استخراج `ProcessSteps` و`CtaBand` إن تكرر النمط أكثر.
5. إكمال تحويل الظلال القديمة `rgba(7,11,26,…)` المتبقية في بعض mockups الهيرو إلى tokens.
6. ربط صفحات التسويق المتبقية (Spotlight/ScreenGallery) بالكامل بـ Container إن رُغب بتوحيد أعمق.

---

## الخلاصة

أُعيدت هيكلة طبقة التصميم والمكوّنات المشتركة بجذر هندسي واضح، مع الحفاظ على الهوية البصرية، واجتياز البناء والاختبارات وفحص التجاوب عبر Playwright على جميع نقاط التوقف المطلوبة.
