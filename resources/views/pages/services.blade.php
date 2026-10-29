<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — خدماتنا البرمجية والاستشارية</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Services Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Header" class="box-border w-full h-fit shrink-0 flex flex-row gap-[40px] p-[56px_40px] justify-start items-start bg-[#FFFFFF]">
          <div data-pencil-name="Head Left" class="box-border w-[640px] shrink-0 h-fit flex flex-col gap-[16px] justify-start items-start">
            <div data-pencil-name="Eyebrow" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold tracking-[0.6px] text-left [white-space:nowrap]">
              خدماتنا — حلول من الفكرة إلى الإطلاق
            </div>
            <div data-pencil-name="Title" class="text-[48px]/[52px] box-border w-full text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold tracking-[-0.8px] text-left">
              خدمات برمجية
              <br>
              متكاملة لنموك.
            </div>
            <div data-pencil-name="Desc" class="text-[14px]/[26px] box-border w-[520px] text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              من الأنظمة المؤسسية إلى تطبيقات الجوال — نبني برمجيات آمنة، سريعة، وقابلة للتوسع، مع
              دعم عربي مستمر بعد الإطلاق.
            </div>
            <div data-pencil-name="Btns" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start">
              <div data-pencil-name="B1" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_22px] justify-start items-center bg-[#0A66FF] rounded-[999px]">
                <div data-pencil-name="B1 Text" class="text-[13px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  استشارة مجانية
                </div>
                <svg data-pencil-name="B1 Icon" data-icon-name="arrow-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M6.90088 2.35156q-0.18115 0.02734-0.32129 0.16748-0.11279 0.11279-0.14697 0.28028-0.03418 0.16748 0.02051 0.32129 0.02734 0.08545 0.25976 0.3247 0.23242 0.23584 1.36377 1.37061 1.58252 1.58252 1.58252 1.59619 0 0.01367-3.45557 0.01367l-3.44531 0-0.08545 0.04102q-0.22217 0.11279-0.30078 0.33838-0.0752 0.22217 0.00684 0.43408 0.05811 0.0957 0.14013 0.18115 0.08545 0.08203 0.16748 0.11963 0.08545 0.03418 0.53321 0.03418l3.01123 0q3.42822 0 3.42822 0.01367 0 0.01367-1.58252 1.59619-1.13135 1.13477-1.36377 1.37402-0.23242 0.23584-0.25976 0.3213-0.05469 0.15381-0.02051 0.32128 0.03418 0.16748 0.14697 0.28028 0.18115 0.18115 0.42041 0.18115l0.04102 0q0.11279 0 0.19824-0.05469 0.14014-0.09912 0.51611-0.46484l1.68164-1.67822q2.1123-2.10205 2.15332-2.18409 0.07178-0.12646 0.07178-0.28027 0-0.15381-0.07178-0.28027-0.04102-0.08203-2.1499-2.18067-2.10547-2.10205-2.17725-2.13623-0.06836-0.0376-0.23584-0.06494-0.04102 0-0.12646 0.01367z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="B2" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_20px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <svg data-pencil-name="B2 Icon" data-icon-name="grid-2x2" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M2.60449 1.20313q-0.50586 0.08545-0.87842 0.43749-0.36914 0.34863-0.50927 0.86475-0.02734 0.08545-0.02735 0.71436l-0.01367 3.78027 0.01367 3.78027q0 0.62891 0.02735 0.71436 0.14014 0.48877 0.46826 0.82031 0.33154 0.32813 0.82031 0.46826 0.08545 0.02734 0.71436 0.02735l3.78027 0.01367 3.78027-0.01367q0.62891 0 0.71436-0.02735 0.48877-0.14014 0.81689-0.46826 0.33154-0.33154 0.47168-0.82031 0.02734-0.08545 0.02735-0.71436l0.01367-3.78027-0.01367-3.78027q0-0.62891-0.02735-0.71436-0.12646-0.48877-0.458-0.81689-0.32813-0.33154-0.80323-0.47168l-0.14013-0.04102-4.32715 0q-4.3374 0-4.4502 0.02734z m3.82129 3.16503l0 2.05762-4.10156 0 0.01367-3.64014 0.04102-0.09912q0.07178-0.14014 0.18798-0.229 0.11963-0.09229 0.25977-0.11963 0.08545 0 1.83545-0.01367l1.76367 0 0 2.04394z m4.8877-1.98925q0.2085 0.09912 0.30761 0.30761l0.04102 0.09912 0.01367 3.64014-4.10156 0 0-4.10156 3.64013 0.01367 0.09913 0.04102z m-4.8877 7.23925l0 2.05762-1.76367 0q-1.75 0-1.84912-0.02734-0.29395-0.05811-0.43408-0.33496l-0.04102-0.09913-0.01367-3.64013 4.10156 0 0 2.04394z m5.25-0.22558l-0.01367 1.82177-0.04102 0.09913q-0.14014 0.27685-0.43408 0.33496-0.09912 0.02734-1.84912 0.02734l-1.76367 0 0-4.10156 4.10156 0 0 1.81836z" fill="#070B1A"></path>
                </svg>
                <div data-pencil-name="B2 Text" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  استعرض التقنيات
                </div>
              </div>
            </div>
            <div data-pencil-name="Trust" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] p-[12px_0px_0px_0px] justify-start items-center">
              <div data-pencil-name="Chip +120 مشروع" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_10px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <div data-pencil-name="Chip Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  +120 مشروع
                </div>
              </div>
              <div data-pencil-name="Chip 98% رضا" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_10px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <div data-pencil-name="Chip Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  98% رضا
                </div>
              </div>
              <div data-pencil-name="Chip دعم 24/7" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_10px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <div data-pencil-name="Chip Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  دعم 24/7
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="Head Right" class="box-border [flex:1_1_0] h-[380px] flex flex-col gap-0 justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[20px] overflow-hidden">
            <div data-pencil-name="Top Bar" class="[box-sizing:content-box] w-[680px] h-[41.5px] shrink-0 flex flex-row gap-0 p-[0px_16px] justify-between items-center bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
              <div data-pencil-name="Top Title" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                نطاق الخدمات
              </div>
              <div data-pencil-name="Live Pill Inner" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[5px_10px] justify-start items-start bg-[#E6F4EA] rounded-[999px]">
                <div data-pencil-name="Live" class="text-[10px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  ● 6 خدمات رئيسية
                </div>
              </div>
            </div>
            <div data-pencil-name="Body" class="box-border w-full [flex:1_1_0] flex flex-col gap-[10px] p-[16px] justify-start items-start">
              <div data-pencil-name="Svc تطوير الأنظمة المخصصة" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
                <div data-pencil-name="IC" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                  <svg data-pencil-name="I" data-icon-name="code" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M4.48096 2.95313q-0.07178 0.01367-0.15039 0.07177-0.0752 0.05469-1.86621 1.84571l-1.42872 1.44238q-0.32129 0.33838-0.39306 0.44775-0.05469 0.08545-0.05469 0.19824l0 0.08204q0 0.11279 0.05469 0.19824 0.08545 0.12305 0.40674 0.46142l1.46972 1.46973q1.31592 1.31592 1.58936 1.58252 0.27344 0.2666 0.34521 0.29395 0.2085 0.06836 0.42383-0.01368 0.21875-0.08545 0.31787-0.28027 0.04102-0.09912 0.04102-0.23926l0-0.05469q0.01367-0.11279-0.04102-0.18457-0.07178-0.10938-0.35205-0.40332l-2.854-2.87109 2.854-2.87109q0.28027-0.29395 0.35205-0.40332 0.05469-0.07178 0.04102-0.18457l0-0.05469q0-0.14014-0.04444-0.22901-0.04102-0.09229-0.1333-0.17431-0.08887-0.08545-0.18115-0.11963-0.08887-0.0376-0.20849-0.0376-0.11963 0-0.18799 0.02735z m4.64843 0q-0.09912 0.04443-0.1914 0.12988-0.08887 0.08203-0.1333 0.17431-0.04102 0.08887-0.04102 0.22901l0 0.05469q-0.01367 0.11279 0.04102 0.18457 0.07178 0.10938 0.35205 0.40332l2.854 2.87109-2.854 2.87109q-0.28027 0.29395-0.35205 0.40332-0.05469 0.07178-0.04102 0.18457l0 0.05469q0 0.14014 0.04102 0.23926 0.09912 0.19482 0.31445 0.28027 0.21875 0.08203 0.42725 0.01367 0.07178-0.02734 0.34521-0.29394 0.27344-0.2666 1.58936-1.58252l1.46972-1.46973q0.32129-0.33838 0.40674-0.46142 0.05469-0.08545 0.05469-0.19824l0-0.08204q0-0.11279-0.05469-0.19824-0.08545-0.12305-0.40674-0.46142l-1.45605-1.45606q-1.10742-1.11768-1.48682-1.47998-0.37598-0.36572-0.43066-0.39648-0.08545-0.04102-0.22559-0.04102-0.14014 0-0.22217 0.02734z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Mid" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="Svc Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    تطوير الأنظمة المخصصة
                  </div>
                  <div data-pencil-name="Svc Time" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    3-6 أسابيع
                  </div>
                </div>
                <svg data-pencil-name="Chevron" data-icon-name="chevron-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M5.09619 2.93945q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.25293 0 0.16748 0.04102 0.25293 0.04443 0.08203 1.62353 1.66455l1.58252 1.58252-1.58252 1.58252q-1.5791 1.58252-1.62353 1.66797-0.04102 0.08203-0.04102 0.23584 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.09912 0.0957 0.18115 0.1333 0.08545 0.03418 0.23926 0.03418 0.15381 0 0.24268-0.04785 0.09229-0.05127 1.90381-1.8628 1.81494-1.81494 1.86279-1.9038 0.05127-0.09229 0.05127-0.25977 0-0.16748-0.04443-0.24951-0.04102-0.08545-1.85938-1.90723l-1.44238-1.42871q-0.33496-0.33496-0.46143-0.41699-0.09912-0.07178-0.19824-0.07178l-0.04102 0q-0.14014 0-0.18115 0.01367z" fill="#9AA0AB"></path>
                </svg>
              </div>
              <div data-pencil-name="Svc تطبيقات iOS &amp; Android" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
                <div data-pencil-name="IC" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#070B1A] rounded-[10px]">
                  <svg data-pencil-name="I" data-icon-name="smartphone" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.90674 0.60156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.36573-0.30762 0.33496-0.43408 0.81005l-0.04102 0.1709 0 9.79932 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 6.33008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-9.83008-0.04102-0.16748q-0.12646-0.46143-0.43408-0.78271-0.44775-0.4751-1.13476-0.54688-0.16748-0.01367-3.06592-0.01367-2.89844 0-3.07959 0.02734z m6.24463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 9.6045-0.02735 0.08544q-0.12646 0.26318-0.37939 0.33497-0.08203 0.02734-3.07959 0.02734-2.99756 0-3.07959-0.02734-0.25293-0.07178-0.37939-0.33497l-0.02735-0.08544 0-9.6045 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 3.10694-0.02734l3.01123 0.01367 0.09912 0.04102z m-3.30518 8.13476q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.23926 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.15381 0.15381 0.3999 0.16748 0.24609 0.01367 0.42041-0.16065 0.17432-0.17432 0.17432-0.41357 0-0.23926-0.16748-0.3999-0.16748-0.16064-0.39307-0.17432-0.14014 0-0.18115 0.01367z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Mid" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="Svc Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    تطبيقات iOS &amp; Android
                  </div>
                  <div data-pencil-name="Svc Time" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    4-8 أسابيع
                  </div>
                </div>
                <svg data-pencil-name="Chevron" data-icon-name="chevron-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M5.09619 2.93945q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.25293 0 0.16748 0.04102 0.25293 0.04443 0.08203 1.62353 1.66455l1.58252 1.58252-1.58252 1.58252q-1.5791 1.58252-1.62353 1.66797-0.04102 0.08203-0.04102 0.23584 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.09912 0.0957 0.18115 0.1333 0.08545 0.03418 0.23926 0.03418 0.15381 0 0.24268-0.04785 0.09229-0.05127 1.90381-1.8628 1.81494-1.81494 1.86279-1.9038 0.05127-0.09229 0.05127-0.25977 0-0.16748-0.04443-0.24951-0.04102-0.08545-1.85938-1.90723l-1.44238-1.42871q-0.33496-0.33496-0.46143-0.41699-0.09912-0.07178-0.19824-0.07178l-0.04102 0q-0.14014 0-0.18115 0.01367z" fill="#9AA0AB"></path>
                </svg>
              </div>
              <div data-pencil-name="Svc حلول سحابية و DevOps" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
                <div data-pencil-name="IC" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#7C3AED] rounded-[10px]">
                  <svg data-pencil-name="I" data-icon-name="cloud" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M4.95605 2.33789q-1.09375 0.07178-2.05419 0.63232-0.95703 0.55713-1.5586 1.4834-0.56055 0.85107-0.71435 1.90381-0.04102 0.22217-0.04102 0.58789 0 0.3623 0.02734 0.57422 0.12646 1.04932 0.66309 1.93115 0.54004 0.88184 1.42529 1.45606 0.43408 0.28027 0.88868 0.45459 0.45459 0.17432 1.01513 0.25976 0.16748 0.02734 0.55713 0.04102l2.38233 0q2.1123 0.01367 2.58056 0 0.47168-0.01367 0.73486-0.05469 0.92627-0.19824 1.60987-0.88183 0.68701-0.68701 0.88525-1.61329 0.15381-0.79639-0.07861-1.56542-0.23242-0.77246-0.80322-1.34327-0.3794-0.39307-0.89893-0.64599-0.36231-0.16748-0.71436-0.23584-0.34863-0.07178-0.90917-0.07178l-0.37598 0-0.08545-0.18115q-0.39307-0.86816-1.09375-1.51074-0.69727-0.646-1.59277-0.96045-0.89551-0.31445-1.84913-0.2461l0-0.01367z m0.81348 1.20313q1.18945 0.18457 2.01318 1.04931 0.15381 0.1709 0.23926 0.2666 0.34863 0.46143 0.54688 1.03565 0.06836 0.21191 0.14355 0.31103 0.07861 0.0957 0.21875 0.16748l0.1128 0.04102 0.74169 0.01367q0.7417 0.01367 0.8545 0.04102 0.4751 0.11279 0.84423 0.40674 0.37256 0.29395 0.57081 0.72802 0.14014 0.29395 0.17431 0.62549 0.03418 0.32813-0.02051 0.64941-0.11279 0.50244-0.47168 0.91602-0.35547 0.41357-0.83056 0.58106l-0.07178 0.02734q-0.14014 0.04443-0.2666 0.0581-0.18115 0.02734-0.66992 0.02735l-2.19776 0q-2.77197 0-2.92578-0.01367-0.99463-0.15381-1.75-0.77588-0.75537-0.62549-1.08008-1.54834-0.18115-0.5332-0.18115-1.13477 0-0.43408 0.08545-0.81006 0.22217-0.95361 0.90918-1.65429 0.68701-0.70068 1.62354-0.93653 0.22559-0.05811 0.39306-0.07177l0.22217-0.02735q0.07178-0.01367 0.35889 0 0.28711 0.01367 0.41357 0.02735z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Mid" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="Svc Name" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    حلول سحابية و DevOps
                  </div>
                  <div data-pencil-name="Svc Time" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    مستمر
                  </div>
                </div>
                <svg data-pencil-name="Chevron" data-icon-name="chevron-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M5.09619 2.93945q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.25293 0 0.16748 0.04102 0.25293 0.04443 0.08203 1.62353 1.66455l1.58252 1.58252-1.58252 1.58252q-1.5791 1.58252-1.62353 1.66797-0.04102 0.08203-0.04102 0.23584 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.09912 0.0957 0.18115 0.1333 0.08545 0.03418 0.23926 0.03418 0.15381 0 0.24268-0.04785 0.09229-0.05127 1.90381-1.8628 1.81494-1.81494 1.86279-1.9038 0.05127-0.09229 0.05127-0.25977 0-0.16748-0.04443-0.24951-0.04102-0.08545-1.85938-1.90723l-1.44238-1.42871q-0.33496-0.33496-0.46143-0.41699-0.09912-0.07178-0.19824-0.07178l-0.04102 0q-0.14014 0-0.18115 0.01367z" fill="#9AA0AB"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Grid Sec" class="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] p-[48px_40px] justify-start items-start bg-[#FCFBF8]">
          <div data-pencil-name="Grid" class="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start">
            <div data-pencil-name="Col1" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start">
              <div data-pencil-name="Card الأنظمة الإدارية" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
                <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="IB" class="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                    <svg data-pencil-name="Icon" data-icon-name="layout-dashboard" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                      <path d="M2.03027 1.20313q-0.22559 0.07178-0.42724 0.23242-0.20166 0.16064-0.30078 0.36914l-0.02735 0.04443q-0.05811 0.10938-0.07177 0.2085-0.02734 0.14014-0.02735 0.56054l0 3.51368q0 0.42041 0.02735 0.56054 0.01367 0.09912 0.07177 0.2085l0.02735 0.04443q0.09912 0.22217 0.30761 0.38282 0.2085 0.16064 0.44776 0.21875 0.11279 0.04102 1.72949 0.03417 1.6167-0.00684 1.74316-0.03417 0.29395-0.07178 0.53321-0.30762 0.12305-0.12646 0.1914-0.23242 0.07178-0.10596 0.11621-0.27344l0.04102-0.12647 0-4.46386-0.04102-0.12647q-0.04443-0.16748-0.11621-0.27344-0.06836-0.10596-0.1914-0.23242-0.15381-0.15381-0.29395-0.22217l-0.01709-0.01367q-0.12305-0.05811-0.22217-0.07177-0.12646-0.02734-0.47509-0.02735l-1.14844 0-1.52783 0q-0.24951 0.01367-0.34864 0.02735z m6.43946-0.00001q-0.28027 0.05811-0.53321 0.30762-0.12305 0.12646-0.19482 0.23242-0.06836 0.10596-0.11279 0.27344l-0.04102 0.12647 0 2.15332 0.04102 0.14013q0.08545 0.22559 0.24609 0.40674 0.16064 0.18115 0.35547 0.28028l0.01709 0.01367q0.13672 0.07178 0.22217 0.08545 0.14014 0.01367 0.48877 0.02734l2.92578-0.01367 0.14013-0.04102q0.2666-0.08545 0.46827-0.28711 0.20508-0.20508 0.29052-0.45459 0.02734-0.08545 0.02735-0.25293l0.01367-0.95361 0-0.86816q0-0.23584-0.02735-0.34864-0.01367-0.07178-0.08544-0.21191l-0.01368-0.01367q-0.09912-0.22217-0.30078-0.37598-0.20166-0.15381-0.44092-0.22559-0.09912-0.02734-0.33496-0.02734l-1.41504 0q-1.62354 0-1.73632 0.02734z m-3.21973 3.16504l0 2.05762-2.92578 0 0-4.10156 2.92578 0 0 2.04394z m6.42578-1.16211l0 0.86817-2.92578 0 0-1.75 2.92578 0 0 0.88183z m-3.20605 3.24707q-0.28027 0.05811-0.53321 0.30762-0.12305 0.12646-0.19482 0.23242-0.06836 0.10596-0.11279 0.27344l-0.04102 0.12647 0 4.46386 0.04102 0.12647q0.04443 0.16748 0.11279 0.27344 0.07178 0.10596 0.19482 0.23242 0.23926 0.23584 0.53321 0.30761 0.12646 0.02734 1.74316 0.03418 1.6167 0.00684 1.72949-0.03418 0.30762-0.07178 0.54346-0.30761 0.23926-0.23926 0.31104-0.54688 0.02734-0.11279 0.03417-2.31738 0.00684-2.20459-0.03417-2.31738-0.07178-0.30762-0.3042-0.53662-0.229-0.23242-0.53663-0.31788-0.09912-0.02734-0.33496-0.02734l-1.41504 0q-1.62354 0-1.73632 0.02734z m3.20605 3.16504l0 2.05762-2.92578 0 0-4.10156 2.92578 0 0 2.04394z m-9.54639-0.85449q-0.31104 0.05469-0.56396 0.27344-0.24951 0.21533-0.34863 0.50928-0.02734 0.08545-0.02735 0.25293l-0.01367 0.95361 0 0.86816q0 0.23584 0.02735 0.34864 0.01367 0.07178 0.08544 0.21191l0.01368 0.01367q0.09912 0.22217 0.30761 0.38281 0.2085 0.16065 0.44776 0.21875 0.11279 0.04102 1.72949 0.03418 1.6167-0.00684 1.74316-0.03418 0.29395-0.07178 0.53321-0.30761 0.12305-0.12646 0.1914-0.23242 0.07178-0.10596 0.11621-0.27344l0.04102-0.12647 0-2.15332-0.04102-0.14013q-0.08545-0.22559-0.24609-0.40674-0.16064-0.18115-0.35547-0.28028l-0.01709-0.01367q-0.12305-0.05811-0.22217-0.08545-0.14014-0.01367-0.48877-0.02734l-1.26123 0q-1.55518 0-1.65088 0.01367z m3.12061 2.03028l0 0.88183-2.92578 0 0-1.75 2.92578 0 0 0.86817z" fill="#FFFFFF"></path>
                    </svg>
                  </div>
                  <svg data-pencil-name="Arrow" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#9AA0AB"></path>
                  </svg>
                </div>
                <div data-pencil-name="Card Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  الأنظمة الإدارية
                </div>
                <div data-pencil-name="Card Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  ERP, CRM, HRM مخصصة تربط كل أقسامك في نظام واحد.
                </div>
                <div data-pencil-name="Tags" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Odoo
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      SAP
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Custom
                    </div>
                  </div>
                </div>
              </div>
              <div data-pencil-name="Card السحابة والبنية" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
                <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="IB" class="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#7C3AED] rounded-[10px]">
                    <svg data-pencil-name="Icon" data-icon-name="cloud" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                      <path d="M4.95605 2.33789q-1.09375 0.07178-2.05419 0.63232-0.95703 0.55713-1.5586 1.4834-0.56055 0.85107-0.71435 1.90381-0.04102 0.22217-0.04102 0.58789 0 0.3623 0.02734 0.57422 0.12646 1.04932 0.66309 1.93115 0.54004 0.88184 1.42529 1.45606 0.43408 0.28027 0.88868 0.45459 0.45459 0.17432 1.01513 0.25976 0.16748 0.02734 0.55713 0.04102l2.38233 0q2.1123 0.01367 2.58056 0 0.47168-0.01367 0.73486-0.05469 0.92627-0.19824 1.60987-0.88183 0.68701-0.68701 0.88525-1.61329 0.15381-0.79639-0.07861-1.56542-0.23242-0.77246-0.80322-1.34327-0.3794-0.39307-0.89893-0.64599-0.36231-0.16748-0.71436-0.23584-0.34863-0.07178-0.90917-0.07178l-0.37598 0-0.08545-0.18115q-0.39307-0.86816-1.09375-1.51074-0.69727-0.646-1.59277-0.96045-0.89551-0.31445-1.84913-0.2461l0-0.01367z m0.81348 1.20313q1.18945 0.18457 2.01318 1.04931 0.15381 0.1709 0.23926 0.2666 0.34863 0.46143 0.54688 1.03565 0.06836 0.21191 0.14355 0.31103 0.07861 0.0957 0.21875 0.16748l0.1128 0.04102 0.74169 0.01367q0.7417 0.01367 0.8545 0.04102 0.4751 0.11279 0.84423 0.40674 0.37256 0.29395 0.57081 0.72802 0.14014 0.29395 0.17431 0.62549 0.03418 0.32813-0.02051 0.64941-0.11279 0.50244-0.47168 0.91602-0.35547 0.41357-0.83056 0.58106l-0.07178 0.02734q-0.14014 0.04443-0.2666 0.0581-0.18115 0.02734-0.66992 0.02735l-2.19776 0q-2.77197 0-2.92578-0.01367-0.99463-0.15381-1.75-0.77588-0.75537-0.62549-1.08008-1.54834-0.18115-0.5332-0.18115-1.13477 0-0.43408 0.08545-0.81006 0.22217-0.95361 0.90918-1.65429 0.68701-0.70068 1.62354-0.93653 0.22559-0.05811 0.39306-0.07177l0.22217-0.02735q0.07178-0.01367 0.35889 0 0.28711 0.01367 0.41357 0.02735z" fill="#FFFFFF"></path>
                    </svg>
                  </div>
                  <svg data-pencil-name="Arrow" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#9AA0AB"></path>
                  </svg>
                </div>
                <div data-pencil-name="Card Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  السحابة والبنية
                </div>
                <div data-pencil-name="Card Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  AWS/Azure مع CI/CD ومراقبة 24/7.
                </div>
                <div data-pencil-name="Tags" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      AWS
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Docker
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      K8s
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Col2" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start">
              <div data-pencil-name="Card المتاجر والمنصات" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
                <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="IB" class="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#070B1A] rounded-[10px]">
                    <svg data-pencil-name="Icon" data-icon-name="shopping-bag" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                      <path d="M3.92041 0.60156q-0.30762 0.01367-0.60156 0.16065-0.29395 0.14697-0.50586 0.37256-0.10938 0.11279-0.7417 0.96386-0.51611 0.68701-0.64941 0.90576-0.1333 0.21533-0.20508 0.44092l-0.04102 0.15381 0 8.38428 0.05469 0.15381q0.15723 0.51953 0.56055 0.86133 0.40674 0.3418 0.93994 0.3999 0.15381 0.02734 4.26904 0.02734 4.11523 0 4.26904-0.02734 0.30762-0.02734 0.58789-0.16748 0.32471-0.15381 0.56055-0.44092 0.23926-0.28711 0.35205-0.65283l0.05469-0.15381 0-8.38428-0.04102-0.15381q-0.07178-0.22559-0.20508-0.44092-0.1333-0.21875-0.64941-0.90576-0.63232-0.85107-0.7417-0.96386-0.21191-0.22559-0.50586-0.36573-0.29395-0.14014-0.6289-0.16748-0.16748-0.02734-3.06592-0.02734-2.89844 0-3.06592 0.02734z m6.14551 1.16211q0.12646 0.02734 0.22217 0.1333 0.09912 0.10596 0.42041 0.52637l0.37939 0.50244-2.04394 0.01367q-2.04395 0-4.0879 0l-2.04394-0.01367 0.37939-0.51611q0.30762-0.40674 0.40332-0.50586 0.09912-0.09912 0.22559-0.12647 0.08203-0.02734 3.05566-0.02734 2.97705 0 3.08985 0.01367z m1.60986 6.10449q0 3.75293-0.01367 3.86231-0.05469 0.32471-0.33496 0.46484l-0.09912 0.04102-8.45606 0-0.09912-0.04102q-0.28027-0.12646-0.32129-0.43408-0.02734-0.11279-0.02734-3.87939l0-3.76661 9.35156 0 0 3.75293z m-7.15381-2.60449q-0.11279 0.02734-0.21875 0.11279-0.10254 0.08203-0.16064 0.18116-0.08203 0.18115-0.04785 0.54004 0.03418 0.35547 0.17431 0.73486 0.15381 0.46143 0.46826 0.84766 0.31787 0.38281 0.7212 0.63574 0.36572 0.22559 0.73486 0.3247 0.37256 0.0957 0.80664 0.09571 0.30762 0 0.43408-0.01367 0.9502-0.16748 1.59619-0.81348 0.48877-0.46143 0.70069-1.07666 0.14014-0.37939 0.18115-0.78613 0.01367-0.24951-0.02051-0.37598-0.03418-0.12646-0.14697-0.23926-0.18115-0.19482-0.44776-0.17431-0.2666 0.02051-0.42041 0.23242-0.07178 0.08203-0.09912 0.17431-0.02734 0.08887-0.04101 0.27344-0.04102 0.62891-0.46143 1.09033-0.18457 0.18115-0.37939 0.30078-0.19482 0.11963-0.48877 0.20508-0.09912 0.04102-0.40674 0.04102-0.30762 0-0.40674-0.04102-0.29395-0.08545-0.48877-0.20508-0.19482-0.11963-0.37939-0.30078-0.43408-0.46143-0.46143-1.09033-0.02734-0.29395-0.11963-0.43408-0.08887-0.14014-0.27343-0.2085-0.18115-0.07178-0.34864-0.03076z" fill="#FFFFFF"></path>
                    </svg>
                  </div>
                  <svg data-pencil-name="Arrow" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#9AA0AB"></path>
                  </svg>
                </div>
                <div data-pencil-name="Card Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  المتاجر والمنصات
                </div>
                <div data-pencil-name="Card Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  متاجر سريعة وآمنة مع دفع وشحن ومخزون متكامل.
                </div>
                <div data-pencil-name="Tags" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Shopify
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Woo
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Headless
                    </div>
                  </div>
                </div>
              </div>
              <div data-pencil-name="Card التكاملات والـ APIs" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
                <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="IB" class="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#0E9F6E] rounded-[10px]">
                    <svg data-pencil-name="Icon" data-icon-name="plug" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                      <path d="M5.15088 0.60156q-0.0957 0.01367-0.17432 0.05127-0.0752 0.03418-0.15381 0.12647-0.0752 0.08887-0.11279 0.16748-0.03418 0.0752-0.03418 0.28369l0 2.84375-0.39307 0.01367q-0.32129 0-0.44775 0.02051-0.12646 0.02051-0.27344 0.09912-0.14697 0.0752-0.30078 0.229-0.15381 0.15381-0.22217 0.28028l0 0.03076q-0.07178 0.12305-0.08544 0.20849-0.02734 0.11279-0.02735 0.40674l0 1.10401q0 1.37402 0.02735 1.5415 0.15381 0.96729 0.84082 1.65088 0.43408 0.43408 0.96728 0.63232 0.30762 0.12305 0.57764 0.16748 0.27344 0.04102 0.70752 0.04102l0.37939 0 0 2.29688q0 0.18115 0.03418 0.2666 0.0376 0.08203 0.11963 0.16748 0.08545 0.08203 0.18799 0.1333 0.10596 0.04785 0.23242 0.04785 0.12646 0 0.229-0.04785 0.10596-0.05127 0.18799-0.1333 0.08545-0.08545 0.11963-0.16748 0.0376-0.08545 0.0376-0.2666l0-2.29688 0.37939 0q0.43066 0 0.7041-0.04102 0.27344-0.04443 0.58106-0.16748 0.5332-0.19824 0.96728-0.63232 0.68701-0.68359 0.84082-1.65088 0.02734-0.16748 0.02735-1.5415l0-1.10401q0-0.29395-0.02735-0.40674-0.01367-0.08545-0.08544-0.20849l0-0.01709q-0.06836-0.14014-0.22217-0.29395-0.15381-0.15381-0.30078-0.229-0.14697-0.07861-0.27344-0.09912-0.12646-0.02051-0.44775-0.02051l-0.39307-0.01367 0-2.84375q0-0.2085-0.0376-0.28369-0.03418-0.07861-0.11279-0.16748-0.0752-0.09229-0.15723-0.13672-0.11279-0.05469-0.2666-0.05469-0.15381 0-0.2666 0.05469-0.08203 0.04443-0.16065 0.13672-0.0752 0.08887-0.11279 0.16748-0.03418 0.0752-0.03418 0.28369l0 2.84375-2.35156 0 0-2.81299q0-0.23926-0.02734-0.29394-0.07178-0.19824-0.25293-0.30079-0.18115-0.10596-0.39307-0.06494z m4.7749 5.78321q0 1.13477-0.02734 1.32959-0.02734 0.34863-0.16748 0.64257-0.16748 0.32471-0.44776 0.56397-0.28027 0.23584-0.64599 0.34863l-0.15381 0.05469-2.9668 0-0.15381-0.05469q-0.36572-0.11279-0.64599-0.34863-0.28027-0.23926-0.44776-0.56397-0.14014-0.29395-0.16748-0.6289-0.02734-0.18115-0.02734-1.32959l0-1.14844 5.85156 0 0 1.13477z" fill="#FFFFFF"></path>
                    </svg>
                  </div>
                  <svg data-pencil-name="Arrow" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#9AA0AB"></path>
                  </svg>
                </div>
                <div data-pencil-name="Card Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  التكاملات والـ APIs
                </div>
                <div data-pencil-name="Card Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  نربط أنظمتك الحالية بواجهات آمنة وموثقة.
                </div>
                <div data-pencil-name="Tags" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      REST
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      GraphQL
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Webhooks
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Col3" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] justify-start items-start">
              <div data-pencil-name="Card تطبيقات الجوال" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
                <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="IB" class="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                    <svg data-pencil-name="Icon" data-icon-name="smartphone" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                      <path d="M3.90674 0.60156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.36573-0.30762 0.33496-0.43408 0.81005l-0.04102 0.1709 0 9.79932 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 6.33008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-9.83008-0.04102-0.16748q-0.12646-0.46143-0.43408-0.78271-0.44775-0.4751-1.13476-0.54688-0.16748-0.01367-3.06592-0.01367-2.89844 0-3.07959 0.02734z m6.24463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 9.6045-0.02735 0.08544q-0.12646 0.26318-0.37939 0.33497-0.08203 0.02734-3.07959 0.02734-2.99756 0-3.07959-0.02734-0.25293-0.07178-0.37939-0.33497l-0.02735-0.08544 0-9.6045 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 3.10694-0.02734l3.01123 0.01367 0.09912 0.04102z m-3.30518 8.13476q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.23926 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.15381 0.15381 0.3999 0.16748 0.24609 0.01367 0.42041-0.16065 0.17432-0.17432 0.17432-0.41357 0-0.23926-0.16748-0.3999-0.16748-0.16064-0.39307-0.17432-0.14014 0-0.18115 0.01367z" fill="#FFFFFF"></path>
                    </svg>
                  </div>
                  <svg data-pencil-name="Arrow" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#9AA0AB"></path>
                  </svg>
                </div>
                <div data-pencil-name="Card Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  تطبيقات الجوال
                </div>
                <div data-pencil-name="Card Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  نيتف وهجين بأداء عالٍ وتجربة تليق بعلامتك.
                </div>
                <div data-pencil-name="Tags" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Flutter
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      React Native
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Swift
                    </div>
                  </div>
                </div>
              </div>
              <div data-pencil-name="Card الأمان والصيانة" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
                <div data-pencil-name="Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="IB" class="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#FF5F56] rounded-[10px]">
                    <svg data-pencil-name="Icon" data-icon-name="shield-check" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                      <path d="M6.84619 0.60156q-0.34863 0.02734-0.68701 0.30762-0.51611 0.42041-1.00147 0.70068-0.48193 0.28027-1.01513 0.4751-0.30762 0.11279-0.58789 0.1709-0.28027 0.05469-0.66992 0.08203-0.23926 0.01367-0.36573 0.07178-0.19482 0.06836-0.37939 0.22217-0.18115 0.15381-0.26319 0.34863l-0.01367 0.03076q-0.07178 0.12646-0.08545 0.22217-0.01367 0.15381-0.02734 0.60156l0 1.78076q0 2.25244 0.01367 2.46094 0.14014 1.6543 1.10742 2.88477 0.14014 0.16748 0.43409 0.46142 0.29395 0.29394 0.48877 0.44775 0.92285 0.7417 2.2832 1.27491 0.46143 0.18115 0.65625 0.23926 0.23926 0.05469 0.43408 0.01367 0.16748-0.02734 0.5332-0.15381 1.35693-0.51953 2.27979-1.20313 0.37939-0.2666 0.71435-0.60498 1.37402-1.3706 1.54151-3.37353 0.01367-0.23584 0.01367-2.46094 0-2.22852-0.02734-2.35498-0.07178-0.32129-0.31787-0.56396-0.24268-0.24609-0.5503-0.31788-0.09912-0.02734-0.37939-0.04101-0.48877-0.02734-0.96387-0.18115-0.81348-0.2666-1.55518-0.77246-0.2666-0.18115-0.64257-0.48877-0.42041-0.33496-0.96729-0.28028z m0.43408 1.34326q0.64258 0.51953 1.32959 0.86817 1.2168 0.61865 2.25244 0.68701l0.21192 0-0.01367 4.31348q0 0.33496-0.02735 0.50244-0.22559 1.34326-1.1416 2.27637-0.91602 0.92969-2.66601 1.57226l-0.21192 0.08545-0.18115-0.05469q-2.32422-0.85449-3.2334-2.22851-0.47852-0.71436-0.63232-1.63721-0.02734-0.18115-0.02735-0.50244l-0.01367-4.32715 0.19483 0q0.86816-0.05469 1.84912-0.48193 0.98096-0.42725 1.83545-1.12793 0.16748-0.14014 0.19482-0.14014 0.02734 0 0.28027 0.19482z m1.32959 3.31885q-0.06836 0.02734-0.12646 0.05127-0.05469 0.02051-1.06299 1.02539l-0.99463 0.99463-0.40674-0.40332q-0.2666-0.2666-0.3623-0.33838-0.12646-0.11279-0.19824-0.14013-0.06836-0.02734-0.19483-0.02735-0.12646 0-0.16748 0.01367-0.04102 0.01367-0.09912 0.04102-0.18115 0.09912-0.28027 0.2666-0.04102 0.08545-0.04102 0.25293l0 0.01367q0 0.14014 0.03418 0.21192 0.0376 0.06836 0.17774 0.22216 0.0957 0.11279 0.48876 0.50586l0.04102 0.04102q0.42041 0.42041 0.55371 0.54687 0.1333 0.12305 0.20166 0.15381 0.14014 0.06836 0.29395 0.05469 0.15381-0.01367 0.28027-0.09912 0.07178-0.05469 1.28857-1.27149 0.86816-0.86816 1.04932-1.06298 0.18457-0.19824 0.21192-0.27002 0.0957-0.27686-0.05811-0.52295-0.15381-0.24609-0.44775-0.25977-0.12646-0.01367-0.18116 0z" fill="#FFFFFF"></path>
                    </svg>
                  </div>
                  <svg data-pencil-name="Arrow" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                    <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#9AA0AB"></path>
                  </svg>
                </div>
                <div data-pencil-name="Card Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  الأمان والصيانة
                </div>
                <div data-pencil-name="Card Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  حماية، نسخ احتياطي، وتحديثات استباقية.
                </div>
                <div data-pencil-name="Tags" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      WAF
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Backup
                    </div>
                  </div>
                  <div data-pencil-name="Tag" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="Tag Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      SLA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="technologies" data-pencil-name="Tech Strip" class="[box-sizing:content-box] w-[1440px] h-[115px] shrink-0 flex flex-col gap-[12px] p-[28px_40px] justify-start items-start bg-[#FFFFFF] [border-width:1px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:-0.5px_0px_-0.5px_0px]">
          <div data-pencil-name="Tech Label" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold tracking-[0.6px] text-center [white-space:nowrap]">
            التقنيات التي نتقنها
          </div>
          <div data-pencil-name="Tech Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-center items-start">
            <div data-pencil-name="Tech Next.js" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Tech Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                Next.js
              </div>
            </div>
            <div data-pencil-name="Tech Laravel" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Tech Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                Laravel
              </div>
            </div>
            <div data-pencil-name="Tech Flutter" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Tech Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                Flutter
              </div>
            </div>
            <div data-pencil-name="Tech React" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Tech Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                React
              </div>
            </div>
            <div data-pencil-name="Tech Node.js" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Tech Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                Node.js
              </div>
            </div>
            <div data-pencil-name="Tech PostgreSQL" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Tech Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                PostgreSQL
              </div>
            </div>
            <div data-pencil-name="Tech AWS" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Tech Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                AWS
              </div>
            </div>
            <div data-pencil-name="Tech Docker" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Tech Text" class="text-[11px]/[normal] box-border text-[#070B1A] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                Docker
              </div>
            </div>
          </div>
        </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>