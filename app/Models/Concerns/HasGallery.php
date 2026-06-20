<?php

namespace App\Models\Concerns;

use App\Models\GalleryImage;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasGallery
{
    public function galleryImages(): MorphMany
    {
        return $this->morphMany(GalleryImage::class, 'imageable')->orderBy('sort_order');
    }

    public function galleryConfigKey(): string
    {
        return match (static::class) {
            \App\Models\Place::class => 'places_gallery_image',
            \App\Models\Event::class => 'events_gallery_image',
            \App\Models\Tour::class => 'tours_gallery_image',
            default => throw new \InvalidArgumentException('Unsupported gallery entity: '.static::class),
        };
    }
}
