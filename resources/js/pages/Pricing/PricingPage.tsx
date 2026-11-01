import { Icon, type IconName } from "@/components/ui/Icon"
import { useState } from "react"
import { Link } from "react-router-dom"
import { PRICING as FALLBACK_PRICING } from "@/data/pricing"
import { usePricingPlansQuery } from "@/lib/queries"
import { Tabs } from "@/components/ui/Tabs"
import { CardSkeleton } from "@/components/ui/Skeleton"
import { Accordion } from "@/components/ui/Accordion"

function computeDiscountedPrice(priceStr: string, isAnnual: boolean) {
  if (!priceStr || priceStr === "حسب الطلب") {
    return { display: "مخصص", original: null, isCustom: true }
  }

  const rawNumber = parseInt(priceStr.replace(/[^0-9]/g, ""), 10)
  if (isNaN(rawNumber)) {
    return { display: priceStr, original: null, isCustom: false }
  }

  if (isAnnual) {
    const discounted = Math.round(rawNumber * 0.8)
    return {
      display: discounted.toLocaleString("en-US"),
      original: priceStr,
      isCustom: false,
    }
  }

  return { display: priceStr, original: null, isCustom: false }
}

const PRICING_FAQS = [
  {
    id: "payment-methods",
    title: "ما هي طرق الدفع المتاحة لديكم؟",
    content: "نوفر خيارات دفع متعددة ومرنة تناسب الجميع: التحويل البنكي المباشر، بطاقات مدى والبطاقات الائتمانية، بالإضافة إلى خطط التقسيط الميسرة عبر تابي وتمارا.",
  },
  {
    id: "source-code",
    title: "هل أحصل على الكود المصدري الكامل للمشروع؟",
    content: "نعم بكل تأكيد، عند اكتمال المشروع وتسليمه النهائي، يحصل العميل على الكود المصدري كاملاً بنسبة 100% مع التوثيق التقني وحقوق الملكية الفكرية الكاملة.",
  },
  {
    id: "support-guarantee",
    title: "ماذا يشمل الضمان والدعم الفني بعد التسليم؟",
    content: "تتضمن جميع الباقات فترة ضمان ودعم فني مجاني لمدة لا تقل عن 30 يوماً بعد الإطلاق، تشمل إصلاح أي مشاكل تقنية وتقديم التدريب اللازم لفريقك على إدارة النظام.",
  },
  {
    id: "annual-discount",
    title: "كيف يعمل خصم الـ 20% للفوترة السنوية؟",
    content: "عند اختيار الاشتراك السنوي في عقود الصيانة والتطوير المستمر، يتم تطبيق خصم 20% فورياً على التكلفة الإجمالية مع الحصول على ميزات استضافة ومراقبة أداء إضافية مجاناً.",
  },
]

export function PricingPage({ onToast: _onToast }: { onToast: (m: string) => void }) {
  const [billing, setBilling] = useState<"once" | "annual">("once")
  const { data: apiPlans, isLoading } = usePricingPlansQuery()

  const plans = (apiPlans && apiPlans.length > 0)
    ? apiPlans.map((p: any) => ({
        name: p.name,
        price: p.price,
        period: p.period || null,
        unit: p.period ? `${p.currency || "ر.س"} — ${p.period}` : "ريال — مرة واحدة",
        features: Array.isArray(p.features) ? p.features.map((f: any) => typeof f === "string" ? f : f.text) : [],
        cta: p.cta || "اطلب الآن",
        popular: !!p.highlight,
      }))
    : FALLBACK_PRICING

  const isAnnual = billing === "annual"
  const hasRecurringPlans = plans.some((plan: any) => Boolean(plan.period))

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-16 bg-white">
      {/* Header & Title */}
      <div className="text-center max-w-[680px] mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-card-soft)] text-[11px] font-bold tracking-[0.6px] text-[var(--color-primary)]">
          <Icon name="sparkles" size={13} />
          باقات استثمارية واضحة ومدروسة
        </div>
        <h1 className="mt-3 text-[32px] sm:text-[38px] leading-[44px] font-bold tracking-[-0.5px] text-[var(--color-ink)]">
          استثمار برمجي واضح وشفاف بدون مفاجآت
        </h1>
        <p className="mt-2 text-[14px] leading-[24px] text-[var(--color-text-muted)]">
          أسعار محددة، عقود مرنة، ودفعات مرتبطة بمراحل الإنجاز والتسليم الفعلي — ابدأ بميزانية تناسب احتياج شركتك.
        </p>

        {/* Billing Switch Tabs */}
        {hasRecurringPlans && (
          <div className="mt-8 flex justify-center">
            <Tabs
              tabs={[
                { id: "once", label: "دفع مرحلي / مرة واحدة" },
                {
                  id: "annual",
                  label: "سنوي ومستمر",
                  badge: (
                    <span className="bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-full px-2 py-0.5 text-[10px] font-bold">
                      خصم 20%
                    </span>
                  ),
                },
              ]}
              activeTab={billing}
              onChange={(id) => setBilling(id as "once" | "annual")}
            />
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          plans.map((p: any) => {
            const { display, original, isCustom } = computeDiscountedPrice(p.price, isAnnual && Boolean(p.period))
            const periodLabel = p.period || p.unit?.split("—").pop()?.trim() || "مرة واحدة"

            return (
              <div
                key={p.name}
                className={`rounded-[28px] border p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  p.popular
                    ? "bg-[var(--color-ink)] text-white border-[var(--color-primary-light)] border-2 shadow-[var(--shadow-card-lg)] ring-1 ring-[var(--color-primary-light)]/20 scale-[1.02]"
                    : "bg-white border-[var(--color-border)] shadow-[var(--shadow-card)] hover:border-[var(--color-violet-mid)]/40 hover:shadow-lg"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[12px] font-bold px-3 py-1 rounded-full ${
                        p.popular
                          ? "bg-[var(--color-primary-light)] text-white flex items-center gap-1.5"
                          : "bg-[var(--color-card-soft)] text-[var(--color-primary)]"
                      }`}
                    >
                      {p.popular && <Icon name="star" size={13} />}
                      {p.popular ? "الباقة الأكثر طلباً" : p.name}
                    </span>
                    {isAnnual && !isCustom && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        وفرت 20%
                      </span>
                    )}
                  </div>

                  <h3 className={`mt-4 text-[20px] font-bold ${p.popular ? "text-white" : "text-[var(--color-ink)]"}`}>
                    {p.name}
                  </h3>
                  <p className={`mt-1 text-[13px] leading-relaxed ${p.popular ? "text-[var(--color-lavender)]" : "text-[var(--color-text-muted)]"}`}>
                    {p.popular
                      ? "للشركات التي تريد نظاماً مخصصاً عالي الأداء مع تكامل شامل"
                      : p.name === "الانطلاقة"
                      ? "للشركات الناشئة والمتاجر التي تحتاج حضوراً رقمياً سريعاً واحترافياً"
                      : "للمؤسسات والجهات التي تتطلب حلولاً مؤتمتة وتحولاً رقمياً متكاملاً"}
                  </p>

                  {/* Price Tag with dynamic discount calculation */}
                  <div className="mt-6 flex items-baseline gap-2">
                    {!isCustom && (
                      <span className={`text-[14px] font-bold ${p.popular ? "text-amber-300" : "text-[var(--color-primary)]"}`}>
                        ر.س
                      </span>
                    )}
                    <div className="flex flex-col">
                      {original && (
                        <span className="text-[12px] line-through text-slate-400 font-mono">
                          {original} ر.س
                        </span>
                      )}
                      <span className={`text-[36px] font-bold tracking-tight font-mono ${p.popular ? "text-white" : "text-[var(--color-ink)]"}`}>
                        {display}
                      </span>
                    </div>
                    {!isCustom && (
                      <span className={`text-[12px] ${p.popular ? "text-[var(--color-text-faint)]" : "text-[var(--color-text-muted)]"}`}>
                        {isAnnual && p.period ? "/ سنوياً" : `/ ${periodLabel}`}
                      </span>
                    )}
                  </div>

                  <div className={`h-px my-6 ${p.popular ? "bg-white/10" : "bg-[var(--color-border)]"}`} />

                  {/* Features List */}
                  <ul className="space-y-3">
                    {p.features.map((f: string) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px]">
                        <span
                          className={`size-5 rounded-full grid place-items-center text-[10px] shrink-0 mt-0.5 ${
                            p.popular
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-[var(--color-lavender)] text-[var(--color-primary)]"
                          }`}
                        >
                          <Icon name="check" size={14} />
                        </span>
                        <span className={p.popular ? "text-slate-200" : "text-[var(--color-ink)]"}>
                          {String(f)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button linked with query params */}
                <div className="mt-8">
                  <Link
                    to={`/quote?service=${encodeURIComponent(p.name)}`}
                    className={`w-full text-center rounded-full py-3.5 px-6 text-[13px] font-bold transition-all block shadow-sm ${
                      p.popular
                        ? "bg-white text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-black hover:shadow-md"
                        : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"
                    }`}
                  >
                    {p.popular ? "ابدأ مشروعك الآن ←" : p.cta}
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Custom Quote Banner */}
      <div className="mt-12 bg-[var(--gradient-card)] border border-[var(--color-border)] rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[var(--shadow-card)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[11px] font-bold text-[var(--color-primary)] border border-[var(--color-border)]">
            حلول مصممة خصيصاً
          </div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--color-ink)] mt-2">
            هل تحتاج إلى تسعير مخصص أو نطاق عمل استثنائي؟
          </h2>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed max-w-[620px]">
            نقدّم دراسة متعمقة لمتطلبات مشروعك ونرسل لك عرض سعر تفصيلياً مع خطة زمنية وجدول مراحل معتمد خلال 24 ساعة فقط.
          </p>
        </div>
        <Link
          to="/quote?service=custom"
          className="shrink-0 bg-[var(--color-ink)] text-white px-7 py-3.5 rounded-full text-[13px] font-bold hover:bg-[var(--color-primary)] transition-all shadow-md hover:shadow-lg"
        >
          اطلب تسعير مخصص الآن ←
        </Link>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="mt-8 grid md:grid-cols-3 gap-4 text-[13px]">
        {(
          [
            {
              title: "دفع آمن ومحمي",
              desc: "تحويل بنكي رسمي / مدى / فيزا / تقسيط ميسر عبر تابي وتمارا.",
              icon: "shield" as IconName,
            },
            {
              title: "ضمان جودة معتمد",
              desc: "30 يوماً دعم فني وصيانة مجانية بعد الإطلاق لضمان استقرار النظام.",
              icon: "check" as IconName,
            },
            {
              title: "شفافية الملكية الكاملة",
              desc: "تسليم الكود المصدري كاملاً والتوثيق البرمجي الشامل فور الانتهاء.",
              icon: "code" as IconName,
            },
          ] as const
        ).map((item) => (
          <div
            key={item.title}
            className="bg-white border border-[var(--color-border)] rounded-[20px] p-5 shadow-sm hover:border-[var(--color-primary-light)]/30 transition-all"
          >
            <div className="flex items-center gap-2.5 font-bold text-[var(--color-ink)]">
              <span className="size-8 rounded-full bg-[var(--color-card-soft)] text-[var(--color-primary)] grid place-items-center">
                <Icon name={item.icon} size={16} />
              </span>
              <span>{item.title}</span>
            </div>
            <p className="text-[var(--color-text-muted)] mt-2 text-[12px] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="mt-16 max-w-[800px] mx-auto">
        <div className="text-center mb-8">
          <div className="text-[11px] font-bold text-[var(--color-primary)]">إجابات واضحة</div>
          <h2 className="text-[24px] font-bold text-[var(--color-ink)] mt-1">
            الأسئلة الشائعة حول الأسعار والتعاقد
          </h2>
        </div>
        <Accordion items={PRICING_FAQS} defaultOpenId="payment-methods" />
      </div>
    </div>
  )
}
