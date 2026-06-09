<?php

namespace Tests\Unit\Services;

use App\Models\Event;
use App\Services\EventService;
use App\Services\FeaturedImageStorage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use RuntimeException;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class EventServiceTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    private EventService $eventService;

    private string $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
        $this->eventService = new EventService;
    }

    private function makeEvent(array $overrides = []): Event
    {
        return Event::forceCreate(array_merge([
            'title' => $title = fake()->sentence(),
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'start' => now()->addWeek()->format('Y-m-d'),
            'end' => now()->addWeeks(2)->format('Y-m-d'),
            'is_online' => false,
            'address' => fake()->address(),
            'city_id' => $this->city->id,
            'category_id' => $this->childCategory->id,
            'google_maps_src' => 'https://maps.google.com/embed',
            'featured_image' => 'existing-event.jpg',
        ], $overrides));
    }

    public function test_store_featured_image_returns_null_for_empty_input(): void
    {
        $this->assertNull($this->eventService->storeFeaturedImage(null));
        $this->assertNull($this->eventService->storeFeaturedImage(''));
    }

    public function test_store_featured_image_saves_file_to_events_directory(): void
    {
        $filename = $this->eventService->storeFeaturedImage($this->base64Pixel);

        $this->assertNotNull($filename);
        $this->assertStringStartsWith('event_', $filename);
        $this->assertFileExists(storage_path('app/public/events/'.$filename));
    }

    public function test_store_featured_image_throws_on_invalid_data(): void
    {
        $this->expectException(RuntimeException::class);

        $this->eventService->storeFeaturedImage('invalid-image-data');
    }

    public function test_store_does_not_persist_event_when_image_save_fails(): void
    {
        $this->mock(FeaturedImageStorage::class, function ($mock) {
            $mock->shouldReceive('storeFromBase64')->once()->andThrow(new RuntimeException('fail'));
        });

        $service = app(EventService::class);

        try {
            $service->store([
                'title' => 'Broken Upload Event',
                'description' => 'Test',
                'start' => now()->addWeek()->format('Y-m-d'),
                'end' => now()->addWeeks(2)->format('Y-m-d'),
                'is_online' => false,
                'link' => '',
                'google_maps_src' => 'https://maps.google.com/embed',
                'address' => 'Test address',
                'city_id' => $this->city->id,
                'category_id' => $this->childCategory->id,
                'featured_image' => $this->base64Pixel,
                'tag_ids' => [$this->childTag->id],
            ]);
            $this->fail('Expected RuntimeException was not thrown.');
        } catch (RuntimeException) {
            // expected
        }

        $this->assertDatabaseMissing('events', ['slug' => 'broken-upload-event']);
    }

    public function test_update_preserves_featured_image_when_not_in_payload(): void
    {
        $event = $this->makeEvent(['featured_image' => 'keep-me.jpg']);

        $this->eventService->update([
            'title' => 'Updated Title',
            'description' => $event->description,
            'start' => $event->start->format('Y-m-d'),
            'end' => $event->end->format('Y-m-d'),
            'is_online' => false,
            'address' => $event->address,
            'city_id' => $event->city_id,
            'category_id' => $event->category_id,
            'google_maps_src' => $event->google_maps_src,
            'tag_ids' => [],
        ], $event);

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'featured_image' => 'keep-me.jpg',
            'title' => 'Updated Title',
        ]);
    }

    public function test_update_replaces_featured_image_when_provided(): void
    {
        $event = $this->makeEvent(['featured_image' => 'old.jpg']);

        $this->eventService->update([
            'title' => $event->title,
            'description' => $event->description,
            'start' => $event->start->format('Y-m-d'),
            'end' => $event->end->format('Y-m-d'),
            'is_online' => false,
            'address' => $event->address,
            'city_id' => $event->city_id,
            'category_id' => $event->category_id,
            'google_maps_src' => $event->google_maps_src,
            'featured_image' => $this->base64Pixel,
            'tag_ids' => [],
        ], $event);

        $event->refresh();
        $this->assertNotNull($event->featured_image);
        $this->assertNotSame('old.jpg', $event->featured_image);
        $this->assertFileExists(storage_path('app/public/events/'.$event->featured_image));
    }

    public function test_update_does_not_detach_tags_when_tag_ids_omitted(): void
    {
        $event = $this->makeEvent();
        $event->tags()->attach($this->childTag->id);

        $this->eventService->update([
            'title' => 'Only title change',
            'description' => $event->description,
            'start' => $event->start->format('Y-m-d'),
            'end' => $event->end->format('Y-m-d'),
            'is_online' => false,
            'address' => $event->address,
            'city_id' => $event->city_id,
            'category_id' => $event->category_id,
            'google_maps_src' => $event->google_maps_src,
        ], $event);

        $this->assertTrue($event->fresh()->tags->contains('id', $this->childTag->id));
    }
}
