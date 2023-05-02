<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\View\Component;

class Translations extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $locale = App::getLocale();

        $translations = Cache::remember("trans_$locale", 2, function () use ($locale) {
            $phpTranslations = [];

            $jsonTranslations = [];

            if (File::exists(resource_path("lang/$locale"))) {
                $phpTranslations = collect(File::allFiles(resource_path("lang/$locale")))

                    ->filter(function ($file) {
                        return $file->getExtension() === 'php';
                    })->flatMap(function ($file) {
                        return Arr::dot(File::getRequire($file->getRealPath()));
                    })->toArray();
            }

            if (File::exists(resource_path("lang/$locale.json"))) {
                $jsonTranslations = json_decode(File::get(resource_path("lang/$locale.json")), true);
            }

            return array_merge($phpTranslations, $jsonTranslations);
        });

        return view('components.translations', [
            'translations' => $translations,
        ]);
    }
}
