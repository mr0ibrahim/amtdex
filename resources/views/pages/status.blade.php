<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — حالة الخدمات والأنظمة</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Status Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Hero" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[40px] justify-start items-center bg-[#F0EDE7]">
          <div data-pencil-name="Title" class="text-[32px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
            حالة الخدمات
          </div>
          <div data-pencil-name="Sub" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
            مراقبة لحظية — آخر تحديث منذ دقيقة
          </div>
        </div>
        <div data-pencil-name="Grid" class="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[24px_40px] justify-start items-start bg-[#FFFFFF]">
          <div data-pencil-name="Svc واجهة الموقع" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
            <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
              <div data-pencil-name="Svc Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                واجهة الموقع
              </div>
              <div data-pencil-name="Dot" class="box-border w-[10px] shrink-0 h-[10px] flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
            </div>
            <div data-pencil-name="Uptime" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              99.98% جاهزية — 30 يوم
            </div>
            <div data-pencil-name="Bar" class="box-border w-full h-[6px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]">
              <div data-pencil-name="Fill" class="box-border [flex:1_1_0] h-full flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
            </div>
          </div>
          <div data-pencil-name="Svc لوحة التحكم" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
            <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
              <a href="/dashboard" style="text-decoration:none; color:inherit; display:contents;"><div data-pencil-name="Svc Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                لوحة التحكم
              </div></a>
              <div data-pencil-name="Dot" class="box-border w-[10px] shrink-0 h-[10px] flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
            </div>
            <div data-pencil-name="Uptime" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              99.95% جاهزية — 30 يوم
            </div>
            <div data-pencil-name="Bar" class="box-border w-full h-[6px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]">
              <div data-pencil-name="Fill" class="box-border [flex:1_1_0] h-full flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
            </div>
          </div>
          <div data-pencil-name="Svc واجهات API" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
            <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
              <div data-pencil-name="Svc Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                واجهات API
              </div>
              <div data-pencil-name="Dot" class="box-border w-[10px] shrink-0 h-[10px] flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
            </div>
            <div data-pencil-name="Uptime" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              99.99% جاهزية — 30 يوم
            </div>
            <div data-pencil-name="Bar" class="box-border w-full h-[6px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]">
              <div data-pencil-name="Fill" class="box-border [flex:1_1_0] h-full flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
            </div>
          </div>
          <div data-pencil-name="Svc البريد والدعم" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
            <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
              <div data-pencil-name="Svc Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                البريد والدعم
              </div>
              <div data-pencil-name="Dot" class="box-border w-[10px] shrink-0 h-[10px] flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
            </div>
            <div data-pencil-name="Uptime" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              100% جاهزية — 30 يوم
            </div>
            <div data-pencil-name="Bar" class="box-border w-full h-[6px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]">
              <div data-pencil-name="Fill" class="box-border [flex:1_1_0] h-full flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Incidents" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[0px_40px_32px_40px] justify-start items-start bg-[#FFFFFF]">
          <div data-pencil-name="Inc Title" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
            الحوادث الأخيرة
          </div>
          <div data-pencil-name="IR" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[14px] justify-between items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
            <div data-pencil-name="IR Date" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              2 يناير 2026
            </div>
            <div data-pencil-name="IR Title" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              صيانة مجدولة — تحديث أمني
            </div>
            <div data-pencil-name="SB" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_10px] justify-start items-start bg-[#E6F4EA] rounded-[999px]">
              <div data-pencil-name="SB Text" class="text-[11px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                مكتمل
              </div>
            </div>
          </div>
          <div data-pencil-name="IR" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[14px] justify-between items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
            <div data-pencil-name="IR Date" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['JetBrains_Mono',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              18 ديسمبر 2025
            </div>
            <div data-pencil-name="IR Title" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              تباطؤ API لمدة 4 دقائق
            </div>
            <div data-pencil-name="SB" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_10px] justify-start items-start bg-[#E6F4EA] rounded-[999px]">
              <div data-pencil-name="SB Text" class="text-[11px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                تم الحل
              </div>
            </div>
          </div>
        </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>