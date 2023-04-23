<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use App\Services\PlaceService;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function __construct(
        protected PlaceService $placeService = new PlaceService(),
        protected CategoryService $categoryService = new CategoryService(),
    ) {
    }

    public function getByCategoryParentID($CategoryParentIdentifier = null): \Inertia\Response
    {
        $category = $this->categoryService->bySlug($CategoryParentIdentifier);
        $places = $this->placeService->getByCategoryParentID($category->id);

        return Inertia::render('Site/Place/Category/Index', [
            'category' => $category,
            'places' => $places,
        ]);
    }

    public function getByPlaceIdentifier(string $slug): \Inertia\Response
    {
        $place = $this->placeService->getByPlaceIdentifier($slug);

        return Inertia::render('Site/Place/Show', [
            'place' => $place,
        ]);
    }
}
