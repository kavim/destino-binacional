<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'start',
        'end',
        'is_online',
        'link',
        'google_maps_src',
        'address',
        'city_id',
        'category_id',
        'price',
        'door_time',
        'featured_image',
    ];

    protected $dates = ['deleted_at'];

    protected $casts = [
        'start' => 'date:Y/m/d',
        'end' => 'date:Y/m/d',
        'is_online' => 'boolean',
    ];

    protected $appends = [
        'image',
    ];

    public function getImageAttribute()
    {
        if (is_null($this->featured_image) || $this->featured_image === '') {
            return asset('images/parque.webp');
        }

        return asset('storage/events/'.$this->featured_image);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class)->withDefault();
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
