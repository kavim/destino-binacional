<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Trusted proxies
    |--------------------------------------------------------------------------
    |
    | Comma-separated IPs/CIDRs. Never use "*": that lets any client spoof
    | X-Forwarded-* (IP, proto, host).
    |
    | Default is RFC1918 + loopback — the hop PHP actually sees in Docker
    | (nginx → php-fpm). Cloudflare IPs are not needed here: nginx is the
    | proxy in front of PHP; it already receives Cloudflare's headers.
    |
    | Override with TRUSTED_PROXIES if PHP is reached through another hop.
    |
    */
    'proxies' => env(
        'TRUSTED_PROXIES',
        '10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,127.0.0.1,::1'
    ),

];
