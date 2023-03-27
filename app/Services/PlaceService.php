<?php

namespace App\Services;

use App\Models\Place;
use App\Models\PlaceTranslation;
use App\Repositories\PlaceRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class PlaceService
{
    public string $error_message = '';

    public function __construct(
        protected PlaceRepository $placeRepository = new PlaceRepository(),
    ) {
    }

    public function index()
    {
        return $this->placeRepository->index();
    }

    public function store(array $data, Request $request)
    {
        // upload image
        $featured_image_src = $this->storeFeaturedImage(Arr::get($data, 'featured_image'), $request);

        // process data here
        $data['google_maps_src'] = ! is_null(Arr::get($data, 'google_maps_src')) ?? extractSrcFromGmapsIframe(Arr::get($data, 'google_maps_src'));
        $data['featured_image'] = $featured_image_src;

        $place = Place::create([
            'name' => Arr::get($data, 'name'),
            'slug' => Str::slug(Arr::get($data, 'name')),
            'address' => Arr::get($data, 'address'),
            'city_id' => Arr::get($data, 'city_id'),
            'place_type_id' => Arr::get($data, 'place_type_id'),
            'category_id' => Arr::get($data, 'category_id'),
            'featured_image' => Arr::get($data, 'featured_image'),
            'google_maps_src' => Arr::get($data, 'google_maps_src'),
        ]);

        if (! $place) {
            $this->error_message = 'Error creating place';

            return false;
        }

        PlaceTranslation::create([
            'place_id' => $place->id,
            'locale' => 'pt',
            'description' => $data['description_pt'],
        ]);

        PlaceTranslation::create([
            'place_id' => $place->id,
            'locale' => 'es',
            'description' => $data['description_es'],
        ]);

        return $place;
    }

    public function storeFeaturedImage($image): string
    {
        if (! $image || is_null($image)) {
            return null;
        }

        $width = config('custom.feature_image.width');
        $height = config('custom.feature_image.height');
        $path = config('custom.feature_image.path');

        try {
            $file = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
            $featured_image_src = 'place_'.time().'.'.explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($file)->resize($width, $height)->save(storage_path('app/public/'.$path.$featured_image_src));
        } catch (Exception $e) {
            Log::error($e);
        }

        return $featured_image_src;
    }

    public function update(array $data, Request $request, Place $place)
    {
        // upload image
        if ($request->has('featured_image')
            && ! is_null($request->featured_image)
            && ! is_null(Arr::get($data, 'featured_image'))
        ) {
            $the_feature_image = $this->storeFeaturedImage(Arr::get($data, 'featured_image'));
        }

        $place->update([
            'name' => Arr::get($data, 'name'),
            'slug' => Str::slug(Arr::get($data, 'name')),
            'address' => Arr::get($data, 'address'),
            'city_id' => Arr::get($data, 'city_id'),
            'place_type_id' => Arr::get($data, 'place_type_id'),
            'category_id' => Arr::get($data, 'category_id'),
            'featured_image' => $the_feature_image ?? $place->featured_image,
            'google_maps_src' => extractSrcFromGmapsIframe(Arr::get($data, 'google_maps_src')),
        ]);

        PlaceTranslation::updateOrCreate(
            ['place_id' => $place->id, 'locale' => 'pt'],
            ['description' => $data['description_pt']]
        );

        PlaceTranslation::updateOrCreate(
            ['place_id' => $place->id, 'locale' => 'es'],
            ['description' => $data['description_es']]
        );

        return $place;
    }
}
