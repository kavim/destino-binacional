<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * Trusted proxies come from config/trustedproxy.php (TRUSTED_PROXIES).
     * Left null so Illuminate falls through to that config — never '*'.
     *
     * @var array<int, string>|string|null
     */
    protected $proxies = null;

    /**
     * @return array<int, string>|string|null
     */
    protected function proxies()
    {
        $configured = parent::proxies() ?: config('trustedproxy.proxies');

        if ($configured === '*' || $configured === '**') {
            return '10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,127.0.0.1,::1';
        }

        return $configured;
    }

    /**
     * The headers that should be used to detect proxies.
     *
     * @var int
     */
    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB;
}
