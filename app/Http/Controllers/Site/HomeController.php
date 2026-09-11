<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Services\EventService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(
        public EventService $eventService,
    ) {}

    public function index()
    {
        $redirectUrl = config('app.home_temporary_redirect_url');

        if (is_string($redirectUrl) && $redirectUrl !== '') {
            return redirect()->away($redirectUrl, 302);
        }

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
