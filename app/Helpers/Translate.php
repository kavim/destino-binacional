<?php

namespace App\Helpers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class Translate
{
    public static function getOptionsLang()
    {
        return (array) config('translate.app.idiomas', ['pt' => 'Português']);
    }

    public static function setLocale($locale = null)
    {
        if ($locale) {
            Session::put('locale', $locale);
        } else {
            $locale = Session::get('locale');
        }

        if (! in_array($locale, ['en', 'pt', 'es'])) {
            return;
        }

        App::setLocale($locale);
    }
}
