<?php

namespace App\Http\Controllers\Site;

use App\Models\Category;
use App\Services\CategoryService;
use App\Services\TourService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TourController
{
    public function __construct(
        protected TourService $tourService = new TourService,
        protected CategoryService $categoryService = new CategoryService,
    ) {}

    public function index(Request $request): \Inertia\Response
    {
        $categorySlug = $request->string('category')->trim()->toString();
        $categoryId = null;

        if ($categorySlug !== '') {
            try {
                $category = $this->categoryService->bySlug($categorySlug);
                $categoryId = $category->id;
            } catch (\Throwable) {
                $categorySlug = '';
            }
        }

        $tours = $this->tourService->filtered($categoryId);

        $filterCategories = Category::query()
            ->whereHas('tours')
            ->get()
            ->sortBy(fn (Category $c) => mb_strtolower((string) $c->name))
            ->values()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
            ]);

        return Inertia::render('Site/Tour/Index', [
            'tours' => $tours,
            'filters' => [
                'category' => $categorySlug !== '' ? $categorySlug : null,
            ],
            'filterCategories' => $filterCategories,
        ]);
    }

    public function show(string $slug): \Inertia\Response
    {
        $tour = $this->tourService->getBySlug($slug);
        $tour->load('categories');

        $mapRaw = $tour->getRawOriginal('google_maps_src');
        $googleMaps = is_string($mapRaw) ? $mapRaw : null;

        return Inertia::render('Site/Tour/Show', [
            'tour' => [
                'title' => $tour->title,
                'slug' => $tour->slug,
                'image' => $tour->image,
                'description' => $tour->description ?? '',
                'start' => $tour->start,
                'end' => $tour->end,
                'meeting_point' => $tour->meeting_point,
                'guide' => $tour->guide,
                'google_maps_src' => $googleMaps,
                'price' => $tour->price,
                'currency' => $tour->currency,
                'recurrence_enabled' => (bool) $tour->recurrence_enabled,
                'categories' => $tour->categories->map(fn (Category $c) => [
                    'name' => $c->name,
                    'slug' => $c->slug,
                ])->values(),
            ],
        ]);
    }
}
