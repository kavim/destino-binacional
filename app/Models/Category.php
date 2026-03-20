<?php

namespace App\Models;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected function image(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                if (is_null($value)) {
                    return 'https://picsum.photos/1200/720';
                }

                if (substr($value, 0, 4) === 'http') {
                    return $value;
                }

                return asset('/storage/categories/'.$value);
            },
        );
    }

    protected function featuredImage(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                $public = $this->publicImagesFileUrl($value);
                if ($public !== null) {
                    return $public;
                }

                if (is_null($value) || $value === '') {
                    return asset('images/icons/default.svg');
                }

                return asset('storage/categories/'.$value);
            },
        );
    }

    protected function icon(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                $public = $this->publicImagesFileUrl($value);
                if ($public !== null) {
                    return $public;
                }

                if (is_null($value) || $value === '') {
                    return asset('images/icons/default.svg');
                }

                return asset('storage/icons/'.$value);
            }
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
}
