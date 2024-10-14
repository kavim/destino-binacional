<?php

namespace App\Services;

use App\Models\Tour;
use App\Repositories\TourRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class TourService
{
    public string $error_message = '';

    public function __construct(
        protected TourRepository $tourRepository = new TourRepository(),
    ) {
    }

    public function index()
    {
        return $this->tourRepository->index();
    }

    public function filtered(?string $start = null, ?string $end = null, ?int $category_id = null)
    {
        return $this->tourRepository->filtered($start, $end, $category_id);
    }

    public function store(array $data)
    {
        // upload image
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
    }

    public function storeFeaturedImage($image): ?string
    {
        if (! $image || is_null($image)) {
            return null;
        }

        $width = config('custom.tours_feature_image.width');
        $height = config('custom.tours_feature_image.height');
        $path = config('custom.tours_feature_image.path');
        $featured_image_src = null;

        try {
            $file = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
            $featured_image_src = 'tour_'.time().'.'.explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($file)->resize($width, $height)->save(storage_path('app/public/'.$path.$featured_image_src));
        } catch (Exception $e) {
            Log::error($e);
        }

        return $featured_image_src;
    }

    public function update(array $data, Tour $tour): Tour
    {
        $the_feature_image = null;
        $start = Arr::get($data, 'start', null);
        $end = Arr::get($data, 'end', null);

        // upload image
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
    }

    public function getBySlug(string $slug): Tour
    {
        return $this->tourRepository->getBySlug($slug);
    }
}
