<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Opcodes\LogViewer\Facades\LogViewer;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Log Viewer: apenas usuários autenticados podem acessar
        LogViewer::auth(fn ($request) => $request->user() !== null);

        $migrationsPath = database_path('migrations');
        $paths = $this->getAllSubdirectoriesOptimized($migrationsPath);

        $skipTracker = app()->environment('testing') || !config('app.tracker_enabled', false);

        $paths = array_filter($paths, function (string $path) use ($skipTracker) {
            if ($skipTracker && str_contains($path, DIRECTORY_SEPARATOR . 'tracker')) {
                return false;
            }
            return true;
        });

        $this->loadMigrationsFrom($paths);
    }

    function getAllSubdirectoriesOptimized($dir): array
    {
        $subdirectories = [];

        $items = scandir($dir);

        foreach ($items as $item) {
            if ($item !== '.' && $item !== '..') {
                $path = $dir . DIRECTORY_SEPARATOR . $item;
                if (is_dir($path)) {
                    $subdirectories[] = $path;
                    $subdirectoriesToAdd = $this->getAllSubdirectoriesOptimized($path);
                    foreach ($subdirectoriesToAdd as $subdirToAdd) {
                        $subdirectories[] = $subdirToAdd;
                    }
                }
            }
        }

        return $subdirectories;
    }
}
