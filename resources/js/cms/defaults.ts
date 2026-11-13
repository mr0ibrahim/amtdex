export type CmsPage = { path: string; label: string; published: boolean; seoTitle: string; seoDescription: string }
export type CmsNav = { id: string; label: string; to: string; visible: boolean }
export type CmsSection = { id: string; label: string; visible: boolean; image?: string; fields: Record<string, string> }
export type CmsDocument = { copy: Record<string, string>; pages: CmsPage[]; nav: CmsNav[]; homeSections: CmsSection[] }

export const CMS_DEFAULTS: CmsDocument = {
  "copy": {
    "footer.blurb": "نحن شركة برمجيات وتقنية معلومات، نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو.",
    "footer.city": "اليمن - إب"
  },
  "pages": [
    {
      "path": "/",
      "label": "الرئيسية",
      "published": true,
      "seoTitle": "AMTDEX SOFT — امتدكس سوفت",
      "seoDescription": "هندسة الفكرة قبل برمجتها. من الفكرة إلى التنفيذ."
    },
    {
      "path": "/services",
      "label": "الخدمات",
      "published": true,
      "seoTitle": "ماذا نقدم؟ — AMTDEX SOFT",
      "seoDescription": "مواقع، تطبيقات، متاجر، أنظمة إدارة، تسويق، هوية بصرية، وحماية المواقع والأنظمة."
    },
    {
      "path": "/portfolio",
      "label": "أعمالنا",
      "published": true,
      "seoTitle": "اعمالنا",
      "seoDescription": "نماذج من مشاريع ومنصات رقمية قمنا بتطويرها وإطلاقها بنجاح."
    },
    {
      "path": "/blog",
      "label": "المدونة",
      "published": true,
      "seoTitle": "المدونة — AMTDEX SOFT",
      "seoDescription": "ملاحظات وأفكار من امتدكس سوفت."
    },
    {
      "path": "/about",
      "label": "من نحن",
      "published": true,
      "seoTitle": "من نحن — امتدكس سوفت",
      "seoDescription": "نطوّر الحلول الرقمية ونحوّل الأفكار والمشكلات إلى أنظمة وبرمجيات قابلة للعمل والنمو."
    },
    {
      "path": "/contact",
      "label": "تواصل",
      "published": true,
      "seoTitle": "تواصل معنا — AMTDEX SOFT",
      "seoDescription": "اليمن - إب. Info@amtdex.com. +967 784 440 429."
    },
    {
      "path": "/quote",
      "label": "ابدأ مشروعك",
      "published": true,
      "seoTitle": "ابدأ مشروعك — AMTDEX SOFT",
      "seoDescription": "أخبرنا عن فكرتك ونعود إليك."
    }
  ],
  "nav": [
    {
      "id": "services",
      "label": "الخدمات",
      "to": "/services",
      "visible": true
    },
    {
      "id": "portfolio",
      "label": "أعمالنا",
      "to": "/portfolio",
      "visible": true
    },
    {
      "id": "blog",
      "label": "المدونة",
      "to": "/blog",
      "visible": true
    },
    {
      "id": "about",
      "label": "من نحن",
      "to": "/about",
      "visible": true
    },
    {
      "id": "contact",
      "label": "تواصل معنا",
      "to": "/contact",
      "visible": true
    },
    {
      "id": "quote",
      "label": "ابدأ مشروعك",
      "to": "/quote",
      "visible": true
    }
  ],
  "homeSections": [
    {
      "id": "hero",
      "label": "الافتتاح",
      "visible": true,
      "fields": {
        "kicker": "امتدكس سوفت — هندسة الفكرة قبل برمجتها.",
        "title": "هندسة الفكرة\nقبل برمجتها.",
        "lede": "حيث تلتقي الأفكار بالتقنية، وتتحول الطموحات إلى مشاريع قابلة للتحقيق.",
        "cta": "تواصل معنا",
        "cta2": "استعرض أعمالنا",
        "proof": "4.9/5 من 300+ عميل في الخليج يثقون بنا"
      }
    },
    {
      "id": "stats",
      "label": "الأرقام والتقييمات",
      "visible": true,
      "fields": {
        "stat1_value": "+120",
        "stat1_label": "مشروع برمجي مسلّم",
        "stat1_sub": "من المتاجر إلى الأنظمة المؤسسية",
        "stat2_value": "24/7",
        "stat2_label": "سنوات خبرة",
        "stat2_sub": "فريق هندسي متخصص",
        "stat3_value": "98%",
        "stat3_label": "رضا العملاء",
        "stat3_sub": "تسليم في الوقت وبجودة عالية",
        "stat4_value": "4.9/5",
        "stat4_label": "تقييم رضا العملاء",
        "stat4_sub": "من 2,400+ مراجعة"
      }
    },
    {
      "id": "gallery",
      "label": "معرض المنتجات والبطاقات",
      "visible": true,
      "fields": {
        "kicker": "واجهات تصنع الفرق",
        "title": "من فكرتك، إلى تجربة متكاملة.",
        "lede": "متاجر، تطبيقات، وأنظمة أعمال — نصمّم لكل منتج واجهة تخدم مستخدميه، وتعبّر عن هويته.",
        "deck_kicker": "من الفكرة إلى تجربة حقيقية",
        "deck_title": "ثلاث أفكار.\nوتجربة تتحرّك معك.",
        "deck_lede": "بدّل بين النماذج واستكشف كيف يمكن أن يبدو مشروعك."
      }
    },
    {
      "id": "testimonials",
      "label": "آراء العملاء",
      "visible": true,
      "fields": {
        "kicker": "علاقات تُبنى على الثقة",
        "title": "ماذا يقول عملاؤنا",
        "link": "تعرّف على أعمالنا"
      }
    },
    {
      "id": "workflow",
      "label": "خطوات العمل",
      "visible": true,
      "fields": {
        "kicker": "من الفكرة إلى الإنجاز",
        "title": "خمس خطوات\nمن الفكرة إلى الإنجاز.",
        "lede": "من الفكرة إلى التنفيذ. الخطوات نفسها التي نعمل بها مع كل مشروع.",
        "step1_title": "نفهم",
        "step1_description": "نفهم فكرتك واحتياجات مشروعك.",
        "step2_title": "نخطط",
        "step2_description": "نخطط للحل التقني المناسب لك.",
        "step3_title": "نصمّم ونبرمج",
        "step3_description": "نصمم ونبرمج مشروعك باحترافية.",
        "step4_title": "نختبر",
        "step4_description": "نختبر الحل ونتأكد من جاهزيته.",
        "step5_title": "نطلق",
        "step5_description": "نساعدك على إطلاق مشروعك وتطويره."
      }
    },
    {
      "id": "guarantee",
      "label": "بطاقة الضمان",
      "visible": true,
      "fields": {
        "kicker": "التزام موثّق في العقد",
        "title": "ضمان AMTDEX",
        "lede": "إذا لم نسلّم حسب الاتفاق، نعيد الدفعة الأخيرة كاملة.",
        "note": "مكتوب في العقد. ثقة نبنيها بالأفعال، لا الشعارات.",
        "cta": "تواصل معنا"
      }
    },
    {
      "id": "contact",
      "label": "التواصل النهائي",
      "visible": true,
      "fields": {
        "kicker": "لنتحدث عن مشروعك القادم",
        "title": "عندك فكرة؟ لنتحدث عنها.",
        "lede": "من الفكرة إلى التنفيذ. أخبرنا عن مشروعك وسنناقش معك الخطوة التالية.",
        "cta": "ابدأ مشروعك",
        "cta2": "تحدث معنا"
      }
    }
  ]
}
