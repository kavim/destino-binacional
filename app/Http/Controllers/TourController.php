<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTourRequest;
use App\Http\Requests\UpdateTourRequest;
use App\Models\Category;
use App\Models\Tour;
use App\Services\TourService;
use App\Support\GalleryPresenter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use RuntimeException;

class TourController extends Controller
{
    public function __construct(
        protected TourService $tourService,
    ) {
        $this->authorizeResource(Tour::class);
    }

    public function index(): \Inertia\Response|\Inertia\ResponseFactory
    {
        $hasAnyFilter = request()->has('search') || request()->has('sub_category_id') || request()->has('category_id');

        $tours = Tour::when(request('search'), function ($query, $search) {
            $query->where('slug', 'LIKE', '%'.Str::slug($search).'%');
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
            'filters' => request()->all(['search', 'category_id', 'sub_category_id']),
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

    public function store(StoreTourRequest $request): \Illuminate\Http\RedirectResponse
    {
        try {
            $this->tourService->store($request->validated(), $request);
        } catch (RuntimeException $e) {
            $field = str_contains($e->getMessage(), 'gallery image') ? 'gallery' : 'featured_image';

            return back()
                ->withErrors([
                    $field => $field === 'gallery'
                        ? 'No se pudo guardar una imagen de la galería. Use JPG o PNG e intente de nuevo.'
                        : 'No se pudo guardar la imagen del tour.',
                ])
                ->withInput();
        }

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
        $tour->load('galleryImages');
        $tour->price = $tour->price / 100;
        $tour->recurrence_day_hour = $tour->recurrence_day_hour ?? config('custom.working_hours');

        return Inertia::render('Dashboard/Tour/Edit', [
            'tour' => $tour,
            'current_image' => $tour->image,
            'gallery' => GalleryPresenter::forEntity($tour),
            'parent_categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'category_ids' => $tour->categories->pluck('id')->map(fn ($id) => (int) $id),
        ]);
    }

    public function update(UpdateTourRequest $request, Tour $tour): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validated();

        try {
            $this->tourService->update($validated, $tour, $request);
        } catch (RuntimeException $e) {
            $field = str_contains($e->getMessage(), 'gallery image') ? 'gallery' : 'featured_image';

            return back()
                ->withErrors([
                    $field => $field === 'gallery'
                        ? 'No se pudo guardar una imagen de la galería. Use JPG o PNG e intente de nuevo.'
                        : 'No se pudo guardar la imagen del tour.',
                ])
                ->withInput();
        }

        return redirect()->route('tours.index')
            ->with('success', 'Tour updated successfully.');
    }

    public function destroy(Tour $tour): \Illuminate\Http\RedirectResponse
    {
        $this->tourService->destroy($tour);

        return redirect()->route('tours.index')
            ->with('success', 'Tour deleted successfully.');
    }
}
