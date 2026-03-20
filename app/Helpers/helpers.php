<?php

if (! function_exists('extractSrcFromGmapsIframe')) {

    function extractSrcFromGmapsIframe(?string $google_maps_src): ?string
    {
        if (is_null($google_maps_src)) {
            return null;
        }

        if (str_starts_with($google_maps_src, 'http')) {
            return $google_maps_src;
        }

        preg_match('~iframe.*src="([^"]*)"~', $google_maps_src, $result);

        return is_array($result) && count($result) > 0 && $result[1] ? $result[1] : null;
    }

}

if (! function_exists('parse_money')) {
    function parse_money(?string $parse_money): string|null
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
