<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — من نحن - AMTDEX SOFT</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="About Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Hero" class="box-border w-full h-fit shrink-0 flex flex-row gap-[40px] p-[56px_40px] justify-start items-start bg-[#FFFFFF]">
          <div data-pencil-name="Hero Left" class="box-border w-[640px] shrink-0 h-fit flex flex-col gap-[16px] justify-start items-start">
            <div data-pencil-name="Eyebrow" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              من نحن — نبني برمجيات تثق بها المنطقة
            </div>
            <div data-pencil-name="Title" class="text-[44px]/[48px] box-border w-full text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold tracking-[-0.6px] text-left">
              من فكرة في الرياض
              <br>
              إلى شريك تقني للخليج.
            </div>
            <div data-pencil-name="Desc" class="text-[14px]/[26px] box-border w-[520px] text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              تأسست AMTDEX عام 2018 بهدف واحد: تحويل الأفكار إلى أنظمة تعمل بكفاءة لسنوات. اليوم
              نخدم 300+ عميل من المتاجر الناشئة إلى المؤسسات بفريق 24 مهندس ومصمم.
            </div>
            <div data-pencil-name="Stats" class="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] p-[16px_0px_0px_0px] justify-start items-start">
              <div data-pencil-name="Stat" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="S Val" class="text-[22px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  2018
                </div>
                <div data-pencil-name="S Label" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  سنة التأسيس
                </div>
              </div>
              <div data-pencil-name="Stat" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="S Val" class="text-[22px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  120+
                </div>
                <div data-pencil-name="S Label" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  مشروع مُسلّم
                </div>
              </div>
              <div data-pencil-name="Stat" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[14px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="S Val" class="text-[22px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  24
                </div>
                <div data-pencil-name="S Label" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                  مهندس ومصمم
                </div>
              </div>
            </div>
          </div>
          <div data-pencil-name="Hero Right" class="box-border [flex:1_1_0] h-[380px] flex flex-col gap-0 justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[20px] overflow-hidden">
            <div data-pencil-name="Img Top" class="[box-sizing:content-box] w-[680px] h-[41.5px] shrink-0 flex flex-row gap-0 p-[0px_16px] justify-between items-center bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:0px_0px_-0.5px_0px]">
              <div data-pencil-name="Img Title" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                مقرنا — الرياض، حي العليا
              </div>
              <div data-pencil-name="Live Badge2" class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[5px_10px] justify-start items-start bg-[#E6F4EA] rounded-[999px]">
                <div data-pencil-name="Live Text" class="text-[10px]/[normal] box-border text-[#0E9F6E] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                  ● نعمل حضورياً وعن بُعد
                </div>
              </div>
            </div>
            <div data-pencil-name="Img Body" class="box-border w-full [flex:1_1_0] flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#EEF3FF]">
              <div data-pencil-name="Top Row" class="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start">
                <div data-pencil-name="PH" class="box-border [flex:1_1_0] h-[90px] flex flex-col gap-0 justify-center items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <svg data-pencil-name="PH Icon" data-icon-name="users" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[20px] h-[20px] shrink-0">
                    <path d="M4.84326 1.20313q-0.81006 0.11279-1.42871 0.61865-0.61523 0.50244-0.89551 1.24414-0.18115 0.48877-0.18115 1.02197 0 0.28027 0.04102 0.50586 0.04443 0.22217 0.14013 0.48877 0.15381 0.46143 0.46826 0.84766 0.31787 0.38281 0.7212 0.63574 0.36572 0.22559 0.73486 0.32471 0.37256 0.0957 0.80664 0.0957 0.22559 0 0.3623-0.01367 0.14014-0.01367 0.35206-0.05811 0.60156-0.15381 1.104-0.55713 0.50586-0.40674 0.7998-0.98096 0.19482-0.39307 0.26661-0.88183 0.02734-0.14014 0.02734-0.40674 0-0.2666-0.02734-0.40674-0.09912-0.65625-0.46485-1.20312-0.3623-0.54688-0.93652-0.89551-0.43408-0.2666-0.98096-0.36572-0.15381-0.02734-0.45459-0.03418-0.30078-0.00684-0.45459 0.02051z m4.34082 0.0581q-0.14014 0.04102-0.25293 0.14014-0.11279 0.0957-0.15381 0.2666-0.04102 0.16748 0 0.32129 0.04102 0.15381 0.15381 0.25293 0.11279 0.0957 0.33838 0.18115 0.24951 0.08203 0.40332 0.17432 0.15381 0.08887 0.30762 0.25976 0.33838 0.33496 0.45459 0.76904 0.11963 0.43408 0.01367 0.86817-0.10254 0.43408-0.41699 0.76904-0.31445 0.33496-0.7793 0.48877-0.19482 0.07178-0.28711 0.14356-0.08887 0.06836-0.16064 0.20849-0.05469 0.09912-0.05469 0.23926 0 0.13672 0.05469 0.23584 0.08545 0.19482 0.28027 0.29395 0.12646 0.05811 0.25293 0.05126 0.12646-0.01025 0.33496-0.07861 0.35205-0.11279 0.6084-0.27344 0.25977-0.16064 0.5127-0.42724 0.78271-0.78271 0.85449-1.84912 0.09912-1.18945-0.70069-2.12598-0.48877-0.58789-1.2749-0.85449-0.33496-0.11279-0.48877-0.05469z m-3.73926 1.09033q0.40674 0.02734 0.78272 0.28711 0.37939 0.25977 0.58105 0.65967 0.20508 0.39648 0.18457 0.88184-0.02051 0.48193-0.28711 0.86132-0.15381 0.23584-0.37939 0.41358-0.22217 0.17432-0.46143 0.27002-0.19482 0.05811-0.2871 0.07861-0.08887 0.02051-0.32813 0.02051-0.23926 0-0.33154-0.02051-0.08887-0.02051-0.28369-0.07861-0.39307-0.14014-0.68018-0.46826-0.28711-0.32813-0.3999-0.73487-0.10938-0.46143 0.01367-0.90918 0.12646-0.44775 0.45459-0.76904 0.33154-0.32471 0.79297-0.45117 0.08545-0.02734 0.24609-0.04785 0.16064-0.02051 0.21533-0.00684l0.16748 0.01367z m-2.35156 5.85156q-0.96387 0.14014-1.65088 0.82715-0.54687 0.54688-0.75537 1.31592-0.07178 0.23926-0.08545 0.44092-0.01367 0.20166-0.01367 0.82031l0 0.76904 0.04102 0.1128q0.05811 0.0957 0.14013 0.18115 0.21191 0.19482 0.50586 0.14697 0.29395-0.04785 0.42041-0.31445l0.04102-0.09912 0.01367-0.79639q0.01367-0.61865 0.02734-0.77246 0.01367-0.15381 0.07178-0.34863 0.14014-0.37939 0.46826-0.68018 0.32813-0.30078 0.73487-0.41357 0.15381-0.04102 0.53662-0.05469 0.38623-0.01367 1.66113-0.01367 1.2749 0 1.65771 0.01367 0.38623 0.01367 0.54004 0.05469 0.42041 0.11279 0.75538 0.43066 0.33838 0.31445 0.46142 0.71778 0.05811 0.16748 0.06494 0.3247 0.00684 0.15381 0.02051 0.7417l0.01367 0.79639 0.04102 0.09912q0.12646 0.2666 0.42041 0.31445 0.29395 0.04785 0.50586-0.14697 0.08203-0.08545 0.14013-0.18115l0.04102-0.1128 0-0.76904q0-0.61865-0.01367-0.82031-0.01367-0.20166-0.08545-0.44092-0.08203-0.32129-0.23584-0.61523-0.2666-0.51953-0.73828-0.90235-0.46826-0.38623-1.02539-0.54004l-0.04444-0.01367q-0.16748-0.05811-0.29394-0.07178-0.15381-0.01367-0.56055-0.01367l-1.60986-0.01367q-2.05762 0-2.21143 0.02734z m7.85449 0.05811q-0.23926 0.05469-0.36572 0.27344-0.12305 0.21533-0.05469 0.45459 0.05811 0.19482 0.21192 0.30761 0.06836 0.04102 0.28027 0.12647 0.24951 0.08203 0.40332 0.17432 0.15381 0.08887 0.32471 0.27343 0.33496 0.34863 0.44775 0.78272 0.02734 0.11279 0.03418 0.24609 0.00684 0.1333 0.02051 0.70752l0.01367 0.79639 0.04102 0.09912q0.12646 0.2666 0.42041 0.31445 0.29395 0.04785 0.50586-0.14697 0.08203-0.08545 0.14013-0.18115l0.04102-0.1128 0.01367-0.64599q0-0.64258-0.02734-0.95703-0.02734-0.31445-0.12647-0.59473-0.14014-0.42041-0.42724-0.81006-0.28711-0.39307-0.64942-0.65967-0.31103-0.22559-0.69726-0.35888-0.38281-0.1333-0.5503-0.08887z" fill="#9AA0AB"></path>
                  </svg>
                </div>
                <div data-pencil-name="PH" class="box-border [flex:1_1_0] h-[90px] flex flex-col gap-0 justify-center items-center bg-[#070B1A] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <div data-pencil-name="PH Text" class="text-[10px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold tracking-[1px] text-left [white-space:nowrap]">
                    AMTDEX HQ
                  </div>
                </div>
                <div data-pencil-name="PH" class="box-border [flex:1_1_0] h-[90px] flex flex-col gap-0 justify-center items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                  <svg data-pencil-name="PH Icon" data-icon-name="code" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[20px] h-[20px] shrink-0">
                    <path d="M4.48096 2.95313q-0.07178 0.01367-0.15039 0.07177-0.0752 0.05469-1.86621 1.84571l-1.42872 1.44238q-0.32129 0.33838-0.39306 0.44775-0.05469 0.08545-0.05469 0.19824l0 0.08204q0 0.11279 0.05469 0.19824 0.08545 0.12305 0.40674 0.46142l1.46972 1.46973q1.31592 1.31592 1.58936 1.58252 0.27344 0.2666 0.34521 0.29395 0.2085 0.06836 0.42383-0.01368 0.21875-0.08545 0.31787-0.28027 0.04102-0.09912 0.04102-0.23926l0-0.05469q0.01367-0.11279-0.04102-0.18457-0.07178-0.10938-0.35205-0.40332l-2.854-2.87109 2.854-2.87109q0.28027-0.29395 0.35205-0.40332 0.05469-0.07178 0.04102-0.18457l0-0.05469q0-0.14014-0.04444-0.22901-0.04102-0.09229-0.1333-0.17431-0.08887-0.08545-0.18115-0.11963-0.08887-0.0376-0.20849-0.0376-0.11963 0-0.18799 0.02735z m4.64843 0q-0.09912 0.04443-0.1914 0.12988-0.08887 0.08203-0.1333 0.17431-0.04102 0.08887-0.04102 0.22901l0 0.05469q-0.01367 0.11279 0.04102 0.18457 0.07178 0.10938 0.35205 0.40332l2.854 2.87109-2.854 2.87109q-0.28027 0.29395-0.35205 0.40332-0.05469 0.07178-0.04102 0.18457l0 0.05469q0 0.14014 0.04102 0.23926 0.09912 0.19482 0.31445 0.28027 0.21875 0.08203 0.42725 0.01367 0.07178-0.02734 0.34521-0.29394 0.27344-0.2666 1.58936-1.58252l1.46972-1.46973q0.32129-0.33838 0.40674-0.46142 0.05469-0.08545 0.05469-0.19824l0-0.08204q0-0.11279-0.05469-0.19824-0.08545-0.12305-0.40674-0.46142l-1.45605-1.45606q-1.10742-1.11768-1.48682-1.47998-0.37598-0.36572-0.43066-0.39648-0.08545-0.04102-0.22559-0.04102-0.14014 0-0.22217 0.02734z" fill="#9AA0AB"></path>
                  </svg>
                </div>
              </div>
              <div data-pencil-name="Quote" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
                <div data-pencil-name="QI Box" class="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[999px]">
                  <svg data-pencil-name="QI" data-icon-name="quote" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                    <path d="M2.60449 1.20313q-0.43408 0.07178-0.78613 0.35888-0.34863 0.28711-0.51611 0.67676l-0.02735 0.0581q-0.04443 0.14014-0.07178 0.23584-0.01367 0.12646-0.01367 0.49219l-0.01367 3.7085 0.05469 0.15381q0.12646 0.40674 0.40674 0.71435 0.28027 0.30762 0.67334 0.46143 0.2085 0.07178 0.48877 0.09912l0.12646 0.01367 0 0.28027q0 0.32129-0.04443 0.46143-0.04102 0.14014-0.15039 0.25293-0.08545 0.08203-0.18457 0.11963-0.0957 0.03418-0.29395 0.04785-0.24951 0.02734-0.41015 0.10596-0.16064 0.0752-0.34522 0.24267-0.22217 0.23926-0.29395 0.53321-0.02734 0.12646-0.02734 0.86816 0 0.7417 0.02734 0.85449 0.05811 0.23926 0.21875 0.44776 0.16064 0.2085 0.38282 0.30761 0.1709 0.09912 0.28711 0.1128 0.11963 0.01367 0.3999 0.01367 0.44775-0.01367 0.84082-0.11279 0.39307-0.09912 0.81006-0.30762 0.82715-0.39307 1.40137-1.12793 0.57422-0.73486 0.76904-1.63037l0.01367-0.06836q0.04443-0.19824 0.05811-0.35205 0.02734-0.2085 0.02734-0.79639l0.01367-4.72021q-0.01367-0.69727-0.02734-0.93653-0.01367-0.18115-0.04102-0.32129-0.14014-0.4751-0.50586-0.81005-0.3623-0.33838-0.84082-0.4375-0.10938-0.01367-0.29394-0.02735l-0.92285 0q-1.07666 0-1.18946 0.02735z m6.3711-0.00001q-0.47852 0.09912-0.83741 0.44434-0.35547 0.3418-0.4956 0.80322-0.04102 0.18115-0.05469 0.52637-0.01367 0.3418 0 1.81152l0 1.87647 0.04102 0.16748q0.14014 0.4751 0.45459 0.80664 0.31787 0.32813 0.76562 0.45117 0.08203 0.03076 0.23584 0.05811 0.15381 0.02734 0.22559 0.02734 0.01367 0 0.01367 0.36572 0 0.27686-0.00684 0.3418-0.00684 0.06152-0.04785 0.11963-0.09912 0.18115-0.2666 0.2666-0.07178 0.04102-0.22559 0.05469-0.3623 0.04102-0.51611 0.11279-0.49219 0.23584-0.646 0.76904-0.01367 0.06836-0.02734 0.2085l0 0.67334q0 0.57422 0.00684 0.68701 0.00684 0.11279 0.03418 0.2085 0.04443 0.16748 0.11279 0.27344 0.07178 0.10596 0.19482 0.23242 0.23926 0.23584 0.54688 0.30761 0.11279 0.04102 0.42724 0.02735 0.31445-0.01367 0.52637-0.04102 0.97754-0.18457 1.76367-0.77246 0.15381-0.10938 0.42725-0.38281 0.27344-0.27344 0.38281-0.42725 0.60156-0.79981 0.77246-1.82177 0.02734-0.12646 0.02735-0.64258l0.01367-2.82666-0.01367-2.84375q0-0.4751-0.02735-0.56055-0.12646-0.48877-0.458-0.81689-0.32813-0.33154-0.80323-0.47168-0.09912-0.02734-0.2666-0.03418-0.16748-0.00684-1.0083-0.00684l-0.96387 0q-0.19824 0.01367-0.30761 0.02734z m-4.21436 1.14844q0.30762 0.04102 0.43408 0.32129l0.04102 0.09912 0 3.12061q0 3.12402-0.01367 3.27783-0.12646 0.75537-0.56055 1.34326-0.09912 0.11279-0.25977 0.28028-0.16064 0.16748-0.28711 0.25293-0.68359 0.54346-1.6372 0.61523l-0.15381 0.01367 0-1.17578 0.15381 0q0.50244-0.04102 0.91601-0.3623 0.41357-0.32471 0.58106-0.79981 0.07178-0.19482 0.08545-0.34863 0.01367-0.15381 0.01367-0.56055 0-0.35205-0.00684-0.44775-0.00684-0.09912-0.03418-0.18457-0.08545-0.23584-0.29394-0.44776-0.15381-0.16748-0.33838-0.24267-0.18115-0.07861-0.43408-0.10596-0.22217-0.01367-0.34864-0.08203-0.12646-0.07178-0.20849-0.22559-0.04443-0.07178-0.05811-0.18115-0.01367-0.14014-0.02734-0.56055l0.01367-3.16504 0.04102-0.09912q0.07178-0.14014 0.18798-0.229 0.11963-0.09229 0.25977-0.11963 0.09912-0.01367 0.96729-0.01367 0.86816 0 0.96728 0.02734z m6.55225 0.02735q0.2085 0.09912 0.30761 0.30761l0.04102 0.09912 0 5.55762q0 0.58789-0.02734 0.79981-0.01367 0.15381-0.05811 0.33496l-0.01367 0.04101q-0.22217 0.77246-0.78955 1.32617-0.56738 0.55029-1.33643 0.73145-0.22559 0.05811-0.54687 0.08545l-0.14014 0.01367 0-1.17578 0.08545 0q0.0957 0 0.27002-0.04102 0.17773-0.04443 0.3042-0.08544 0.40332-0.16748 0.68359-0.50245 0.28027-0.33838 0.3794-0.78613 0.02734-0.18115 0.02734-0.60156 0-0.34863-0.01367-0.48194-0.01367-0.1333-0.07178-0.27343-0.0957-0.22559-0.30762-0.42041-0.2085-0.19482-0.44775-0.2666-0.0957-0.02734-0.25293-0.03418-0.15381-0.00684-0.23584-0.03418-0.25293-0.07178-0.37939-0.33496l-0.02735-0.08545 0-3.78028 0.04102-0.09912q0.05811-0.12646 0.16748-0.21533 0.11279-0.09229 0.25293-0.10596 0.09912-0.02734 1.03564-0.01367l0.95361 0 0.09913 0.04102z" fill="#FFFFFF"></path>
                  </svg>
                </div>
                <div data-pencil-name="Quote Text" class="text-[11px]/[normal] box-border [flex:1_1_0] text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left">
                  “نبني للمدى الطويل، لا للإطلاق فقط.” — مؤسس AMTDEX
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Values" class="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] p-[48px_40px] justify-start items-start bg-[#F0EDE7]">
          <div data-pencil-name="Values Label" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
            قيمنا
          </div>
          <div data-pencil-name="Values Title" class="text-[32px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
            كيف نعمل — ولماذا يثق بنا العملاء
          </div>
          <div data-pencil-name="Grid" class="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start">
            <div data-pencil-name="V الجودة أولاً" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="IB" class="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                <svg data-pencil-name="VI" data-icon-name="shield-check" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                  <path d="M6.84619 0.60156q-0.34863 0.02734-0.68701 0.30762-0.51611 0.42041-1.00147 0.70068-0.48193 0.28027-1.01513 0.4751-0.30762 0.11279-0.58789 0.1709-0.28027 0.05469-0.66992 0.08203-0.23926 0.01367-0.36573 0.07178-0.19482 0.06836-0.37939 0.22217-0.18115 0.15381-0.26319 0.34863l-0.01367 0.03076q-0.07178 0.12646-0.08545 0.22217-0.01367 0.15381-0.02734 0.60156l0 1.78076q0 2.25244 0.01367 2.46094 0.14014 1.6543 1.10742 2.88477 0.14014 0.16748 0.43409 0.46142 0.29395 0.29394 0.48877 0.44775 0.92285 0.7417 2.2832 1.27491 0.46143 0.18115 0.65625 0.23926 0.23926 0.05469 0.43408 0.01367 0.16748-0.02734 0.5332-0.15381 1.35693-0.51953 2.27979-1.20313 0.37939-0.2666 0.71435-0.60498 1.37402-1.3706 1.54151-3.37353 0.01367-0.23584 0.01367-2.46094 0-2.22852-0.02734-2.35498-0.07178-0.32129-0.31787-0.56396-0.24268-0.24609-0.5503-0.31788-0.09912-0.02734-0.37939-0.04101-0.48877-0.02734-0.96387-0.18115-0.81348-0.2666-1.55518-0.77246-0.2666-0.18115-0.64257-0.48877-0.42041-0.33496-0.96729-0.28028z m0.43408 1.34326q0.64258 0.51953 1.32959 0.86817 1.2168 0.61865 2.25244 0.68701l0.21192 0-0.01367 4.31348q0 0.33496-0.02735 0.50244-0.22559 1.34326-1.1416 2.27637-0.91602 0.92969-2.66601 1.57226l-0.21192 0.08545-0.18115-0.05469q-2.32422-0.85449-3.2334-2.22851-0.47852-0.71436-0.63232-1.63721-0.02734-0.18115-0.02735-0.50244l-0.01367-4.32715 0.19483 0q0.86816-0.05469 1.84912-0.48193 0.98096-0.42725 1.83545-1.12793 0.16748-0.14014 0.19482-0.14014 0.02734 0 0.28027 0.19482z m1.32959 3.31885q-0.06836 0.02734-0.12646 0.05127-0.05469 0.02051-1.06299 1.02539l-0.99463 0.99463-0.40674-0.40332q-0.2666-0.2666-0.3623-0.33838-0.12646-0.11279-0.19824-0.14013-0.06836-0.02734-0.19483-0.02735-0.12646 0-0.16748 0.01367-0.04102 0.01367-0.09912 0.04102-0.18115 0.09912-0.28027 0.2666-0.04102 0.08545-0.04102 0.25293l0 0.01367q0 0.14014 0.03418 0.21192 0.0376 0.06836 0.17774 0.22216 0.0957 0.11279 0.48876 0.50586l0.04102 0.04102q0.42041 0.42041 0.55371 0.54687 0.1333 0.12305 0.20166 0.15381 0.14014 0.06836 0.29395 0.05469 0.15381-0.01367 0.28027-0.09912 0.07178-0.05469 1.28857-1.27149 0.86816-0.86816 1.04932-1.06298 0.18457-0.19824 0.21192-0.27002 0.0957-0.27686-0.05811-0.52295-0.15381-0.24609-0.44775-0.25977-0.12646-0.01367-0.18116 0z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="V Title" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                الجودة أولاً
              </div>
              <div data-pencil-name="V Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                كود نظيف، اختبارات آلية، ومراجعة أقران لكل سطر قبل الإطلاق.
              </div>
            </div>
            <div data-pencil-name="V الالتزام بالوقت" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="IB" class="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                <svg data-pencil-name="VI" data-icon-name="timer" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                  <path d="M5.7251 0.60156q-0.18115 0.02734-0.32129 0.18115-0.14014 0.15381-0.15381 0.35206 0 0.14014 0.06152 0.28027 0.06494 0.14014 0.19141 0.22217l0.01367 0.01367q0.06836 0.05811 0.15039 0.07178 0.08545 0.01367 0.35205 0.02734l1.96192 0q0.2666-0.01367 0.34863-0.02734 0.08545-0.01367 0.15381-0.07178l0.01367-0.01367q0.21191-0.14014 0.24609-0.36914 0.03418-0.23242-0.09912-0.43409-0.1333-0.20508-0.38281-0.23242-0.11279-0.02734-1.2749-0.02734-1.16211 0-1.26123 0.02734z m0.77246 2.33789q-0.98096 0.09912-1.86963 0.54688-0.88867 0.44775-1.54834 1.18945-1.07666 1.2168-1.30225 2.88477-0.02734 0.2085-0.0205 0.64941 0.00684 0.44092 0.03418 0.63916 0.09912 0.71436 0.34863 1.32276 0.25293 0.6084 0.67334 1.16894 0.15381 0.19482 0.44092 0.48877 0.28711 0.29395 0.47168 0.44775 0.43408 0.33496 0.93652 0.58789 0.58789 0.28027 1.1416 0.41358 0.55371 0.1333 1.19629 0.1333 0.64258 0 1.19629-0.1333 0.55371-0.1333 1.1416-0.41358 0.40674-0.2085 0.72119-0.4375 0.31445-0.23242 0.66651-0.58447 0.85107-0.84082 1.24414-1.95849 0.25293-0.72803 0.27343-1.54493 0.02051-0.82031-0.17431-1.56543-0.2666-0.93652-0.82715-1.69873-0.56055-0.76221-1.37061-1.30908-0.16748-0.11279-0.50586-0.28027-0.33496-0.16748-0.52978-0.23926-0.54688-0.19482-1.13477-0.28027-0.16748-0.02734-0.60156-0.03418-0.43408-0.00684-0.60156 0.00683z m0.96387 1.17578q0.98096 0.09912 1.82519 0.68018 0.84766 0.58105 1.32617 1.46289 0.43408 0.82715 0.46143 1.77734 0.02734 1.0083-0.39307 1.87647-0.15381 0.34863-0.33496 0.60156-0.18115 0.25293-0.44775 0.51953-0.2666 0.26318-0.50586 0.44092-0.23584 0.17432-0.55713 0.3418-1.06641 0.5332-2.24902 0.41357-1.18262-0.11963-2.13282-0.875-0.22559-0.18115-0.49218-0.46826-0.2666-0.28711-0.43409-0.56738-0.62891-0.99463-0.60839-2.20459 0.02051-1.21338 0.68017-2.20459 0.60156-0.9126 1.59619-1.40137 1.03564-0.51953 2.26612-0.39307z m1.18945 1.73633q-0.0957 0.01367-0.16748 0.05127-0.06836 0.03418-1.03565 0.98438-0.67334 0.68701-0.82031 0.84082-0.14697 0.15381-0.17432 0.22558-0.06836 0.2085 0.01368 0.42725 0.08545 0.21533 0.28027 0.31445 0.09912 0.04102 0.25293 0.04102l0.02734 0q0.11279 0 0.19483-0.04102 0.08545-0.04443 0.29736-0.23926 0.15381-0.14014 0.66992-0.65966l0.1128-0.10938q0.67334-0.67334 0.82031-0.83398 0.14697-0.16064 0.17431-0.23242 0.06836-0.2085-0.00341-0.39649-0.06836-0.19141-0.24268-0.30078-0.17432-0.11279-0.3999-0.07178z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="V Title" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                الالتزام بالوقت
              </div>
              <div data-pencil-name="V Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                تسليم مرحلي أسبوعي — ترى التقدم وتوافق قبل المتابعة.
              </div>
            </div>
            <div data-pencil-name="V الشفافية" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="IB" class="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                <svg data-pencil-name="VI" data-icon-name="handshake" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                  <path d="M1.59619 1.18945q-0.12646 0.04102-0.23926 0.14698-0.10938 0.10596-0.14697 0.21191-0.03418 0.10254-0.3418 3.38037l-0.29394 3.27441 0.04101 0.12647q0.02734 0.12646 0.1128 0.22559 0.12646 0.14014 2.03027 2.03027 1.90381 1.89014 1.98926 1.9585 0.26318 0.19482 0.60156 0.29394 0.15381 0.04101 0.39649 0.05811 0.24609 0.01367 0.41357-0.03077 0.58789-0.11279 0.98096-0.51611 0.19482-0.21191 0.30761-0.43408l0.07178-0.14014q0 0 0.15381 0.06836 0.18115 0.09912 0.33496 0.1333 0.15381 0.03418 0.37598 0.03418 0.2666 0.01367 0.46826-0.02734 0.20508-0.04101 0.43066-0.15381 0.4751-0.23926 0.7417-0.70068 0.05469-0.0957 0.11621-0.23584 0.06494-0.14014 0.07862-0.23926l0.02734-0.09912 0.2666 0q0.22559 0 0.35547-0.02735 0.1333-0.02734 0.34521-0.11279 0.30762-0.10938 0.57422-0.37598 0.2666-0.2666 0.38282-0.56738 0.11963-0.30078 0.14697-0.58105l0-0.14014 0.33838 0q0.22217-0.01367 0.28369-0.02051 0.06494-0.00684 0.12305-0.03418 0.12305-0.05811 0.22217-0.18115 0.09912-0.12646 0.12646-0.2666 0.01367-0.07178-0.28711-3.33252-0.30078-3.26416-0.32812-3.35303-0.02734-0.09229-0.1128-0.18799-0.08545-0.09912-0.17773-0.14013-0.08887-0.04443-0.21533-0.05811-0.12647-0.01367-0.23243 0.02051-0.10254 0.03418-0.20849 0.14014-0.10254 0.10596-0.14014 0.19824-0.03418 0.08887-0.03418 0.21533 0 0.06836-0.00683 0.09229-0.00684 0.02051-0.03418 0.0205-0.14014 0.04102-0.36573 0.07862-0.22217 0.03418-0.28027 0.03418-0.14014 0-0.42041-0.1709-0.41699-0.24951-0.78272-0.38281-0.3623-0.1333-0.78271-0.20508-0.22559-0.04102-0.62549-0.04102-0.39648 0-0.62207 0.04102-0.70068 0.12646-1.25781 0.44775l-0.1709 0.08545-4.00244 0 0-0.05469q0-0.04443-0.02734-0.14013-0.02734-0.09912-0.14014-0.21192-0.11279-0.11279-0.19824-0.14013-0.08203-0.02734-0.19483-0.02735-0.11279 0-0.16748 0.01367z m7.2666 1.17578q0.2666 0.04443 0.50244 0.14356 0.23926 0.0957 0.57422 0.29053 0.30762 0.16748 0.42041 0.22558 0.25293 0.0957 0.51612 0.1128 0.2666 0.01367 0.61865-0.05811 0.2666-0.05469 0.27344-0.04785 0.00684 0.00684 0.21533 2.21826l0.21191 2.32422-0.28027 0-1.24756-1.23389q-0.93652-0.93652-1.19629-1.17236-0.25977-0.23926-0.45459-0.35205-0.44775-0.25293-0.98779-0.28711-0.54004-0.03418-1.01514 0.16064-0.28027 0.11279-0.48535 0.25977-0.20166 0.14697-0.55029 0.49219-0.34863 0.3418-0.40674 0.36914-0.12646 0.08203-0.32813 0.08203-0.20166 0-0.34179-0.08203-0.29395-0.19482-0.29395-0.56055 0-0.16748 0.06836-0.30762 0.02734-0.05469 0.92969-0.96386 0.90576-0.9126 1.0459-1.0254 0.65625-0.52979 1.52441-0.60156 0.32129-0.04102 0.68701 0.01367z m-4.45361 1.13477q-0.46143 0.4751-0.60156 0.65283-0.14014 0.17432-0.23242 0.38623-0.08887 0.2085-0.10938 0.3418-0.02051 0.12988-0.02051 0.36914 0 0.23926 0.02051 0.37256 0.02051 0.12988 0.11963 0.3418 0.10938 0.30762 0.37598 0.57421 0.2666 0.2666 0.57421 0.37598 0.21191 0.09912 0.3418 0.11963 0.1333 0.02051 0.37256 0.02051 0.23926 0 0.36914-0.02051 0.1333-0.02051 0.32813-0.10254 0.19824-0.08545 0.36572-0.21191 0.16748-0.12646 0.49219-0.44776 0.28027-0.2666 0.3623-0.33496 0.08545-0.07178 0.18115-0.12646 0.51953-0.25293 1.05274 0 0.10938 0.05469 0.28369 0.22558 0.17773 0.16748 1.11426 1.09033l0.21191 0.22217q0.62891 0.61865 0.79639 0.79981 0.23926 0.23926 0.29394 0.34863 0.04102 0.08545 0.04102 0.21191l0 0.04102q0 0.11279-0.01367 0.15381-0.01367 0.04102-0.04102 0.11279-0.12647 0.28027-0.39307 0.34863-0.12647 0.04443-0.28027 0.03077-0.15381-0.01709-0.23584-0.08545-0.05811-0.02734-0.85791-0.8169-0.79639-0.79297-0.86475-0.83398-0.11279-0.07178-0.27343-0.07178-0.16064 0-0.28711 0.07178-0.2085 0.0957-0.28028 0.32812-0.06836 0.229 0.04444 0.45459 0.02734 0.06836 0.68359 0.7417l0.50586 0.50244q0.15381 0.1709 0.19483 0.24268 0.04102 0.06836 0.05468 0.17773 0.04443 0.33838-0.19482 0.57422-0.29395 0.28027-0.70069 0.12647-0.05469-0.02734-0.18115-0.1333-0.12646-0.10596-0.57422-0.56739-0.67334-0.65625-0.7417-0.69726-0.11279-0.07178-0.27343-0.07178-0.16064 0-0.28711 0.07178-0.2085 0.0957-0.28028 0.32812-0.06836 0.229 0.02735 0.45459 0.04443 0.06836 0.2666 0.29395 0.18115 0.18115 0.23584 0.28027 0.05811 0.0957 0.07178 0.22217 0.05811 0.32471-0.18116 0.56055-0.29395 0.28027-0.70068 0.14013-0.06836-0.02734-0.35547-0.30761-0.28711-0.28027-1.60303-1.58252l-1.84912-1.8628 0.44776-5.01074 2.77197 0-0.58789 0.57422z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="V Title" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                الشفافية
              </div>
              <div data-pencil-name="V Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                تسعير واضح، تقارير أسبوعية، وملكية كاملة للكود.
              </div>
            </div>
            <div data-pencil-name="V الدعم المستمر" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="IB" class="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
                <svg data-pencil-name="VI" data-icon-name="heart" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                  <path d="M9.37891 1.75q-0.64258 0.04102-1.24414 0.30078-0.60156 0.25977-1.04932 0.68018l-0.08545 0.06836-0.11279-0.09571q-0.40674-0.35205-0.88184-0.57422-0.51611-0.25293-1.13476-0.35205-0.16748-0.02734-0.51954-0.0205-0.34863 0.00684-0.52978 0.03418-1.24414 0.19824-2.11231 1.0664-1.0083 1.0083-1.10742 2.41992-0.08203 0.98096 0.39307 1.94825 0.19482 0.37598 0.44092 0.72119 0.24609 0.3418 0.67675 0.80322 0.21191 0.23926 1.97559 1.94824 1.76367 1.70557 1.87647 1.79102 0.44775 0.33496 1.03564 0.33496 0.58789 0 1.03564-0.33496 0.11279-0.08545 1.88331-1.80811 1.77051-1.72266 1.98242-1.93115 0.41699-0.46143 0.66308-0.80322 0.24609-0.34521 0.44092-0.72119 0.35205-0.70068 0.3999-1.43555 0.04785-0.73486-0.18798-1.46289-0.19824-0.61865-0.61866-1.14844-0.41699-0.5332-0.97754-0.86816-0.49219-0.30762-1.08691-0.45459-0.59473-0.14697-1.15527-0.10596z m0.71435 1.20313q0.32129 0.05811 0.66309 0.21874 0.34521 0.16064 0.61181 0.38282 0.30762 0.2666 0.53663 0.67334 0.23242 0.40674 0.30419 0.82715 0.02734 0.18115 0.02735 0.46826 0 0.28711-0.02735 0.45459-0.14014 0.72803-0.74169 1.4834-0.29395 0.36572-0.66651 0.73828-0.36914 0.36914-1.84228 1.79785l-1.29883 1.24414q-0.31104 0.29395-0.43408 0.36572-0.08545 0.05469-0.19825 0.05469l-0.05468 0q-0.11279 0-0.21192-0.05469-0.10938-0.07178-0.43408-0.37939-0.23584-0.2085-1.07666-1.02198l-0.2085-0.20849q-1.28857-1.24756-1.66113-1.60986-0.36914-0.36572-0.59473-0.63233-0.43408-0.48877-0.67334-0.90918-0.23584-0.42041-0.32128-0.86816-0.02734-0.16748-0.02735-0.44776 0-0.28027 0.02735-0.44775 0.11279-0.61523 0.50244-1.13135 0.39307-0.51953 0.93994-0.77246 0.50586-0.22559 1.03564-0.25293 0.40674-0.01367 0.76905 0.08545 0.36572 0.0957 0.65283 0.2666 0.28711 0.16748 0.59472 0.46143 0.21191 0.19482 0.34864 0.2666 0.14014 0.06836 0.36572 0.06836 0.22559 0 0.37256-0.06836 0.14697-0.07178 0.35547-0.28027 0.30762-0.29395 0.58789-0.46143 0.28027-0.1709 0.64258-0.2666 0.56055-0.15723 1.13476-0.04443z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="V Title" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                الدعم المستمر
              </div>
              <div data-pencil-name="V Desc" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
                لسنا مقاولاً عابراً — نرافقك بعد الإطلاق لسنوات.
              </div>
            </div>
          </div>
        </div>
        <div data-pencil-name="Team" class="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] p-[48px_40px] justify-start items-start bg-[#FFFFFF]">
          <div data-pencil-name="Team Head" class="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end">
            <div data-pencil-name="Team Title" class="text-[28px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              فريق يجمع الهندسة والتصميم
            </div>
            <div data-pencil-name="Team Link" class="text-[12px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              انضم إلينا ←
            </div>
          </div>
          <div data-pencil-name="Team Grid" class="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start">
            <div data-pencil-name="Member أحمد السعيد" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="Avatar" class="box-border w-full h-[120px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#0A66FF12] rounded-[12px]">
                <div data-pencil-name="Circ" class="box-border w-[56px] h-[56px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[999px]">
                  <div data-pencil-name="Letter" class="text-[20px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]">
                    أ
                  </div>
                </div>
              </div>
              <div data-pencil-name="M Name" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                أحمد السعيد
              </div>
              <div data-pencil-name="M Role" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                المؤسس والرئيس التنفيذي
              </div>
            </div>
            <div data-pencil-name="Member سارة القحطاني" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="Avatar" class="box-border w-full h-[120px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#7C3AED12] rounded-[12px]">
                <div data-pencil-name="Circ" class="box-border w-[56px] h-[56px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#7C3AED] rounded-[999px]">
                  <div data-pencil-name="Letter" class="text-[20px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]">
                    س
                  </div>
                </div>
              </div>
              <div data-pencil-name="M Name" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                سارة القحطاني
              </div>
              <div data-pencil-name="M Role" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                رئيسة التصميم
              </div>
            </div>
            <div data-pencil-name="Member فيصل الحربي" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="Avatar" class="box-border w-full h-[120px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#070B1A12] rounded-[12px]">
                <div data-pencil-name="Circ" class="box-border w-[56px] h-[56px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#070B1A] rounded-[999px]">
                  <div data-pencil-name="Letter" class="text-[20px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]">
                    ف
                  </div>
                </div>
              </div>
              <div data-pencil-name="M Name" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                فيصل الحربي
              </div>
              <div data-pencil-name="M Role" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                مدير الهندسة
              </div>
            </div>
            <div data-pencil-name="Member نورة العلي" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
              <div data-pencil-name="Avatar" class="box-border w-full h-[120px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#0E9F6E12] rounded-[12px]">
                <div data-pencil-name="Circ" class="box-border w-[56px] h-[56px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0E9F6E] rounded-[999px]">
                  <div data-pencil-name="Letter" class="text-[20px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]">
                    ن
                  </div>
                </div>
              </div>
              <div data-pencil-name="M Name" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                نورة العلي
              </div>
              <div data-pencil-name="M Role" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
                مديرة المنتجات
              </div>
            </div>
          </div>
        </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>