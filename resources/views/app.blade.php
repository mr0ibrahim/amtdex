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
            basename: @json(rtrim(parse_url(url('/'), PHP_URL_PATH) ?? '', '/') ?: '/')
        };
    </script>

    @php
        if (file_exists(public_path('hot')) && !app()->isLocal()) {
            @unlink(public_path('hot'));
        }
    @endphp
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>

