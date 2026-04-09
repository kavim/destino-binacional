<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Services\EventService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService = new EventService,
    ) {}

    public function index(Request $request): \Inertia\Response
    {
        $start = $request->has('start') && ! is_null($request->input('start')) ? Carbon::parse($request->input('start')) : null;
        $end = $request->has('end') && ! is_null($request->input('end')) ? Carbon::parse($request->input('end')) : null;
        $searchRaw = $request->input('search');
        $search = is_string($searchRaw) && $searchRaw !== '' ? trim($searchRaw) : null;
        $events = $this->eventService->filtered($start, $end, null, $search);

        return Inertia::render('Site/Event/Index', [
            'events' => $events,
            'filters' => [
                'start' => ! is_null($start) ? $start : null,
                'end' => ! is_null($end) ? $end : null,
                'search' => is_string($searchRaw) ? trim($searchRaw) : '',
            ],
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $event = $this->eventService->getBySlug($slug);
        $event->load('city.state');

        return Inertia::render('Site/Event/Show', [
            'event' => $event,
        ]);
    }
}
