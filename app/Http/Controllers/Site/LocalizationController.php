<?php

namespace App\Http\Controllers\Site;

use App\Helpers\Translate;
use App\Http\Controllers\Controller;
use URL;

class LocalizationController extends Controller
{
    public function changeLanguage(string $lang): \Illuminate\Http\RedirectResponse
    {
        Translate::setLocale($lang);

        $previous = URL::previous();

        if (($pos = strpos($previous, '?')) !== false) {
            $previous = substr($previous, 0, $pos);
        }

        $route = app('router')->getRoutes()->match(app('request')->create($previous));
        $name = $route->getName();

        if ($name === 'change-language') {
            $previous = $name = null;
        }

        if ($previous && $lang !== 'pt') {
            $previous .= "?lang=$lang";
        }

        $previous = ($previous) ? $previous : \route('home');

        return redirect($previous);
    }
}
