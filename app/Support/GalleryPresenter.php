<?php

namespace App\Support;

use App\Models\GalleryImage;
use Illuminate\Database\Eloquent\Model;

class GalleryPresenter
{
    /**
     * @return array<int, array{id: int, url: string, sort_order: int, width: ?int, height: ?int}>
     */
    public static function forEntity(Model $entity): array
    {
        if (! method_exists($entity, 'galleryImages')) {
            return [];
        }

        return $entity->galleryImages
            ->map(fn (GalleryImage $image) => [
                'id' => $image->id,
                'url' => $image->url,
                'sort_order' => $image->sort_order,
                'width' => $image->width,
                'height' => $image->height,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{id: int, url: string, width: ?int, height: ?int}>
     */
    public static function forSite(Model $entity): array
    {
        if (! method_exists($entity, 'galleryImages')) {
            return [];
        }

        return $entity->galleryImages
            ->map(fn (GalleryImage $image) => [
                'id' => $image->id,
                'url' => $image->url,
                'width' => $image->width,
                'height' => $image->height,
            ])
            ->values()
            ->all();
    }
}
