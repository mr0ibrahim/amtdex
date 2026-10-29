<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMTDEX SOFT — مركز المساعدة والدعم</title>
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
    <div class="amtdex-canvas-frame box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] relative overflow-x-clip" data-pencil-name="Help Page" class="box-border w-full max-w-[1440px] mx-auto h-fit [box-shadow:0px_12px_32px_#070B1A08] relative flex flex-col gap-0 justify-start items-start bg-[#FCFBF8] overflow-hidden">
        @include('partials.site-header')
        <div data-pencil-name="Hero" class="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[48px_40px] justify-start items-center bg-[#FFFFFF]">
          <a href="/help" style="text-decoration:none; color:inherit; display:contents;"><div data-pencil-name="Eyebrow" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
            مركز المساعدة
          </div></a>
          <div data-pencil-name="Title" class="text-[36px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-center [white-space:nowrap]">
            كيف يمكننا مساعدتك؟
          </div>
          <div data-pencil-name="Search" class="box-border w-[560px] h-[48px] shrink-0 flex flex-row gap-[12px] p-[0px_20px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[999px]">
            <svg data-pencil-name="Search Icon" data-icon-name="search" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[16px] shrink-0 h-[16px]">
              <path d="M6.00537 1.17578q-0.04102 0.01367-0.23584 0.02734-0.57422 0.07178-1.16211 0.29053-0.58789 0.21533-1.09375 0.5503-0.39307 0.2666-0.74853 0.61181-0.35547 0.3418-0.62207 0.7041-0.646 0.92285-0.86817 2.03028-0.05811 0.28027-0.07861 0.46142-0.02051 0.18115-0.02051 0.57422 0 0.43408 0.02734 0.68018 0.02734 0.24268 0.12647 0.59472 0.19482 0.75537 0.60156 1.43555 0.40674 0.67676 0.96729 1.18262 0.40674 0.3623 0.81689 0.60156 0.41357 0.23926 0.91944 0.43408 1.06299 0.39307 2.21826 0.29395 1.15527-0.09912 2.1499-0.65967 0.12646-0.06836 0.33496-0.2085 0.2085-0.14014 0.29395-0.21191l0.05468-0.05469 1.10743 1.10742q1.12109 1.104 1.20312 1.15528 0.08545 0.04785 0.23926 0.04785 0.15381 0 0.23584-0.03418 0.08545-0.0376 0.18115-0.1333 0.09912-0.09912 0.1333-0.18115 0.0376-0.08545 0.0376-0.23926 0-0.15381-0.05127-0.23584-0.04785-0.08545-1.15186-1.20654l-1.10742-1.10743 0.05469-0.06836q0.05811-0.05469 0.19824-0.25293 0.82373-1.23047 0.89209-2.70703 0.07178-1.47656-0.63916-2.76513-0.5332-0.96729-1.42187-1.64405-0.88867-0.68018-1.95508-0.9331-0.29395-0.06836-0.54004-0.09571-0.24268-0.03076-0.60498-0.04443-0.43408 0-0.49219 0z m0.7417 1.17578q0.37939 0.01367 0.79297 0.14014 0.41357 0.12646 0.78955 0.32129 0.7417 0.39307 1.28857 1.08008 0.54687 0.68359 0.75538 1.49707 0.07178 0.28027 0.09228 0.49902 0.02051 0.21533 0.02051 0.50928 0 0.70068-0.19483 1.30224-0.39307 1.16211-1.33984 1.91065-0.94336 0.74853-2.16016 0.875-0.19824 0.01367-0.49218 0.00683-0.29395-0.00684-0.48877-0.03418-0.5332-0.08545-1.03907-0.30761-0.50244-0.22559-0.93652-0.56055-0.14014-0.12646-0.35205-0.3418-0.2085-0.21875-0.33154-0.37256-0.57422-0.76904-0.7417-1.69531-0.08545-0.43408-0.06494-0.90918 0.02051-0.4751 0.11963-0.89551 0.29395-1.14844 1.18945-1.95849 0.89551-0.81348 2.05762-1.02539 0.18115-0.02734 0.42041-0.04102 0.23926-0.01367 0.34863-0.01367l0.2666 0.01367z" fill="#9AA0AB"></path>
            </svg>
            <div data-pencil-name="Search PH" class="text-[12px]/[normal] box-border text-[#9AA0AB] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              ابحث عن إجابة — مثلاً: كيف أتابع مشروعي؟
            </div>
          </div>
        </div>
        <div data-pencil-name="Categories" class="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[0px_40px_32px_40px] justify-start items-start bg-[#FFFFFF]">
          <div data-pencil-name="Cat البدء" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
            <div data-pencil-name="CI" class="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
              <svg data-pencil-name="CI Icon" data-icon-name="rocket" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                <path d="M12.41748 0.60156q-2.03027 0.08545-3.80762 1.14844-0.43408 0.25293-0.81347 0.56055-0.82373 0.62891-1.43897 1.45605l-0.1709 0.22217q-0.01367 0.01367-0.16748-0.02734-0.90918-0.18115-1.58252-0.14698-0.66992 0.03418-1.11767 0.28711-0.44775 0.25293-0.78614 0.76905-0.44775 0.65967-0.71435 1.72265-0.05469 0.25293-0.06152 0.3999-0.00684 0.14697 0.04785 0.25977 0.11279 0.2085 0.3247 0.29394 0.06836 0.02734 0.26319 0.02735l2.60449 0 1.42871 1.42871 0 2.60449q0 0.19482 0.02735 0.26318 0.08545 0.21192 0.29394 0.32471 0.14014 0.06836 0.38623 0.03418 0.24609-0.03418 0.72119-0.18799 1.59619-0.49219 2.05762-1.37402 0.50244-0.96387 0.12646-2.70019l-0.02734-0.12647q0-0.02734 0.02734-0.04443 0.0957-0.05469 0.54688-0.43409 1.16211-0.99121 1.86621-2.30712 0.70752-1.31592 0.90576-2.83008 0.02734-0.29395 0.04785-0.67676 0.02051-0.38623 0.00684-0.47168-0.04101-0.2085-0.18799-0.3418-0.14697-0.1333-0.37256-0.14697-0.12646 0-0.43408 0.01367z m-0.19482 1.24756q0 0.18115-0.09912 0.65625-0.4751 2.60449-2.68653 4.28613-0.42041 0.32129-0.99463 0.64258-0.57422 0.32129-1.17578 0.57422l-0.12646 0.05469-1.20313-1.2168 0.15381-0.32129q0.32129-0.72803 0.72803-1.36377 0.40674-0.63916 0.81006-1.11425 0.77246-0.86816 1.84228-1.44922 1.06982-0.58105 2.23194-0.76221 0.30762-0.04443 0.42041-0.04443l0.09912-0.01368 0 0.07178z m-7.21192 3.13428q0.43408 0.04102 0.47852 0.07178 0.02734 0.01367-0.06494 0.17431-0.08887 0.16064-0.25293 0.49903-0.16064 0.33496-0.24268 0.51611l-0.07178 0.16748-0.88183 0q-0.88184 0.01367-0.88184-0.01367 0-0.02734 0.0752-0.22217 0.07861-0.19824 0.15039-0.33838 0.22217-0.44775 0.4375-0.62207 0.21875-0.17432 0.59814-0.23242 0.30762-0.02734 0.65625 0z m3.96485 3.65381q0.01367 0.11279 0.04101 0.40674 0.04102 0.67334-0.12646 1.04931-0.14014 0.30762-0.71436 0.57422-0.11279 0.07178-0.33154 0.15723-0.21533 0.08203-0.24268 0.08203-0.02734 0-0.01367-0.88184l0-0.88183 0.34863-0.15381q0.36572-0.15381 0.67334-0.31446 0.30762-0.16406 0.32129-0.16406 0.01367 0 0.04444 0.12647z m-5.81055 0.12646q-0.22559 0.02734-0.45801 0.1333-0.229 0.10596-0.41015 0.2461-0.5332 0.42041-0.88184 1.30224-0.19824 0.48877-0.36572 1.14844-0.16748 0.65625-0.16748 0.9502 0 0.14014 0.03418 0.22558 0.0376 0.08203 0.1333 0.18115 0.09912 0.0957 0.18115 0.1333 0.08545 0.03418 0.22558 0.03418 0.30762 0 1.01514-0.18115 0.70752-0.18457 1.18262-0.39306 0.75537-0.32129 1.14844-0.78272 0.39307-0.46484 0.46142-1.09375 0-0.11279-0.01367-0.28711-0.01367-0.17432-0.04102-0.28711-0.12646-0.4751-0.47851-0.81689-0.34863-0.34521-0.82373-0.48535-0.14014-0.02734-0.41358-0.03418-0.27344-0.00684-0.32812 0.00683z m0.38965 1.16211q0.1709 0.02734 0.29394 0.11963 0.12646 0.09229 0.18457 0.229 0.05469 0.11279 0.05469 0.25977 0 0.14697-0.02734 0.24609-0.19824 0.56055-1.65088 0.96729-0.19824 0.05469-0.20508 0.04101-0.00684-0.01367 0.08203-0.30761 0.09229-0.29395 0.15039-0.46143 0.32129-0.85449 0.70069-1.03906 0.10938-0.05469 0.30761-0.06836 0.01367 0 0.10938 0.01367z" fill="#FFFFFF"></path>
              </svg>
            </div>
            <div data-pencil-name="Cat Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              البدء
            </div>
            <div data-pencil-name="Cat Desc" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              إنشاء حساب وتقديم أول مشروع
            </div>
            <div data-pencil-name="Cat Count" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              8 مقالات
            </div>
          </div>
          <div data-pencil-name="Cat المشاريع" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
            <div data-pencil-name="CI" class="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
              <svg data-pencil-name="CI Icon" data-icon-name="folder-kanban" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                <path d="M1.97559 1.20313q-0.47852 0.09912-0.83741 0.44433-0.35547 0.3418-0.4956 0.80322-0.04102 0.14014-0.04102 0.34864-0.01367 0.2666-0.02734 1.13476l0.01367 6.23096q0.01367 0.61523 0.02734 0.69726 0.11279 0.45117 0.40674 0.78614 0.29395 0.33496 0.72803 0.50244l0.04102 0.01367q0.12646 0.04443 0.30761 0.05811 0.2666 0.01367 1.14844 0.02734l7.44775 0q0.9126 0 1.17578-0.02734 0.18457-0.01367 0.31104-0.05811l0.04102-0.01367q0.37598-0.12646 0.66308-0.39648 0.28711-0.27344 0.42725-0.65284l0.01367-0.04101q0.04443-0.12646 0.05811-0.25293 0.02734-0.18115 0.02734-0.71436l0-2.39258q0.01367-3.03857 0-3.20605-0.07178-0.50586-0.34863-0.88184-0.36572-0.4751-0.96729-0.64599l-0.14014-0.04102-4.71679-0.01367q-0.33838-0.01367-0.40674-0.02734-0.09912-0.04443-0.19141-0.14014-0.08887-0.09912-0.27002-0.36572-0.21191-0.32129-0.3247-0.4751-0.41699-0.56055-1.09034-0.70068-0.09912-0.02734-0.33496-0.02735l-1.14843 0-1.16211 0q-0.22559 0.01367-0.33496 0.02735z m2.89502 1.18945q0.11279 0.05811 0.1538 0.10596 0.04443 0.04785 0.32471 0.45459 0.38965 0.56055 0.58789 0.72802 0.29395 0.23926 0.66992 0.35205l0.14014 0.04102 2.52246 0q2.51904 0.01367 2.57373 0.03418 0.05811 0.02051 0.14014 0.07861 0.08545 0.05469 0.12646 0.09912 0.04102 0.04102 0.08545 0.13672l0.04102 0.09912 0 6.13184-0.04102 0.09912q-0.11279 0.2085-0.32471 0.29395l-0.0957 0.02734-8.96191 0q-0.61523 0-0.6836-0.02734-0.21191-0.08545-0.3247-0.29395l-0.04102-0.09912 0-7.88184 0.04102-0.09912q0.05811-0.12646 0.16748-0.21533 0.11279-0.09229 0.25293-0.10596 0.09912-0.01367 1.31592-0.01367l1.20654 0 0.12305 0.05469z m-0.34864 2.87109q-0.11279 0.02734-0.21875 0.11279-0.10254 0.08203-0.15381 0.18116-0.04785 0.09912-0.06152 0.31787-0.01367 0.21533-0.01367 1.12451 0 0.90918 0.01367 1.12793 0.01367 0.21533 0.05469 0.31445 0.04443 0.06836 0.11963 0.14014 0.07861 0.06836 0.16064 0.11279 0.23926 0.10938 0.48194 0 0.24609-0.11279 0.31787-0.36572 0.02734-0.08203 0.02734-1.32959 0-1.24756-0.02734-1.32959-0.05811-0.18115-0.19825-0.28711-0.13672-0.10596-0.32129-0.11963-0.11279-0.01367-0.18115 0z m2.33789 0q-0.12646 0.02734-0.23925 0.1333-0.10938 0.10596-0.16748 0.23242-0.02734 0.06836-0.02735 0.18116 0 0.11279 0 0.6289l0 0.72803 0.04102 0.08545q0.04443 0.06836 0.12646 0.15381 0.08545 0.08203 0.16065 0.12646 0.07861 0.04102 0.24609 0.04102 0.16748 0 0.24268-0.04102 0.07861-0.04443 0.16064-0.12646 0.08545-0.08545 0.12988-0.15381l0.04102-0.08545 0-0.72803q0-0.51611 0-0.6289 0-0.11279-0.02734-0.18116-0.08545-0.19824-0.27344-0.30078-0.18799-0.10596-0.41358-0.06494z m2.33789 0q-0.08545 0.02734-0.18457 0.09229-0.0957 0.06152-0.15039 0.1333l-0.01367 0.01367q-0.05811 0.08203-0.07178 0.16748-0.01367 0.11279-0.02734 0.4751l0.01367 3.33252 0.04102 0.09912q0.04443 0.08203 0.11279 0.16064 0.07178 0.0752 0.14014 0.1128 0.07178 0.03418 0.16748 0.04785 0.23926 0.04102 0.43408-0.09229 0.19824-0.1333 0.23926-0.36914 0.02734-0.09912 0.02734-1.84912 0-1.75-0.02734-1.86279-0.02734-0.16748-0.15381-0.29395-0.09912-0.11279-0.25293-0.15381-0.15381-0.04102-0.29395-0.01367z" fill="#FFFFFF"></path>
              </svg>
            </div>
            <a href="/projects" style="text-decoration:none; color:inherit; display:contents;"><div data-pencil-name="Cat Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              المشاريع
            </div></a>
            <div data-pencil-name="Cat Desc" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              المتابعة، المراجعات، والتسليم
            </div>
            <div data-pencil-name="Cat Count" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              12 مقال
            </div>
          </div>
          <div data-pencil-name="Cat الفواتير" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
            <div data-pencil-name="CI" class="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
              <svg data-pencil-name="CI Icon" data-icon-name="credit-card" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                <path d="M2.15674 2.35156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.3794-0.30762 0.32129-0.43408 0.79638l-0.04102 0.1709 0 6.29932 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 9.83008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-6.33008-0.04102-0.16748q-0.12646-0.46143-0.43408-0.76904-0.44775-0.48877-1.13476-0.56055-0.16748-0.01367-4.81592-0.01367-4.64844 0-4.82959 0.02734z m9.74463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0.01367 1.30225-10.5 0 0.01367-1.30225 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 4.85694-0.02734l4.76123 0.01367 0.09912 0.04102z m0.34863 4.67578l-0.01367 1.82178-0.02735 0.08545q-0.12646 0.26318-0.37939 0.33496-0.08203 0.02734-4.82959 0.02734-4.74756 0-4.82959-0.02734-0.25293-0.07178-0.37939-0.33496l-0.02735-0.08545-0.01367-3.62647 10.5 0 0 1.80469z" fill="#FFFFFF"></path>
              </svg>
            </div>
            <div data-pencil-name="Cat Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              الفواتير
            </div>
            <div data-pencil-name="Cat Desc" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              الدفعات، الفواتير، والضرائب
            </div>
            <div data-pencil-name="Cat Count" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              6 مقالات
            </div>
          </div>
          <div data-pencil-name="Cat الأمان" class="box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#F0EDE7] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[16px]">
            <div data-pencil-name="CI" class="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#0A66FF] rounded-[10px]">
              <svg data-pencil-name="CI Icon" data-icon-name="shield-check" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[18px] shrink-0 h-[18px]">
                <path d="M6.84619 0.60156q-0.34863 0.02734-0.68701 0.30762-0.51611 0.42041-1.00147 0.70068-0.48193 0.28027-1.01513 0.4751-0.30762 0.11279-0.58789 0.1709-0.28027 0.05469-0.66992 0.08203-0.23926 0.01367-0.36573 0.07178-0.19482 0.06836-0.37939 0.22217-0.18115 0.15381-0.26319 0.34863l-0.01367 0.03076q-0.07178 0.12646-0.08545 0.22217-0.01367 0.15381-0.02734 0.60156l0 1.78076q0 2.25244 0.01367 2.46094 0.14014 1.6543 1.10742 2.88477 0.14014 0.16748 0.43409 0.46142 0.29395 0.29394 0.48877 0.44775 0.92285 0.7417 2.2832 1.27491 0.46143 0.18115 0.65625 0.23926 0.23926 0.05469 0.43408 0.01367 0.16748-0.02734 0.5332-0.15381 1.35693-0.51953 2.27979-1.20313 0.37939-0.2666 0.71435-0.60498 1.37402-1.3706 1.54151-3.37353 0.01367-0.23584 0.01367-2.46094 0-2.22852-0.02734-2.35498-0.07178-0.32129-0.31787-0.56396-0.24268-0.24609-0.5503-0.31788-0.09912-0.02734-0.37939-0.04101-0.48877-0.02734-0.96387-0.18115-0.81348-0.2666-1.55518-0.77246-0.2666-0.18115-0.64257-0.48877-0.42041-0.33496-0.96729-0.28028z m0.43408 1.34326q0.64258 0.51953 1.32959 0.86817 1.2168 0.61865 2.25244 0.68701l0.21192 0-0.01367 4.31348q0 0.33496-0.02735 0.50244-0.22559 1.34326-1.1416 2.27637-0.91602 0.92969-2.66601 1.57226l-0.21192 0.08545-0.18115-0.05469q-2.32422-0.85449-3.2334-2.22851-0.47852-0.71436-0.63232-1.63721-0.02734-0.18115-0.02735-0.50244l-0.01367-4.32715 0.19483 0q0.86816-0.05469 1.84912-0.48193 0.98096-0.42725 1.83545-1.12793 0.16748-0.14014 0.19482-0.14014 0.02734 0 0.28027 0.19482z m1.32959 3.31885q-0.06836 0.02734-0.12646 0.05127-0.05469 0.02051-1.06299 1.02539l-0.99463 0.99463-0.40674-0.40332q-0.2666-0.2666-0.3623-0.33838-0.12646-0.11279-0.19824-0.14013-0.06836-0.02734-0.19483-0.02735-0.12646 0-0.16748 0.01367-0.04102 0.01367-0.09912 0.04102-0.18115 0.09912-0.28027 0.2666-0.04102 0.08545-0.04102 0.25293l0 0.01367q0 0.14014 0.03418 0.21192 0.0376 0.06836 0.17774 0.22216 0.0957 0.11279 0.48876 0.50586l0.04102 0.04102q0.42041 0.42041 0.55371 0.54687 0.1333 0.12305 0.20166 0.15381 0.14014 0.06836 0.29395 0.05469 0.15381-0.01367 0.28027-0.09912 0.07178-0.05469 1.28857-1.27149 0.86816-0.86816 1.04932-1.06298 0.18457-0.19824 0.21192-0.27002 0.0957-0.27686-0.05811-0.52295-0.15381-0.24609-0.44775-0.25977-0.12646-0.01367-0.18116 0z" fill="#FFFFFF"></path>
              </svg>
            </div>
            <div data-pencil-name="Cat Title" class="text-[14px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              الأمان
            </div>
            <div data-pencil-name="Cat Desc" class="text-[11px]/[normal] box-border text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left [white-space:nowrap]">
              الخصوصية، الصلاحيات، والنسخ
            </div>
            <div data-pencil-name="Cat Count" class="text-[11px]/[normal] box-border text-[#0A66FF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              5 مقالات
            </div>
          </div>
        </div>
        <div data-pencil-name="FAQ" class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[32px_40px] justify-start items-start bg-[#F0EDE7]">
          <div data-pencil-name="FAQ Title" class="text-[22px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
            الأسئلة الشائعة
          </div>
          <div data-pencil-name="QA" class="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
            <div data-pencil-name="Q" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              كيف أتابع تقدم مشروعي؟
            </div>
            <div data-pencil-name="A" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              من لوحة التحكم → المشاريع → اختر مشروعك. ستجد الجدول الزمني، الملفات، والتعليقات مع
              تحديث أسبوعي من مدير المشروع.
            </div>
          </div>
          <div data-pencil-name="QA" class="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
            <div data-pencil-name="Q" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              هل يمكنني طلب تعديل بعد التسليم؟
            </div>
            <div data-pencil-name="A" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              نعم، التعديلات الطفيفة مجانية لـ 30 يوم. التعديلات الكبيرة تُسعّر بشكل منفصل حسب
              الجهد.
            </div>
          </div>
          <div data-pencil-name="QA" class="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E8E5DF] [outline-offset:-0.5px] rounded-[12px]">
            <div data-pencil-name="Q" class="text-[13px]/[normal] box-border text-[#070B1A] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              كيف أدفع الفواتير؟
            </div>
            <div data-pencil-name="A" class="text-[12px]/[20px] box-border w-full text-[#6B7280] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-normal text-left">
              عبر التحويل البنكي أو رابط الدفع الإلكتروني المرفق بالفاتورة. الفواتير تصدر مرحلياً مع
              التسليم.
            </div>
          </div>
        </div>
        <div data-pencil-name="Help CTA" class="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] p-[20px_40px] justify-between items-center bg-[#070B1A]">
          <div data-pencil-name="CTA Text" class="text-[13px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
            لم تجد ما تبحث عنه؟ فريقنا يرد خلال ساعتين.
          </div>
          <div data-pencil-name="CTA Btn" class="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[10px_20px] justify-center items-center bg-[#0A66FF] rounded-[999px]">
            <div data-pencil-name="Btn Text" class="text-[12px]/[normal] box-border text-[#FFFFFF] font-['IBM_Plex_Sans_Arabic',system-ui,sans-serif] font-bold text-left [white-space:nowrap]">
              تواصل مع الدعم
            </div>
            <svg data-pencil-name="Btn Icon" data-icon-name="message-circle" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="box-border w-[14px] shrink-0 h-[14px]">
              <path d="M6.80518 0.58789q-0.5332 0.01367-1.10059 0.1333-0.56738 0.11963-1.06982 0.31445-1.3877 0.56055-2.396 1.67481-1.0083 1.11084-1.41162 2.55322-0.30762 1.09375-0.22559 2.21485 0.08545 1.11768 0.54688 2.15332l0.01367 0.04101q0.06836 0.14014 0.07519 0.22559 0.01025 0.08203-0.04785 0.29394-0.04102 0.15381-0.20849 0.66992l-0.05811 0.14014q-0.30762 0.98096-0.33496 1.1211-0.01367 0.16748 0.02734 0.37255 0.04443 0.20166 0.14014 0.35547 0.05811 0.09912 0.17432 0.21875 0.11963 0.11621 0.21875 0.17432 0.16748 0.0957 0.3623 0.14014 0.19824 0.04101 0.3794 0.02734 0.12646-0.02734 1.14843-0.32129l0.14014-0.04443q0.54688-0.15381 0.70068-0.19483 0.22217-0.05469 0.29737-0.04785 0.07861 0.00684 0.20508 0.06152l0.02734 0.01368q0.88184 0.37939 1.97559 0.50586 0.16748 0.02734 0.59472 0.02734 0.42725 0 0.62207-0.02734 0.85449-0.08545 1.64405-0.3794 0.79297-0.29395 1.47998-0.78271 0.93652-0.65967 1.5791-1.60987 0.646-0.95361 0.92627-2.05761 0.28027-1.10742 0.15381-2.23877-0.12647-1.13477-0.646-2.17383-0.66992-1.35693-1.90381-2.27979-1.23047-0.92627-2.72754-1.17578-0.63232-0.11279-1.30224-0.09912z m0.58789 1.17578q1.38428 0.11279 2.5122 0.86133 1.12793 0.74854 1.77051 1.98242 0.40674 0.79639 0.5332 1.75 0.02734 0.22217 0.02735 0.64258 0 0.42041-0.02735 0.65967-0.16748 1.24414-0.85449 2.26611-0.68701 1.02197-1.76367 1.63721-0.57422 0.32471-1.24756 0.50586-0.66992 0.18115-1.32959 0.18115-1.07666 0-2.12597-0.44775-0.19824-0.08545-0.31788-0.11963-0.11621-0.03418-0.28711-0.04785-0.23584-0.01367-0.45458 0.02734-0.21533 0.04102-1.04249 0.28027-1.0083 0.29395-1.01513 0.28711-0.00684-0.00684 0.30078-0.95703 0.30762-0.95361 0.32129-1.10742 0.07178-0.44775-0.14014-0.9126l-0.14014-0.34863q-0.38965-0.96729-0.3623-2.03711 0.02734-1.06982 0.46143-2.02344 0.44775-0.99463 1.25097-1.72265 0.80664-0.72803 1.82178-1.0835 1.01514-0.35547 2.10889-0.27344z" fill="#FFFFFF"></path>
            </svg>
          </div>
        </div>
@include('partials.site-footer')
</div>
</div>
</body>
</html>