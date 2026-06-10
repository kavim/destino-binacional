<?php

namespace App\Services;

use App\Support\GdImageFormats;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use RuntimeException;
use Throwable;

class GalleryImageStorage
{
    /**
     * @param  array{
     *     path: string,
     *     prefix: string,
     *     max_edge?: int|null,
     *     output_format?: string|null,
     *     output_quality?: int|null
     * }  $options
     * @return array{filename: string, width: int, height: int}
     *
     * @throws RuntimeException
     */
    public function storeFromUploadedFile(UploadedFile $file, array $options): array
    {
        $directory = trim($options['path'], '/');
        $prefix = $options['prefix'];
        $maxEdge = $options['max_edge'] ?? 1920;
        $preferredFormat = isset($options['output_format']) ? strtolower((string) $options['output_format']) : 'webp';
        $outputFormat = GdImageFormats::resolveOutputFormat($preferredFormat);
        $outputQuality = $options['output_quality'] ?? 85;

        $extension = $outputFormat === 'jpg' ? 'jpg' : $outputFormat;
        $filename = $prefix.time().'_'.bin2hex(random_bytes(4)).'.'.$extension;
        $relativePath = $directory.'/'.$filename;

        Storage::disk('public')->makeDirectory($directory);

        $fullPath = storage_path('app/public/'.$relativePath);

        try {
            $imageInstance = Image::make($file->getRealPath());
            $width = $imageInstance->width();
            $height = $imageInstance->height();

            if ($maxEdge > 0 && max($width, $height) > $maxEdge) {
                $imageInstance->resize($maxEdge, $maxEdge, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                $width = $imageInstance->width();
                $height = $imageInstance->height();
            }

            $imageInstance->encode($outputFormat, $outputQuality);
            $imageInstance->save($fullPath);
            @chmod($fullPath, 0644);
        } catch (Throwable $e) {
            Log::error('Gallery image save failed', [
                'path' => $relativePath,
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException(
                'Could not save gallery image. '.$e->getMessage(),
                0,
                $e
            );
        }

        if (! Storage::disk('public')->exists($relativePath)) {
            throw new RuntimeException('Gallery image was not written to disk.');
        }

        return [
            'filename' => $filename,
            'width' => $width,
            'height' => $height,
        ];
    }

    public function delete(string $filename, string $directory): void
    {
        $directory = trim($directory, '/');
        $relativePath = $directory.'/'.$filename;

        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
