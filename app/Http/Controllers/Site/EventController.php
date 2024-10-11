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
        protected EventService $eventService = new EventService(),
    ) {
    }

    public function index(Request $request): \Inertia\Response
    {
        $start = $request->has('start') && ! is_null($request->input('start')) ? Carbon::parse($request->input('start')) : null;
        $end = $request->has('end') && ! is_null($request->input('end')) ? Carbon::parse($request->input('end')) : null;
        $events = $this->eventService->filtered($start, $end);

        return Inertia::render('Site/Event/Index', [
            'events' => $events,
            'filters' => [
                'start' => ! is_null($start) ? $start : null,
                'end' => ! is_null($end) ? $end : null,
            ],
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $event = $this->eventService->getBySlug($slug);

        return Inertia::render('Site/Event/Show', [
            'event' => $event,
        ]);
    }
}
