<?php

namespace Tests\Feature\Dashboard;

use App\Models\GalleryImage;
use App\Models\Place;
use App\Models\PlaceTranslation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class GalleryControllerTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    private string $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    public function test_place_store_with_gallery_uploads_images(): void
    {
        $file = UploadedFile::fake()->image('gallery.jpg', 640, 480);

        $this->actingAs($this->user)
            ->post('/places', [
                'name' => 'Place With Gallery',
                'address' => 'Calle 1',
                'city_id' => $this->city->id,
                'place_type_id' => $this->placeType->id,
                'description_pt' => 'PT',
                'description_es' => 'ES',
                'featured_image' => $this->base64Pixel,
                'order' => 1,
                'category_ids' => [$this->childCategory->id],
                'gallery_new' => [$file],
                'gallery_new_keys' => ['tmp-1'],
                'gallery_order' => json_encode(['new:tmp-1']),
            ])
            ->assertRedirect('/places');

        $place = Place::where('slug', 'place-with-gallery')->first();
        $this->assertNotNull($place);
        $this->assertSame(1, $place->galleryImages()->count());
    }

    public function test_place_edit_includes_gallery_prop(): void
    {
        $place = Place::forceCreate([
            'name' => 'Galeria',
            'slug' => 'galeria',
            'address' => 'Rua 1',
            'city_id' => $this->city->id,
            'place_type_id' => $this->placeType->id,
            'category_id' => $this->childCategory->id,
            'featured_image' => 'test.jpg',
            'order' => 0,
        ]);

        PlaceTranslation::forceCreate(['place_id' => $place->id, 'locale' => 'es', 'description' => 'D']);
        PlaceTranslation::forceCreate(['place_id' => $place->id, 'locale' => 'pt', 'description' => 'D']);
        $place->categories()->attach($this->childCategory->id);

        GalleryImage::create([
            'imageable_type' => Place::class,
            'imageable_id' => $place->id,
            'filename' => 'place_gallery_test.webp',
            'sort_order' => 0,
            'width' => 100,
            'height' => 100,
        ]);

        $this->actingAs($this->user)
            ->get("/places/{$place->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('gallery', 1)
                ->where('gallery.0.id', fn ($id) => is_int($id))
            );
    }

    public function test_place_destroy_deletes_gallery_images(): void
    {
        $place = Place::forceCreate([
            'name' => 'Delete Gallery',
            'slug' => 'delete-gallery',
            'address' => 'Rua 1',
            'city_id' => $this->city->id,
            'place_type_id' => $this->placeType->id,
            'category_id' => $this->childCategory->id,
            'featured_image' => 'test.jpg',
            'order' => 0,
        ]);

        GalleryImage::create([
            'imageable_type' => Place::class,
            'imageable_id' => $place->id,
            'filename' => 'place_gallery_delete.webp',
            'sort_order' => 0,
        ]);

        $this->actingAs($this->user)
            ->delete("/places/{$place->id}")
            ->assertRedirect('/places');

        $this->assertDatabaseCount('gallery_images', 0);
    }

    public function test_place_update_with_gallery_multipart_requires_place_type_id(): void
    {
        $place = Place::forceCreate([
            'name' => 'Multipart Gallery',
            'slug' => 'multipart-gallery',
            'address' => 'Rua 1',
            'city_id' => $this->city->id,
            'place_type_id' => $this->placeType->id,
            'category_id' => $this->childCategory->id,
            'featured_image' => 'test.jpg',
            'order' => 0,
        ]);

        PlaceTranslation::forceCreate(['place_id' => $place->id, 'locale' => 'es', 'description' => 'D']);
        PlaceTranslation::forceCreate(['place_id' => $place->id, 'locale' => 'pt', 'description' => 'D']);
        $place->categories()->attach($this->childCategory->id);

        $file = UploadedFile::fake()->image('gallery.jpg', 640, 480);

        $this->actingAs($this->user)
            ->post("/places/{$place->id}", [
                '_method' => 'PUT',
                'name' => $place->name,
                'address' => $place->address,
                'city_id' => $place->city_id,
                'place_type_id' => $place->place_type_id,
                'description_pt' => 'PT',
                'description_es' => 'ES',
                'current_image' => $place->featured_image,
                'order' => 1,
                'category_ids' => [$this->childCategory->id],
                'gallery_new' => [$file],
                'gallery_new_keys' => ['tmp-1'],
                'gallery_order' => json_encode(['new:tmp-1']),
            ])
            ->assertRedirect('/places');

        $this->assertSame(1, $place->fresh()->galleryImages()->count());
    }

    public function test_site_place_show_includes_gallery(): void
    {
        $place = Place::forceCreate([
            'name' => 'Site Gallery',
            'slug' => 'site-gallery',
            'address' => 'Rua 1',
            'city_id' => $this->city->id,
            'place_type_id' => $this->placeType->id,
            'category_id' => $this->childCategory->id,
            'featured_image' => 'test.jpg',
            'order' => 0,
        ]);

        PlaceTranslation::forceCreate(['place_id' => $place->id, 'locale' => 'es', 'description' => 'Desc']);
        PlaceTranslation::forceCreate(['place_id' => $place->id, 'locale' => 'pt', 'description' => 'Desc']);

        GalleryImage::create([
            'imageable_type' => Place::class,
            'imageable_id' => $place->id,
            'filename' => 'place_gallery_site.webp',
            'sort_order' => 0,
            'width' => 200,
            'height' => 150,
        ]);

        $this->get('/p/site-gallery')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Site/Place/Show')
                ->has('place.gallery', 1)
            );
    }
}
