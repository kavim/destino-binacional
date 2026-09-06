<?php

namespace App\Services;

use App\Models\ObservabilityError;
use App\Models\ObservabilityPageView;
use App\Models\ObservabilityPerformance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ObservabilityService
{
    /**
     * @return array<string, mixed>|null
     */
    public static function pageViewPayload(Request $request): ?array
    {
        if (! config('observability.enabled', true)) {
            return null;
        }

        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            return null;
        }

        $path = $request->path();
        if (self::shouldSkipPath($path)) {
            return null;
        }

        $ip = $request->ip();

        return [
            'path' => $path,
            'method' => $request->method(),
            'route_name' => $request->route()?->getName(),
            'ip' => $ip,
            'user_id' => $request->user()?->id,
            'user_agent' => $request->userAgent() ? mb_substr($request->userAgent(), 0, 500) : null,
            'referer' => $request->header('Referer') ? mb_substr($request->header('Referer'), 0, 1000) : null,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function performancePayload(
        string $path,
        string $method,
        ?string $routeName,
        int $durationMs,
        ?int $memoryBytes,
        ?int $statusCode
    ): ?array {
        if (! config('observability.enabled', true)) {
            return null;
        }

        if (self::shouldSkipPath($path)) {
            return null;
        }

        return [
            'path' => $path,
            'method' => $method,
            'route_name' => $routeName,
            'duration_ms' => $durationMs,
            'memory_bytes' => $memoryBytes,
            'status_code' => $statusCode,
            'measured_at' => now()->toDateTimeString(),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $payload
     */
    public static function persistPageView(?array $payload): void
    {
        if ($payload === null) {
            return;
        }

        $ip = $payload['ip'] ?? null;
        $ipHash = $ip ? hash('sha256', $ip.config('app.key')) : null;
        $geo = $ip ? GeoService::locate($ip) : null;

        try {
            ObservabilityPageView::create([
                'path' => $payload['path'],
                'method' => $payload['method'],
                'route_name' => $payload['route_name'] ?? null,
                'ip' => config('observability.store_ip', false) && $ip ? $ip : null,
                'ip_hash' => $ipHash,
                'user_id' => $payload['user_id'] ?? null,
                'user_agent' => $payload['user_agent'] ?? null,
                'referer' => $payload['referer'] ?? null,
                'country' => $geo['country'] ?? null,
                'country_code' => $geo['country_code'] ?? null,
                'region' => $geo['region'] ?? null,
                'city' => $geo['city'] ?? null,
                'timezone' => $geo['timezone'] ?? null,
                'viewed_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::channel('single')->warning('Observability: failed to record page view', [
                'path' => $payload['path'] ?? null,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * @param  array<string, mixed>|null  $payload
     */
    public static function persistPerformance(?array $payload): void
    {
        if ($payload === null) {
            return;
        }

        try {
            ObservabilityPerformance::create([
                'path' => $payload['path'],
                'method' => $payload['method'],
                'route_name' => $payload['route_name'] ?? null,
                'duration_ms' => $payload['duration_ms'],
                'memory_bytes' => $payload['memory_bytes'] ?? null,
                'status_code' => $payload['status_code'] ?? null,
                'measured_at' => $payload['measured_at'] ?? now(),
            ]);
        } catch (\Throwable $e) {
            Log::channel('single')->warning('Observability: failed to record performance', [
                'path' => $payload['path'] ?? null,
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
