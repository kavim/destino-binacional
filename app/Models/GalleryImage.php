<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class GalleryImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'imageable_type',
        'imageable_id',
        'filename',
        'sort_order',
        'width',
        'height',
    ];

    protected $appends = [
        'url',
    ];

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getUrlAttribute(): string
    {
        $directory = $this->storageDirectory();

        return public_storage_file_url($this->filename, $directory);
    }

    public function storageDirectory(): string
    {
        $configKey = $this->imageable?->galleryConfigKey() ?? 'places_gallery_image';
        $config = config('custom.'.$configKey);
        $path = $config['path'] ?? 'places/gallery/';

        return rtrim($path, '/');
    }
}
