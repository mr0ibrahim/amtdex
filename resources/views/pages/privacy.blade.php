<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — سياسة الخصوصية</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Privacy Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Header" class="[box-sizing:content-box] w-[1440px] h-[215.5px] shrink-0 flex flex-col gap-[12px] p-[48px_40px_32px_40px] justify-start items-start bg-[#F0EDE7] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
          <div data-pencil-name="Badge" class="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[6px_12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
            <div data-pencil-name="Badge Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              آخر تحديث — 1 يناير 2026
            </div>
          </div>
          <a href="/privacy" style="text-decoration:none; color:inherit; display:contents;"><div data-pencil-name="Title" class="text-[40px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
            سياسة الخصوصية
          </div></a>
          <div data-pencil-name="Desc" class="text-[13px]/[23px] box-border w-[640px] text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
            نلتزم بحماية بياناتك — هذه السياسة توضح ما نجمعه، كيف نستخدمه، وحقوقك.
          </div>
        </div>
        <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-row gap-[32px] p-[32px_40px] justify-start items-start">
          <div data-pencil-name="TOC" class="box-border w-[260px] shrink-0 h-fit flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
            <div data-pencil-name="TOC Title" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              المحتويات
            </div>
            <div data-pencil-name="TI البيانات التي نجمعها" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot2" class="box-border w-[6px] shrink-0 h-[6px] bg-[#0A66FF] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                البيانات التي نجمعها
              </div>
            </div>
            <div data-pencil-name="TI كيف نستخدمها" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#00000000] [outline:1px_solid_#00000000] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot2" class="box-border w-[6px] shrink-0 h-[6px] bg-[#CBD5E1] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                كيف نستخدمها
              </div>
            </div>
            <div data-pencil-name="TI المشاركة والتخزين" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#00000000] [outline:1px_solid_#00000000] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot2" class="box-border w-[6px] shrink-0 h-[6px] bg-[#CBD5E1] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                المشاركة والتخزين
              </div>
            </div>
            <div data-pencil-name="TI حقوقك" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#00000000] [outline:1px_solid_#00000000] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot2" class="box-border w-[6px] shrink-0 h-[6px] bg-[#CBD5E1] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                حقوقك
              </div>
            </div>
            <div data-pencil-name="TI اتصل بنا" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#00000000] [outline:1px_solid_#00000000] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot2" class="box-border w-[6px] shrink-0 h-[6px] bg-[#CBD5E1] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                اتصل بنا
              </div>
            </div>
            <div data-pencil-name="Contact Box" class="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#070B1A] [outline:1px_solid_#1E2535] [outline-offset:-0.5px] rounded-[12px]">
              <div data-pencil-name="CB Title" class="text-[11px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                لديك استفسار؟
              </div>
              <div data-pencil-name="CB Desc" class="text-[11px]/[17px] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                تواصل مع مسؤول الخصوصية مباشرة.
              </div>
              <div data-pencil-name="CB Btn" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px] justify-center items-start bg-[#FFFFFF] rounded-[999px]">
                <div data-pencil-name="CB Btn Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  privacy@amtdex.sa
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="Content" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[20px] justify-start items-start">
            <div data-pencil-name="Sec 01" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="S Head" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
                <div data-pencil-name="Num" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[8px]">
                  <div data-pencil-name="Num Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    01
                  </div>
                </div>
                <div data-pencil-name="S Title" class="text-[15px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  البيانات التي نجمعها
                </div>
              </div>
              <div data-pencil-name="S Body" class="text-[12.5px]/[23px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                نجمع فقط ما تحتاجه لتقديم الخدمة: بيانات التواصل (الاسم، البريد، الجوال)، بيانات
                المشروع التي تزودنا بها، وبيانات الاستخدام التقنية (عنوان IP، نوع الجهاز) لتحسين
                الأداء والأمان.
              </div>
              <div data-pencil-name="Bullets" class="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#F0EDE7] rounded-[10px]">
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="BDot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    بيانات الحساب والتواصل
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="BDot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    ملفات المشروع والوثائق
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="BDot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    سجلات الاستخدام والدعم
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Sec 02" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="S Head" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
                <div data-pencil-name="Num" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[8px]">
                  <div data-pencil-name="Num Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    02
                  </div>
                </div>
                <div data-pencil-name="S Title" class="text-[15px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  كيف نستخدم بياناتك
                </div>
              </div>
              <div data-pencil-name="S Body" class="text-[12.5px]/[23px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                نستخدم بياناتك لتطوير وتسليم مشروعك، تقديم الدعم، وإرسال تحديثات مهمة فقط. لا نبيع
                بياناتك ولا نشاركها لأغراض تسويقية.
              </div>
            </div>
            <div data-pencil-name="Sec 03" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="S Head" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
                <div data-pencil-name="Num" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[8px]">
                  <div data-pencil-name="Num Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    03
                  </div>
                </div>
                <div data-pencil-name="S Title" class="text-[15px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  المشاركة والتخزين
                </div>
              </div>
              <div data-pencil-name="S Body" class="text-[12.5px]/[23px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                تُخزن البيانات على خوادم مشفّرة داخل السعودية (AWS Riyadh) مع نسخ احتياطي يومي.
                نشاركها فقط مع مزودي الخدمة الضروريين (الدفع، الاستضافة) بعقود سرية.
              </div>
            </div>
            <div data-pencil-name="Sec 04" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="S Head" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
                <div data-pencil-name="Num" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[8px]">
                  <div data-pencil-name="Num Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    04
                  </div>
                </div>
                <div data-pencil-name="S Title" class="text-[15px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  حقوقك
                </div>
              </div>
              <div data-pencil-name="S Body" class="text-[12.5px]/[23px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                لك الحق في الوصول، التصحيح، الحذف، وتقييد المعالجة. يمكنك طلب نسخة من بياناتك أو
                حذفها عبر privacy@amtdex.sa — نرد خلال 10 أيام عمل.
              </div>
              <div data-pencil-name="Bullets" class="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#F0EDE7] rounded-[10px]">
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="BDot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    الوصول والتصحيح
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="BDot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    الحذف والنسيان
                  </div>
                </div>
                <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
                  <div data-pencil-name="BDot" class="box-border w-[6px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                  <div data-pencil-name="BT" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                    الاعتراض وتقييد المعالجة
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Sec 05" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="S Head" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
                <div data-pencil-name="Num" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[8px]">
                  <div data-pencil-name="Num Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    05
                  </div>
                </div>
                <div data-pencil-name="S Title" class="text-[15px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  اتصل بنا
                </div>
              </div>
              <div data-pencil-name="S Body" class="text-[12.5px]/[23px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                لأي استفسار حول الخصوصية: privacy@amtdex.sa — أو عبر صفحة التواصل. نلتزم بالرد خلال
                يومي عمل.
              </div>
            </div>
          </div>
        </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>