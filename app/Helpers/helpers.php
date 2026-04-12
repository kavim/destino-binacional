<?php

if (! function_exists('googleMapsEmbedHttpsUrlIsAllowed')) {

    /** Apenas HTTPS + host Google + caminho típico de embed (/maps/embed). */
    function googleMapsEmbedHttpsUrlIsAllowed(string $url): bool
    {
        $parts = parse_url($url);
        if (($parts['scheme'] ?? '') !== 'https') {
            return false;
        }
        $host = strtolower($parts['host'] ?? '');
        $isGoogle = $host === 'www.google.com'
            || $host === 'google.com'
            || $host === 'maps.google.com'
            || str_ends_with($host, '.google.com');
        if (! $isGoogle) {
            return false;
        }
        $path = strtolower($parts['path'] ?? '');

        return str_contains($path, '/maps/embed');
    }
}

if (! function_exists('extractSrcFromGmapsIframe')) {

    function extractSrcFromGmapsIframe(?string $google_maps_src): ?string
    {
        if (is_null($google_maps_src)) {
            return null;
        }

        $candidates = [];

        if (str_starts_with($google_maps_src, 'http')) {
            $candidates[] = $google_maps_src;
        }

        if (preg_match('~iframe[^>]+src="([^"]*)"~i', $google_maps_src, $m) && ! empty($m[1])) {
            $candidates[] = $m[1];
        }

        foreach ($candidates as $raw) {
            $raw = trim($raw);
            if ($raw !== '' && googleMapsEmbedHttpsUrlIsAllowed($raw)) {
                return $raw;
            }
        }

        return null;
    }

}

if (! function_exists('parse_money')) {
    function parse_money(?string $parse_money): ?string
    {
        // get only the numbers for example from 20,43 to be 2043, and from 20.43 to be 2043.
        // We have to currency and for pesos Uruguayos we don't need to multiply by 100

        return is_null($parse_money) ? null : preg_replace('/[^0-9]/', '', $parse_money);
    }
}

if (! function_exists('convert_to_cents')) {
    function convert_to_cents(string|int|float|null $value): int
    {
        if ($value === null || $value === '') {
            return 0;
        }

        if (is_int($value) || is_float($value)) {
            return (int) round((float) $value * 100);
        }

        // Valor já normalizado do front (ex.: "1234.56") ou máscara legada
        $value = str_replace(['UYU', 'BRL', 'R$', ' ', ' '], '', (string) $value);
        $value = trim($value);

        // pt-BR: 1.234,56 → último separador , é decimal
        if (str_contains($value, ',') && (! str_contains($value, '.') || strrpos($value, ',') > strrpos($value, '.'))) {
            $value = str_replace('.', '', $value);
            $value = str_replace(',', '.', $value);
        } else {
            // 1,944.50 ou 1234.56
            $value = str_replace(',', '', $value);
        }

        $value = preg_replace('/[^0-9.]/', '', $value);

        if ($value === '' || $value === '.') {
            return 0;
        }

        return (int) round((float) $value * 100);
    }
}

if (! function_exists('public_asset_path')) {
    /**
     * Caminho relativo a ficheiros em public/ (não depende de APP_URL).
     */
    function public_asset_path(string $path): string
    {
        return '/'.ltrim(str_replace('\\', '/', $path), '/');
    }
}

if (! function_exists('public_href')) {
    /**
     * URL absoluta para o browser, usando a raiz do pedido HTTP quando existir
     * (via ForceRequestRootUrl + url()). Mantém URLs http(s) externas.
     */
    function public_href(string $pathOrUrl): string
    {
        $t = trim($pathOrUrl);
        if ($t === '') {
            return $t;
        }
        if (str_starts_with($t, 'http://') || str_starts_with($t, 'https://')) {
            return $t;
        }

        $path = '/'.ltrim(str_replace('\\', '/', $t), '/');

        return url($path);
    }
}

if (! function_exists('public_storage_url')) {
    /**
     * URL relativa ao symlink public/storage → storage/app/public.
     */
    function public_storage_url(string $path): string
    {
        return '/storage/'.ltrim(str_replace('\\', '/', $path), '/');
    }
}

if (! function_exists('public_storage_file_url')) {
    /**
     * URL pública para ficheiro no disco public (ex.: places/foo.jpg).
     * Evita APP_URL errado em dev e prefixos duplicados (places/places/).
     *
     * @param  string  $directory  Ex.: places, events, tours
     */
    function public_storage_file_url(?string $filename, string $directory): string
    {
        if ($filename === null || trim((string) $filename) === '') {
            return public_href(public_asset_path('images/parque.webp'));
        }

        $v = trim((string) $filename);
        if (str_starts_with($v, 'http://') || str_starts_with($v, 'https://')) {
            return $v;
        }

        $v = ltrim($v, '/');
        $v = preg_replace('#^storage/#', '', $v) ?? '';
        $dir = trim(str_replace('\\', '/', $directory), '/');
        $v = preg_replace('#^'.preg_quote($dir, '#').'/#', '', $v) ?? '';
        if ($v === '' || str_contains($v, '..')) {
            return public_href(public_asset_path('images/parque.webp'));
        }

        return public_href(public_storage_url($dir.'/'.$v));
    }
}
