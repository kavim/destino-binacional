<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CategoryTranslation;
use App\Models\City;
use App\Models\Place;
use App\Models\PlaceType;
use App\Services\PlaceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function __construct(
        protected PlaceService $placeService,
    ) {
        $this->placeService = new PlaceService();
    }

    public function index()
    {
        $places = Place::when(request('search'), function ($query, $search) {
            $query->where('slug', 'LIKE', '%'.Str::slug($search).'%');
        })
            ->when(request('sub_category_id'), function ($query, $sub_category_id) {
                return $query->where('category_id', $sub_category_id);
            })
            ->when(request('category_id'), function ($query, $category_id) {
                return $query->whereHas('category', function ($query) use ($category_id) {
                    return $query->where('parent_id', $category_id);
                });
            })
            ->orderBy('id', 'DESC')
            ->paginate();

        return Inertia::render('Dashboard/Place/Index', [
            'places' => $places,
            'categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'filters' => request()->all(['search', 'category_id']),
        ]);
    }

    public function show(Place $place)
    {
        return Inertia::render('Dashboard/Place/Show', [
            'place' => $place,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Place/Create', [
            'categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'cities' => City::get(['id', 'name']),
            'place_types' => PlaceType::get(['id', 'name']),
        ]);
    }

    public function store(Request $request): mixed
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'address' => 'required|max:255',
            'city_id' => 'required|exists:cities,id',
            'place_type_id' => 'required|exists:place_types,id',
            'category_id' => 'required|exists:categories,id',
            'description_pt' => 'required|max:9999',
            'description_es' => 'required|max:9999',
            'google_maps_src' => 'required',
            'featured_image' => 'required',
            'order' => 'required|numeric|min:0|max:9999',
        ]);

        $this->placeService->store($request->all(), $request);

        return redirect()->route('places.index')
            ->with('success', 'Place created successfully.');
    }

    public function edit(Place $place)
    {
        return Inertia::render('Dashboard/Place/Edit', [
            'place' => $place,
            'current_image' => $place->image,
            'categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'cities' => City::get(['id', 'name']),
            'place_types' => PlaceType::get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Place $place): RedirectResponse
    {
        $request->validate([
            'name' => 'required',
            'address' => 'required',
            'city_id' => 'required',
            'place_type_id' => 'required',
            'category_id' => 'required',
            'description_pt' => 'required',
            'description_es' => 'required',
            'google_maps_src' => 'required',
            'featured_image' => 'required_if:current_image,==,null',
            'image' => 'required_if:featured_image,==,null',
        ]);

        $this->placeService->update($request->all(), $request, $place);

        return redirect()->route('places.index')
            ->with('success', 'Place created successfully.');
    }

    public function importPlaces(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required',
                'address' => 'required',
                'city_id' => 'required',
                'place_type_id' => 'required',
                'category_slug' => 'required',
                'description_pt' => 'required',
                'description_es' => 'required',
                'google_maps_src' => 'required',
                'featured_image' => 'required',
            ]);

            $cat = CategoryTranslation::where('slug', $validated['category_slug'])->first();

            if ($cat) {
                $validated['category_id'] = $cat->category_id;
            } else {
                $validated['category_id'] = 5;
            }

            $this->placeService->store($validated, $request);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());

            return response()->json([
                'message' => 'Error importing places.',
            ]);
        }

        return response()->json([
            'message' => 'Places imported successfully.',
        ]);
    }
}
