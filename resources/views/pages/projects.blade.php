<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — معرض الأعمال والمشاريع</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Projects Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Header" class="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[48px_40px] justify-start items-center bg-[#FFFFFF]">
          <div data-pencil-name="Eyebrow" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
            أعمالنا — مشاريع نبنيها بفخر
          </div>
          <div data-pencil-name="Title" class="text-[42px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
            برمجيات أثبتت نجاحها في السوق
          </div>
          <div data-pencil-name="Desc" class="text-[13px]/[23px] box-border w-[600px] text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-center">
            مختارات من 120+ مشروع — متاجر، أنظمة مؤسسية، وتطبيقات جوال غيّرت طريقة عمل شركائنا.
          </div>
          <div data-pencil-name="Filters" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
            <div data-pencil-name="Filter الكل" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_16px] justify-start items-start bg-[#070B1A] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Filter Text" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                الكل
              </div>
            </div>
            <div data-pencil-name="Filter المتاجر" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Filter Text" class="text-[12px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                المتاجر
              </div>
            </div>
            <div data-pencil-name="Filter الأنظمة" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Filter Text" class="text-[12px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                الأنظمة
              </div>
            </div>
            <div data-pencil-name="Filter التطبيقات" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Filter Text" class="text-[12px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                التطبيقات
              </div>
            </div>
            <div data-pencil-name="Filter السحابة" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Filter Text" class="text-[12px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                السحابة
              </div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Projects Grid" class="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[0px_40px_40px_40px] justify-start items-start bg-[#FCFBF8]">
          <div data-pencil-name="Row1" class="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start">
            <div data-pencil-name="Proj نُخبة — " class="box-border w-[720px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[20px] overflow-hidden">
              <div data-pencil-name="Thumb" class="box-border w-full h-[220px] shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#070B1A]">
                <div data-pencil-name="Thumb Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="Cat Pill" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_12px] justify-start items-start bg-[#FFFFFF] rounded-[999px]">
                    <div data-pencil-name="Cat" class="text-[10px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                      المتاجر • 2024
                    </div>
                  </div>
                  <div data-pencil-name="Arrow" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] rounded-[999px]">
                    <svg data-pencil-name="Arr" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                      <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#070B1A"></path>
                    </svg>
                  </div>
                </div>
                <div data-pencil-name="Mock" class="box-border w-full [flex:1_1_0] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <div data-pencil-name="M Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#FF5F56] rounded-[50%]"></div>
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#FFBD2E] rounded-[50%]"></div>
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#27C93F] rounded-[50%]"></div>
                  </div>
                  <div data-pencil-name="M Body" class="box-border w-full [flex:1_1_0] flex flex-row gap-[12px] justify-start items-start">
                    <div data-pencil-name="M Side" class="box-border w-[80px] shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start">
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]"></div>
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]"></div>
                    </div>
                    <div data-pencil-name="M Main" class="box-border [flex:1_1_0] h-full flex flex-col gap-[8px] justify-start items-start">
                      <div data-pencil-name="Line1" class="box-border w-full h-[14px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[6px]"></div>
                      <div data-pencil-name="Line2" class="box-border w-[180px] h-[10px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[6px]"></div>
                      <div data-pencil-name="Stats Mini" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[8px]"></div>
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[8px]"></div>
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[8px]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[20px] justify-start items-start">
                <div data-pencil-name="Proj Title" class="text-[15px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  نُخبة — منصة تجارة متكاملة
                </div>
                <div data-pencil-name="Proj Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  متجر headless مع دفع، شحن، ومخزون موحّد. +60% مبيعات في 3 أشهر.
                </div>
                <div data-pencil-name="Tags" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="TT" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="TT Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Next.js
                    </div>
                  </div>
                  <div data-pencil-name="TT" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="TT Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Stripe
                    </div>
                  </div>
                  <div data-pencil-name="TT" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="TT Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      PostgreSQL
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="Row2" class="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start">
            <div data-pencil-name="Proj ميراس — " class="box-border [flex:1_1_0] h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[20px] overflow-hidden">
              <div data-pencil-name="Thumb" class="box-border w-full h-[180px] shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#070B1A12]">
                <div data-pencil-name="Thumb Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="Cat Pill" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_12px] justify-start items-start bg-[#FFFFFF] rounded-[999px]">
                    <div data-pencil-name="Cat" class="text-[10px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                      الأنظمة • 2024
                    </div>
                  </div>
                  <div data-pencil-name="Arrow" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] rounded-[999px]">
                    <svg data-pencil-name="Arr" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                      <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#070B1A"></path>
                    </svg>
                  </div>
                </div>
                <div data-pencil-name="Mock" class="box-border w-full [flex:1_1_0] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <div data-pencil-name="M Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#FF5F56] rounded-[50%]"></div>
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#FFBD2E] rounded-[50%]"></div>
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#27C93F] rounded-[50%]"></div>
                  </div>
                  <div data-pencil-name="M Body" class="box-border w-full [flex:1_1_0] flex flex-row gap-[12px] justify-start items-start">
                    <div data-pencil-name="M Side" class="box-border w-[80px] shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start">
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]"></div>
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]"></div>
                    </div>
                    <div data-pencil-name="M Main" class="box-border [flex:1_1_0] h-full flex flex-col gap-[8px] justify-start items-start">
                      <div data-pencil-name="Line1" class="box-border w-full h-[14px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[6px]"></div>
                      <div data-pencil-name="Line2" class="box-border w-[180px] h-[10px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[6px]"></div>
                      <div data-pencil-name="Stats Mini" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[8px]"></div>
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[8px]"></div>
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[8px]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[20px] justify-start items-start">
                <div data-pencil-name="Proj Title" class="text-[15px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  ميراس — نظام إدارة العمليات
                </div>
                <div data-pencil-name="Proj Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  CRM + إدارة مشاريع + فوترة في نظام واحد.
                </div>
                <div data-pencil-name="Tags" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="TT" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="TT Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Laravel
                    </div>
                  </div>
                  <div data-pencil-name="TT" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="TT Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Vue
                    </div>
                  </div>
                  <div data-pencil-name="TT" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="TT Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      AWS
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Proj دليل — ت" class="box-border [flex:1_1_0] h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[20px] overflow-hidden">
              <div data-pencil-name="Thumb" class="box-border w-full h-[180px] shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#7C3AED12]">
                <div data-pencil-name="Thumb Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                  <div data-pencil-name="Cat Pill" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_12px] justify-start items-start bg-[#FFFFFF] rounded-[999px]">
                    <div data-pencil-name="Cat" class="text-[10px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                      التطبيقات • 2023
                    </div>
                  </div>
                  <div data-pencil-name="Arrow" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] rounded-[999px]">
                    <svg data-pencil-name="Arr" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                      <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#070B1A"></path>
                    </svg>
                  </div>
                </div>
                <div data-pencil-name="Mock" class="box-border w-full [flex:1_1_0] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <div data-pencil-name="M Top" class="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#FF5F56] rounded-[50%]"></div>
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#FFBD2E] rounded-[50%]"></div>
                    <div data-pencil-name="dc" class="box-border w-[8px] shrink-0 h-[8px] bg-[#27C93F] rounded-[50%]"></div>
                  </div>
                  <div data-pencil-name="M Body" class="box-border w-full [flex:1_1_0] flex flex-row gap-[12px] justify-start items-start">
                    <div data-pencil-name="M Side" class="box-border w-[80px] shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start">
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[999px]"></div>
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]"></div>
                      <div data-pencil-name="SLine" class="box-border w-full h-[8px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[999px]"></div>
                    </div>
                    <div data-pencil-name="M Main" class="box-border [flex:1_1_0] h-full flex flex-col gap-[8px] justify-start items-start">
                      <div data-pencil-name="Line1" class="box-border w-full h-[14px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[6px]"></div>
                      <div data-pencil-name="Line2" class="box-border w-[180px] h-[10px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[6px]"></div>
                      <div data-pencil-name="Stats Mini" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[8px]"></div>
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#0A66FF] rounded-[8px]"></div>
                        <div data-pencil-name="SM" class="box-border [flex:1_1_0] h-[40px] flex flex-row gap-0 justify-start items-start bg-[#F0EDE7] rounded-[8px]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[20px] justify-start items-start">
                <div data-pencil-name="Proj Title" class="text-[15px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  دليل — تطبيق خدمات منزلية
                </div>
                <div data-pencil-name="Proj Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                  تطبيق جوال بـ 4.8 نجوم و 50k تحميل في شهر.
                </div>
                <div data-pencil-name="Tags" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
                  <div data-pencil-name="TT" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="TT Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Flutter
                    </div>
                  </div>
                  <div data-pencil-name="TT" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F0EDE7] rounded-[999px]">
                    <div data-pencil-name="TT Text" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Firebase
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="More" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[16px_0px_0px_0px] justify-center items-start">
            <div data-pencil-name="More Btn" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_28px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="More Text" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                عرض جميع الأعمال — 120 مشروع
              </div>
              <svg data-pencil-name="More Icon" data-icon-name="arrow-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                <path d="M6.90088 2.35156q-0.18115 0.02734-0.32129 0.16748-0.11279 0.11279-0.14697 0.28028-0.03418 0.16748 0.02051 0.32129 0.02734 0.08545 0.25976 0.3247 0.23242 0.23584 1.36377 1.37061 1.58252 1.58252 1.58252 1.59619 0 0.01367-3.45557 0.01367l-3.44531 0-0.08545 0.04102q-0.22217 0.11279-0.30078 0.33838-0.0752 0.22217 0.00684 0.43408 0.05811 0.0957 0.14013 0.18115 0.08545 0.08203 0.16748 0.11963 0.08545 0.03418 0.53321 0.03418l3.01123 0q3.42822 0 3.42822 0.01367 0 0.01367-1.58252 1.59619-1.13135 1.13477-1.36377 1.37402-0.23242 0.23584-0.25976 0.3213-0.05469 0.15381-0.02051 0.32128 0.03418 0.16748 0.14697 0.28028 0.18115 0.18115 0.42041 0.18115l0.04102 0q0.11279 0 0.19824-0.05469 0.14014-0.09912 0.51611-0.46484l1.68164-1.67822q2.1123-2.10205 2.15332-2.18409 0.07178-0.12646 0.07178-0.28027 0-0.15381-0.07178-0.28027-0.04102-0.08203-2.1499-2.18067-2.10547-2.10205-2.17725-2.13623-0.06836-0.0376-0.23584-0.06494-0.04102 0-0.12646 0.01367z" fill="#070B1A"></path>
              </svg>
            </div>
          </div>
        </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>