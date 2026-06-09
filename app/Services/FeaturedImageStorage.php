<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use RuntimeException;
use Throwable;

class FeaturedImageStorage
{
    /**
     * Persist a base64 data-URI image on the public disk.
     *
     * @param  array{path: string, prefix: string, width?: int|null, height?: int|null}  $options
     *
     * @throws RuntimeException
     */
    public function storeFromBase64(?string $image, array $options): ?string
    {
        if ($image === null || trim($image) === '') {
            return null;
        }

        $directory = trim($options['path'], '/');
        $prefix = $options['prefix'];
        $width = $options['width'] ?? null;
        $height = $options['height'] ?? null;

        $extension = $this->extensionFromDataUri($image);
        $filename = $prefix.time().'.'.$extension;
        $relativePath = $directory.'/'.$filename;

        $decoded = base64_decode(
            (string) preg_replace('#^data:image/\w+;base64,#i', '', $image),
            true
        );

        if ($decoded === false) {
            throw new RuntimeException('Invalid base64 image data.');
        }

        Storage::disk('public')->makeDirectory($directory);

        try {
            $imageInstance = Image::make($decoded);

            if ($width !== null && $height !== null) {
                $imageInstance->resize($width, $height);
            }

            $imageInstance->save(storage_path('app/public/'.$relativePath));
        } catch (Throwable $e) {
            Log::error('Featured image save failed', [
                'path' => $relativePath,
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException('Could not save featured image.', 0, $e);
        }

        if (! Storage::disk('public')->exists($relativePath)) {
            throw new RuntimeException('Featured image was not written to disk.');
        }

        return $filename;
    }

    /**
     * @throws RuntimeException
     */
    private function extensionFromDataUri(string $dataUri): string
    {
        $semicolon = strpos($dataUri, ';');
        if ($semicolon === false) {
            throw new RuntimeException('Invalid image data URI.');
        }

        $mimePart = explode(':', substr($dataUri, 0, $semicolon))[1] ?? '';
        $extension = explode('/', $mimePart)[1] ?? '';

        if ($extension === '') {
            throw new RuntimeException('Could not detect image type.');
        }

        return $extension;
    }
}
