<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — دراسة حالة</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Case Study Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Hero" class="box-border w-full h-fit shrink-0 flex flex-row gap-[32px] p-[40px] justify-start items-start bg-[#070B1A]">
          <div data-pencil-name="Hero Left" class="box-border w-[640px] shrink-0 h-fit flex flex-col gap-[14px] justify-start items-start">
            <div data-pencil-name="Badge" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[6px_12px] justify-start items-center bg-[#1E2535] [outline:1px_solid_#2A3347] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="BDot" class="box-border w-[6px] shrink-0 h-[6px] bg-[#7DD3A0] rounded-[50%]"></div>
              <div data-pencil-name="BText" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                دراسة حالة — المتاجر
              </div>
            </div>
            <div data-pencil-name="Title" class="text-[38px]/[42px] box-border w-full text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left">
              نُخبة — كيف ضاعفنا
              <br>
              المبيعات 60% في 90 يوم
            </div>
            <div data-pencil-name="Desc" class="text-[13px]/[23px] box-border w-[520px] text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              منصة Headless موحّدة للمخزون، الدفع، والشحن — بديل لثلاثة أنظمة منفصلة كانت تستهلك 18
              ساعة أسبوعياً.
            </div>
            <div data-pencil-name="Meta" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px_0px_0px_0px] justify-start items-start">
              <div data-pencil-name="M العميل" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#161D2E] [outline:1px_solid_#2A3347] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="ML" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  العميل
                </div>
                <div data-pencil-name="MV" class="text-[11px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  نُخبة للتجزئة
                </div>
              </div>
              <div data-pencil-name="M المدة" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#161D2E] [outline:1px_solid_#2A3347] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="ML" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  المدة
                </div>
                <div data-pencil-name="MV" class="text-[11px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  10 أسابيع
                </div>
              </div>
              <div data-pencil-name="M التقنيات" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#161D2E] [outline:1px_solid_#2A3347] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="ML" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  التقنيات
                </div>
                <div data-pencil-name="MV" class="text-[11px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  Next.js + Stripe
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="Hero Right" class="box-border [flex:1_1_0] h-[320px] flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#2A3347] [outline-offset:-0.5px] rounded-[16px] overflow-hidden">
            <div data-pencil-name="Top" class="[box-sizing:content-box] w-[688px] h-[35.5px] shrink-0 flex flex-row gap-[6px] p-[0px_14px] justify-start items-center bg-[#F8F7F5] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
              <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#FF5F56] rounded-[50%]"></div>
              <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#FFBD2E] rounded-[50%]"></div>
              <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#27C93F] rounded-[50%]"></div>
              <div data-pencil-name="Url" class="box-border [flex:1_1_0] h-[22px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <div data-pencil-name="Url Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  nukhba.sa — متجر مباشر
                </div>
              </div>
            </div>
            <div data-pencil-name="Mock" class="box-border w-full [flex:1_1_0] flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FCFBF8]">
              <div data-pencil-name="Stats" class="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start">
                <div data-pencil-name="SC" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <div data-pencil-name="SV" class="text-[20px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    +60%
                  </div>
                  <div data-pencil-name="SL" class="text-[10px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    المبيعات
                  </div>
                </div>
                <div data-pencil-name="SC" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <div data-pencil-name="SV" class="text-[20px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    -18س
                  </div>
                  <div data-pencil-name="SL" class="text-[10px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    وقت أسبوعي
                  </div>
                </div>
                <div data-pencil-name="SC" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <div data-pencil-name="SV" class="text-[20px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    4.9
                  </div>
                  <div data-pencil-name="SL" class="text-[10px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    تقييم
                  </div>
                </div>
              </div>
              <div data-pencil-name="Chart" class="box-border w-full [flex:1_1_0] flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="Chart Title" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  نمو المبيعات — قبل وبعد
                </div>
                <div data-pencil-name="Bars" class="box-border w-full [flex:1_1_0] flex flex-row gap-[8px] justify-start items-end">
                  <div data-pencil-name="BW" class="box-border [flex:1_1_0] h-full flex flex-col gap-[4px] justify-end items-center">
                    <div data-pencil-name="Bar" class="box-border w-full h-[40px] shrink-0 opacity-[0.14] flex flex-row gap-0 justify-start items-start bg-[#070B1A] rounded-[6px_6px_4px_4px]"></div>
                    <div data-pencil-name="BL" class="text-[9px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                      ينا
                    </div>
                  </div>
                  <div data-pencil-name="BW" class="box-border [flex:1_1_0] h-full flex flex-col gap-[4px] justify-end items-center">
                    <div data-pencil-name="Bar" class="box-border w-full h-[56px] shrink-0 opacity-[0.14] flex flex-row gap-0 justify-start items-start bg-[#070B1A] rounded-[6px_6px_4px_4px]"></div>
                    <div data-pencil-name="BL" class="text-[9px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                      فبر
                    </div>
                  </div>
                  <div data-pencil-name="BW" class="box-border [flex:1_1_0] h-full flex flex-col gap-[4px] justify-end items-center">
                    <div data-pencil-name="Bar" class="box-border w-full h-[48px] shrink-0 opacity-[0.14] flex flex-row gap-0 justify-start items-start bg-[#070B1A] rounded-[6px_6px_4px_4px]"></div>
                    <div data-pencil-name="BL" class="text-[9px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                      مار
                    </div>
                  </div>
                  <div data-pencil-name="BW" class="box-border [flex:1_1_0] h-full flex flex-col gap-[4px] justify-end items-center">
                    <div data-pencil-name="Bar" class="box-border w-full h-[72px] shrink-0 opacity-[0.14] flex flex-row gap-0 justify-start items-start bg-[#070B1A] rounded-[6px_6px_4px_4px]"></div>
                    <div data-pencil-name="BL" class="text-[9px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                      أبر
                    </div>
                  </div>
                  <div data-pencil-name="BW" class="box-border [flex:1_1_0] h-full flex flex-col gap-[4px] justify-end items-center">
                    <div data-pencil-name="Bar" class="box-border w-full h-[96px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[6px_6px_4px_4px]"></div>
                    <div data-pencil-name="BL" class="text-[9px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                      ماي
                    </div>
                  </div>
                  <div data-pencil-name="BW" class="box-border [flex:1_1_0] h-full flex flex-col gap-[4px] justify-end items-center">
                    <div data-pencil-name="Bar" class="box-border w-full h-[88px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[6px_6px_4px_4px]"></div>
                    <div data-pencil-name="BL" class="text-[9px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                      يون
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-row gap-[32px] p-[40px] justify-start items-start">
          <div data-pencil-name="Content" class="box-border w-[880px] shrink-0 h-fit flex flex-col gap-[24px] justify-start items-start">
            <div data-pencil-name="Sec 01" class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start">
              <div data-pencil-name="SH" class="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center">
                <div data-pencil-name="NB" class="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[8px]">
                  <div data-pencil-name="NBT" class="text-[10px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    01
                  </div>
                </div>
                <div data-pencil-name="STitle" class="text-[16px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  التحدي
                </div>
              </div>
              <div data-pencil-name="SBody" class="text-[12.5px]/[23px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                كان لدى نُخبة ثلاثة أنظمة منفصلة (Shopify للمبيعات، Excel للمخزون، واتساب للدعم) —
                لا تزامن، أخطاء مخزون يومية، و 18 ساعة عمل يدوي أسبوعياً. التوسع لفرع جديد كان
                مستحيلاً بهذه البنية.
              </div>
              <div data-pencil-name="Bullets" class="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#F0EDE7] rounded-[10px]">
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    مخزون غير متزامن وأخطاء يومية
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    18 ساعة إدخال يدوي أسبوعياً
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    لا رؤية موحدة للمبيعات
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Sec 02" class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start">
              <div data-pencil-name="SH" class="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center">
                <div data-pencil-name="NB" class="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[8px]">
                  <div data-pencil-name="NBT" class="text-[10px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    02
                  </div>
                </div>
                <div data-pencil-name="STitle" class="text-[16px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  الحل
                </div>
              </div>
              <div data-pencil-name="SBody" class="text-[12.5px]/[23px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                بنينا منصة Headless موحّدة: واجهة Next.js سريعة، Stripe للدفع، نظام مخزون لحظي مع
                Webhooks، ولوحة تحكم لإدارة الطلبات والمخزون والشحن من مكان واحد.
              </div>
              <div data-pencil-name="Bullets" class="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#F0EDE7] rounded-[10px]">
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    Next.js + PostgreSQL + Stripe
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    مخزون لحظي وتزامن تلقائي
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    لوحة تحكم موحّدة وشحن متكامل
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Sec 03" class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start">
              <div data-pencil-name="SH" class="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center">
                <div data-pencil-name="NB" class="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[8px]">
                  <div data-pencil-name="NBT" class="text-[10px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    03
                  </div>
                </div>
                <div data-pencil-name="STitle" class="text-[16px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  النتائج
                </div>
              </div>
              <div data-pencil-name="SBody" class="text-[12.5px]/[23px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                بعد 90 يوم: +60% مبيعات، توفير 18 ساعة أسبوعياً، صفر أخطاء مخزون، وتجهيز فرع جديد في
                أسبوعين فقط.
              </div>
              <div data-pencil-name="Bullets" class="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#F0EDE7] rounded-[10px]">
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    +60% مبيعات في 90 يوم
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    18 ساعة توفير أسبوعي
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    جاهزية للتوسع الفوري
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Quote" class="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[20px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="QMark" class="text-[48px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                “
              </div>
              <div data-pencil-name="QC" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] justify-start items-start">
                <div data-pencil-name="QText" class="text-[13px]/[22px] box-border w-full text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left">
                  كنا نعمل 18 ساعة يدوياً كل أسبوع. مع AMTDEX صارت كل العمليات تلقائية — التوسع صار
                  سهلاً.
                </div>
                <div data-pencil-name="QAuth" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  — سارة العتيبي، مديرة العمليات — نُخبة
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="Side" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[16px] justify-start items-start">
            <div data-pencil-name="Tech" class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="Tech Title" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                التقنيات المستخدمة
              </div>
              <div data-pencil-name="Tech Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                <div data-pencil-name="TF" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_10px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                  <div data-pencil-name="TF Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    Next.js
                  </div>
                </div>
                <div data-pencil-name="TF" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_10px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                  <div data-pencil-name="TF Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    Stripe
                  </div>
                </div>
                <div data-pencil-name="TF" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_10px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                  <div data-pencil-name="TF Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    PostgreSQL
                  </div>
                </div>
                <div data-pencil-name="TF" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_10px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                  <div data-pencil-name="TF Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    AWS
                  </div>
                </div>
                <div data-pencil-name="TF" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_10px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                  <div data-pencil-name="TF Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    Vercel
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Next" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#070B1A] rounded-[16px]">
              <div data-pencil-name="Next Label" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal tracking-[0.6px] text-left [white-space:nowrap]">
                المشروع التالي
              </div>
              <div data-pencil-name="Next Title" class="text-[14px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                ميراس — نظام إدارة العمليات
              </div>
              <div data-pencil-name="Next Btn" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] p-[10px_0px] justify-center items-center bg-[#FFFFFF] rounded-[999px]">
                <div data-pencil-name="Next Btn Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  عرض الدراسة →
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