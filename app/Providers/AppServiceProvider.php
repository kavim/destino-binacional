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
        LogViewer::auth(fn ($request) => (bool) $request->user()?->isAdmin());

        $migrationsPath = database_path('migrations');
        $paths = $this->getAllSubdirectoriesOptimized($migrationsPath);

        $skipTracker = ! config('tracker.enabled');

        $paths = array_filter($paths, function (string $path) use ($skipTracker) {
            if ($skipTracker && str_contains($path, DIRECTORY_SEPARATOR.'tracker')) {
                return false;
            }

            return true;
        });

        $this->loadMigrationsFrom($paths);
    }

    public function getAllSubdirectoriesOptimized($dir): array
    {
        $subdirectories = [];

        $items = scandir($dir);

        foreach ($items as $item) {
            if ($item !== '.' && $item !== '..') {
                $path = $dir.DIRECTORY_SEPARATOR.$item;
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
