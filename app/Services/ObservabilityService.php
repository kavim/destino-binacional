<?php

namespace App\Services;

use App\Models\ObservabilityError;
use App\Models\ObservabilityPageView;
use App\Models\ObservabilityPerformance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ObservabilityService
{
    public static function recordPageView(Request $request): void
    {
        if (! config('observability.enabled', true)) {
            return;
        }

        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            return;
        }

        $path = $request->path();
        if (self::shouldSkipPath($path)) {
            return;
        }

        $ip = $request->ip();
        $ipHash = $ip ? hash('sha256', $ip.config('app.key')) : null;
        $geo = $ip ? GeoService::locate($ip) : null;

        try {
            ObservabilityPageView::create([
                'path' => $path,
                'method' => $request->method(),
                'route_name' => $request->route()?->getName(),
                'ip' => config('observability.store_ip', true) && $ip ? $ip : null,
                'ip_hash' => $ipHash,
                'user_id' => $request->user()?->id,
                'user_agent' => $request->userAgent() ? mb_substr($request->userAgent(), 0, 500) : null,
                'referer' => $request->header('Referer') ? mb_substr($request->header('Referer'), 0, 1000) : null,
                'country' => $geo['country'] ?? null,
                'country_code' => $geo['country_code'] ?? null,
                'region' => $geo['region'] ?? null,
                'city' => $geo['city'] ?? null,
                'timezone' => $geo['timezone'] ?? null,
                'viewed_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::channel('single')->warning('Observability: failed to record page view', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public static function recordPerformance(string $path, string $method, ?string $routeName, int $durationMs, ?int $memoryBytes, ?int $statusCode): void
    {
        if (! config('observability.enabled', true)) {
            return;
        }

        if (self::shouldSkipPath($path)) {
            return;
        }

        try {
            ObservabilityPerformance::create([
                'path' => $path,
                'method' => $method,
                'route_name' => $routeName,
                'duration_ms' => $durationMs,
                'memory_bytes' => $memoryBytes,
                'status_code' => $statusCode,
                'measured_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::channel('single')->warning('Observability: failed to record performance', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public static function recordError(string $source, string $message, array $context = []): void
    {
        if (! config('observability.enabled', true)) {
            return;
        }

        try {
            ObservabilityError::create([
                'source' => $source,
                'message' => mb_substr($message, 0, 65535),
                'url' => $context['url'] ?? null,
                'file' => $context['file'] ?? null,
                'line' => $context['line'] ?? null,
                'context' => $context,
                'level' => $context['level'] ?? 'error',
            ]);
        } catch (\Throwable $e) {
            Log::channel('single')->warning('Observability: failed to record error', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    protected static function shouldSkipPath(string $path): bool
    {
        $skip = config('observability.skip_paths', [
            '_debugbar',
            'telescope',
            'horizon',
            'log-viewer',
            'sanctum',
        ]);

        foreach ($skip as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return true;
            }
        }

        return false;
    }
}
