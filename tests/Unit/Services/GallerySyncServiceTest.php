<?php

namespace Tests\Unit\Services;

use App\Models\GalleryImage;
use App\Models\Place;
use App\Models\PlaceTranslation;
use App\Services\GallerySyncService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class GallerySyncServiceTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    private GallerySyncService $syncService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
        $this->syncService = new GallerySyncService;
    }

    private function makePlace(): Place
    {
        $place = Place::forceCreate([
            'name' => 'Gallery Place',
            'slug' => 'gallery-place',
            'address' => 'Test',
            'city_id' => $this->city->id,
            'place_type_id' => $this->placeType->id,
            'category_id' => $this->childCategory->id,
            'featured_image' => 'test.jpg',
            'order' => 0,
        ]);

        PlaceTranslation::forceCreate([
            'place_id' => $place->id,
            'locale' => 'es',
            'description' => 'Desc',
        ]);

        return $place;
    }

    public function test_sync_creates_gallery_images_from_uploads(): void
    {
        $place = $this->makePlace();
        $file = UploadedFile::fake()->image('one.jpg', 640, 480);

        $request = Request::create('/places', 'POST', [
            'gallery_order' => json_encode(['new:tmp-a']),
            'gallery_new_keys' => ['tmp-a'],
        ], [], [
            'gallery_new' => [$file],
        ]);

        $this->syncService->sync(
            $place,
            $request,
            $this->syncService->mapNewFilesFromRequest($request),
        );

        $this->assertDatabaseCount('gallery_images', 1);
        $image = $place->galleryImages()->first();
        $this->assertNotNull($image);
        $this->assertSame(0, $image->sort_order);
        $this->assertFileExists(storage_path('app/public/places/gallery/'.$image->filename));
    }

    public function test_sync_reorders_existing_images(): void
    {
        $place = $this->makePlace();

        $first = GalleryImage::create([
            'imageable_type' => Place::class,
            'imageable_id' => $place->id,
            'filename' => 'place_gallery_first.webp',
            'sort_order' => 0,
            'width' => 100,
            'height' => 100,
        ]);

        $second = GalleryImage::create([
            'imageable_type' => Place::class,
            'imageable_id' => $place->id,
            'filename' => 'place_gallery_second.webp',
            'sort_order' => 1,
            'width' => 100,
            'height' => 100,
        ]);

        $request = Request::create('/places/1', 'PUT', [
            'gallery_order' => json_encode([
                'existing:'.$second->id,
                'existing:'.$first->id,
            ]),
        ]);

        $this->syncService->sync($place, $request, []);

        $this->assertSame(0, $second->fresh()->sort_order);
        $this->assertSame(1, $first->fresh()->sort_order);
    }

    public function test_sync_removes_images_and_deletes_files(): void
    {
        $place = $this->makePlace();
        $filename = 'place_gallery_remove.webp';
        $directory = storage_path('app/public/places/gallery');
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
        file_put_contents($directory.'/'.$filename, 'fake');

        $image = GalleryImage::create([
            'imageable_type' => Place::class,
            'imageable_id' => $place->id,
            'filename' => $filename,
            'sort_order' => 0,
        ]);

        $request = Request::create('/places/1', 'PUT', [
            'gallery_order' => json_encode([]),
            'gallery_remove_ids' => [$image->id],
        ]);

        $this->syncService->sync($place, $request, []);

        $this->assertDatabaseMissing('gallery_images', ['id' => $image->id]);
        $this->assertFileDoesNotExist($directory.'/'.$filename);
    }

    public function test_delete_all_for_entity_removes_records_and_files(): void
    {
        $place = $this->makePlace();
        $filename = 'place_gallery_all.webp';
        $directory = storage_path('app/public/places/gallery');
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
        file_put_contents($directory.'/'.$filename, 'fake');

        GalleryImage::create([
            'imageable_type' => Place::class,
            'imageable_id' => $place->id,
            'filename' => $filename,
            'sort_order' => 0,
        ]);

        $this->syncService->deleteAllFor($place);

        $this->assertDatabaseCount('gallery_images', 0);
        $this->assertFileDoesNotExist($directory.'/'.$filename);
    }
}
