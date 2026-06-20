<?php

namespace Tests\Unit\Services;

use App\Services\GalleryImageStorage;
use Illuminate\Http\UploadedFile;
use RuntimeException;
use Tests\TestCase;

class GalleryImageStorageTest extends TestCase
{
    private GalleryImageStorage $storage;

    protected function setUp(): void
    {
        parent::setUp();
        $this->storage = new GalleryImageStorage;
    }

    public function test_store_from_uploaded_file_saves_to_disk(): void
    {
        $file = UploadedFile::fake()->image('gallery.jpg', 800, 600);

        $result = $this->storage->storeFromUploadedFile($file, [
            'path' => 'places/gallery/',
            'prefix' => 'place_gallery_',
            'max_edge' => 1920,
            'output_format' => 'webp',
        ]);

        $this->assertStringStartsWith('place_gallery_', $result['filename']);
        $this->assertGreaterThan(0, $result['width']);
        $this->assertGreaterThan(0, $result['height']);
        $this->assertFileExists(storage_path('app/public/places/gallery/'.$result['filename']));

        $this->storage->delete($result['filename'], 'places/gallery');
    }

    public function test_store_downscales_when_exceeding_max_edge(): void
    {
        $file = UploadedFile::fake()->image('large.jpg', 3000, 2000);

        $result = $this->storage->storeFromUploadedFile($file, [
            'path' => 'tours/gallery/',
            'prefix' => 'tour_gallery_',
            'max_edge' => 1920,
            'output_format' => 'webp',
        ]);

        $this->assertLessThanOrEqual(1920, max($result['width'], $result['height']));

        $this->storage->delete($result['filename'], 'tours/gallery');
    }

    public function test_delete_removes_file_from_disk(): void
    {
        $file = UploadedFile::fake()->image('remove.jpg', 400, 300);

        $result = $this->storage->storeFromUploadedFile($file, [
            'path' => 'events/gallery/',
            'prefix' => 'event_gallery_',
            'max_edge' => 1920,
            'output_format' => 'jpg',
        ]);

        $path = storage_path('app/public/events/gallery/'.$result['filename']);
        $this->assertFileExists($path);

        $this->storage->delete($result['filename'], 'events/gallery');

        $this->assertFileDoesNotExist($path);
    }

    public function test_store_throws_on_invalid_file(): void
    {
        $this->expectException(RuntimeException::class);

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $this->storage->storeFromUploadedFile($file, [
            'path' => 'places/gallery/',
            'prefix' => 'place_gallery_',
        ]);
    }
}
