<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceHttps
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->shouldForceHttps()) {
            return $next($request);
        }

        if (! $request->secure()) {
            return redirect()->secure($request->getRequestUri(), 301);
        }

        $response = $next($request);

        $response->headers->set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains; preload'
        );

        return $response;
    }

    private function shouldForceHttps(): bool
    {
        return app()->environment('production')
            || (bool) config('app.force_https', false);
    }
}
