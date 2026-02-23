<?php

namespace App\Exceptions;

use App\Services\ObservabilityService;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
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
    }
}
