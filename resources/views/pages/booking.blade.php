<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — حجز استشارة أو موعد</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Booking Wizard Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Header" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[40px] justify-start items-center bg-[#F0EDE7]">
          <div data-pencil-name="Eyebrow" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
            حجز استشارة — 3 خطوات فقط
          </div>
          <div data-pencil-name="Title" class="text-[36px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
            احجز استشارتك المجانية
          </div>
          <div data-pencil-name="Steps Bar" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
            <div data-pencil-name="Step 1" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[8px_14px] justify-start items-center bg-[#0A66FF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Num" class="box-border w-[20px] shrink-0 h-[20px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] rounded-[999px]">
                <div data-pencil-name="Num Text" class="text-[10px]/[normal] box-border text-[#0A66FF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  1
                </div>
              </div>
              <div data-pencil-name="Step Text" class="text-[11px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                نوع المشروع
              </div>
            </div>
            <div data-pencil-name="Line" class="box-border w-[24px] shrink-0 h-[2px] flex flex-row gap-0 justify-start items-start bg-[#E8E5DF] rounded-[999px]"></div>
            <div data-pencil-name="Step 2" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[8px_14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Num" class="box-border w-[20px] shrink-0 h-[20px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] rounded-[999px]">
                <div data-pencil-name="Num Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  2
                </div>
              </div>
              <div data-pencil-name="Step Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                التفاصيل
              </div>
            </div>
            <div data-pencil-name="Line" class="box-border w-[24px] shrink-0 h-[2px] flex flex-row gap-0 justify-start items-start bg-[#E8E5DF] rounded-[999px]"></div>
            <div data-pencil-name="Step 3" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[8px_14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Num" class="box-border w-[20px] shrink-0 h-[20px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] rounded-[999px]">
                <div data-pencil-name="Num Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  3
                </div>
              </div>
              <div data-pencil-name="Step Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                التأكيد
              </div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] p-[32px_40px] justify-start items-start">
          <div data-pencil-name="Card" class="box-border w-[880px] shrink-0 h-fit flex flex-col gap-[16px] p-[24px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
            <div data-pencil-name="Card Title" class="text-[16px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              ما نوع مشروعك؟
            </div>
            <div data-pencil-name="Opts" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
              <div data-pencil-name="Opt نظام إداري" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[16px] justify-start items-center bg-[#EEF3FF] [outline:2px_solid_#0A66FF] [outline-offset:-1px] rounded-[12px]">
                <div data-pencil-name="OI" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                  <svg data-pencil-name="OI Icon" data-icon-name="layout-dashboard" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M2.03027 1.20313q-0.22559 0.07178-0.42724 0.23242-0.20166 0.16064-0.30078 0.36914l-0.02735 0.04443q-0.05811 0.10938-0.07177 0.2085-0.02734 0.14014-0.02735 0.56054l0 3.51368q0 0.42041 0.02735 0.56054 0.01367 0.09912 0.07177 0.2085l0.02735 0.04443q0.09912 0.22217 0.30761 0.38282 0.2085 0.16064 0.44776 0.21875 0.11279 0.04102 1.72949 0.03417 1.6167-0.00684 1.74316-0.03417 0.29395-0.07178 0.53321-0.30762 0.12305-0.12646 0.1914-0.23242 0.07178-0.10596 0.11621-0.27344l0.04102-0.12647 0-4.46386-0.04102-0.12647q-0.04443-0.16748-0.11621-0.27344-0.06836-0.10596-0.1914-0.23242-0.15381-0.15381-0.29395-0.22217l-0.01709-0.01367q-0.12305-0.05811-0.22217-0.07177-0.12646-0.02734-0.47509-0.02735l-1.14844 0-1.52783 0q-0.24951 0.01367-0.34864 0.02735z m6.43946-0.00001q-0.28027 0.05811-0.53321 0.30762-0.12305 0.12646-0.19482 0.23242-0.06836 0.10596-0.11279 0.27344l-0.04102 0.12647 0 2.15332 0.04102 0.14013q0.08545 0.22559 0.24609 0.40674 0.16064 0.18115 0.35547 0.28028l0.01709 0.01367q0.13672 0.07178 0.22217 0.08545 0.14014 0.01367 0.48877 0.02734l2.92578-0.01367 0.14013-0.04102q0.2666-0.08545 0.46827-0.28711 0.20508-0.20508 0.29052-0.45459 0.02734-0.08545 0.02735-0.25293l0.01367-0.95361 0-0.86816q0-0.23584-0.02735-0.34864-0.01367-0.07178-0.08544-0.21191l-0.01368-0.01367q-0.09912-0.22217-0.30078-0.37598-0.20166-0.15381-0.44092-0.22559-0.09912-0.02734-0.33496-0.02734l-1.41504 0q-1.62354 0-1.73632 0.02734z m-3.21973 3.16504l0 2.05762-2.92578 0 0-4.10156 2.92578 0 0 2.04394z m6.42578-1.16211l0 0.86817-2.92578 0 0-1.75 2.92578 0 0 0.88183z m-3.20605 3.24707q-0.28027 0.05811-0.53321 0.30762-0.12305 0.12646-0.19482 0.23242-0.06836 0.10596-0.11279 0.27344l-0.04102 0.12647 0 4.46386 0.04102 0.12647q0.04443 0.16748 0.11279 0.27344 0.07178 0.10596 0.19482 0.23242 0.23926 0.23584 0.53321 0.30761 0.12646 0.02734 1.74316 0.03418 1.6167 0.00684 1.72949-0.03418 0.30762-0.07178 0.54346-0.30761 0.23926-0.23926 0.31104-0.54688 0.02734-0.11279 0.03417-2.31738 0.00684-2.20459-0.03417-2.31738-0.07178-0.30762-0.3042-0.53662-0.229-0.23242-0.53663-0.31788-0.09912-0.02734-0.33496-0.02734l-1.41504 0q-1.62354 0-1.73632 0.02734z m3.20605 3.16504l0 2.05762-2.92578 0 0-4.10156 2.92578 0 0 2.04394z m-9.54639-0.85449q-0.31104 0.05469-0.56396 0.27344-0.24951 0.21533-0.34863 0.50928-0.02734 0.08545-0.02735 0.25293l-0.01367 0.95361 0 0.86816q0 0.23584 0.02735 0.34864 0.01367 0.07178 0.08544 0.21191l0.01368 0.01367q0.09912 0.22217 0.30761 0.38281 0.2085 0.16065 0.44776 0.21875 0.11279 0.04102 1.72949 0.03418 1.6167-0.00684 1.74316-0.03418 0.29395-0.07178 0.53321-0.30761 0.12305-0.12646 0.1914-0.23242 0.07178-0.10596 0.11621-0.27344l0.04102-0.12647 0-2.15332-0.04102-0.14013q-0.08545-0.22559-0.24609-0.40674-0.16064-0.18115-0.35547-0.28028l-0.01709-0.01367q-0.12305-0.05811-0.22217-0.08545-0.14014-0.01367-0.48877-0.02734l-1.26123 0q-1.55518 0-1.65088 0.01367z m3.12061 2.03028l0 0.88183-2.92578 0 0-1.75 2.92578 0 0 0.86817z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="OT" class="text-[12px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
                  نظام إداري
                </div>
                <div data-pencil-name="OD" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
                  ERP / CRM / HRM
                </div>
              </div>
              <div data-pencil-name="Opt متجر إلكتروني" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[16px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="OI" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] rounded-[10px]">
                  <svg data-pencil-name="OI Icon" data-icon-name="shopping-bag" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.92041 0.60156q-0.30762 0.01367-0.60156 0.16065-0.29395 0.14697-0.50586 0.37256-0.10938 0.11279-0.7417 0.96386-0.51611 0.68701-0.64941 0.90576-0.1333 0.21533-0.20508 0.44092l-0.04102 0.15381 0 8.38428 0.05469 0.15381q0.15723 0.51953 0.56055 0.86133 0.40674 0.3418 0.93994 0.3999 0.15381 0.02734 4.26904 0.02734 4.11523 0 4.26904-0.02734 0.30762-0.02734 0.58789-0.16748 0.32471-0.15381 0.56055-0.44092 0.23926-0.28711 0.35205-0.65283l0.05469-0.15381 0-8.38428-0.04102-0.15381q-0.07178-0.22559-0.20508-0.44092-0.1333-0.21875-0.64941-0.90576-0.63232-0.85107-0.7417-0.96386-0.21191-0.22559-0.50586-0.36573-0.29395-0.14014-0.6289-0.16748-0.16748-0.02734-3.06592-0.02734-2.89844 0-3.06592 0.02734z m6.14551 1.16211q0.12646 0.02734 0.22217 0.1333 0.09912 0.10596 0.42041 0.52637l0.37939 0.50244-2.04394 0.01367q-2.04395 0-4.0879 0l-2.04394-0.01367 0.37939-0.51611q0.30762-0.40674 0.40332-0.50586 0.09912-0.09912 0.22559-0.12647 0.08203-0.02734 3.05566-0.02734 2.97705 0 3.08985 0.01367z m1.60986 6.10449q0 3.75293-0.01367 3.86231-0.05469 0.32471-0.33496 0.46484l-0.09912 0.04102-8.45606 0-0.09912-0.04102q-0.28027-0.12646-0.32129-0.43408-0.02734-0.11279-0.02734-3.87939l0-3.76661 9.35156 0 0 3.75293z m-7.15381-2.60449q-0.11279 0.02734-0.21875 0.11279-0.10254 0.08203-0.16064 0.18116-0.08203 0.18115-0.04785 0.54004 0.03418 0.35547 0.17431 0.73486 0.15381 0.46143 0.46826 0.84766 0.31787 0.38281 0.7212 0.63574 0.36572 0.22559 0.73486 0.3247 0.37256 0.0957 0.80664 0.09571 0.30762 0 0.43408-0.01367 0.9502-0.16748 1.59619-0.81348 0.48877-0.46143 0.70069-1.07666 0.14014-0.37939 0.18115-0.78613 0.01367-0.24951-0.02051-0.37598-0.03418-0.12646-0.14697-0.23926-0.18115-0.19482-0.44776-0.17431-0.2666 0.02051-0.42041 0.23242-0.07178 0.08203-0.09912 0.17431-0.02734 0.08887-0.04101 0.27344-0.04102 0.62891-0.46143 1.09033-0.18457 0.18115-0.37939 0.30078-0.19482 0.11963-0.48877 0.20508-0.09912 0.04102-0.40674 0.04102-0.30762 0-0.40674-0.04102-0.29395-0.08545-0.48877-0.20508-0.19482-0.11963-0.37939-0.30078-0.43408-0.46143-0.46143-1.09033-0.02734-0.29395-0.11963-0.43408-0.08887-0.14014-0.27343-0.2085-0.18115-0.07178-0.34864-0.03076z" fill="#6B7280"></path>
                  </svg>
                </div>
                <div data-pencil-name="OT" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
                  متجر إلكتروني
                </div>
                <div data-pencil-name="OD" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
                  Headless / Shopify
                </div>
              </div>
              <div data-pencil-name="Opt تطبيق جوال" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[16px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="OI" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] rounded-[10px]">
                  <svg data-pencil-name="OI Icon" data-icon-name="smartphone" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.90674 0.60156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.36573-0.30762 0.33496-0.43408 0.81005l-0.04102 0.1709 0 9.79932 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 6.33008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-9.83008-0.04102-0.16748q-0.12646-0.46143-0.43408-0.78271-0.44775-0.4751-1.13476-0.54688-0.16748-0.01367-3.06592-0.01367-2.89844 0-3.07959 0.02734z m6.24463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 9.6045-0.02735 0.08544q-0.12646 0.26318-0.37939 0.33497-0.08203 0.02734-3.07959 0.02734-2.99756 0-3.07959-0.02734-0.25293-0.07178-0.37939-0.33497l-0.02735-0.08544 0-9.6045 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 3.10694-0.02734l3.01123 0.01367 0.09912 0.04102z m-3.30518 8.13476q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.23926 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.15381 0.15381 0.3999 0.16748 0.24609 0.01367 0.42041-0.16065 0.17432-0.17432 0.17432-0.41357 0-0.23926-0.16748-0.3999-0.16748-0.16064-0.39307-0.17432-0.14014 0-0.18115 0.01367z" fill="#6B7280"></path>
                  </svg>
                </div>
                <div data-pencil-name="OT" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
                  تطبيق جوال
                </div>
                <div data-pencil-name="OD" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
                  iOS &amp; Android
                </div>
              </div>
              <div data-pencil-name="Opt حل سحابي" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[16px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="OI" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] rounded-[10px]">
                  <svg data-pencil-name="OI Icon" data-icon-name="cloud" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M4.95605 2.33789q-1.09375 0.07178-2.05419 0.63232-0.95703 0.55713-1.5586 1.4834-0.56055 0.85107-0.71435 1.90381-0.04102 0.22217-0.04102 0.58789 0 0.3623 0.02734 0.57422 0.12646 1.04932 0.66309 1.93115 0.54004 0.88184 1.42529 1.45606 0.43408 0.28027 0.88868 0.45459 0.45459 0.17432 1.01513 0.25976 0.16748 0.02734 0.55713 0.04102l2.38233 0q2.1123 0.01367 2.58056 0 0.47168-0.01367 0.73486-0.05469 0.92627-0.19824 1.60987-0.88183 0.68701-0.68701 0.88525-1.61329 0.15381-0.79639-0.07861-1.56542-0.23242-0.77246-0.80322-1.34327-0.3794-0.39307-0.89893-0.64599-0.36231-0.16748-0.71436-0.23584-0.34863-0.07178-0.90917-0.07178l-0.37598 0-0.08545-0.18115q-0.39307-0.86816-1.09375-1.51074-0.69727-0.646-1.59277-0.96045-0.89551-0.31445-1.84913-0.2461l0-0.01367z m0.81348 1.20313q1.18945 0.18457 2.01318 1.04931 0.15381 0.1709 0.23926 0.2666 0.34863 0.46143 0.54688 1.03565 0.06836 0.21191 0.14355 0.31103 0.07861 0.0957 0.21875 0.16748l0.1128 0.04102 0.74169 0.01367q0.7417 0.01367 0.8545 0.04102 0.4751 0.11279 0.84423 0.40674 0.37256 0.29395 0.57081 0.72802 0.14014 0.29395 0.17431 0.62549 0.03418 0.32813-0.02051 0.64941-0.11279 0.50244-0.47168 0.91602-0.35547 0.41357-0.83056 0.58106l-0.07178 0.02734q-0.14014 0.04443-0.2666 0.0581-0.18115 0.02734-0.66992 0.02735l-2.19776 0q-2.77197 0-2.92578-0.01367-0.99463-0.15381-1.75-0.77588-0.75537-0.62549-1.08008-1.54834-0.18115-0.5332-0.18115-1.13477 0-0.43408 0.08545-0.81006 0.22217-0.95361 0.90918-1.65429 0.68701-0.70068 1.62354-0.93653 0.22559-0.05811 0.39306-0.07177l0.22217-0.02735q0.07178-0.01367 0.35889 0 0.28711 0.01367 0.41357 0.02735z" fill="#6B7280"></path>
                  </svg>
                </div>
                <div data-pencil-name="OT" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
                  حل سحابي
                </div>
                <div data-pencil-name="OD" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center [white-space:nowrap]">
                  AWS / DevOps
                </div>
              </div>
            </div>
            <div data-pencil-name="Budget" class="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
              <div data-pencil-name="BLabel" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                الميزانية التقريبية
              </div>
              <div data-pencil-name="BR" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
                <div data-pencil-name="OB &lt; 20K" class="box-border [flex:1_1_0] h-fit flex flex-row gap-0 p-[12px_0px] justify-center items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="OB Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    &lt; 20K
                  </div>
                </div>
                <div data-pencil-name="OB 20K-50K" class="box-border [flex:1_1_0] h-fit flex flex-row gap-0 p-[12px_0px] justify-center items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="OB Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    20K-50K
                  </div>
                </div>
                <div data-pencil-name="OB 50K-150K" class="box-border [flex:1_1_0] h-fit flex flex-row gap-0 p-[12px_0px] justify-center items-start bg-[#070B1A] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="OB Text" class="text-[11px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    50K-150K
                  </div>
                </div>
                <div data-pencil-name="OB 150K+" class="box-border [flex:1_1_0] h-fit flex flex-row gap-0 p-[12px_0px] justify-center items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="OB Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    150K+
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Actions" class="[box-sizing:content-box] w-[832px] h-[57.5px] shrink-0 flex flex-row gap-0 p-[16px_0px_0px_0px] justify-between items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:-0.5px_0px_0px_0px]">
              <div data-pencil-name="Skip" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                تخطي — التحدث مع خبير مباشرة
              </div>
              <div data-pencil-name="Next" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_24px] justify-start items-center bg-[#0A66FF] rounded-[999px]">
                <div data-pencil-name="Next Text" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  التالي — التفاصيل →
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="Side" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start">
            <div data-pencil-name="Cal" class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="Cal Title" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                اختر موعداً
              </div>
              <div data-pencil-name="Cal Grid" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                <div data-pencil-name="D 0" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[8px] justify-start items-center bg-[#F0EDE7] rounded-[10px]">
                  <div data-pencil-name="D Label" class="text-[9px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    الأ
                  </div>
                  <div data-pencil-name="D Num" class="text-[14px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    15
                  </div>
                </div>
                <div data-pencil-name="D 1" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[8px] justify-start items-center bg-[#0A66FF] rounded-[10px]">
                  <div data-pencil-name="D Label" class="text-[9px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    الإ
                  </div>
                  <div data-pencil-name="D Num" class="text-[14px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    16
                  </div>
                </div>
                <div data-pencil-name="D 2" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[8px] justify-start items-center bg-[#F0EDE7] rounded-[10px]">
                  <div data-pencil-name="D Label" class="text-[9px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    الث
                  </div>
                  <div data-pencil-name="D Num" class="text-[14px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    17
                  </div>
                </div>
                <div data-pencil-name="D 3" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[8px] justify-start items-center bg-[#F0EDE7] rounded-[10px]">
                  <div data-pencil-name="D Label" class="text-[9px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    الأ
                  </div>
                  <div data-pencil-name="D Num" class="text-[14px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    18
                  </div>
                </div>
                <div data-pencil-name="D 4" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[8px] justify-start items-center bg-[#F0EDE7] rounded-[10px]">
                  <div data-pencil-name="D Label" class="text-[9px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    الخ
                  </div>
                  <div data-pencil-name="D Num" class="text-[14px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    19
                  </div>
                </div>
              </div>
              <div data-pencil-name="Slots" class="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
                <div data-pencil-name="Slot" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px_12px] justify-between items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="Slot Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    10:00 ص — متاح
                  </div>
                  <div data-pencil-name="Dot" class="box-border w-[8px] shrink-0 h-[8px] flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
                </div>
                <div data-pencil-name="Slot" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px_12px] justify-between items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="Slot Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    11:00 ص — متاح
                  </div>
                  <div data-pencil-name="Dot" class="box-border w-[8px] shrink-0 h-[8px] flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
                </div>
                <div data-pencil-name="Slot" class="box-border w-full h-fit shrink-0 opacity-[0.6] flex flex-row gap-0 p-[10px_12px] justify-between items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="Slot Text" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    2:00 م — محجوز
                  </div>
                </div>
                <div data-pencil-name="Slot" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px_12px] justify-between items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="Slot Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    3:30 م — متاح
                  </div>
                  <div data-pencil-name="Dot" class="box-border w-[8px] shrink-0 h-[8px] flex flex-row gap-0 justify-start items-start bg-[#0E9F6E] rounded-[999px]"></div>
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