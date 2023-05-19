<?php

namespace App\Services;

use App\Models\Event;
use App\Repositories\EventRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class EventService
{
    public string $error_message = '';

    public function __construct(
        protected EventRepository $eventRepository = new EventRepository(),
    ) {
    }

    public function index()
    {
        return $this->eventRepository->index();
    }

    public function groupedByStartDate()
    {
        return $this->eventRepository->groupedByStartDateLimited();
    }

    public function filtered(?string $start = null, ?string $end = null, ?int $category_id = null)
    {
        return $this->eventRepository->filtered($start, $end, $category_id);
    }

    public function getBySlug(string $slug)
    {
        return $this->eventRepository->getBySlug($slug);
    }

    public function store(array $data): Event
    {
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

        return $event;
    }

    public function storeFeaturedImage($image): string|null
    {
        if (! $image || is_null($image)) {
            return null;
        }

        $width = config('custom.feature_image.width');
        $height = config('custom.feature_image.height');

        try {
            $file = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
            $featured_image_src = 'event_'.time().'.'.explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            // Image::make($file)->resize($width, $height)->save(storage_path('app/public/'.'events/'.$featured_image_src));
            Image::make($file)->save(storage_path('app/public/'.'events/'.$featured_image_src));
        } catch (Exception $e) {
            Log::error($e);
        }

        return $featured_image_src;
    }

    public function update(array $data, Event $event)
    {
        // upload image
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

        $event->tags()->sync(Arr::get($data, 'tag_ids'));

        return $event;
    }

    public function destroy(Event $event)
    {
        $event->delete();
    }
}
