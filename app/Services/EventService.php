<?php

namespace App\Services;

use App\Models\Event;
use App\Repositories\EventRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventService
{
    public string $error_message = '';

    public function __construct(
        protected EventRepository $eventRepository = new EventRepository,
        protected FeaturedImageStorage $featuredImageStorage = new FeaturedImageStorage,
        protected GallerySyncService $gallerySyncService = new GallerySyncService,
    ) {}

    public function index()
    {
        return $this->eventRepository->index();
    }

    public function groupedByStartDate()
    {
        return $this->eventRepository->groupedByStartDateLimited();
    }

    public function filtered(?string $start = null, ?string $end = null, ?int $category_id = null, ?string $search = null)
    {
        return $this->eventRepository->filtered($start, $end, $category_id, $search);
    }

    public function getBySlug(string $slug)
    {
        return $this->eventRepository->getBySlug($slug);
    }

    public function store(array $data, ?Request $request = null): Event
    {
        return DB::transaction(function () use ($data, $request) {
            $event = Event::create([
                'title' => Arr::get($data, 'title'),
                'slug' => Str::slug(Arr::get($data, 'title')),
                'description' => Arr::get($data, 'description'),
                'start' => Carbon::parse(Arr::get($data, 'start')),
                'end' => Carbon::parse(Arr::get($data, 'end')),
                'is_online' => Arr::get($data, 'is_online'),
                'link' => Arr::get($data, 'link'),
                'google_maps_src' => extractSrcFromGmapsIframe(Arr::get($data, 'google_maps_src')),
                'address' => Arr::get($data, 'address'),
                'city_id' => Arr::get($data, 'city_id'),
                'category_id' => Arr::get($data, 'category_id'),
                'featured_image' => $this->storeFeaturedImage(Arr::get($data, 'featured_image')),
            ]);

            $event->tags()->sync(Arr::get($data, 'tag_ids'));

            if ($request) {
                $this->gallerySyncService->sync(
                    $event,
                    $request,
                    $this->gallerySyncService->mapNewFilesFromRequest($request),
                );
            }

            return $event;
        });
    }

    public function storeFeaturedImage($image): ?string
    {
        $config = config('custom.events_feature_image');

        return $this->featuredImageStorage->storeFromBase64($image, [
            'path' => $config['path'],
            'prefix' => 'event_',
            'width' => $config['width'],
            'height' => $config['height'],
            'output_format' => $config['output_format'] ?? null,
            'output_quality' => $config['output_quality'] ?? 85,
        ]);
    }

    public function update(array $data, Event $event, ?Request $request = null)
    {
        return DB::transaction(function () use ($data, $event, $request) {
            $the_feature_image = null;

            if (! is_null(Arr::get($data, 'featured_image'))) {
                $the_feature_image = $this->storeFeaturedImage(Arr::get($data, 'featured_image'));
            }

            $event->update([
                'title' => Arr::get($data, 'title'),
                'slug' => Str::slug(Arr::get($data, 'title')),
                'description' => Arr::get($data, 'description'),
                'start' => Carbon::parse(Arr::get($data, 'start')),
                'end' => Carbon::parse(Arr::get($data, 'end')),
                'is_online' => Arr::get($data, 'is_online'),
                'link' => Arr::get($data, 'link'),
                'google_maps_src' => extractSrcFromGmapsIframe(Arr::get($data, 'google_maps_src')) ?? $event->google_maps_src,
                'address' => Arr::get($data, 'address'),
                'city_id' => Arr::get($data, 'city_id'),
                'category_id' => Arr::get($data, 'category_id'),
                'featured_image' => $the_feature_image ?? $event->featured_image,
            ]);

            if (array_key_exists('tag_ids', $data)) {
                $event->tags()->sync(Arr::get($data, 'tag_ids', []));
            }

            if ($request) {
                $this->gallerySyncService->sync(
                    $event,
                    $request,
                    $this->gallerySyncService->mapNewFilesFromRequest($request),
                );
            }

            return $event;
        });
    }

    public function destroy(Event $event): void
    {
        DB::transaction(function () use ($event) {
            $this->gallerySyncService->deleteAllFor($event);
            $event->delete();
        });
    }
}
