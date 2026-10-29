<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — تواصل معنا</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Contact Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-row gap-[32px] p-[40px] justify-start items-start">
          <div data-pencil-name="Form Card" class="box-border w-[760px] shrink-0 h-fit [box-shadow:0px_12px_24px_#070B1A07] flex flex-col gap-[20px] p-[32px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[20px]">
            <a href="/contact" style="text-decoration:none; color:inherit; display:contents;"><div data-pencil-name="Form Eyebrow" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              تواصل معنا
            </div></a>
            <div data-pencil-name="Form Title" class="text-[32px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              احكِ لنا عن مشروعك
            </div>
            <div data-pencil-name="Form Desc" class="text-[13px]/[22px] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              نرد خلال ساعتين في أوقات العمل. أو احجز استشارة 30 دقيقة مباشرة.
            </div>
            <div data-pencil-name="Field Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
              <div data-pencil-name="Field الاسم الكامل" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start">
                <div data-pencil-name="Label" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  الاسم الكامل
                </div>
                <div data-pencil-name="Input" class="box-border w-full h-[44px] shrink-0 flex flex-row gap-0 p-[0px_14px] justify-start items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="PH" class="text-[12px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    أحمد محمد
                  </div>
                </div>
              </div>
              <div data-pencil-name="Field البريد الإلكتروني" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start">
                <div data-pencil-name="Label" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  البريد الإلكتروني
                </div>
                <div data-pencil-name="Input" class="box-border w-full h-[44px] shrink-0 flex flex-row gap-0 p-[0px_14px] justify-start items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="PH" class="text-[12px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    ahmed@company.sa
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Field Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
              <div data-pencil-name="Field رقم الجوال" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start">
                <div data-pencil-name="Label" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  رقم الجوال
                </div>
                <div data-pencil-name="Input" class="box-border w-full h-[44px] shrink-0 flex flex-row gap-0 p-[0px_14px] justify-start items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="PH" class="text-[12px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    +966 5X XXX XXXX
                  </div>
                </div>
              </div>
              <div data-pencil-name="Field نوع المشروع" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start">
                <div data-pencil-name="Label" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  نوع المشروع
                </div>
                <div data-pencil-name="Input" class="box-border w-full h-[44px] shrink-0 flex flex-row gap-0 p-[0px_14px] justify-start items-center bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                  <div data-pencil-name="PH" class="text-[12px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    اختر الخدمة — نظام / تطبيق / متجر
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Budget Row" class="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
              <div data-pencil-name="Label" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                الميزانية التقريبية
              </div>
              <div data-pencil-name="Opts" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
                <div data-pencil-name="Opt &lt; 20K" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[10px_16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                  <div data-pencil-name="Opt Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    &lt; 20K
                  </div>
                </div>
                <div data-pencil-name="Opt 20K - 50K" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[10px_16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                  <div data-pencil-name="Opt Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    20K - 50K
                  </div>
                </div>
                <div data-pencil-name="Opt 50K - 150K" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[10px_16px] justify-start items-start bg-[#070B1A] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                  <div data-pencil-name="Opt Text" class="text-[11px]/[normal] box-border text-[#FFFFFF] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    50K - 150K
                  </div>
                </div>
                <div data-pencil-name="Opt 150K+" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[10px_16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                  <div data-pencil-name="Opt Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    150K+
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Msg" class="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
              <div data-pencil-name="Label" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                تفاصيل المشروع
              </div>
              <div data-pencil-name="Textarea" class="box-border w-full h-[90px] shrink-0 flex flex-col gap-0 p-[14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[10px]">
                <div data-pencil-name="PH2" class="text-[12px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  صف فكرتك، أهدافك، والجدول الزمني المتوقع...
                </div>
              </div>
            </div>
            <div data-pencil-name="Send Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
              <div data-pencil-name="Send" class="box-border [flex:1_1_0] h-fit flex flex-row gap-[8px] p-[14px_0px] justify-center items-center bg-[#0A66FF] rounded-[999px]">
                <div data-pencil-name="Send Text" class="text-[13px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  إرسال الطلب — نرد خلال ساعتين
                </div>
                <svg data-pencil-name="Send Icon" data-icon-name="send" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M12.43115 0.58789q-0.01367 0.01367-0.02734 0.01367-0.04102 0-0.60156 0.18115l-5.19532 1.78077q-5.40381 1.8457-5.53027 1.90381-0.26318 0.12305-0.39648 0.38281-0.1333 0.25977-0.07862 0.52636 0.02734 0.19482 0.14698 0.37256 0.11963 0.17432 0.2871 0.27002 0.09912 0.04443 2.39942 0.96729 2.30371 0.92285 2.40283 0.98096 0.14014 0.06836 0.2085 0.22216 0.04443 0.05811 0.96728 2.36182 0.92285 2.30029 0.96729 2.41308 0.0957 0.16748 0.27002 0.28711 0.17773 0.11963 0.37256 0.16065 0.23926 0.02734 0.46826-0.06836 0.23242-0.09912 0.35888-0.29736 0.08203-0.0957 0.15381-0.30762 0.2085-0.57422 1.99951-5.83106 1.79443-5.25684 1.80811-5.32519 0.01367-0.09912 0-0.21191-0.04101-0.3623-0.32813-0.59131-0.28711-0.23242-0.65283-0.19141z m-3.87597 4.0332l-2.26954 2.25245-1.98925-0.79639q-1.98584-0.7998-1.97217-0.81348l8.46973-2.89844q0.01367 0-2.23877 2.25586z m2.92578-0.93994q-0.09912 0.2666-1.45606 4.22803-1.2749 3.75293-1.28857 3.7666-0.01367 0.01367-0.57422-1.38428l-1.03565-2.57714 4.50831-4.50831q0 0-0.15381 0.4751z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="Secure" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                🔒 بياناتك محمية ولن تُشارك
              </div>
            </div>
          </div>
          <div data-pencil-name="Side" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[16px] justify-start items-start">
            <div data-pencil-name="Info Card" class="box-border w-full h-fit shrink-0 [box-shadow:0px_12px_24px_#070B1A18] flex flex-col gap-[16px] p-[24px] justify-start items-start bg-[#070B1A] rounded-[20px]">
              <div data-pencil-name="Info Title" class="text-[14px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                معلومات التواصل
              </div>
              <div data-pencil-name="Info Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
                <div data-pencil-name="IC" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#1E2535] rounded-[10px]">
                  <svg data-pencil-name="II" data-icon-name="mail" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                    <path d="M2.05762 1.77734q-0.28027 0.04102-0.53321 0.16748-0.34863 0.19824-0.58789 0.50586-0.23584 0.30762-0.32129 0.70069-0.01367 0.10938-0.02734 0.66992l0 3.17871 0 3.17871q0.01367 0.56055 0.02734 0.66992 0.11279 0.5332 0.50245 0.90577 0.39307 0.36914 0.92627 0.46826 0.16748 0.02734 4.95605 0.02734 4.78857 0 4.95605-0.02734 0.5332-0.09912 0.92286-0.46826 0.39307-0.37256 0.50586-0.90577 0.01367-0.10938 0.02734-0.66992l0-3.17871 0-3.17871q-0.01367-0.56055-0.02734-0.66992-0.12647-0.54688-0.53321-0.92285-0.40674-0.37939-0.95019-0.46485-0.1709-0.01367-4.93897-0.01367-4.76465 0-4.90478 0.02734z m9.81298 1.17579q0.09912 0.04443 0.18116 0.12304 0.08545 0.0752 0.12646 0.16065 0.04443 0.08203 0.05127 0.12988 0.00684 0.04785 0.00684 0.18799l0 0.21191-2.46436 1.58252q-2.46436 1.56543-2.53613 1.60303-0.06836 0.03418-0.16748 0.03418l-0.02734 0.01367q-0.0957 0.01367-0.2085-0.04102-0.15381-0.07178-0.65967-0.37939l-4.40918-2.81299 0-0.21191q0-0.14014 0.00684-0.18799 0.00684-0.04785 0.04101-0.12305 0.0376-0.07861 0.12647-0.16064 0.09229-0.08545 0.16748-0.1128 0.07861-0.03076 0.70752-0.04443l4.18701 0 4.18701 0q0.61523 0 0.68359 0.02735z m-5.63964 5.02783q0.22217 0.10938 0.46142 0.15381 0.09912 0.02734 0.30762 0.02734 0.2085 0 0.30762-0.02734 0.30762-0.05811 0.54687-0.19825 0.14014-0.08203 2.26612-1.42529l2.12939-1.36035-0.01367 5.50293-0.04102 0.09912q-0.11279 0.2085-0.3247 0.29395l-0.09571 0.02734-9.5498 0-0.09571-0.02734q-0.21191-0.08545-0.3247-0.29395l-0.04102-0.09912-0.01367-5.50293 2.17041 1.37402q2.17041 1.38428 2.31055 1.45606z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Col" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="IL" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    البريد
                  </div>
                  <div data-pencil-name="IV" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    hello@amtdex.sa
                  </div>
                </div>
              </div>
              <div data-pencil-name="Info Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
                <div data-pencil-name="IC" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#1E2535] rounded-[10px]">
                  <svg data-pencil-name="II" data-icon-name="phone" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                    <path d="M2.15674 0.60156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.36573-0.30762 0.32129-0.43408 0.78271-0.02734 0.12646-0.03418 0.21191-0.00684 0.08203-0.00684 0.36231 0.01367 1.65088 0.53662 3.26074 0.52637 1.60986 1.49365 2.98389 0.5332 0.7417 1.2168 1.42871 0.68701 0.68359 1.42871 1.2168 1.37402 0.96729 2.99072 1.49365 1.6167 0.52295 3.25391 0.53662 0.28027 0 0.3623-0.00684 0.08545-0.00683 0.21192-0.03418 0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-1.0083q0.01367-0.67334 0-0.92627-0.01367-0.30762-0.05127-0.46826-0.03418-0.16064-0.11621-0.35547-0.18115-0.36572-0.50586-0.61524-0.32129-0.25293-0.72803-0.33838-0.10938-0.01367-0.29394-0.02734l-0.92285 0q-0.84082 0-1.0459 0.01367-0.20166 0.01367-0.38282 0.07178-0.28027 0.08203-0.49218 0.25293-0.2085 0.16748-0.417 0.44434l-0.14013 0.17089-0.11279-0.04443q-0.22217-0.10938-0.54688-0.31103-0.32129-0.20508-0.51611-0.35889-1.07666-0.81348-1.80469-1.91748-0.09912-0.15723-0.2666-0.45117-0.16748-0.29395-0.18457-0.32813-0.01367-0.03418 0.15722-0.16064 0.52979-0.39307 0.69727-0.93653 0.07178-0.18457 0.07861-0.3999 0.00684-0.21875 0.00684-1.10058l0-1.10401-0.05469-0.15381q-0.11279-0.36572-0.35205-0.64599-0.23584-0.28027-0.56055-0.44776-0.29395-0.14014-0.6289-0.16748-0.16748-0.02734-1.02881-0.02734-0.86133 0-1.04248 0.02734z m2.17041 1.20313q0.08203 0.04443 0.15722 0.12304 0.07861 0.0752 0.11963 0.16065 0.04443 0.08203 0.05811 0.30078 0.01367 0.21533 0 0.91602l0 0.71435q-0.01367 0.2085-0.03418 0.28027-0.02051 0.06836-0.07861 0.13672l-0.01368 0q-0.05469 0.08545-0.25976 0.23243-0.20166 0.14697-0.29395 0.25292-0.08887 0.10254-0.16064 0.24952-0.06836 0.14697-0.09912 0.25293-0.02734 0.10596-0.02735 0.27343 0 0.19482 0.06836 0.38623 0.07178 0.18799 0.29737 0.56739 1.20313 2.1123 3.30175 3.30175 0.36572 0.21191 0.55372 0.2837 0.19141 0.06836 0.38623 0.06836 0.28027-0.01367 0.5332-0.12647 0.12305-0.07178 0.229-0.16064 0.10596-0.09228 0.2461-0.27344 0.16748-0.22559 0.25293-0.28027l0-0.01368q0.08203-0.05811 0.14355-0.07861 0.06494-0.02051 0.27344-0.03418l0.72803 0q0.72803-0.01367 0.93652 0 0.21191 0.01367 0.29736 0.07178 0.16748 0.0957 0.25293 0.26318l0.04102 0.09912 0 1.02198q0 0.7417 0 0.88867 0 0.14697-0.02735 0.20508-0.12646 0.26318-0.37939 0.33496-0.15381 0.05469-0.74854 0.01367-0.59473-0.04102-1.1416-0.14014-0.96387-0.16748-1.90381-0.53662-0.93652-0.37256-1.75-0.89209-1.37061-0.89551-2.38574-2.16699-1.01514-1.2749-1.56885-2.81641-0.55371-1.5415-0.56738-3.13769 0-0.26318 0-0.31787 0-0.05811 0.04102-0.12989 0.08545-0.18115 0.22558-0.24951 0.08203-0.05811 0.16065-0.07178 0.07861-0.01367 0.30078-0.02734l1.73633 0.01367 0.09912 0.04102z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Col" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="IL" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    الجوال
                  </div>
                  <div data-pencil-name="IV" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    +966 11 234 5678
                  </div>
                </div>
              </div>
              <div data-pencil-name="Info Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
                <div data-pencil-name="IC" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#1E2535] rounded-[10px]">
                  <svg data-pencil-name="II" data-icon-name="map-pin" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                    <path d="M6.71973 0.60156q-0.81006 0.02734-1.56885 0.31446-0.75537 0.28711-1.41162 0.80664-0.19824 0.15381-0.48535 0.44775-0.28711 0.29395-0.44092 0.48877-0.42041 0.57422-0.67334 1.17578-0.24951 0.60156-0.34863 1.31592-0.04102 0.23926-0.03418 0.68017 0.00684 0.44092 0.03418 0.69385 0.14014 0.88184 0.56054 1.79102 0.50586 1.07666 1.44922 2.27637 0.94678 1.19629 2.19092 2.31738 0.22559 0.19482 0.32129 0.27343 0.09912 0.0752 0.19824 0.11622 0.22217 0.11279 0.48877 0.11279 0.2666 0 0.48877-0.11279 0.11279-0.04101 0.19482-0.10254 0.08545-0.06494 0.31104-0.25977 0.96387-0.86816 1.79101-1.83203 0.82715-0.96728 1.37403-1.86621 0.75537-1.27148 0.98437-2.42676 0.23242-1.15527-0.06152-2.29004-0.35205-1.35693-1.35693-2.36523-0.36572-0.37939-0.74512-0.64258-0.37598-0.2666-0.8374-0.46484-1.12109-0.51611-2.42334-0.44776z m0.88183 1.18946q0.67334 0.09912 1.28174 0.42041 0.6084 0.32129 1.0835 0.82714 0.68701 0.71436 0.95361 1.66114 0.2666 0.94336 0.08203 1.90722-0.34863 1.72266-2.26611 3.92041-0.32129 0.36572-1.00147 1.03907-0.68018 0.66992-0.73486 0.66992-0.05469 0-0.73486-0.66992-0.68018-0.67334-1.00147-1.03907-1.79102-2.05762-2.21142-3.70849-0.08545-0.32129-0.1128-0.69385-0.02734-0.37256 0-0.69385 0.07178-0.66992 0.34864-1.29199 0.28027-0.62549 0.75879-1.11426 0.51611-0.54688 1.20312-0.875 0.68701-0.33154 1.44238-0.38623 0.12646-0.01367 0.44776 0 0.32129 0.01367 0.46142 0.02735z m-0.85449 1.72265q-0.7417 0.08545-1.28857 0.57422-0.5708 0.50244-0.7417 1.26123-0.04102 0.15381-0.04102 0.42041 0 0.26318 0.02734 0.43408 0.11279 0.72803 0.63233 1.25782 0.44775 0.46143 1.06299 0.62548 0.61523 0.16064 1.22363-0.00683 0.6084-0.1709 1.05957-0.63233 0.50244-0.5332 0.62891-1.24414 0.01367-0.1709 0.01367-0.43408 0-0.2666-0.04102-0.40674-0.1709-0.77246-0.7417-1.2749-0.46484-0.40674-1.0664-0.5332-0.15381-0.02734-0.3794-0.04102-0.22217-0.01367-0.34863 0z m0.51953 1.18946q0.29395 0.05811 0.54688 0.30761 0.18115 0.18457 0.26318 0.37256 0.08545 0.18799 0.08545 0.44092 0 0.5332-0.39307 0.88183-0.32129 0.29395-0.76904 0.29395-0.44775 0-0.76904-0.29395-0.44775-0.40674-0.3794-1.0083 0.01367-0.2085 0.09571-0.36914 0.08545-0.16406 0.25293-0.33154 0.1709-0.16748 0.35205-0.24268 0.18115-0.07861 0.43408-0.07861 0.16748 0 0.28027 0.02735z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Col" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
                  <div data-pencil-name="IL" class="text-[10px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                    الموقع
                  </div>
                  <div data-pencil-name="IV" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                    الرياض — حي العليا، برج التقنية
                  </div>
                </div>
              </div>
            </div>
            <div data-pencil-name="Map Card" class="box-border w-full h-[180px] shrink-0 flex flex-col gap-[8px] justify-center items-center bg-[#EEF3FF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <svg data-pencil-name="Map Icon" data-icon-name="map" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[28px] h-[28px] shrink-0">
                <path d="M5.08252 1.31592q-0.16748 0.01367-0.28027 0.05469-0.15381 0.04443-0.48877 0.21191l-1.1211 0.54687q-1.46973 0.7417-1.56884 0.81006-0.2666 0.19824-0.39307 0.54688l-0.05469 0.12646 0 7.04102q0 0.67334 0.02735 0.88184 0.01367 0.14014 0.07177 0.23925l0.02735 0.05469q0.2085 0.43408 0.68701 0.58789 0.12305 0.04102 0.31103 0.05127 0.19141 0.00684 0.31787-0.02734 0.12646-0.0376 1.30225-0.62549l1.18945-0.58789 0.28028 0 1.35693 0.67334q1.36035 0.68359 1.51416 0.72803 0.48877 0.14014 0.97754 0 0.15381-0.04443 1.59619-0.77247 0.95361-0.4751 1.22705-0.61523 0.27344-0.14014 0.35547-0.2085 0.30762-0.25293 0.39307-0.65966 0.01367-0.06836 0.01367-3.9375 0-3.87256-0.01367-3.95801-0.04102-0.23926-0.18115-0.44092-0.14014-0.20166-0.35206-0.32813-0.15381-0.09912-0.34179-0.14697-0.18799-0.05127-0.34522-0.0376-0.18115 0.03076-0.36914 0.11622-0.18799 0.08203-1.08691 0.51611-1.18945 0.58789-1.28858 0.6084-0.0957 0.02051-0.19482 0-0.0957-0.02051-1.45606-0.69385-1.04932-0.51611-1.29541-0.62207-0.24268-0.10596-0.42382-0.1333-0.23926-0.01367-0.39307 0z m-0.40674 5.09619l0 3.72559-2.33789 1.17578q-0.01367-0.01709-0.01367-3.72559l0-3.72217 2.33789-1.16211q0.01367 0 0.01367 3.7085z m3.40088-2.60449l0.09912 0.04101 0 3.72559q0 3.72217-0.01367 3.72217l-2.33789-1.15869 0-7.45118 1.07666 0.54688q1.06641 0.5332 1.17578 0.57422z m3.58545 6.31298q0 0.01709-1.15527 0.59815-1.15527 0.57764-1.16895 0.57764-0.01367 0-0.01367-3.72217l0-3.72559 0.09912-0.04101q0.0957-0.04102 1.16211-0.57422l1.07666-0.52979 0 3.69483q0.01367 3.7085 0 3.72216z" fill="#0A66FF"></path>
              </svg>
              <div data-pencil-name="Map Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                خريطة الموقع — الرياض
              </div>
              <div data-pencil-name="Map Pin" class="box-border w-[36px] h-[36px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[999px]">
                <svg data-pencil-name="Pin" data-icon-name="map-pin" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
                  <path d="M6.71973 0.60156q-0.81006 0.02734-1.56885 0.31446-0.75537 0.28711-1.41162 0.80664-0.19824 0.15381-0.48535 0.44775-0.28711 0.29395-0.44092 0.48877-0.42041 0.57422-0.67334 1.17578-0.24951 0.60156-0.34863 1.31592-0.04102 0.23926-0.03418 0.68017 0.00684 0.44092 0.03418 0.69385 0.14014 0.88184 0.56054 1.79102 0.50586 1.07666 1.44922 2.27637 0.94678 1.19629 2.19092 2.31738 0.22559 0.19482 0.32129 0.27343 0.09912 0.0752 0.19824 0.11622 0.22217 0.11279 0.48877 0.11279 0.2666 0 0.48877-0.11279 0.11279-0.04101 0.19482-0.10254 0.08545-0.06494 0.31104-0.25977 0.96387-0.86816 1.79101-1.83203 0.82715-0.96728 1.37403-1.86621 0.75537-1.27148 0.98437-2.42676 0.23242-1.15527-0.06152-2.29004-0.35205-1.35693-1.35693-2.36523-0.36572-0.37939-0.74512-0.64258-0.37598-0.2666-0.8374-0.46484-1.12109-0.51611-2.42334-0.44776z m0.88183 1.18946q0.67334 0.09912 1.28174 0.42041 0.6084 0.32129 1.0835 0.82714 0.68701 0.71436 0.95361 1.66114 0.2666 0.94336 0.08203 1.90722-0.34863 1.72266-2.26611 3.92041-0.32129 0.36572-1.00147 1.03907-0.68018 0.66992-0.73486 0.66992-0.05469 0-0.73486-0.66992-0.68018-0.67334-1.00147-1.03907-1.79102-2.05762-2.21142-3.70849-0.08545-0.32129-0.1128-0.69385-0.02734-0.37256 0-0.69385 0.07178-0.66992 0.34864-1.29199 0.28027-0.62549 0.75879-1.11426 0.51611-0.54688 1.20312-0.875 0.68701-0.33154 1.44238-0.38623 0.12646-0.01367 0.44776 0 0.32129 0.01367 0.46142 0.02735z m-0.85449 1.72265q-0.7417 0.08545-1.28857 0.57422-0.5708 0.50244-0.7417 1.26123-0.04102 0.15381-0.04102 0.42041 0 0.26318 0.02734 0.43408 0.11279 0.72803 0.63233 1.25782 0.44775 0.46143 1.06299 0.62548 0.61523 0.16064 1.22363-0.00683 0.6084-0.1709 1.05957-0.63233 0.50244-0.5332 0.62891-1.24414 0.01367-0.1709 0.01367-0.43408 0-0.2666-0.04102-0.40674-0.1709-0.77246-0.7417-1.2749-0.46484-0.40674-1.0664-0.5332-0.15381-0.02734-0.3794-0.04102-0.22217-0.01367-0.34863 0z m0.51953 1.18946q0.29395 0.05811 0.54688 0.30761 0.18115 0.18457 0.26318 0.37256 0.08545 0.18799 0.08545 0.44092 0 0.5332-0.39307 0.88183-0.32129 0.29395-0.76904 0.29395-0.44775 0-0.76904-0.29395-0.44775-0.40674-0.3794-1.0083 0.01367-0.2085 0.09571-0.36914 0.08545-0.16406 0.25293-0.33154 0.1709-0.16748 0.35205-0.24268 0.18115-0.07861 0.43408-0.07861 0.16748 0 0.28027 0.02735z" fill="#FFFFFF"></path>
                </svg>
              </div>
            </div>
            <div data-pencil-name="Hours" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[16px] justify-between items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
              <div data-pencil-name="H Label" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                ساعات العمل
              </div>
              <div data-pencil-name="H Val" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                الأحد - الخميس 9ص - 6م
              </div>
            </div>
          </div>
        </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>