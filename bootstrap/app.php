<?php

use App\Http\Middleware\Authenticate;
use App\Http\Middleware\EncryptCookies;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\ForceHttps;
use App\Http\Middleware\ForceRequestRootUrl;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\Localization;
use App\Http\Middleware\ObservabilityMiddleware;
use App\Http\Middleware\PreventRequestsDuringMaintenance;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\TrimStrings;
use App\Http\Middleware\TrustProxies;
use App\Http\Middleware\ValidateSignature;
use App\Http\Middleware\VerifyCsrfToken;
use App\Services\ObservabilityService;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\ValidatePostSize;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Validation\ValidationException;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/*
| Middleware map (same order as the former app/Http/Kernel.php)
| -------------------------------------------------------------------------
| Global: TrustProxies → ForceHttps → ForceRequestRootUrl → HandleCors →
|         PreventRequestsDuringMaintenance → ValidatePostSize → TrimStrings →
|         ConvertEmptyStringsToNull
| web:    EncryptCookies → cookies queue → session → errors → CSRF →
|         SecurityHeaders → SubstituteBindings → Localization → Inertia →
|         preload links → Observability
| api:    throttle:api → SubstituteBindings
| TrustHosts stays off (commented in the old Kernel — spec 023).
*/

return Application::configure(basePath: dirname(__DIR__))
    ->withEvents(discover: false)
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->use([
            TrustProxies::class,
            ForceHttps::class,
            ForceRequestRootUrl::class,
            HandleCors::class,
            PreventRequestsDuringMaintenance::class,
            ValidatePostSize::class,
            TrimStrings::class,
            ConvertEmptyStringsToNull::class,
        ]);

        $middleware->group('web', [
            EncryptCookies::class,
            AddQueuedCookiesToResponse::class,
            StartSession::class,
            ShareErrorsFromSession::class,
            VerifyCsrfToken::class,
            SecurityHeaders::class,
            SubstituteBindings::class,
            Localization::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            ObservabilityMiddleware::class,
        ]);

        $middleware->throttleApi();

        $middleware->alias([
            'auth' => Authenticate::class,
            'guest' => RedirectIfAuthenticated::class,
            'signed' => ValidateSignature::class,
            'admin' => EnsureUserIsAdmin::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule) {
        $schedule->command('observability:prune')->daily()->when(fn () => config('observability.retention_days'));
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontFlash([
            'current_password',
            'password',
            'password_confirmation',
        ]);

        $exceptions->reportable(function (\Throwable $e) {
            if ($e instanceof ValidationException || $e instanceof NotFoundHttpException) {
                return;
            }

            $request = request();
            ObservabilityService::recordError('backend', $e->getMessage(), [
                'url' => $request ? $request->fullUrl() : null,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'level' => 'error',
                'exception' => get_class($e),
                'trace' => collect($e->getTrace())->take(5)->toArray(),
            ]);
        });
    })->create();
