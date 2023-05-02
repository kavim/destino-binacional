<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService,
    ) {
        $this->eventService = new EventService();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $places = Event::when(request('search'), function ($query, $search) {
            $query->where('slug', 'LIKE', '%'.Str::slug($search).'%');
        })
        ->when(request('category_id'), function ($query, $category_id) {
            $query->where('category_id', $category_id);
        })
        ->orderBy('id', 'DESC')
        ->paginate();

        return Inertia::render('Dashboard/Event/Index', [
            'events' => $places,
            'categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'filters' => request()->all(['search', 'category_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Dashboard/Event/Create', [
            'categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'cities' => City::get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required'],
            'description' => ['required'],
            'start' => ['required'],
            'end' => ['required'],
            'is_online' => ['required'],
            'link' => ['required_if:is_online,true'],
            'google_maps_src' => ['required_if:is_online,false'],
            'address' => ['required_if:is_online,false'],
            'city_id' => ['required_if:is_online,false'],
            'category_id' => ['required'],
            'featured_image' => ['required'],
        ]);

        $this->eventService->store($validated);

        return redirect()->route('events.index')
            ->with('success', 'Evento creado con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        return Inertia::render('Dashboard/Event/Edit', [
            'event' => $event,
            'current_image' => $event->image,
            'categories' => Category::where('parent_id', null)->get(),
            'grouped_categories' => Category::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'cities' => City::get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => ['required'],
            'description' => ['required'],
            'start' => ['required'],
            'end' => ['required'],
            'is_online' => ['required'],
            'link' => ['required_if:is_online,true'],
            'google_maps_src' => ['required_if:is_online,false'],
            'address' => ['required_if:is_online,false'],
            'city_id' => ['required_if:is_online,false'],
            'category_id' => ['required'],
            'image' => ['required'],
            'featured_image' => ['nullable'],
        ]);

        $this->eventService->update($validated, $event);

        return redirect()->route('events.index')
            ->with('success', 'Evento actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->route('events.index')
            ->with('success', 'Evento eliminado con éxito.');
    }
}
