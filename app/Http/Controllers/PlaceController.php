<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlaceRequest;
use App\Http\Requests\UpdatePlaceRequest;
use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use App\Models\PlaceType;
use App\Services\PlaceService;
use App\Support\GalleryPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use RuntimeException;

class PlaceController extends Controller
{
    public function __construct(
        protected PlaceService $placeService,
    ) {
        $this->authorizeResource(Place::class);
    }

    public function index(): \Inertia\Response
    {
        $hasAnyFilter = request()->has('search') || request()->has('sub_category_id') || request()->has('category_id');

        $places = Place::when(request('search'), function ($query, $search) {
            $query->where('slug', 'LIKE', '%'.Str::slug($search).'%');
        })
            ->when(request('sub_category_id'), function ($query, $sub_category_id) {
                return $query->whereHas('categories', function ($query) use ($sub_category_id) {
                    return $query->whereIn('categories.id', [$sub_category_id]);
                    // Specify the table name or alias for the 'id' column in the whereIn clause
                });
            })
            ->when(request('category_id'), function ($query, $category_id) {
                return $query->whereHas('categories', function ($query) use ($category_id) {
                    return $query->whereIn('parent_id', [$category_id]);
                });
            })
            ->with('city')
            ->orderBy('places.id', 'DESC')
            ->paginate($hasAnyFilter ? 100 : 10);

        return Inertia::render('Dashboard/Place/Index', [
            'places' => $places,
            'categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'filters' => request()->all(['search', 'category_id', 'sub_category_id']),
        ]);
    }

    public function show(Place $place): \Inertia\Response
    {
        return Inertia::render('Dashboard/Place/Show', [
            'place' => $place,
        ]);
    }

    public function create(): \Inertia\Response
    {
        return Inertia::render('Dashboard/Place/Create', [
            'parent_categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'cities' => City::get(['id', 'name']),
            'place_types' => PlaceType::get(['id', 'name']),
            'category_ids' => [],
        ]);
    }

    public function store(StorePlaceRequest $request): mixed
    {
        try {
            $this->placeService->store($request->validated(), $request);
        } catch (RuntimeException $e) {
            return back()
                ->withErrors([
                    'gallery' => str_contains($e->getMessage(), 'gallery image')
                        ? 'No se pudo guardar una imagen de la galería. Use JPG o PNG e intente de nuevo.'
                        : $e->getMessage(),
                ])
                ->withInput();
        }

        return redirect()->route('places.index')
            ->with('success', 'Place created successfully.');
    }

    public function edit(Place $place)
    {
        $place->load('galleryImages');

        return Inertia::render('Dashboard/Place/Edit', [
            'place' => $place,
            'current_image' => $place->image,
            'gallery' => GalleryPresenter::forEntity($place),
            'parent_categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'cities' => City::get(['id', 'name']),
            'place_types' => PlaceType::get(['id', 'name']),
            'category_ids' => $place->categories->pluck('id')->map(fn ($id) => (int) $id),
        ]);
    }

    public function update(UpdatePlaceRequest $request, Place $place): RedirectResponse
    {
        try {
            $this->placeService->update($request->validated(), $request, $place);
        } catch (RuntimeException $e) {
            return back()
                ->withErrors([
                    'gallery' => str_contains($e->getMessage(), 'gallery image')
                        ? 'No se pudo guardar una imagen de la galería. Use JPG o PNG e intente de nuevo.'
                        : $e->getMessage(),
                ])
                ->withInput();
        }

        return redirect()->route('places.index')
            ->with('success', 'Place created successfully.');
    }

    public function destroy(Place $place): RedirectResponse
    {
        $this->placeService->destroy($place);

        return redirect()->route('places.index')
            ->with('success', 'Place deleted successfully.');
    }
}
