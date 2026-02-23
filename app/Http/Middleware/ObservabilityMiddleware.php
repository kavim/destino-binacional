<?php

namespace App\Http\Middleware;

use App\Services\ObservabilityService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ObservabilityMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->attributes->set('observability_start', microtime(true));
        $request->attributes->set('observability_memory', memory_get_usage(true));

        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        $start = $request->attributes->get('observability_start');
        if ($start === null) {
            return;
        }

        $durationMs = (int) round((microtime(true) - $start) * 1000);
        $memoryBytes = memory_get_usage(true) - ($request->attributes->get('observability_memory') ?? 0);
        if ($memoryBytes < 0) {
            $memoryBytes = null;
        }

        ObservabilityService::recordPageView($request);
        ObservabilityService::recordPerformance(
            $request->path(),
            $request->method(),
            $request->route()?->getName(),
            $durationMs,
            $memoryBytes,
            $response->getStatusCode()
        );
    }
}
