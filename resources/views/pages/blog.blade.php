<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — المدونة التقنية</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Blog Page" class="box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
      @include('partials.site-header')
      <div data-pencil-name="Header" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[40px] justify-start items-center bg-[#FFFFFF]">
        <div data-pencil-name="Eyebrow" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
          المدونة — رؤى تقنية من فريق AMTDEX
        </div>
        <div data-pencil-name="Title" class="text-[36px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
          أفكار تساعدك تتخذ قرار أفضل
        </div>
        <div data-pencil-name="Desc" class="text-[13px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
          مقالات عملية عن اختيار التقنيات، إدارة المشاريع، والتحول الرقمي — من تجاربنا مع 120+ عميل.
        </div>
      </div>
      <div data-pencil-name="Grid" class="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[0px_40px_32px_40px] justify-start items-start bg-[#FFFFFF]">
        <div data-pencil-name="Art ERP" class="box-border w-[520px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px] overflow-hidden">
          <div data-pencil-name="Thumb" class="box-border w-full h-[160px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#070B1A]">
            <div data-pencil-name="Thumb Tag" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold tracking-[1px] text-left [white-space:nowrap]">
              ERP
            </div>
          </div>
          <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[16px] justify-start items-start">
            <div data-pencil-name="Art Tag" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ERP • 6 دقائق
            </div>
            <div data-pencil-name="Art Title" class="text-[14px]/[21px] box-border w-full text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left">
              كيف تختار نظام ERP لمتجرك دون أن تدفع أكثر
            </div>
            <div data-pencil-name="Art Date" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              12 يناير 2026
            </div>
          </div>
        </div>
        <div data-pencil-name="Art Mobile" class="box-border [flex:1_1_0] h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px] overflow-hidden">
          <div data-pencil-name="Thumb" class="box-border w-full h-[160px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#0A66FF]">
            <div data-pencil-name="Thumb Tag" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold tracking-[1px] text-left [white-space:nowrap]">
              Mobile
            </div>
          </div>
          <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[16px] justify-start items-start">
            <div data-pencil-name="Art Tag" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              Mobile • 8 دقائق
            </div>
            <div data-pencil-name="Art Title" class="text-[14px]/[21px] box-border w-full text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left">
              Flutter vs Native — متى تختار كل واحد؟
            </div>
            <div data-pencil-name="Art Date" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              5 يناير 2026
            </div>
          </div>
        </div>
        <div data-pencil-name="Art DevOps" class="box-border [flex:1_1_0] h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px] overflow-hidden">
          <div data-pencil-name="Thumb" class="box-border w-full h-[160px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#0A66FF]">
            <div data-pencil-name="Thumb Tag" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold tracking-[1px] text-left [white-space:nowrap]">
              DevOps
            </div>
          </div>
          <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[16px] justify-start items-start">
            <div data-pencil-name="Art Tag" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              DevOps • 5 دقائق
            </div>
            <div data-pencil-name="Art Title" class="text-[14px]/[21px] box-border w-full text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left">
              لماذا تفشل المشاريع البرمجية وكيف تتجنب ذلك
            </div>
            <div data-pencil-name="Art Date" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              28 ديسمبر 2025
            </div>
          </div>
        </div>
      </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>