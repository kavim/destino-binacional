<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Tour;
use App\Services\TourService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TourController extends Controller
{
    public function __construct(
        protected TourService $tourService,
    )
    {
        $this->tourService = new TourService();
    }

    public function index(): \Inertia\Response|\Inertia\ResponseFactory
    {
        $hasAnyFilter = request()->has('search') || request()->has('sub_category_id') || request()->has('category_id');

        $tours = Tour::when(request('search'), function ($query, $search) {
            $query->where('slug', 'LIKE', '%' . Str::slug($search) . '%');
        })
            ->when(request('sub_category_id'), function ($query, $sub_category_id) {
                return $query->whereHas('categories', function ($query) use ($sub_category_id) {
                    return $query->whereIn('categories.id', [$sub_category_id]);
                });
            })
            ->when(request('category_id'), function ($query, $category_id) {
                return $query->whereHas('categories', function ($query) use ($category_id) {
                    return $query->whereIn('parent_id', [$category_id]);
                });
            })
            ->orderBy('tours.id', 'DESC')
            ->paginate($hasAnyFilter ? 100 : 10); // ok, I know bro xD

        return inertia('Dashboard/Tour/Index', [
            'tours' => $tours,
            'categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'filters' => request()->all(['search', 'category_id']),
        ]);
    }

    public function create(): \Inertia\Response
    {
        return Inertia::render('Dashboard/Tour/Create', [
            'parent_categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'category_ids' => [],
            'recurrence_day_hour' => config('custom.working_hours'),
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'title' => 'required|max:255',
            'meeting_point' => 'required|max:255',
            'start' => 'nullable',
            'end' => 'nullable',
            'price' => 'nullable',
            'description' => 'required|max:9999',
            'guide' => 'required|max:255',
            'google_maps_src' => 'nullable',
            'featured_image' => 'required',
            'category_ids' => ['nullable'],
        ]);

        $this->tourService->store($request->all(), $request);

        return redirect()->route('tours.index')
            ->with('success', 'Tour created successfully.');
    }

    public function show(Tour $tour): \Inertia\Response
    {
        return Inertia::render('Dashboard/Tour/Show', [
            'tour' => $tour,
        ]);
    }

    public function edit(Tour $tour): \Inertia\Response
    {
        $tour->price = $tour->price / 100;
        $tour->recurrence_day_hour = $tour->recurrence_day_hour ?? config('custom.working_hours');

        return Inertia::render('Dashboard/Tour/Edit', [
            'tour' => $tour,
            'current_image' => $tour->image,
            'parent_categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'category_ids' => $tour->categories->pluck('id')->map(fn ($id) => (int) $id),
        ]);
    }

    public function update(Request $request, Tour $tour): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'meeting_point' => 'required|max:255',
            'start' => 'nullable',
            'end' => 'nullable',
            'price' => 'nullable',
            'currency' => 'nullable',
            'description' => 'required|max:9999',
            'guide' => 'required|max:255',
            'google_maps_src' => 'nullable',
            'featured_image' => 'nullable',
            'category_ids' => 'nullable',
            'recurrence_enabled' => 'nullable|boolean',
            'recurrence_day_hour' => 'nullable|array',
        ]);

        $this->tourService->update($validated, $tour);

        return redirect()->route('tours.index')
            ->with('success', 'Tour updated successfully.');
    }

    public function destroy(Tour $tour): \Illuminate\Http\RedirectResponse
    {
        $tour->delete();

        return redirect()->route('tours.index')
            ->with('success', 'Tour deleted successfully.');
    }
}
