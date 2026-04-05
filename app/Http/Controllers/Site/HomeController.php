<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Services\EventService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(
        public EventService $eventService = new EventService,
    ) {}

    public function index()
    {
        $events = $this->eventService->groupedByStartDate();

        return Inertia::render('Site/Home/Home', [
            'grouped_events' => $events,
        ]);
    }

    public function privacyPolicy()
    {
        return Inertia::render('Site/Home/PrivacyPolicy');
    }
}
