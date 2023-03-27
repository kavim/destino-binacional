<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use App\Models\PlaceType;
use App\Services\PlaceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $places = Place::orderBy('id', 'DESC')
        ->paginate();

        return Inertia::render('Dashboard/Place/Index', [
            'places' => $places,
            'categories' => Category::where('parent_id', null)->get(),
            'sub_categories' => Category::where('parent_id', '<>', null)->get(),
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
            'name' => 'required',
            'address' => 'required',
            'city_id' => 'required',
            'place_type_id' => 'required',
            'category_id' => 'required',
            'description_pt' => 'required',
            'description_es' => 'required',
            'google_maps_src' => 'required',
            'featured_image' => 'required',
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
        $validated = $request->validate([
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
}
