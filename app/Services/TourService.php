<?php

namespace App\Services;

use App\Models\Tour;
use App\Repositories\TourRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TourService
{
    public string $error_message = '';

    public function __construct(
        protected TourRepository $tourRepository = new TourRepository,
        protected FeaturedImageStorage $featuredImageStorage = new FeaturedImageStorage,
    ) {}

    public function index()
    {
        return $this->tourRepository->index();
    }

    public function filtered(?int $category_id = null)
    {
        return $this->tourRepository->filtered($category_id);
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $featured_image_src = $this->storeFeaturedImage(Arr::get($data, 'featured_image'));
            $google_maps_src = Arr::get($data, 'google_maps_src');
            $google_maps_src = extractSrcFromGmapsIframe($google_maps_src);
            $google_maps_src = $google_maps_src ?? config('custom.default_map_src');

            $tour = Tour::create([
                'title' => Arr::get($data, 'title'),
                'slug' => Str::slug(Arr::get($data, 'title')),
                'description' => Arr::get($data, 'description'),
                'featured_image' => $featured_image_src,
                'google_maps_src' => $google_maps_src,
                'start' => Arr::get($data, 'start'),
                'end' => Arr::get($data, 'end'),
                'price' => Arr::get($data, 'price') ? convert_to_cents(Arr::get($data, 'price')) : 0,
                'currency' => Arr::get($data, 'currency', 'BRL'),
                'guide' => Arr::get($data, 'guide'),
                'meeting_point' => Arr::get($data, 'meeting_point'),
                'recurrence_enabled' => Arr::get($data, 'recurrence_enabled', false),
                'recurrence_day_hour' => Arr::get($data, 'recurrence_day_hour'),
            ]);

            if (! $tour) {
                $this->error_message = 'Error creating place';

                return false;
            }

            $tour->categories()->sync(Arr::get($data, 'category_ids'));

            return $tour;
        });
    }

    public function storeFeaturedImage($image): ?string
    {
        $config = config('custom.tours_feature_image');

        return $this->featuredImageStorage->storeFromBase64($image, [
            'path' => $config['path'],
            'prefix' => 'tour_',
            'width' => $config['width'],
            'height' => $config['height'],
        ]);
    }

    public function update(array $data, Tour $tour): Tour
    {
        return DB::transaction(function () use ($data, $tour) {
            $the_feature_image = null;
            $start = Arr::get($data, 'start', null);
            $end = Arr::get($data, 'end', null);

            if (! is_null(Arr::get($data, 'featured_image'))) {
                $the_feature_image = $this->storeFeaturedImage(Arr::get($data, 'featured_image'));
            }

            $tour->update([
                'title' => Arr::get($data, 'title'),
                'slug' => Str::slug(Arr::get($data, 'title')),
                'description' => Arr::get($data, 'description'),
                'featured_image' => $the_feature_image ?? $tour->featured_image,
                'google_maps_src' => extractSrcFromGmapsIframe(Arr::get($data, 'google_maps_src')) ?? $tour->google_maps_src,
                'start' => $start,
                'end' => $end,
                'price' => Arr::get($data, 'price') ? convert_to_cents(Arr::get($data, 'price')) : 0,
                'currency' => Arr::get($data, 'currency'),
                'guide' => Arr::get($data, 'guide'),
                'meeting_point' => Arr::get($data, 'meeting_point'),
                'recurrence_enabled' => Arr::get($data, 'recurrence_enabled'),
                'recurrence_day_hour' => Arr::get($data, 'recurrence_day_hour'),
            ]);

            $tour->categories()->sync(Arr::get($data, 'category_ids'));

            return $tour;
        });
    }

    public function getBySlug(string $slug): Tour
    {
        return $this->tourRepository->getBySlug($slug);
    }
}
