<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class CategoryNavCache
{
    public static function get(): array
    {
        $locale = app()->getLocale();

        return Cache::remember(self::key($locale), self::ttl(), function () {
            return Category::query()
                ->whereNull('parent_id')
                ->orderBy('id')
                ->get()
                ->map(fn (Category $category) => $category->toSitePublicPayload())
                ->values()
                ->all();
        });
    }

    public static function flush(): void
    {
        foreach (config('custom.nav_category_locales', ['es', 'pt']) as $locale) {
            Cache::forget(self::key((string) $locale));
        }
    }

    public static function key(string $locale): string
    {
        return 'nav.categories.'.$locale;
    }

    public static function ttl(): int
    {
        return (int) config('custom.nav_categories_ttl', 600);
    }
}
