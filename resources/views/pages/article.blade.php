<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — المقال التقني</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Article Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Hero" class="box-border w-full h-fit shrink-0 flex flex-col gap-[14px] p-[40px] justify-start items-center bg-[#F0EDE7]">
          <div data-pencil-name="Badge" class="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[6px_12px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
            <div data-pencil-name="Badge Text" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              ERP • 6 دقائق قراءة
            </div>
          </div>
          <div data-pencil-name="Title" class="text-[32px]/[37px] box-border w-[760px] text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center">
            كيف تختار نظام ERP لمتجرك
            <br>
            دون أن تدفع أكثر مما تحتاج
          </div>
          <div data-pencil-name="Meta" class="box-border w-fit h-fit shrink-0 flex flex-row gap-[16px] justify-start items-center">
            <div data-pencil-name="Meta Text" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              أحمد السعيد — 12 يناير 2026
            </div>
            <div data-pencil-name="Sep" class="box-border w-[4px] shrink-0 h-[4px] bg-[#CBD5E1] rounded-[50%]"></div>
            <div data-pencil-name="Meta2" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              6 دقائق • 1.2k قراءة
            </div>
          </div>
          <div data-pencil-name="Cover" class="box-border w-[760px] h-[260px] shrink-0 flex flex-col gap-[10px] justify-center items-center bg-[#070B1A] rounded-[16px]">
            <svg data-pencil-name="Cover Icon" data-icon-name="layout-dashboard" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[36px] h-[36px] shrink-0 opacity-[0.5]">
              <path d="M2.03027 1.20313q-0.22559 0.07178-0.42724 0.23242-0.20166 0.16064-0.30078 0.36914l-0.02735 0.04443q-0.05811 0.10938-0.07177 0.2085-0.02734 0.14014-0.02735 0.56054l0 3.51368q0 0.42041 0.02735 0.56054 0.01367 0.09912 0.07177 0.2085l0.02735 0.04443q0.09912 0.22217 0.30761 0.38282 0.2085 0.16064 0.44776 0.21875 0.11279 0.04102 1.72949 0.03417 1.6167-0.00684 1.74316-0.03417 0.29395-0.07178 0.53321-0.30762 0.12305-0.12646 0.1914-0.23242 0.07178-0.10596 0.11621-0.27344l0.04102-0.12647 0-4.46386-0.04102-0.12647q-0.04443-0.16748-0.11621-0.27344-0.06836-0.10596-0.1914-0.23242-0.15381-0.15381-0.29395-0.22217l-0.01709-0.01367q-0.12305-0.05811-0.22217-0.07177-0.12646-0.02734-0.47509-0.02735l-1.14844 0-1.52783 0q-0.24951 0.01367-0.34864 0.02735z m6.43946-0.00001q-0.28027 0.05811-0.53321 0.30762-0.12305 0.12646-0.19482 0.23242-0.06836 0.10596-0.11279 0.27344l-0.04102 0.12647 0 2.15332 0.04102 0.14013q0.08545 0.22559 0.24609 0.40674 0.16064 0.18115 0.35547 0.28028l0.01709 0.01367q0.13672 0.07178 0.22217 0.08545 0.14014 0.01367 0.48877 0.02734l2.92578-0.01367 0.14013-0.04102q0.2666-0.08545 0.46827-0.28711 0.20508-0.20508 0.29052-0.45459 0.02734-0.08545 0.02735-0.25293l0.01367-0.95361 0-0.86816q0-0.23584-0.02735-0.34864-0.01367-0.07178-0.08544-0.21191l-0.01368-0.01367q-0.09912-0.22217-0.30078-0.37598-0.20166-0.15381-0.44092-0.22559-0.09912-0.02734-0.33496-0.02734l-1.41504 0q-1.62354 0-1.73632 0.02734z m-3.21973 3.16504l0 2.05762-2.92578 0 0-4.10156 2.92578 0 0 2.04394z m6.42578-1.16211l0 0.86817-2.92578 0 0-1.75 2.92578 0 0 0.88183z m-3.20605 3.24707q-0.28027 0.05811-0.53321 0.30762-0.12305 0.12646-0.19482 0.23242-0.06836 0.10596-0.11279 0.27344l-0.04102 0.12647 0 4.46386 0.04102 0.12647q0.04443 0.16748 0.11279 0.27344 0.07178 0.10596 0.19482 0.23242 0.23926 0.23584 0.53321 0.30761 0.12646 0.02734 1.74316 0.03418 1.6167 0.00684 1.72949-0.03418 0.30762-0.07178 0.54346-0.30761 0.23926-0.23926 0.31104-0.54688 0.02734-0.11279 0.03417-2.31738 0.00684-2.20459-0.03417-2.31738-0.07178-0.30762-0.3042-0.53662-0.229-0.23242-0.53663-0.31788-0.09912-0.02734-0.33496-0.02734l-1.41504 0q-1.62354 0-1.73632 0.02734z m3.20605 3.16504l0 2.05762-2.92578 0 0-4.10156 2.92578 0 0 2.04394z m-9.54639-0.85449q-0.31104 0.05469-0.56396 0.27344-0.24951 0.21533-0.34863 0.50928-0.02734 0.08545-0.02735 0.25293l-0.01367 0.95361 0 0.86816q0 0.23584 0.02735 0.34864 0.01367 0.07178 0.08544 0.21191l0.01368 0.01367q0.09912 0.22217 0.30761 0.38281 0.2085 0.16065 0.44776 0.21875 0.11279 0.04102 1.72949 0.03418 1.6167-0.00684 1.74316-0.03418 0.29395-0.07178 0.53321-0.30761 0.12305-0.12646 0.1914-0.23242 0.07178-0.10596 0.11621-0.27344l0.04102-0.12647 0-2.15332-0.04102-0.14013q-0.08545-0.22559-0.24609-0.40674-0.16064-0.18115-0.35547-0.28028l-0.01709-0.01367q-0.12305-0.05811-0.22217-0.08545-0.14014-0.01367-0.48877-0.02734l-1.26123 0q-1.55518 0-1.65088 0.01367z m3.12061 2.03028l0 0.88183-2.92578 0 0-1.75 2.92578 0 0 0.86817z" fill="#FFFFFF"></path>
            </svg>
            <div data-pencil-name="Cover Label" class="text-[11px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              ERP — صورة توضيحية
            </div>
          </div>
        </div>
        <div data-pencil-name="Body" class="box-border w-full h-fit shrink-0 flex flex-row gap-[32px] p-[32px_40px] justify-start items-start">
          <div data-pencil-name="TOC" class="box-border w-[240px] shrink-0 h-fit flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[14px]">
            <div data-pencil-name="TOC Title" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              في هذا المقال
            </div>
            <div data-pencil-name="TI المشكلة" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] bg-[#0A66FF] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                المشكلة
              </div>
            </div>
            <div data-pencil-name="TI الحل المقترح" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#00000000] [outline:1px_solid_#00000000] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] bg-[#CBD5E1] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                الحل المقترح
              </div>
            </div>
            <div data-pencil-name="TI التكلفة" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#00000000] [outline:1px_solid_#00000000] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] bg-[#CBD5E1] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                التكلفة
              </div>
            </div>
            <div data-pencil-name="TI الخلاصة" class="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px_10px] justify-start items-center bg-[#00000000] [outline:1px_solid_#00000000] [outline-offset:-0.5px] rounded-[8px]">
              <div data-pencil-name="Dot" class="box-border w-[6px] shrink-0 h-[6px] bg-[#CBD5E1] rounded-[50%]"></div>
              <div data-pencil-name="TI Text" class="text-[12px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                الخلاصة
              </div>
            </div>
            <div data-pencil-name="Share" class="[box-sizing:content-box] w-[208px] h-[47.5px] shrink-0 flex flex-row gap-[8px] p-[12px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:-0.5px_0px_0px_0px]">
              <div data-pencil-name="SB share-2" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <svg data-pencil-name="SI2" data-icon-name="share-2" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M10.40088 0.58789q-0.64258 0.02734-1.18262 0.38623-0.53662 0.35547-0.80322 0.92969-0.12646 0.25293-0.17774 0.44775-0.04785 0.19482-0.06152 0.4751-0.01367 0.36572 0.05469 0.63232l0.03076 0.09571-3.09668 1.8081-0.14014-0.12646q-0.46143-0.39307-1.06298-0.51953-0.16748-0.04102-0.46143-0.04102-0.29395 0-0.46143 0.04102-0.60156 0.12646-1.05957 0.51953-0.45459 0.39307-0.66308 0.95019-0.08545 0.22559-0.1128 0.3794-0.02734 0.15381-0.02734 0.43408 0 0.28027 0.02734 0.43408 0.02734 0.15381 0.1128 0.3794 0.16748 0.4751 0.52978 0.84082 0.36572 0.3623 0.84082 0.52978 0.22559 0.08545 0.3794 0.11279 0.15381 0.02734 0.43408 0.02735 0.22559 0 0.30762-0.00684 0.08545-0.00684 0.19482-0.03418 0.58789-0.15381 1.02197-0.51953l0.14014-0.12646 3.09668 1.8081-0.01367 0.05469q-0.05811 0.18115-0.07178 0.46143-0.01367 0.28027 0.02734 0.50586 0.05811 0.33496 0.21875 0.66308 0.16064 0.32813 0.41358 0.58106 0.44775 0.46143 1.06299 0.62548 0.61523 0.16065 1.22363-0.00683 0.6084-0.1709 1.05957-0.63233 0.50244-0.5332 0.62891-1.24414 0.01367-0.1709 0.01367-0.43408 0-0.2666-0.04102-0.40674-0.1709-0.77246-0.7417-1.2749-0.46484-0.40674-1.08007-0.5332-0.18115-0.04102-0.46143-0.04102-0.28027 0-0.46143 0.04102-0.61523 0.12646-1.06298 0.51953-0.12646 0.11279-0.15723 0.09912l-3.07959-1.79443 0.04443-0.14014q0.02734-0.12646 0.02735-0.48877 0-0.3623-0.02735-0.48877l-0.04443-0.14014 0.21191-0.12646q2.79932-1.63721 2.86768-1.66797 0.03076-0.01367 0.15723 0.09912 0.4751 0.42041 1.11084 0.5332 0.63916 0.10938 1.22705-0.11279 0.68359-0.25293 1.09716-0.84765 0.41357-0.59473 0.41358-1.32276 0-0.39307-0.11279-0.72803-0.23584-0.70068-0.80323-1.13476-0.56738-0.43408-1.30908-0.4751l-0.19824 0z m0.33838 1.18945q0.22217 0.04102 0.41015 0.17432 0.19141 0.1333 0.31787 0.33154 0.22217 0.33496 0.18116 0.76905-0.01367 0.2085-0.09912 0.37255-0.08203 0.16064-0.25293 0.32813-0.16748 0.16748-0.35547 0.24609-0.18799 0.0752-0.44092 0.0752-0.25293 0-0.44092-0.0752-0.18799-0.07861-0.35888-0.24609-0.16748-0.16748-0.25293-0.32813-0.08203-0.16406-0.09571-0.37255-0.05469-0.44775 0.18115-0.78272 0.19824-0.29395 0.52637-0.42724 0.32813-0.1333 0.68018-0.06495z m-6.94531 4.08789q0.15381 0.04443 0.32128 0.1504 0.16748 0.10254 0.25977 0.21533 0.09229 0.10938 0.16064 0.24267 0.07178 0.1333 0.09913 0.2461 0.02734 0.11279 0.02734 0.28027 0 0.16748-0.02734 0.29395-0.07178 0.28027-0.3042 0.51953-0.229 0.23584-0.53662 0.32129-0.11279 0.02734-0.29395 0.02734-0.18115 0-0.29395-0.02734-0.30762-0.08545-0.54003-0.32129-0.229-0.23926-0.30079-0.53321-0.02734-0.11279-0.02734-0.28027 0-0.16748 0.02734-0.29395 0.05811-0.22559 0.22559-0.43408 0.16748-0.2085 0.40674-0.32129 0.34863-0.18115 0.79639-0.08545z m6.97265 4.0879q0.29394 0.0581 0.54688 0.30761 0.18115 0.18457 0.26318 0.37256 0.08545 0.18799 0.08545 0.44092 0 0.29395-0.11279 0.51611-0.22217 0.43408-0.68018 0.59815-0.45459 0.16064-0.88867-0.06494-0.19482-0.08203-0.34863-0.26319-0.15381-0.18457-0.22559-0.36572-0.06836-0.18115-0.06836-0.40674 0-0.22559 0.05469-0.39307 0.09912-0.26318 0.33496-0.47167 0.23926-0.21192 0.49219-0.27002 0.11279-0.02734 0.27343-0.02735 0.16065 0 0.27344 0.02735z" fill="#6B7280"></path>
                </svg>
              </div>
              <div data-pencil-name="SB bookmark" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <svg data-pencil-name="SI2" data-icon-name="bookmark" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M3.72559 1.20313q-0.56055 0.12646-0.93311 0.54003-0.36914 0.41357-0.44092 0.9878-0.02734 0.15381-0.02734 4.55615 0 4.40234 0.02734 4.52881 0.04102 0.36572 0.28028 0.63232 0.23926 0.26318 0.58789 0.34864 0.18115 0.04102 0.39648 0.0205 0.21875-0.02051 0.38623-0.10595 0.09912-0.04102 1.39453-0.78272 1.29541-0.7417 1.37744-0.78271 0.08545-0.04443 0.21875-0.04444 0.1333 0 0.2085 0.0376 0.07861 0.03418 1.3877 0.78272 1.30908 0.74854 1.4082 0.78955 0.22217 0.11279 0.50244 0.11279 0.43408 0 0.76221-0.28711 0.32813-0.28711 0.38623-0.70752 0.02734-0.14014 0.02734-4.54248 0-4.40234-0.02734-4.55615-0.07178-0.57422-0.45117-0.99463-0.37598-0.42041-0.93653-0.5332-0.10938-0.02734-0.57422-0.02735l-2.70019 0-2.67285 0q-0.47852 0.01367-0.58789 0.02735z m6.28564 1.14843q0.30762 0.04102 0.43408 0.32129l0.04102 0.09912 0.01367 4.43653q0 4.45361-0.02734 4.43994l-1.34327-0.76905q-1.33301-0.75879-1.46972-0.81347-0.32471-0.14014-0.71436-0.12647-0.22559 0.01367-0.36572 0.05127-0.14014 0.03418-0.29395 0.10596-0.15381 0.06836-1.44238 0.81006l-1.31592 0.7417q-0.01367 0.01367-0.02734-0.81348l0.01367-8.06299 0.04102-0.09912q0.05811-0.12646 0.16748-0.21533 0.11279-0.09229 0.23242-0.11279 0.11963-0.02051 3.03174-0.02051 2.91211 0 3.0249 0.02734z" fill="#6B7280"></path>
                </svg>
              </div>
              <div data-pencil-name="SB link" class="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
                <svg data-pencil-name="SI2" data-icon-name="link" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M9.36523 0.67334q-0.52979 0.06836-0.99462 0.29395-0.33496 0.16748-0.62891 0.38964-0.16748 0.12646-0.76904 0.72803-0.60156 0.60156-0.63233 0.67334-0.0957 0.18115-0.06152 0.36572 0.03418 0.18115 0.16748 0.31446 0.1333 0.12988 0.32812 0.16064 0.19824 0.02734 0.36573-0.07178 0.05469-0.02734 0.64257-0.60839 0.58789-0.58105 0.72803-0.68018 0.54688-0.37598 1.17578-0.43408 0.68701-0.05469 1.27491 0.25293 0.58789 0.30762 0.93994 0.90918 0.28027 0.47852 0.30761 1.05273 0.02734 0.5708-0.21191 1.09033-0.0957 0.18115-0.16748 0.29395-0.09912 0.14014-0.33496 0.39306-0.18115 0.18115-0.78613 0.78272-1.00488 1.02197-1.13135 1.10742-0.35205 0.28027-0.79981 0.3999-0.44775 0.11621-0.86816 0.06153-0.93652-0.11279-1.53809-0.84082-0.12646-0.14014-0.20507-0.19483-0.0752-0.05811-0.17432-0.08545-0.22217-0.06836-0.43408 0.04444-0.2085 0.10938-0.28028 0.33496-0.04102 0.16748-0.00683 0.30762 0.03418 0.14014 0.16064 0.30761 0.646 0.81348 1.62354 1.13477 0.98096 0.32129 1.97558 0.06836 0.72803-0.19482 1.34326-0.66992 0.12646-0.09912 1.12793-1.10059 1.00146-1.00146 1.09717-1.12793 0.58789-0.72803 0.7417-1.67822 0.04443-0.18115 0.04444-0.52295 0-0.34521-0.04444-0.52637-0.19482-1.17578-1.00488-1.96191-0.40674-0.40674-0.9126-0.65625-0.50244-0.25293-1.07666-0.32129-0.21191-0.03076-0.50586-0.03076-0.29395 0-0.4751 0.04443z m-4.01611 4.02979q-0.92627 0.12646-1.68164 0.70068-0.12646 0.11279-1.10742 1.08691-0.97754 0.9707-1.13135 1.13819-0.50586 0.61865-0.70068 1.37402-0.05469 0.24951-0.07862 0.42725-0.02051 0.17432-0.0205 0.45459 0 0.28027 0.01367 0.44775 0.01709 0.16748 0.08545 0.42041 0.18115 0.72803 0.67676 1.32959 0.49902 0.60156 1.17236 0.93652 0.72803 0.35205 1.52441 0.35205 0.84082 0 1.56885-0.36572 0.33496-0.16748 0.56396-0.34863 0.23242-0.18115 0.7793-0.7417 0.43408-0.43408 0.54004-0.54004 0.10596-0.10596 0.1333-0.17432 0.06836-0.22559-0.01025-0.43408-0.0752-0.21191-0.28369-0.30762-0.09912-0.0581-0.23926-0.0581l-0.01367 0q-0.14014 0-0.21192 0.03076-0.06836 0.02734-0.20849 0.15381-0.09912 0.0957-0.44776 0.44775l-0.02734 0.02735q-0.60156 0.58789-0.72803 0.68701-0.35205 0.24951-0.77246 0.36914-0.41699 0.11963-0.82373 0.07861-0.58789-0.0581-1.05957-0.35205-0.46826-0.29395-0.75537-0.78271-0.28711-0.49219-0.31445-1.06983-0.02734-0.58105 0.21191-1.10058 0.0957-0.18115 0.16748-0.29395 0.09912-0.14014 0.33496-0.39306 0.18115-0.18115 0.76904-0.78272 1.0083-1.0083 1.13477-1.10742 0.5332-0.40332 1.23389-0.4751 0.56055-0.04102 1.09033 0.18457 0.5332 0.22217 0.90918 0.68359 0.11279 0.12646 0.18799 0.18458 0.07861 0.05469 0.17773 0.08203 0.15381 0.04102 0.30762 0 0.15381-0.04102 0.27344-0.16065 0.11963-0.11963 0.14697-0.29394 0.02734-0.17773-0.04102-0.33155-0.03076-0.08203-0.16406-0.24267-0.12988-0.16064-0.27002-0.30078-0.40674-0.39307-0.92627-0.63575-0.51611-0.24609-1.09033-0.31787-0.14014-0.01367-0.44776-0.01367-0.30762 0-0.44775 0.02734z" fill="#6B7280"></path>
                </svg>
              </div>
            </div>
          </div>
          <div data-pencil-name="Content" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[16px] justify-start items-start">
            <div data-pencil-name="Para" class="text-[13px]/[24px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              يبدأ كثير من أصحاب المتاجر باختيار نظام ERP عشوائياً — إما حل ضخم مكلف أو أداة بسيطة
              لا تتحمل النمو. النتيجة: دفع زائد أو إعادة بناء بعد أشهر.
            </div>
            <div data-pencil-name="Para" class="text-[13px]/[24px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              في AMTDEX نطبّق معياراً بسيطاً: ابنِ ما تحتاجه اليوم، وصمم لما ستحتاجه غداً. هذا يعني
              modules منفصلة، API موحّد، وقاعدة بيانات مرنة.
            </div>
            <div data-pencil-name="Para" class="text-[13px]/[24px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              التكلفة ليست سعر الترخيص فقط — بل التدريب، التكامل، والدعم. الحل المخصص يبدو أغلى في
              البداية لكنه يوفّر 40% خلال 18 شهر مقارنة بحل جاهز يحتاج تخصيص مستمر.
            </div>
            <div data-pencil-name="Callout" class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[16px] justify-start items-start bg-[#EEF3FF] [outline:1px_solid_#CBD5FF] [outline-offset:-0.5px] rounded-[12px]">
              <div data-pencil-name="CB Icon" class="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[999px]">
                <svg data-pencil-name="CBI" data-icon-name="lightbulb" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
                  <path d="M6.76074 0.60156q-0.52979 0.02734-1.06299 0.19483-0.76904 0.25293-1.38769 0.7998-0.61523 0.54688-0.96387 1.26123-0.2085 0.43408-0.30762 0.82715-0.09912 0.38965-0.11279 0.86475-0.01367 0.4751 0.06152 0.84082 0.07861 0.3623 0.25977 0.7417 0.12646 0.2666 0.28711 0.49218 0.16064 0.22217 0.41357 0.48877 0.32129 0.32129 0.4751 0.57422 0.15381 0.24951 0.23926 0.52979 0.04102 0.1709 0.08203 0.23925 0.04443 0.06836 0.11279 0.14014 0.14014 0.12646 0.31446 0.14697 0.17773 0.02051 0.35888-0.06152 0.06836-0.04443 0.14356-0.1333 0.07861-0.09229 0.12304-0.17773 0.08203-0.24951-0.09912-0.7417-0.12646-0.32129-0.32129-0.61524-0.19482-0.29395-0.51953-0.64258-0.40332-0.43408-0.56738-0.75537-0.16064-0.32471-0.18799-0.74511-0.08203-1.30225 0.82715-2.23877 0.66992-0.70068 1.63721-0.8545 0.14014-0.01367 0.43408-0.01367 0.29395 0 0.43408 0.01367 0.64258 0.11279 1.17578 0.46485 0.5332 0.34863 0.86817 0.90918 0.33496 0.51611 0.41015 1.14843 0.07861 0.62891-0.11621 1.1587-0.08545 0.23926-0.21875 0.43066-0.12988 0.18799-0.38281 0.45117-0.42041 0.43408-0.63916 0.79981-0.21533 0.3623-0.32813 0.78271-0.0957 0.39307 0.12647 0.63233 0.15381 0.18115 0.38965 0.19482 0.23926 0.01367 0.42383-0.15381 0.08203-0.07178 0.11621-0.14014 0.0376-0.06836 0.07861-0.25293 0.08545-0.30762 0.23926-0.52978 0.15381-0.22559 0.48877-0.58789 0.23926-0.23926 0.36914-0.42041 0.1333-0.18457 0.25976-0.40674 0.28027-0.5332 0.35205-1.12109 0.02734-0.19482 0.02735-0.55713 0-0.36572-0.04102-0.56055-0.15381-0.86816-0.61865-1.58252-0.46143-0.71436-1.18945-1.18945-0.16748-0.11279-0.42041-0.23926-0.9502-0.4751-2.05762-0.40674l0.01367 0z m-1.66455 9.33789q-0.11279 0.02734-0.21875 0.11963-0.10254 0.09229-0.15381 0.18457-0.04785 0.08887-0.04785 0.25635 0 0.16748 0.04102 0.24609 0.04443 0.0752 0.12646 0.16065 0.08545 0.08203 0.15381 0.12646l0.08545 0.04102 3.83496 0 0.08545-0.04102q0.06836-0.04443 0.15039-0.12646 0.08545-0.08545 0.12647-0.16065 0.04443-0.07861 0.04443-0.24609 0-0.16748-0.04102-0.25293-0.09912-0.16748-0.28027-0.2666l-0.08545-0.05469-1.89014 0q-1.89014 0-1.93115 0.01367z m0.60156 2.32422q-0.08545 0.02734-0.18457 0.09229-0.0957 0.06152-0.13672 0.1333-0.14014 0.16748-0.12646 0.38623 0.01367 0.21533 0.18115 0.36914 0.12646 0.12646 0.29395 0.15381 0.11279 0.02734 1.2749 0.02734 1.16211 0 1.2749-0.02734 0.16748-0.02734 0.29395-0.15381 0.22217-0.22559 0.16748-0.51953-0.05469-0.29395-0.35205-0.43408l-0.08203-0.02735-1.26123-0.01367q-1.27148 0-1.34327 0.01367z" fill="#FFFFFF"></path>
                </svg>
              </div>
              <div data-pencil-name="Callout Text" class="text-[12px]/[19px] box-border [flex:1_1_0] text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left">
                نصيحة: ابدأ بـ CRM + مخزون فقط، ثم أضف المحاسبة والشحن لاحقاً — تقلل المخاطرة وتسرّع
                الإطلاق.
              </div>
            </div>
            <div data-pencil-name="More" class="[box-sizing:content-box] w-[1088px] h-[56.5px] shrink-0 flex flex-row gap-[12px] p-[16px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E8E5DF] [margin:-0.5px_0px_0px_0px]">
              <div data-pencil-name="More Label" class="text-[11px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
                مقالات ذات صلة
              </div>
              <div data-pencil-name="Next Art" class="box-border [flex:1_1_0] h-fit flex flex-row gap-0 p-[12px] justify-between items-center bg-[#F0EDE7] rounded-[10px]">
                <div data-pencil-name="Next Title" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                  Flutter vs Native — المقال التالي →
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