<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — تفاصيل الخدمة</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Service Detail Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Hero" class="box-border w-full h-fit shrink-0 flex flex-row gap-[32px] p-[40px] justify-start items-start bg-[#FFFFFF]">
          <div data-pencil-name="Hero Left" class="box-border w-[640px] shrink-0 h-fit flex flex-col gap-[14px] justify-start items-start">
            <div data-pencil-name="Badge" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[6px_12px] justify-start items-center bg-[#EEF3FF] [outline:1px_solid_#CBD5FF] [outline-offset:-0.5px] rounded-[999px]">
              <div data-pencil-name="Badge Text" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                الخدمة الأكثر طلباً — الأنظمة المخصصة
              </div>
            </div>
            <div data-pencil-name="Title" class="text-[40px]/[43px] box-border w-full text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left">
              أنظمة ERP و CRM
              <br>
              مصممة على مقاسك.
            </div>
            <div data-pencil-name="Desc" class="text-[13px]/[24px] box-border w-[520px] text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              نحلل عملك، نصمم النظام، ونبنيه ليخدمك لسنوات. لا قوالب عامة — كل ميزة تحل مشكلة حقيقية
              في شركتك.
            </div>
            <div data-pencil-name="Btns" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start">
              <div data-pencil-name="B1" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_22px] justify-start items-center bg-[#0A66FF] rounded-[999px]">
                <div data-pencil-name="B1 Text" class="text-[13px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  احجز استشارة مجانية
                </div>
                <svg data-pencil-name="B1 Icon" data-icon-name="arrow-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M6.90088 2.35156q-0.18115 0.02734-0.32129 0.16748-0.11279 0.11279-0.14697 0.28028-0.03418 0.16748 0.02051 0.32129 0.02734 0.08545 0.25976 0.3247 0.23242 0.23584 1.36377 1.37061 1.58252 1.58252 1.58252 1.59619 0 0.01367-3.45557 0.01367l-3.44531 0-0.08545 0.04102q-0.22217 0.11279-0.30078 0.33838-0.0752 0.22217 0.00684 0.43408 0.05811 0.0957 0.14013 0.18115 0.08545 0.08203 0.16748 0.11963 0.08545 0.03418 0.53321 0.03418l3.01123 0q3.42822 0 3.42822 0.01367 0 0.01367-1.58252 1.59619-1.13135 1.13477-1.36377 1.37402-0.23242 0.23584-0.25976 0.3213-0.05469 0.15381-0.02051 0.32128 0.03418 0.16748 0.14697 0.28028 0.18115 0.18115 0.42041 0.18115l0.04102 0q0.11279 0 0.19824-0.05469 0.14014-0.09912 0.51611-0.46484l1.68164-1.67822q2.1123-2.10205 2.15332-2.18409 0.07178-0.12646 0.07178-0.28027 0-0.15381-0.07178-0.28027-0.04102-0.08203-2.1499-2.18067-2.10547-2.10205-2.17725-2.13623-0.06836-0.0376-0.23584-0.06494-0.04102 0-0.12646 0.01367z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="B2" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_20px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <svg data-pencil-name="B2 Icon" data-icon-name="play" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M3.75293 1.20313q-0.5332 0.09912-0.91943 0.49218-0.38281 0.38965-0.46827 0.90918-0.02734 0.15381-0.02734 4.39551 0 4.2417 0.02734 4.39551 0.08545 0.51953 0.4751 0.90918 0.5332 0.54687 1.31934 0.51953 0.19482-0.01367 0.34179-0.04785 0.14697-0.0376 0.31446-0.10596 0.12646-0.05811 3.58887-2.07812 3.46582-2.02344 3.63671-2.13624 0.23584-0.15381 0.417-0.38281 0.18457-0.23242 0.27343-0.50586 0.09228-0.27344 0.09229-0.56738 0-0.29395-0.08545-0.57422-0.19482-0.5332-0.65625-0.85449-0.11279-0.08203-3.59912-2.11231-3.48633-2.03027-3.61279-2.10205-0.24951-0.12646-0.5503-0.16748-0.30078-0.04102-0.56738 0.01368z m0.56055 1.18945q0.12305 0.04443 3.62988 2.09521 3.51025 2.05078 3.5581 2.10205 0.04785 0.04785 0.10596 0.15723 0.02734 0.07178 0.04102 0.11963 0.01367 0.04785 0.01367 0.1333 0 0.08545-0.01367 0.1333-0.01367 0.04785-0.04102 0.11963-0.05811 0.10938-0.11621 0.16748-0.05469 0.05469-3.61621 2.12939-3.56152 2.07129-3.66748 2.09864-0.10596 0.02734-0.20508 0.01367-0.32129-0.07178-0.44775-0.33496l-0.04102-0.09912 0-8.45606 0.04102-0.09912q0.09912-0.2085 0.32129-0.29053 0.22559-0.08545 0.4375 0.01026z" fill="#070B1A"></path>
                </svg>
                <div data-pencil-name="B2 Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  شاهد كيف نعمل — 60 ثانية
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="Hero Right" class="box-border [flex:1_1_0] h-[340px] flex flex-col gap-0 justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[20px] overflow-hidden">
            <div data-pencil-name="Top" class="[box-sizing:content-box] w-[688px] h-[37.5px] shrink-0 flex flex-row gap-0 p-[0px_16px] justify-between items-center bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
              <div data-pencil-name="Top Title" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                ماذا نسلّم
              </div>
              <div data-pencil-name="Count" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[5px_10px] justify-start items-start bg-[#EEF3FF] rounded-[999px]">
                <div data-pencil-name="Count Text" class="text-[10px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  6 مراحل تسليم
                </div>
              </div>
            </div>
            <div data-pencil-name="Body" class="box-border w-full [flex:1_1_0] flex flex-col gap-[8px] p-[16px] justify-start items-start">
              <div data-pencil-name="IR 01" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="NB" class="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[8px]">
                  <svg data-pencil-name="Check" data-icon-name="check" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[12px] shrink-0 h-[12px]">
                    <path d="M11.48096 2.95313q-0.07178 0.01367-0.12989 0.0581-0.05469 0.04102-3.07617 3.06592l-3.0249 3.00781-1.28857-1.28857q-1.28857-1.28516-1.38086-1.32618-0.08887-0.04443-0.22217-0.04443-0.1333 0-0.23242 0.0376-0.0957 0.03418-0.18799 0.11279-0.08887 0.0752-0.1333 0.1709-0.02734 0.07178-0.03418 0.11279-0.00684 0.04102-0.00684 0.14014l0 0.04102q-0.01367 0.11279 0.04102 0.19824 0.07178 0.10938 0.36572 0.40332 0.19482 0.21191 0.96729 0.98096l1.49707 1.48339q0.28027 0.2666 0.38964 0.33838 0.07178 0.05469 0.18457 0.04102l0.09571 0.01367q0.07178 0 0.14013-0.02734 0.08545-0.07178 0.32129-0.28711 0.23926-0.21875 0.79981-0.76221l2.2832-2.2832q2.08496-2.09863 2.7002-2.71387 0.61524-0.61865 0.64599-0.68701 0.04102-0.08545 0.04102-0.23926 0-0.09912-0.00684-0.14014-0.00684-0.04102-0.03418-0.11279-0.04443-0.08203-0.13672-0.16406-0.08887-0.08545-0.18115-0.11963-0.08887-0.0376-0.20849-0.0376-0.11963 0-0.18799 0.02734z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Mid" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="IT" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    تحليل ووثيقة SRS
                  </div>
                  <div data-pencil-name="ID" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    ورشة اكتشاف + خارطة طريق
                  </div>
                </div>
                <div data-pencil-name="Done" class="text-[14px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  ✓
                </div>
              </div>
              <div data-pencil-name="IR 02" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="NB" class="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[8px]">
                  <svg data-pencil-name="Check" data-icon-name="check" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[12px] shrink-0 h-[12px]">
                    <path d="M11.48096 2.95313q-0.07178 0.01367-0.12989 0.0581-0.05469 0.04102-3.07617 3.06592l-3.0249 3.00781-1.28857-1.28857q-1.28857-1.28516-1.38086-1.32618-0.08887-0.04443-0.22217-0.04443-0.1333 0-0.23242 0.0376-0.0957 0.03418-0.18799 0.11279-0.08887 0.0752-0.1333 0.1709-0.02734 0.07178-0.03418 0.11279-0.00684 0.04102-0.00684 0.14014l0 0.04102q-0.01367 0.11279 0.04102 0.19824 0.07178 0.10938 0.36572 0.40332 0.19482 0.21191 0.96729 0.98096l1.49707 1.48339q0.28027 0.2666 0.38964 0.33838 0.07178 0.05469 0.18457 0.04102l0.09571 0.01367q0.07178 0 0.14013-0.02734 0.08545-0.07178 0.32129-0.28711 0.23926-0.21875 0.79981-0.76221l2.2832-2.2832q2.08496-2.09863 2.7002-2.71387 0.61524-0.61865 0.64599-0.68701 0.04102-0.08545 0.04102-0.23926 0-0.09912-0.00684-0.14014-0.00684-0.04102-0.03418-0.11279-0.04443-0.08203-0.13672-0.16406-0.08887-0.08545-0.18115-0.11963-0.08887-0.0376-0.20849-0.0376-0.11963 0-0.18799 0.02734z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Mid" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="IT" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    تصميم UX/UI
                  </div>
                  <div data-pencil-name="ID" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    Figma تفاعلي + موافقة
                  </div>
                </div>
                <div data-pencil-name="Done" class="text-[14px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  ✓
                </div>
              </div>
              <div data-pencil-name="IR 03" class="box-border w-full h-fit shrink-0 opacity-[0.7] flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="NB" class="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] rounded-[8px]">
                  <div data-pencil-name="NBT" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    03
                  </div>
                </div>
                <div data-pencil-name="Mid" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="IT" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    التطوير والاختبار
                  </div>
                  <div data-pencil-name="ID" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    رشيق — نسخ أسبوعية
                  </div>
                </div>
              </div>
              <div data-pencil-name="IR 04" class="box-border w-full h-fit shrink-0 opacity-[0.7] flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="NB" class="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F0EDE7] rounded-[8px]">
                  <div data-pencil-name="NBT" class="text-[10px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    04
                  </div>
                </div>
                <div data-pencil-name="Mid" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="IT" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                    الإطلاق والتدريب
                  </div>
                  <div data-pencil-name="ID" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    نشر + تدريب فريقك
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Features" class="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[40px] justify-start items-start bg-[#F0EDE7]">
          <div data-pencil-name="FTitle" class="text-[24px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
            ماذا يشمل النظام
          </div>
          <div data-pencil-name="Grid" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
            <div data-pencil-name="FC إدارة العملاء CRM" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="FI" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                <svg data-pencil-name="FI Icon" data-icon-name="users" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                  <path d="M4.84326 1.20313q-0.81006 0.11279-1.42871 0.61865-0.61523 0.50244-0.89551 1.24414-0.18115 0.48877-0.18115 1.02197 0 0.28027 0.04102 0.50586 0.04443 0.22217 0.14013 0.48877 0.15381 0.46143 0.46826 0.84766 0.31787 0.38281 0.7212 0.63574 0.36572 0.22559 0.73486 0.32471 0.37256 0.0957 0.80664 0.0957 0.22559 0 0.3623-0.01367 0.14014-0.01367 0.35206-0.05811 0.60156-0.15381 1.104-0.55713 0.50586-0.40674 0.7998-0.98096 0.19482-0.39307 0.26661-0.88183 0.02734-0.14014 0.02734-0.40674 0-0.2666-0.02734-0.40674-0.09912-0.65625-0.46485-1.20312-0.3623-0.54688-0.93652-0.89551-0.43408-0.2666-0.98096-0.36572-0.15381-0.02734-0.45459-0.03418-0.30078-0.00684-0.45459 0.02051z m4.34082 0.0581q-0.14014 0.04102-0.25293 0.14014-0.11279 0.0957-0.15381 0.2666-0.04102 0.16748 0 0.32129 0.04102 0.15381 0.15381 0.25293 0.11279 0.0957 0.33838 0.18115 0.24951 0.08203 0.40332 0.17432 0.15381 0.08887 0.30762 0.25976 0.33838 0.33496 0.45459 0.76904 0.11963 0.43408 0.01367 0.86817-0.10254 0.43408-0.41699 0.76904-0.31445 0.33496-0.7793 0.48877-0.19482 0.07178-0.28711 0.14356-0.08887 0.06836-0.16064 0.20849-0.05469 0.09912-0.05469 0.23926 0 0.13672 0.05469 0.23584 0.08545 0.19482 0.28027 0.29395 0.12646 0.05811 0.25293 0.05126 0.12646-0.01025 0.33496-0.07861 0.35205-0.11279 0.6084-0.27344 0.25977-0.16064 0.5127-0.42724 0.78271-0.78271 0.85449-1.84912 0.09912-1.18945-0.70069-2.12598-0.48877-0.58789-1.2749-0.85449-0.33496-0.11279-0.48877-0.05469z m-3.73926 1.09033q0.40674 0.02734 0.78272 0.28711 0.37939 0.25977 0.58105 0.65967 0.20508 0.39648 0.18457 0.88184-0.02051 0.48193-0.28711 0.86132-0.15381 0.23584-0.37939 0.41358-0.22217 0.17432-0.46143 0.27002-0.19482 0.05811-0.2871 0.07861-0.08887 0.02051-0.32813 0.02051-0.23926 0-0.33154-0.02051-0.08887-0.02051-0.28369-0.07861-0.39307-0.14014-0.68018-0.46826-0.28711-0.32813-0.3999-0.73487-0.10938-0.46143 0.01367-0.90918 0.12646-0.44775 0.45459-0.76904 0.33154-0.32471 0.79297-0.45117 0.08545-0.02734 0.24609-0.04785 0.16064-0.02051 0.21533-0.00684l0.16748 0.01367z m-2.35156 5.85156q-0.96387 0.14014-1.65088 0.82715-0.54687 0.54688-0.75537 1.31592-0.07178 0.23926-0.08545 0.44092-0.01367 0.20166-0.01367 0.82031l0 0.76904 0.04102 0.1128q0.05811 0.0957 0.14013 0.18115 0.21191 0.19482 0.50586 0.14697 0.29395-0.04785 0.42041-0.31445l0.04102-0.09912 0.01367-0.79639q0.01367-0.61865 0.02734-0.77246 0.01367-0.15381 0.07178-0.34863 0.14014-0.37939 0.46826-0.68018 0.32813-0.30078 0.73487-0.41357 0.15381-0.04102 0.53662-0.05469 0.38623-0.01367 1.66113-0.01367 1.2749 0 1.65771 0.01367 0.38623 0.01367 0.54004 0.05469 0.42041 0.11279 0.75538 0.43066 0.33838 0.31445 0.46142 0.71778 0.05811 0.16748 0.06494 0.3247 0.00684 0.15381 0.02051 0.7417l0.01367 0.79639 0.04102 0.09912q0.12646 0.2666 0.42041 0.31445 0.29395 0.04785 0.50586-0.14697 0.08203-0.08545 0.14013-0.18115l0.04102-0.1128 0-0.76904q0-0.61865-0.01367-0.82031-0.01367-0.20166-0.08545-0.44092-0.08203-0.32129-0.23584-0.61523-0.2666-0.51953-0.73828-0.90235-0.46826-0.38623-1.02539-0.54004l-0.04444-0.01367q-0.16748-0.05811-0.29394-0.07178-0.15381-0.01367-0.56055-0.01367l-1.60986-0.01367q-2.05762 0-2.21143 0.02734z m7.85449 0.05811q-0.23926 0.05469-0.36572 0.27344-0.12305 0.21533-0.05469 0.45459 0.05811 0.19482 0.21192 0.30761 0.06836 0.04102 0.28027 0.12647 0.24951 0.08203 0.40332 0.17432 0.15381 0.08887 0.32471 0.27343 0.33496 0.34863 0.44775 0.78272 0.02734 0.11279 0.03418 0.24609 0.00684 0.1333 0.02051 0.70752l0.01367 0.79639 0.04102 0.09912q0.12646 0.2666 0.42041 0.31445 0.29395 0.04785 0.50586-0.14697 0.08203-0.08545 0.14013-0.18115l0.04102-0.1128 0.01367-0.64599q0-0.64258-0.02734-0.95703-0.02734-0.31445-0.12647-0.59473-0.14014-0.42041-0.42724-0.81006-0.28711-0.39307-0.64942-0.65967-0.31103-0.22559-0.69726-0.35888-0.38281-0.1333-0.5503-0.08887z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="FCT" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                إدارة العملاء CRM
              </div>
              <div data-pencil-name="FCD" class="text-[11px]/[18px] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                تتبع العملاء، الفرص، والتواصل في مكان واحد.
              </div>
            </div>
            <div data-pencil-name="FC المخزون والمشتريات" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="FI" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                <svg data-pencil-name="FI Icon" data-icon-name="package" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                  <path d="M6.65137 0.61523q-0.22559 0.05811-0.43408 0.15381-0.14014 0.07178-2.16358 1.23389-2.02344 1.16211-2.10889 1.2168-0.58789 0.39307-0.74169 1.07666-0.02734 0.11279-0.02735 0.49218l0 2.21143 0 2.14307q0 0.43408 0.02734 0.52978 0.07178 0.35205 0.26661 0.63916 0.19482 0.28711 0.48877 0.48194 0.18457 0.11279 2.19775 1.26806 2.0166 1.15527 2.12939 1.19629 0.19482 0.08203 0.34864 0.11963 0.15723 0.03418 0.37256 0.03418 0.21875 0 0.39306-0.04102 0.17432-0.04443 0.38281-0.1538 0.15381-0.07178 2.12598-1.19629 1.97559-1.12793 2.11572-1.22705 0.31104-0.19482 0.50586-0.48194 0.19482-0.28711 0.2666-0.63916 0.02734-0.0957 0.02735-0.52978l0-2.14307 0-2.14307q0-0.43408-0.02735-0.52978-0.07178-0.32471-0.25976-0.61865-0.18799-0.29395-0.45459-0.4751-0.12647-0.08203-2.15674-1.24414-2.03027-1.16211-2.18408-1.23389-0.18115-0.08203-0.32129-0.11621-0.14014-0.0376-0.37939-0.0376-0.28027 0-0.38965 0.01367z m0.57422 1.18946q0.0957 0.04443 1.96533 1.10742 1.86963 1.06299 1.86963 1.07666 0 0.01367-0.70752 0.41357-0.70752 0.3999-0.73487 0.39991-0.02734 0-2.03711-1.14844-2.00977-1.14844-2.00976-1.16211 0-0.01367 0.48193-0.28711 0.48535-0.27344 0.63916-0.35547 0.12646-0.07178 0.18116-0.08545 0.05811-0.01367 0.17431 0 0.11963 0.01367 0.17774 0.04102z m-0.81348 2.52246q2.03027 1.16211 2.02344 1.16894-0.00684 0.00684-0.70752 0.41358-0.44775 0.26318-0.58789 0.33496-0.14014 0.06836-0.17432 0.05469-0.03418-0.01367-2.03027-1.15528-1.99609-1.1416-1.9961-1.14843 0-0.00684 0.71436-0.417 0.71436-0.41357 0.71435-0.41357l2.04395 1.16211z m-2.03027 1.8457l2.04394 1.16211 0 2.33789q0 2.33789-0.01367 2.32422l-1.91748-1.09033q-1.91748-1.09375-1.98242-1.15528-0.06152-0.06494-0.11963-0.17431l-0.05469-0.11279 0-2.2251q-0.01367-2.24219 0-2.24219 0.01367 0 2.04395 1.17578z m7.28027 1.06641l0 2.2251-0.05469 0.11279q-0.05811 0.10938-0.12305 0.17431-0.06152 0.06152-1.979 1.15528l-1.91748 1.09033q-0.01367 0.01367-0.01367-2.32422l0-2.33789 3.15137-1.80469q0.92285-0.51953 0.93652-0.52636 0.01367-0.00684 0 2.23535z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="FCT" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                المخزون والمشتريات
              </div>
              <div data-pencil-name="FCD" class="text-[11px]/[18px] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                مخزون لحظي، تنبيهات نقص، وتقارير حركة.
              </div>
            </div>
            <div data-pencil-name="FC التقارير والتحليلات" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="FI" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                <svg data-pencil-name="FI Icon" data-icon-name="chart-column" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                  <path d="M1.59619 1.18945q-0.25293 0.08545-0.37939 0.30762l-0.04102 0.08545 0.01367 9.12598q0 0.70068 0.02735 0.78613 0.14014 0.48877 0.46826 0.82031 0.33154 0.32813 0.82031 0.46826 0.08545 0.02734 0.78613 0.02735l9.12598 0.01367 0.08545-0.04102q0.06836-0.04443 0.15039-0.12646 0.08545-0.08545 0.12646-0.16065 0.04443-0.07861 0.04444-0.24609 0-0.16748-0.04102-0.25293-0.09912-0.16748-0.28027-0.2666l-0.08545-0.05469-8.49707-0.01367q-0.84082 0-1.08008-0.01367-0.15381-0.01367-0.20849-0.05811l-0.02735-0.01367q-0.14014-0.0957-0.22558-0.26318l-0.04102-0.09913-0.01367-9.63183-0.04102-0.08545q-0.09912-0.18115-0.28027-0.2666-0.08545-0.04102-0.22559-0.04785-0.14014-0.00684-0.18115 0.00683z m5.87891 1.16211q-0.12646 0.01367-0.2461 0.10596-0.11621 0.08887-0.17431 0.21533l-0.04102 0.09912-0.01367 6.43946q0.01367 0.62891 0.02734 0.81347 0.01367 0.14014 0.05811 0.19483l0.02734 0.02734q0.15381 0.22559 0.417 0.24609 0.2666 0.02051 0.46484-0.17431 0.12646-0.12646 0.15381-0.29395 0.02734-0.11279 0.02734-3.61279 0-3.5-0.02734-3.59912-0.04102-0.23584-0.23242-0.36914-0.18799-0.1333-0.44092-0.09229z m2.87109 2.33789q-0.25293 0.08545-0.37939 0.30762l-0.04102 0.08545 0 4.94238 0.02734 0.0957q0.08545 0.21192 0.29395 0.32471 0.09912 0.04102 0.25293 0.04102 0.15381 0 0.25293-0.04102 0.2085-0.11279 0.29394-0.32471l0.02735-0.0957 0-4.94238-0.04102-0.08545q-0.09912-0.18115-0.28027-0.2666-0.08545-0.04102-0.22559-0.04785-0.14014-0.00684-0.18115 0.00683z m-5.76953 2.91211q-0.18115 0.01367-0.31445 0.14698-0.1333 0.1333-0.16065 0.31445-0.02734 0.09912-0.02734 0.98779 0 0.88867 0.02734 0.97412 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609 0.07178-0.08203 0.08545-0.15723 0.01367-0.07861 0.02734-0.3042l0-1.72265-0.04102-0.0957q-0.08545-0.21191-0.25293-0.30762-0.16748-0.09912-0.37939-0.05811z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="FCT" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                التقارير والتحليلات
              </div>
              <div data-pencil-name="FCD" class="text-[11px]/[18px] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                لوحات تحكم تنبض بالأرقام لحظياً.
              </div>
            </div>
            <div data-pencil-name="FC الصلاحيات والأمان" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="FI" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                <svg data-pencil-name="FI Icon" data-icon-name="lock" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                  <path d="M6.77441 0.60156q-0.72803 0.02734-1.38769 0.3794-0.65625 0.34863-1.12451 0.92285-0.46826 0.57422-0.64942 1.28857l0 0.01367q-0.07178 0.29395-0.08545 0.48536-0.01367 0.18799-0.02734 1.02539l0 1.10742-0.2666 0q-0.40674 0-0.63916 0.04443-0.229 0.04102-0.45117 0.15039-0.32471 0.16748-0.56397 0.44776-0.23584 0.28027-0.34863 0.64599l-0.05469 0.15381 0 4.7168 0.05469 0.15381q0.15723 0.51953 0.56055 0.86132 0.40674 0.3418 0.93994 0.39991 0.14014 0.02734 4.26904 0.02734 4.12891 0 4.26904-0.02734 0.30762-0.02734 0.58789-0.16748 0.32471-0.15381 0.56055-0.44092 0.23926-0.28711 0.35205-0.65283l0.05469-0.15381 0-4.7168-0.05469-0.15381q-0.11279-0.36572-0.35205-0.64599-0.23584-0.28027-0.56055-0.44776-0.22217-0.10938-0.45459-0.15039-0.229-0.04443-0.63574-0.04443l-0.2666 0 0-1.13477q-0.01367-0.81006-0.02734-0.99804-0.01367-0.19141-0.08545-0.47168l0-0.02735q-0.18115-0.71436-0.66651-1.30224-0.48193-0.58789-1.15185-0.93653-0.82715-0.40674-1.79444-0.35205z m0.70069 1.20313q0.75537 0.15381 1.2749 0.7417 0.3623 0.40674 0.50244 0.92627 0.05811 0.19482 0.06494 0.41357 0.00684 0.21533 0.00684 0.9707l0 0.96729-4.64844 0 0-1.06299q0-0.82715 0.01367-1.0083 0.01367-0.18457 0.09912-0.40674 0.22217-0.64258 0.74854-1.06982 0.52637-0.42725 1.19629-0.5127 0.14014-0.01367 0.3623 0 0.22559 0.01367 0.3794 0.04102z m3.85205 5.25q0.08203 0.04443 0.15723 0.12304 0.07861 0.0752 0.11279 0.15381 0.0376 0.0752 0.0581 0.19483 0.02051 0.11621 0.00684 2.19092l0 1.6372q0 0.3623-0.02734 0.48877-0.01367 0.08545-0.07178 0.14014l-0.01367 0.02734q-0.11279 0.12646-0.26661 0.19824l-0.0957 0.04102-8.37402 0-0.0957-0.04102q-0.15381-0.0581-0.26661-0.19824l-0.01367-0.02734q-0.05811-0.06836-0.07178-0.14014-0.02734-0.12646-0.02734-0.48877l0-1.65088q-0.01367-2.08838 0.01367-2.20117 0.01367-0.18115 0.1333-0.31445 0.11963-0.1333 0.28711-0.17432 0.06836-0.01367 4.25537-0.01367l4.20069 0.01367 0.09912 0.04102z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="FCT" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                الصلاحيات والأمان
              </div>
              <div data-pencil-name="FCD" class="text-[11px]/[18px] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                أدوار دقيقة وتشفير كامل للبيانات.
              </div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Pricing CTA" class="[box-sizing:content-box] w-[1440px] h-[113.5px] shrink-0 flex flex-row gap-[20px] p-[32px_40px] justify-start items-start bg-[#FFFFFF] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:-0.5px_0px_0px_0px]">
          <div data-pencil-name="Left" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] justify-start items-start">
            <div data-pencil-name="PM Title" class="text-[16px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              يبدأ من 35,000 ﷼ — دفعات مرحلية
            </div>
            <div data-pencil-name="PM Desc" class="text-[12px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              خطة زمنية 8-12 أسبوع مع دعم 6 أشهر مجاناً بعد الإطلاق.
            </div>
          </div>
          <div data-pencil-name="Right" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center">
            <div data-pencil-name="PM Btn" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_24px] justify-start items-center bg-[#0A66FF] rounded-[999px]">
              <div data-pencil-name="PM Btn Text" class="text-[13px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                اطلب عرض سعر مفصّل
              </div>
              <svg data-pencil-name="PM Icon" data-icon-name="arrow-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                <path d="M6.90088 2.35156q-0.18115 0.02734-0.32129 0.16748-0.11279 0.11279-0.14697 0.28028-0.03418 0.16748 0.02051 0.32129 0.02734 0.08545 0.25976 0.3247 0.23242 0.23584 1.36377 1.37061 1.58252 1.58252 1.58252 1.59619 0 0.01367-3.45557 0.01367l-3.44531 0-0.08545 0.04102q-0.22217 0.11279-0.30078 0.33838-0.0752 0.22217 0.00684 0.43408 0.05811 0.0957 0.14013 0.18115 0.08545 0.08203 0.16748 0.11963 0.08545 0.03418 0.53321 0.03418l3.01123 0q3.42822 0 3.42822 0.01367 0 0.01367-1.58252 1.59619-1.13135 1.13477-1.36377 1.37402-0.23242 0.23584-0.25976 0.3213-0.05469 0.15381-0.02051 0.32128 0.03418 0.16748 0.14697 0.28028 0.18115 0.18115 0.42041 0.18115l0.04102 0q0.11279 0 0.19824-0.05469 0.14014-0.09912 0.51611-0.46484l1.68164-1.67822q2.1123-2.10205 2.15332-2.18409 0.07178-0.12646 0.07178-0.28027 0-0.15381-0.07178-0.28027-0.04102-0.08203-2.1499-2.18067-2.10547-2.10205-2.17725-2.13623-0.06836-0.0376-0.23584-0.06494-0.04102 0-0.12646 0.01367z" fill="#FFFFFF"></path>
              </svg>
            </div>
          </div>
        </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>