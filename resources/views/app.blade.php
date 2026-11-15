<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-content">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">

    <title>AMTDEX SOFT — هندسة الفكرة قبل برمجتها</title>
    <meta name="description" content="امتدكس سوفت للبرمجيات وتقنية المعلومات والأنظمة. من الفكرة إلى التنفيذ. اليمن - إب.">
    @php
        $googleSiteVerification = trim((string) config('services.google.site_verification', ''));
        if ($googleSiteVerification === '') {
            try {
                $fromSettings = \App\Models\BlogSetting::get('google_search_console', '');
                $googleSiteVerification = is_string($fromSettings) ? trim($fromSettings) : '';
            } catch (\Throwable) {
                $googleSiteVerification = '';
            }
        }
        if (str_starts_with($googleSiteVerification, 'google-site-verification=')) {
            $googleSiteVerification = trim(substr($googleSiteVerification, strlen('google-site-verification=')));
        }
    @endphp
    @if($googleSiteVerification !== '')
        <meta name="google-site-verification" content="{{ $googleSiteVerification }}">
    @endif

    <link rel="preload" as="font" type="font/woff2" crossorigin href="{{ asset('fonts/ibm-plex-sans-arabic.woff2') }}">
    <link rel="ard" type="application/json" href="{{ asset('.well-known/ard.json') }}">
    <meta name="theme-color" content="#461667">
    {{-- Link previews (WhatsApp, X, Telegram) read the first HTML response and run no JavaScript.
         data-rh hands these tags to the client SEO component once the page is running. --}}
    <meta property="og:site_name" content="AMTDEX SOFT" data-rh="true">
    <meta property="og:type" content="website" data-rh="true">
    <meta property="og:locale" content="ar_AR" data-rh="true">
    <meta property="og:title" content="AMTDEX SOFT — هندسة الفكرة قبل برمجتها" data-rh="true">
    <meta property="og:description" content="امتدكس سوفت للبرمجيات وتقنية المعلومات والأنظمة. من الفكرة إلى التنفيذ." data-rh="true">
    <meta property="og:image" content="{{ asset('images/og-amtdex.jpg') }}" data-rh="true">
    <meta property="og:image:width" content="1200" data-rh="true">
    <meta property="og:image:height" content="630" data-rh="true">
    <meta name="twitter:card" content="summary_large_image" data-rh="true">
    <meta name="twitter:image" content="{{ asset('images/og-amtdex.jpg') }}" data-rh="true">
    @if(\App\Support\DashboardHost::matches() || request()->is('dashboard', 'dashboard/*', 'login'))
        <meta name="robots" content="noindex, nofollow">
    @endif

    <script>
        window.__AMTDEX_CONFIG__ = {
            apiUrl: @json(url('/api/v1')),
            csrfToken: @json(csrf_token()),
            appName: @json(config('app.name', 'Amtdex')),
            appEnv: @json(config('app.env')),
            basename: @json(rtrim(parse_url(url('/'), PHP_URL_PATH) ?? '', '/') ?: '/'),
            blogSubdomain: @json(env('BLOG_SUBDOMAIN', 'blog.amtdex.com')),
            isBlogSubdomain: @json(str_starts_with(request()->getHost(), 'blog.')),
            dashboardDomain: @json(\App\Support\DashboardHost::isolated() ? \App\Support\DashboardHost::name() : ''),
            isDashboardHost: @json(\App\Support\DashboardHost::matches()),
            publicHost: @json(parse_url((string) config('app.url'), PHP_URL_HOST) ?: request()->getHost()),
            host: @json(request()->getHost()),
            scheme: @json(request()->getScheme()),
            googleSiteVerification: @json($googleSiteVerification !== '' ? $googleSiteVerification : null)
        };
        window.__CMS_VISIBILITY__ = @json(\App\Support\PageVisibility::bootstrap());
    </script>

    @php
        $manifestPath = public_path('build/manifest.json');
        $useManifest = file_exists($manifestPath) && (!app()->isLocal() || !file_exists(public_path('hot')));
    @endphp
    @if($useManifest)
        @php
            $manifest = json_decode(file_get_contents($manifestPath), true);
            $cssFile = $manifest['resources/css/app.css']['file'] ?? null;
            $jsFile = $manifest['resources/js/app.tsx']['file'] ?? null;
        @endphp
        @if($cssFile)
            <link rel="stylesheet" href="{{ asset('build/' . $cssFile) }}">
        @endif
        @php
            // Preload the active route and shared imports in parallel with the entry.
            $preloads = [];
            $collectImports = function ($key) use (&$collectImports, &$preloads, $manifest) {
                if (!isset($manifest[$key]) || isset($preloads[$key])) return;
                $preloads[$key] = $manifest[$key]['file'];
                foreach ($manifest[$key]['imports'] ?? [] as $import) $collectImports($import);
            };
            foreach ($manifest['resources/js/app.tsx']['imports'] ?? [] as $import) $collectImports($import);
            $routeEntries = [
                '/' => str_starts_with(request()->getHost(), 'blog.') ? 'Blog/BlogHomePage' : 'Home/HomePage',
                '/services' => 'Services/ServicesPage', '/about' => 'About/AboutPage',
                '/contact' => 'Contact/ContactPage', '/portfolio' => 'Portfolio/PortfolioPage',
            ];
            $routeEntry = $routeEntries['/' . trim(request()->path(), '/')] ?? null;
            if ($routeEntry) $collectImports('resources/js/pages/' . $routeEntry . '.tsx');
        @endphp
        @foreach(array_unique($preloads) as $preload)
            @if(str_ends_with($preload, '.js'))
                <link rel="modulepreload" href="{{ asset('build/' . $preload) }}">
            @endif
        @endforeach
        @if($jsFile)
            <script type="module" src="{{ asset('build/' . $jsFile) }}"></script>
        @endif
    @else
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @endif
</head>
<body>
    <div id="root"><p style="font-family:system-ui,sans-serif;padding:24px">AMTDEX SOFT — حلول برمجية تصنع الفرق</p></div>
</body>
</html>

