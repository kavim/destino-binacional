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
            ->orderBy('places.id', 'DESC')
            ->paginate($hasAnyFilter ? 100 : 10);

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
            'parent_categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'cities' => City::get(['id', 'name']),
            'place_types' => PlaceType::get(['id', 'name']),
            'category_ids' => [],
        ]);
    }

    public function store(Request $request): mixed
    {
        $request->validate([
            'name' => 'required|max:255',
            'address' => 'required|max:255',
            'city_id' => 'required|exists:cities,id',
            'place_type_id' => 'required|exists:place_types,id',
            'description_pt' => 'required|max:9999',
            'description_es' => 'required|max:9999',
            'google_maps_src' => 'nullable',
            'featured_image' => 'required',
            'order' => 'required|numeric|min:0|max:9999',
            'category_ids' => ['nullable'],
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
            'parent_categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'cities' => City::get(['id', 'name']),
            'place_types' => PlaceType::get(['id', 'name']),
            'category_ids' => $place->categories->pluck('id')->map(fn ($id) => (int) $id),
        ]);
    }

    public function update(Request $request, Place $place): RedirectResponse
    {
        $request->validate([
            'name' => 'required',
            'address' => 'required',
            'city_id' => 'required',
            'place_type_id' => 'required',
            'description_pt' => 'required',
            'description_es' => 'required',
            'google_maps_src' => 'nullable',
            'featured_image' => 'required_if:current_image,==,null',
            'image' => 'required_if:featured_image,==,null',
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['required', 'exists:categories,id'],
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

    public function destroy(Place $place): RedirectResponse
    {
        $place->delete();

        return redirect()->route('places.index')
            ->with('success', 'Place deleted successfully.');
    }
}
