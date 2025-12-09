<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>JSB</title>

    {{-- Icon fonts actually used in Vue components --}}
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css" />
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    {{-- Main compiled CSS from Laravel Mix / Vite (Bootstrap, etc.) --}}
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    {{-- JSB / Landing-page custom styles --}}
{{--    <link href="{{ asset('css/styles.css') }}" rel="stylesheet">--}}
    <link rel="stylesheet" href="{{ asset('css/base.css') }}">
    <link rel="stylesheet" href="{{ asset('css/header.css') }}">
    <link rel="stylesheet" href="{{ asset('css/hero.css') }}">
    <link rel="stylesheet" href="{{ asset('css/components.css') }}">
    <link rel="stylesheet" href="{{ asset('css/jsb.css') }}">
    <link rel="stylesheet" href="{{ asset('css/animations.css') }}">
    <link rel="stylesheet" href="{{ asset('css/responsive.css') }}">
    <link rel="stylesheet" href="{{ asset('css/blog.css') }}">
    <link rel="stylesheet" href="{{ asset('css/projects/cp1.css') }}">

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
        .custom-font {
            font-family: 'Poppins', sans-serif;
        }
    </style>
</head>
<body>
@yield('content')

{{-- Vue SPA bundle --}}
<!-- Leaflet Fullscreen JS -->

<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
