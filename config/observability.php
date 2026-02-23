<?php

return [

    'enabled' => env('OBSERVABILITY_ENABLED', true),

    /*
    | Paths that should not be tracked (prefix match).
    */
    'skip_paths' => [
        '_debugbar',
        'telescope',
        'horizon',
        'log-viewer',
        'sanctum',
    ],

    /*
    | Retention: delete records older than this (days). Set to null to keep forever.
    */
    'retention_days' => env('OBSERVABILITY_RETENTION_DAYS', 90),

    /*
    | Geolocation: enable IP-to-location lookup via ip-api.com (free, cached per IP).
    | Set to false to disable or if you hit rate limits (45 req/min on free tier).
    */
    'geo_enabled' => env('OBSERVABILITY_GEO_ENABLED', true),

    /*
    | Store full IP address. Set to false to only keep ip_hash (e.g. for GDPR).
    */
    'store_ip' => env('OBSERVABILITY_STORE_IP', true),

];
