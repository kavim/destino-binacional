<?php

namespace Tests\Feature\Bootstrap;

use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsStaff;
use App\Http\Middleware\ForceHttps;
use App\Http\Middleware\ForceRequestRootUrl;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\Localization;
use App\Http\Middleware\ObservabilityMiddleware;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\TrustProxies;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Tests\TestCase;

class Laravel11BootstrapTest extends TestCase
{
    use RefreshDatabase;

    public function test_global_middleware_keeps_force_https_after_trust_proxies(): void
    {
        $global = app(Kernel::class)->getGlobalMiddleware();

        $this->assertSame(
            [TrustProxies::class, ForceHttps::class, ForceRequestRootUrl::class],
            array_slice($global, 0, 3)
        );
    }

    public function test_web_middleware_order_matches_former_http_kernel(): void
    {
        $web = app(Kernel::class)->getMiddlewareGroups()['web'] ?? [];

        $this->assertSame(
            [
                VerifyCsrfToken::class,
                SecurityHeaders::class,
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
                Localization::class,
                HandleInertiaRequests::class,
                \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
                ObservabilityMiddleware::class,
            ],
            array_slice($web, 4)
        );
    }

    public function test_route_aliases_resolve_auth_verified_admin_and_throttle(): void
    {
        $aliases = app(Kernel::class)->getMiddlewareAliases();

        $this->assertArrayHasKey('auth', $aliases);
        $this->assertSame(EnsureEmailIsVerified::class, $aliases['verified']);
        $this->assertSame(EnsureUserIsAdmin::class, $aliases['admin']);
        $this->assertSame(EnsureUserIsStaff::class, $aliases['staff']);
        $this->assertSame(ThrottleRequests::class, $aliases['throttle']);
    }

    public function test_observability_prune_is_on_the_schedule(): void
    {
        $this->artisan('schedule:list')
            ->expectsOutputToContain('observability:prune')
            ->assertSuccessful();
    }
}
