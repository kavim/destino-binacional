<?php

namespace App\Models;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Category extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    public $translatedAttributes = [
        'name',
        'slug',
        'description',
    ];

    protected $fillable = ['color', 'icon', 'active', 'featured_image', 'type', 'parent_id'];

    protected $appends = [
        'image',
        'name_pt',
        'name_es',
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Static SVGs and defaults live under public/images/ (e.g. public/images/icons/*.svg).
     * Uploaded category photos live under storage/app/public/categories/.
     */
    protected function publicImagesFileUrl(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        if (str_starts_with($value, 'icons/')) {
            return asset('images/'.$value);
        }

        return null;
    }

    /**
     * Featured image shown on category pages (hero background).
     */
    protected function resolveFeaturedImagePublicUrl(?string $value): string
    {
        $public = $this->publicImagesFileUrl($value);
        if ($public !== null) {
            return $public;
        }

        if ($value === null || $value === '') {
            return asset('images/parque.webp');
        }

        if (Storage::disk('public')->exists('categories/'.$value)) {
            return asset('storage/categories/'.$value);
        }

        return asset('images/parque.webp');
    }

    /**
     * Fix icon paths accidentally stored as absolute URLs (e.g. after save used the accessor)
     * or as "images/icons/..." so files resolve with the current APP_URL.
     */
    protected function normalizeIconStorageValue(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        $trimmed = trim($value);

        if (str_starts_with($trimmed, 'http://') || str_starts_with($trimmed, 'https://')) {
            $path = parse_url($trimmed, PHP_URL_PATH);
            if (! is_string($path) || $path === '') {
                return $trimmed;
            }
            if (preg_match('#/(?:images/icons|storage/icons)/([^/]+\.(?:svg|png|webp|jpe?g))$#i', $path, $m)) {
                return $m[1];
            }

            return $trimmed;
        }

        $noLeading = ltrim($trimmed, '/');
        if (str_starts_with($noLeading, 'images/icons/')) {
            return substr($noLeading, strlen('images/icons/'));
        }

        return $trimmed;
    }

    /**
     * Category menu / hero icon (SVG often lives in public/images/icons/).
     */
    protected function resolveIconPublicUrl(?string $value): string
    {
        $value = $this->normalizeIconStorageValue($value);

        if ($value === null || $value === '') {
            return asset('images/icons/default.svg');
        }

        $public = $this->publicImagesFileUrl($value);
        if ($public !== null) {
            return $public;
        }

        $basename = basename($value);
        $candidates = [
            'images/icons/'.$value,
            'images/icons/'.$basename,
        ];
        foreach ($candidates as $relative) {
            if (is_file(public_path($relative))) {
                return asset($relative);
            }
        }

        if (Storage::disk('public')->exists('icons/'.$value)) {
            return asset('storage/icons/'.$value);
        }

        if (Storage::disk('public')->exists('icons/'.$basename)) {
            return asset('storage/icons/'.$basename);
        }

        return asset('images/icons/default.svg');
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                return $this->resolveFeaturedImagePublicUrl($attributes['featured_image'] ?? null);
            },
        );
    }

    protected function featuredImage(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                return $this->resolveFeaturedImagePublicUrl($value);
            },
        );
    }

    protected function icon(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                return $this->resolveIconPublicUrl($value);
            },
            set: function (?string $value) {
                if ($value === null || trim((string) $value) === '') {
                    return ['icon' => null];
                }

                return ['icon' => $this->normalizeIconStorageValue(trim((string) $value))];
            },
        );
    }

    public function getNamePtAttribute()
    {
        return $this->translate('pt')?->name;
    }

    public function getNameEsAttribute()
    {
        return $this->translate('es')?->name;
    }

    public function places()
    {
        return $this->belongsToMany(Place::class);
    }

    /**
     * Site nav + home cards (name, slug, description follow current app locale).
     */
    public function toSitePublicPayload(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'featured_image' => $this->featured_image,
            'icon' => $this->icon,
            'color' => $this->color,
        ];
    }
}
