<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Event;
use App\Models\Tag;
use App\Services\EventService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use RuntimeException;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hasAnyFilter = request()->has('search') || request()->has('tag_id') || request()->has('parent_tag_id');

        $events = Event::when(request('search'), function ($query, $search) {
            $query->where('slug', 'LIKE', '%'.Str::slug($search).'%');
        })
            ->when(request('tag_id'), function ($query, $tagId) {
                return $query->whereHas('tags', function ($q) use ($tagId) {
                    $q->where('tags.id', $tagId);
                });
            })
            ->when(request('parent_tag_id'), function ($query, $parentTagId) {
                return $query->whereHas('tags', function ($q) use ($parentTagId) {
                    $q->where('tags.parent_id', $parentTagId);
                });
            })
            ->orderBy('id', 'DESC')
            ->paginate($hasAnyFilter ? 100 : 10);

        return Inertia::render('Dashboard/Event/Index', [
            'events' => $events,
            'parent_tags' => Tag::where('parent_id', null)->get(),
            'grouped_tags' => Tag::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'filters' => request()->all(['search', 'parent_tag_id', 'tag_id']),
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
            'parent_tags' => Tag::where('parent_id', null)->get(),
            'grouped_tags' => Tag::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required',
            'description' => 'required',
            'start' => 'required',
            'end' => 'required',
            'is_online' => 'required',
            'link' => 'required_if:is_online,true',
            'google_maps_src' => 'required_if:is_online,false',
            'address' => 'required_if:is_online,false',
            'city_id' => 'required_if:is_online,false',
            'category_id' => 'nullable',
            'featured_image' => 'required',
            'tag_ids' => 'required',
        ]);

        try {
            $this->eventService->store($validated);
        } catch (RuntimeException) {
            return back()
                ->withErrors(['featured_image' => 'No se pudo guardar la imagen del evento. Verifique permisos de storage e intente de nuevo.'])
                ->withInput();
        }

        return redirect()->route('events.index')
            ->with('success', 'Evento creado con éxito.');
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
            'parent_tags' => Tag::where('parent_id', null)->get(),
            'grouped_tags' => Tag::where('parent_id', '<>', null)->get()->groupBy('parent_id'),
            'tag_ids' => $event->tags->pluck('id')->map(fn ($id) => (int) $id),
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
            'category_id' => ['nullable'],
            'image' => 'required_if:featured_image,null',
            'featured_image' => 'required_if:image,==,null',
            'tag_ids' => ['required', 'array'],
        ]);

        try {
            $this->eventService->update($validated, $event);
        } catch (RuntimeException) {
            return back()
                ->withErrors(['featured_image' => 'No se pudo guardar la imagen del evento. Verifique permisos de storage e intente de nuevo.'])
                ->withInput();
        }

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
