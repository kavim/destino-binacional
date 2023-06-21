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
        $featured_image_src = $this->storeFeaturedImage(Arr::get($data, 'featured_image'));

        $place = Place::create([
            'name' => Arr::get($data, 'name'),
            'slug' => Str::slug(Arr::get($data, 'name')),
            'address' => Arr::get($data, 'address'),
            'city_id' => Arr::get($data, 'city_id'),
            'place_type_id' => Arr::get($data, 'place_type_id'),
            'category_id' => Arr::get($data, 'category_id'),
            'featured_image' => $featured_image_src,
            'google_maps_src' => extractSrcFromGmapsIframe(Arr::get($data, 'google_maps_src')) ?? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2035.7206938642744!2d-55.53435751721623!3d-30.89615794116233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a9fe587b122a5b%3A0xa18c901cc947fe5a!2sPlaza%20Internacional!5e0!3m2!1ses-419!2sbr!4v1687316146073!5m2!1ses-419!2sbr',
            'order' => Arr::get($data, 'order') ? (int) Arr::get($data, 'order') : 0,
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

        $place->categories()->sync(Arr::get($data, 'category_ids'));

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
        $featured_image_src = null;

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
            'google_maps_src' => extractSrcFromGmapsIframe(Arr::get($data, 'google_maps_src')) ?? $place->google_maps_src,
            'order' => Arr::get($data, 'order') ?? 0,
        ]);

        PlaceTranslation::updateOrCreate(
            ['place_id' => $place->id, 'locale' => 'pt'],
            ['description' => $data['description_pt']]
        );

        PlaceTranslation::updateOrCreate(
            ['place_id' => $place->id, 'locale' => 'es'],
            ['description' => $data['description_es']]
        );

        $place->categories()->sync(Arr::get($data, 'category_ids'));

        return $place;
    }

    public function getByCategoryParentID(int $CategoryParentId)
    {
        return $this->placeRepository->getByCategoryParentID($CategoryParentId);
    }

    public function getByPlaceIdentifier(string $slug)
    {
        return $this->placeRepository->getByPlaceIdentifier($slug);
    }
}
