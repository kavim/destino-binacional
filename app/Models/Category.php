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

    public function icon(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                if (is_null($value)) {
                    return 'https://picsum.photos/500/500';
                }

                if (substr($value, 0, 4) === 'http') {
                    return $value;
                }

                return asset('/storage/icons/'.$value);
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
}
