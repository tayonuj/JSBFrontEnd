<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @php
        $versionedAsset = static function (string $path): string {
            $normalizedPath = '/' . ltrim($path, '/');
            $manifestPath = public_path('mix-manifest.json');

            if (is_file($manifestPath)) {
                $manifest = json_decode(file_get_contents($manifestPath), true) ?: [];

                if (isset($manifest[$normalizedPath])) {
                    return asset(ltrim($manifest[$normalizedPath], '/'));
                }
            }

            $publicFilePath = public_path(ltrim($path, '/'));

            if (is_file($publicFilePath)) {
                return asset(ltrim($path, '/')) . '?v=' . filemtime($publicFilePath);
            }

            return asset(ltrim($path, '/'));
        };
    @endphp
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>JSB</title>

    {{-- Icon fonts actually used in Vue components --}}
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css" />
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    {{-- Main compiled CSS from Laravel Mix / Vite (Bootstrap, etc.) --}}
    <link href="{{ $versionedAsset('css/app.css') }}" rel="stylesheet">

    {{-- JSB / Landing-page custom styles --}}
{{--    <link href="{{ asset('css/styles.css') }}" rel="stylesheet">--}}
    <link rel="stylesheet" href="{{ $versionedAsset('css/base.css') }}">
    <link rel="stylesheet" href="{{ $versionedAsset('css/header.css') }}">
    <link rel="stylesheet" href="{{ $versionedAsset('css/hero.css') }}">
    <link rel="stylesheet" href="{{ $versionedAsset('css/components.css') }}">
    <link rel="stylesheet" href="{{ $versionedAsset('css/jsb.css') }}">
    <link rel="stylesheet" href="{{ $versionedAsset('css/animations.css') }}">
    <link rel="stylesheet" href="{{ $versionedAsset('css/responsive.css') }}">
    <link rel="stylesheet" href="{{ $versionedAsset('css/blog.css') }}">
    <link rel="stylesheet" href="{{ $versionedAsset('css/projects/cp1.css') }}">

    {{-- Leaflet for JSB map --}}
    <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossorigin=""
    />
    <script
            src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossorigin=""
    ></script>

    <!-- Leaflet Fullscreen CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet.fullscreen/dist/Control.FullScreen.css" />


    <script src="https://unpkg.com/leaflet.fullscreen/dist/Control.FullScreen.umd.js"></script>


    {{-- Fonts used for headings / custom-font class --}}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700%7cPoppins:300,400,500,600,700,800,900&display=swap"
            rel="stylesheet">

    <style>
        :root {
            --jsb-app-font: 'Poppins', sans-serif;
        }

        html,
        body,
        body *,
        input,
        button,
        select,
        textarea {
            font-family: var(--jsb-app-font);
        }

        .custom-font {
            font-family: var(--jsb-app-font);
        }
    </style>
</head>
<body>
@yield('content')

{{--Chat API--}}

{{-- <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
<script type="module">
    import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

    createChat({
        webhookUrl: 'https://shia.logifortech.com/webhook/6f0ca8e3-3b24-49dc-a313-e560186e3af0/chat',
        initialMessages: [
            'Hi there! 👋',
            'I\'m G Sentry AI. How can I assist you today?'
        ],
    });
</script> --}}
{{-- Vue SPA bundle --}}
<!-- Leaflet Fullscreen JS -->

<script src="{{ $versionedAsset('js/app.js') }}"></script>
</body>
</html>
