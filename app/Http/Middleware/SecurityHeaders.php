<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('Content-Security-Policy-Report-Only', $this->reportOnlyPolicy());
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }

    /**
     * Report-only: Inertia/Vite still need 'unsafe-inline' (and eval in Vite HMR).
     * Hosts: GA, GTM, Hotjar, Google Maps embed, Bunny fonts, Font Awesome CDN.
     */
    private function reportOnlyPolicy(): string
    {
        $directives = [
            'default-src \'self\'',
            'base-uri \'self\'',
            'object-src \'none\'',
            'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://static.hotjar.com https://script.hotjar.com https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com https://maps.googleapis.com',
            'style-src \'self\' \'unsafe-inline\' https://fonts.bunny.net https://cdnjs.cloudflare.com',
            'img-src \'self\' data: blob: https:',
            'font-src \'self\' data: https://fonts.bunny.net https://cdnjs.cloudflare.com',
            'connect-src \'self\' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com http://localhost:* ws://localhost:* wss://localhost:*',
            'frame-src https://www.google.com https://maps.google.com https://www.google.com/maps https://*.hotjar.com',
            'frame-ancestors \'self\'',
        ];

        return implode('; ', $directives);
    }
}
