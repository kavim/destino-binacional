<?php

if (! function_exists('extractSrcFromGmapsIframe')) {
    function extractSrcFromGmapsIframe(?string $google_maps_src): string|null
    {
        if (is_null($google_maps_src)) {
            return null;
        }

        preg_match('~iframe.*src="([^"]*)"~', $google_maps_src, $result);

        return is_array($result) && count($result) > 0 && $result[1] ? $result[1] : null;
    }
}
