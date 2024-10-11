<?php

if (! function_exists('extractSrcFromGmapsIframe')) {
    function extractSrcFromGmapsIframe(?string $google_maps_src): ?string
    {
        if (is_null($google_maps_src)) {
            return null;
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
    function convert_to_cents(string $value): int
    {
        // Remove a moeda e espaços em branco
        $value = str_replace(['UYU', 'BRL', ' ', ' '], '', $value); // Remover 'UYU', 'BRL' e espaços

        // Substituir vírgula por ponto para permitir conversão para float
        $value = str_replace(',', '.', $value);

        // remove qualquer outro caracter deixando apenas os numeros e o ponto
        $value = preg_replace('/[^0-9.]/', '', $value);

        // Converter para float e multiplicar por 100 para obter os centavos
        return (int) ($value * 100);
    }
}
