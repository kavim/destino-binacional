<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use RuntimeException;

class GallerySyncService
{
    public function __construct(
        protected GalleryImageStorage $galleryImageStorage = new GalleryImageStorage,
    ) {}

    /**
     * @param  array<int, UploadedFile>  $newFiles  keyed by temp id from gallery_order
     */
    public function sync(Model $entity, Request $request, array $newFiles = []): void
    {
        if (! method_exists($entity, 'galleryImages')) {
            throw new RuntimeException('Entity does not support gallery images.');
        }

        $configKey = $entity->galleryConfigKey();
        $config = config('custom.'.$configKey);
        $prefix = match ($configKey) {
            'places_gallery_image' => 'place_gallery_',
            'events_gallery_image' => 'event_gallery_',
            'tours_gallery_image' => 'tour_gallery_',
            default => 'gallery_',
        };

        $removeIds = array_map('intval', Arr::wrap($request->input('gallery_remove_ids', [])));
        $order = $this->parseOrder($request->input('gallery_order'));

        if ($removeIds !== []) {
            $toDelete = $entity->galleryImages()->whereIn('id', $removeIds)->get();
            foreach ($toDelete as $image) {
                $this->galleryImageStorage->delete($image->filename, $image->storageDirectory());
                $image->forceDelete();
            }
        }

        $sortOrder = 0;
        foreach ($order as $token) {
            if (str_starts_with($token, 'existing:')) {
                $id = (int) substr($token, 9);
                $existing = $entity->galleryImages()->where('id', $id)->first();
                if ($existing) {
                    $existing->update(['sort_order' => $sortOrder]);
                    $sortOrder++;
                }

                continue;
            }

            if (str_starts_with($token, 'new:')) {
                $tempId = substr($token, 4);
                $file = $newFiles[$tempId] ?? null;
                if (! $file instanceof UploadedFile) {
                    continue;
                }

                $stored = $this->galleryImageStorage->storeFromUploadedFile($file, [
                    'path' => $config['path'],
                    'prefix' => $prefix,
                    'max_edge' => $config['max_edge'] ?? 1920,
                    'output_format' => $config['output_format'] ?? 'webp',
                    'output_quality' => $config['output_quality'] ?? 85,
                ]);

                $entity->galleryImages()->create([
                    'filename' => $stored['filename'],
                    'sort_order' => $sortOrder,
                    'width' => $stored['width'],
                    'height' => $stored['height'],
                ]);
                $sortOrder++;
            }
        }
    }

    public function deleteAllFor(Model $entity): void
    {
        if (! method_exists($entity, 'galleryImages')) {
            return;
        }

        $images = $entity->galleryImages()->get();
        foreach ($images as $image) {
            $this->galleryImageStorage->delete($image->filename, $image->storageDirectory());
            $image->forceDelete();
        }
    }

    /**
     * @return array<int, string>
     */
    private function parseOrder(mixed $raw): array
    {
        if (is_string($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                return array_values(array_filter($decoded, 'is_string'));
            }
        }

        if (is_array($raw)) {
            return array_values(array_filter($raw, 'is_string'));
        }

        return [];
    }

    /**
     * @return array<string, UploadedFile>
     */
    public function mapNewFilesFromRequest(Request $request): array
    {
        $mapped = [];
        $files = $request->file('gallery_new', []);
        $keys = $request->input('gallery_new_keys', []);

        if (! is_array($files)) {
            return $mapped;
        }

        foreach ($files as $index => $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $tempId = is_array($keys) ? ($keys[$index] ?? null) : null;
            if (is_string($tempId) && $tempId !== '') {
                $mapped[$tempId] = $file;
            }
        }

        return $mapped;
    }
}
