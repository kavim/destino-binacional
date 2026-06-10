<?php

namespace App\Support;

class GdImageFormats
{
    public static function supportsWebp(): bool
    {
        return self::gdInfoFlag('WebP Support');
    }

    public static function supportsJpeg(): bool
    {
        return self::gdInfoFlag('JPEG Support');
    }

    public static function resolveOutputFormat(string $preferred): string
    {
        $preferred = strtolower($preferred);

        if ($preferred === 'webp' && self::supportsWebp()) {
            return 'webp';
        }

        if (self::supportsJpeg()) {
            return 'jpg';
        }

        return 'png';
    }

    private static function gdInfoFlag(string $key): bool
    {
        if (! function_exists('gd_info')) {
            return false;
        }

        $info = gd_info();

        return ! empty($info[$key]);
    }
}
