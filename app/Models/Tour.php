<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'featured_image',
        'guide',
        'start',
        'end',
        'meeting_point',
        'google_maps_src',
        'price',
        'currency',
    ];

    protected $casts = [
        'google_maps_src' => 'array',
        'start' => 'datetime:Y-m-d H:i:s',
        'end' => 'datetime:Y-m-d H:i:s',
    ];

    protected $appends = [
        'image',
    ];

    public function getImageAttribute()
    {
        return is_null($this->featured_image)
            ? 'https://api.lorem.space/image/house?w=1200&h=720'
            : asset('/storage/tours/'.$this->featured_image);
    }

    public function categories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }
}
