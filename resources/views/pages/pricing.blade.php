<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — خطط الأسعار والباقات</title>
  <script>
    tailwind = { config: { corePlugins: { preflight: false } } };
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{{ asset('css/amtdex.css') }}" />
  <script src="{{ asset('js/amtdex.js') }}" defer></script>
</head>
<body style="background-color: #FCFBF8; margin: 0; padding: 0;">
  <div class="amtdex-page-wrapper">
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Pricing Detail Page" class="box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
      @include('partials.site-header')
      <div data-pencil-name="Header" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[40px] justify-start items-center bg-[#F0EDE7]">
        <div data-pencil-name="Eyebrow" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
          التسعير — استثمار واضح بلا مفاجآت
        </div>
        <div data-pencil-name="Title" class="text-[36px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
          اختر ما يناسب مرحلتك
        </div>
        <div data-pencil-name="Desc" class="text-[13px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
          دفعات مرحلية مرتبطة بالتسليم — 30% مقدم، 40% تجريبي، 30% إطلاق. بدون تكاليف مخفية.
        </div>
        <div data-pencil-name="Toggle" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] p-[4px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
          <div data-pencil-name="Off" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_18px] justify-start items-start bg-[#070B1A] rounded-[999px]">
            <div data-pencil-name="Off Text" class="text-[11px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              مرة واحدة
            </div>
          </div>
          <div data-pencil-name="On" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[8px_18px] justify-start items-center bg-[#00000000] rounded-[999px]">
            <div data-pencil-name="On Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              اشتراك صيانة
            </div>
            <div data-pencil-name="Save" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#E6F4EA] rounded-[999px]">
              <div data-pencil-name="Save Text" class="text-[10px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                خصم 20%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-pencil-name="Compare" class="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[32px_40px] justify-start items-start bg-[#FFFFFF]">
        <div data-pencil-name="Comp Head" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
          <div data-pencil-name="Empty" class="box-border w-[320px] shrink-0 h-[40px] flex flex-row gap-0 justify-start items-start"></div>
          <div data-pencil-name="PH الانطلاق" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
            <div data-pencil-name="PH Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
              الانطلاق
            </div>
            <div data-pencil-name="PH Price" class="text-[16px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
              4,900 ﷼
            </div>
            <div data-pencil-name="PH Sub" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
              مرة واحدة
            </div>
          </div>
          <div data-pencil-name="PH المخصص ★" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[14px] justify-start items-center bg-[#070B1A] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
            <div data-pencil-name="PH Name" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
              المخصص ★
            </div>
            <div data-pencil-name="PH Price" class="text-[16px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
              35K+ ﷼
            </div>
            <div data-pencil-name="PH Sub" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
              يبدأ من
            </div>
          </div>
          <div data-pencil-name="PH المؤسسي" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
            <div data-pencil-name="PH Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
              المؤسسي
            </div>
            <div data-pencil-name="PH Price" class="text-[16px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
              مخصص
            </div>
            <div data-pencil-name="PH Sub" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
              حسب النطاق
            </div>
          </div>
        </div>
        <div data-pencil-name="Row" class="[box-sizing:content-box] w-[1360px] h-[43.5px] shrink-0 flex flex-row gap-[12px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
          <div data-pencil-name="Label" class="box-border w-[320px] shrink-0 h-[44px] flex flex-row gap-0 p-[0px_12px] justify-start items-center">
            <div data-pencil-name="Label Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
              موقع/متجر أساسي
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
        </div>
        <div data-pencil-name="Row" class="[box-sizing:content-box] w-[1360px] h-[43.5px] shrink-0 flex flex-row gap-[12px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
          <div data-pencil-name="Label" class="box-border w-[320px] shrink-0 h-[44px] flex flex-row gap-0 p-[0px_12px] justify-start items-center">
            <div data-pencil-name="Label Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
              لوحة تحكم مخصصة
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#CBD5E1] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              —
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
        </div>
        <div data-pencil-name="Row" class="[box-sizing:content-box] w-[1360px] h-[43.5px] shrink-0 flex flex-row gap-[12px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
          <div data-pencil-name="Label" class="box-border w-[320px] shrink-0 h-[44px] flex flex-row gap-0 p-[0px_12px] justify-start items-center">
            <div data-pencil-name="Label Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
              تطبيقات جوال
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#CBD5E1] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              —
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
        </div>
        <div data-pencil-name="Row" class="[box-sizing:content-box] w-[1360px] h-[43.5px] shrink-0 flex flex-row gap-[12px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
          <div data-pencil-name="Label" class="box-border w-[320px] shrink-0 h-[44px] flex flex-row gap-0 p-[0px_12px] justify-start items-center">
            <div data-pencil-name="Label Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
              تكاملات ودفع
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#CBD5E1] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              —
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
        </div>
        <div data-pencil-name="Row" class="[box-sizing:content-box] w-[1360px] h-[43.5px] shrink-0 flex flex-row gap-[12px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
          <div data-pencil-name="Label" class="box-border w-[320px] shrink-0 h-[44px] flex flex-row gap-0 p-[0px_12px] justify-start items-center">
            <div data-pencil-name="Label Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
              دعم ما بعد الإطلاق
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              14 يوم
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              6 أشهر
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              12 شهر
            </div>
          </div>
        </div>
        <div data-pencil-name="Row" class="[box-sizing:content-box] w-[1360px] h-[43.5px] shrink-0 flex flex-row gap-[12px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
          <div data-pencil-name="Label" class="box-border w-[320px] shrink-0 h-[44px] flex flex-row gap-0 p-[0px_12px] justify-start items-center">
            <div data-pencil-name="Label Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
              SLA 99.9%
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#CBD5E1] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              —
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#CBD5E1] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              —
            </div>
          </div>
          <div data-pencil-name="Cell" class="box-border [flex:1_1_0] h-[44px] flex flex-row gap-0 justify-center items-center">
            <div data-pencil-name="Cell Text" class="text-[13px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ✓
            </div>
          </div>
        </div>
      </div>
      <div data-pencil-name="Calculator" class="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[32px_40px] justify-start items-start bg-[#F0EDE7]">
        <div data-pencil-name="Calc Title" class="text-[22px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
          حاسبة التكلفة التقديرية
        </div>
        <div data-pencil-name="Calc Card" class="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
          <div data-pencil-name="Left" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[12px] justify-start items-start">
            <div data-pencil-name="QR" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[12px] justify-between items-center bg-[#F0EDE7] rounded-[10px]">
              <div data-pencil-name="QR Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                نوع المشروع: متجر + نظام مخزون
              </div>
              <div data-pencil-name="QR Edit" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                تعديل
              </div>
            </div>
            <div data-pencil-name="QR" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[12px] justify-between items-center bg-[#F0EDE7] rounded-[10px]">
              <div data-pencil-name="QR Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                عدد المستخدمين: ~50
              </div>
              <div data-pencil-name="QR Edit" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                تعديل
              </div>
            </div>
            <div data-pencil-name="QR" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[12px] justify-between items-center bg-[#F0EDE7] rounded-[10px]">
              <div data-pencil-name="QR Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                التكاملات: دفع + شحن + محاسبة
              </div>
              <div data-pencil-name="QR Edit" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                تعديل
              </div>
            </div>
          </div>
          <div data-pencil-name="Right" class="box-border w-[320px] shrink-0 h-fit flex flex-col gap-[10px] p-[16px] justify-start items-center bg-[#070B1A] rounded-[14px]">
            <div data-pencil-name="Est Label" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              التكلفة التقديرية
            </div>
            <div data-pencil-name="Est Val" class="text-[20px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              ﷼ 42,000 — 58,000
            </div>
            <div data-pencil-name="Est Note" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
              تقدير أولي — السعر النهائي بعد ورشة الاكتشاف
            </div>
            <div data-pencil-name="Calc Btn" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[12px_0px] justify-center items-start bg-[#0A66FF] rounded-[999px]">
              <div data-pencil-name="Calc Btn Text" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                اطلب تسعير دقيق مجاناً
              </div>
            </div>
          </div>
        </div>
      </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>