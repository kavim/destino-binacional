<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Place;
use App\Services\CategoryService;
use App\Services\PlaceService;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function __construct(
        protected PlaceService $placeService = new PlaceService,
        protected CategoryService $categoryService = new CategoryService,
    ) {}

    public function getByCategoryParentID($CategoryParentIdentifier = null): \Inertia\Response
    {
        /** @var Category $category */
        $category = $this->categoryService->bySlug($CategoryParentIdentifier);
        $places = $this->placeService->getByCategoryParentID($category->id);

        $places = $places->through(function (Place $p) {
            $metaBits = array_filter([
                $p->placeType?->name,
                $p->city?->name,
            ]);

            return [
                'slug' => $p->slug,
                'name' => $p->name,
                'image' => $p->image,
                'meta' => $metaBits !== [] ? implode(' · ', $metaBits) : null,
            ];
        });

        return Inertia::render('Site/Place/Category/Index', [
            'category' => [
                'name' => $category->name,
                'description' => $category->description,
                'color' => $category->color,
                'featured_image' => $category->image,
                'icon' => $category->icon,
            ],
            'places' => $places,
        ]);
    }

    public function getByPlaceIdentifier(string $slug): \Inertia\Response
    {
        $place = $this->placeService->getByPlaceIdentifier($slug);

        $city = $place->city;
        $state = $city?->state;

        return Inertia::render('Site/Place/Show', [
            'place' => [
                'name' => $place->name,
                'slug' => $place->slug,
                'image' => $place->image,
                'description' => $place->description ?? '',
                'address' => $place->address,
                'google_maps_src' => $place->google_maps_src,
                'city' => $city ? [
                    'name' => $city->name,
                    'state' => $state ? ['name' => $state->name] : null,
                ] : null,
                'place_type' => $place->placeType ? [
                    'name' => $place->placeType->name,
                ] : null,
                'categories' => $place->categories->map(fn (Category $c) => [
                    'name' => $c->name,
                    'slug' => $c->slug,
                ])->values(),
            ],
        ]);
    }
}
