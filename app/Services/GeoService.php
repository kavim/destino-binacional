<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeoService
{
    /** Cache TTL in seconds (30 days). */
    private const CACHE_TTL = 2_592_000;

    /** IPs that should not be looked up (private, localhost, etc). */
    private const SKIP_IPS = ['127.0.0.1', '::1', 'localhost'];

    /**
     * Get geolocation data for an IP address.
     * Uses ip-api.com (free, no key) with caching to avoid rate limits.
     *
     * @return array{country: ?string, country_code: ?string, region: ?string, city: ?string, timezone: ?string}|null
     */
    public static function locate(string $ip): ?array
    {
        $ip = trim($ip);
        if ($ip === '' || self::shouldSkipIp($ip)) {
            return null;
        }

        $cacheKey = 'geo:'.md5($ip);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($ip) {
            return self::fetchFromApi($ip);
        });
    }

    protected static function shouldSkipIp(string $ip): bool
    {
        if (in_array($ip, self::SKIP_IPS, true)) {
            return true;
        }
        // Private ranges: 10.x, 172.16-31.x, 192.168.x
        if (preg_match('/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/', $ip)) {
            return true;
        }

        return false;
    }

    protected static function fetchFromApi(string $ip): ?array
    {
        if (! config('observability.geo_enabled', true)) {
            return null;
        }

        try {
            $response = Http::timeout(3)->get('http://ip-api.com/json/'.urlencode($ip), [
                'fields' => 'status,country,countryCode,regionName,city,timezone',
            ]);

            $data = $response->json();
            if (($data['status'] ?? '') !== 'success') {
                return null;
            }

            return [
                'country' => $data['country'] ?? null,
                'country_code' => $data['countryCode'] ?? null,
                'region' => $data['regionName'] ?? null,
                'city' => $data['city'] ?? null,
                'timezone' => $data['timezone'] ?? null,
            ];
        } catch (\Throwable $e) {
            Log::channel('single')->debug('GeoService: lookup failed', [
                'ip' => $ip,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
