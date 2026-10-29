<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">

    <title>{{ config('app.name', 'Amtdex') }} — حلول برمجية تصنع الفرق</title>
    <meta name="description" content="Amtdex — شركة حلول برمجية متكاملة: مواقع، تطبيقات، أنظمة ERP، ذكاء اصطناعي وأمن سيبراني. نصمم ونبني ونطلق.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Instrument+Sans:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <meta name="theme-color" content="#16064F">

    <script>
        window.__AMTDEX_CONFIG__ = {
            apiUrl: @json(url('/api/v1')),
            csrfToken: @json(csrf_token()),
            appName: @json(config('app.name', 'Amtdex')),
            basename: @json(rtrim(parse_url(url('/'), PHP_URL_PATH) ?? '', '/') ?: '/'),
            blogSubdomain: @json(env('BLOG_SUBDOMAIN', 'blog.amtdex.com')),
            isBlogSubdomain: @json(str_starts_with(request()->getHost(), 'blog.')),
            host: @json(request()->getHost()),
            scheme: @json(request()->getScheme())
        };
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
        @if($jsFile)
            <script type="module" src="{{ asset('build/' . $jsFile) }}"></script>
        @endif
    @else
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @endif
</head>
<body>
    <div id="root"></div>
</body>
</html>

