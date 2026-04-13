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
        'recurrence_enabled',
        'recurrence_day_hour',
    ];

    protected $casts = [
        'google_maps_src' => 'array',
        'start' => 'datetime:Y-m-d H:i:s',
        'end' => 'datetime:Y-m-d H:i:s',
        'recurrence_day_hour' => 'array',
    ];

    protected $appends = [
        'image',
    ];

    public function getImageAttribute()
    {
        return public_storage_file_url($this->featured_image, 'tours');
    }

    public function categories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }
}
