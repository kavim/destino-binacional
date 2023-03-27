<?php

namespace App\Models;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Place extends Model implements TranslatableContract
{
    use HasFactory, SoftDeletes, Translatable;

    public $useTranslationFallback = true;

    public $translatedAttributes = [
        'description',
    ];

    protected $fillable = [
        'name',
        'slug',
        'address',
        'city_id',
        'place_type_id',
        'category_id',
        'description_pt',
        'description_es',
        'google_maps_src',
        'featured_image',
    ];

    protected $dates = ['deleted_at'];

    protected $casts = [
        'google_maps_src' => 'array',
    ];

    protected $appends = [
        'image',
        'description_pt',
        'description_es',
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function placeType()
    {
        return $this->belongsTo(PlaceType::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageAttribute()
    {
        return is_null($this->featured_image)
            ? 'https://api.lorem.space/image/burger?w=1200&h=720'
            : asset('/storage/places/'.$this->featured_image);
    }

    public function getDescriptionPtAttribute()
    {
        return $this->translate('pt')->description;
    }

    public function getDescriptionEsAttribute()
    {
        return $this->translate('es')->description;
    }
}
