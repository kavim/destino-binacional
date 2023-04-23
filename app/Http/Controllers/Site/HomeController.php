<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use App\Services\EventService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(
        public EventService $eventService = new EventService(),
        public CategoryService $categoryService = new CategoryService(),
    ) {
    }

    public function index()
    {
        $events = $this->eventService->groupedByStartDate();
        $categories = $this->categoryService->index();

        return Inertia::render('Site/Home/Home', [
            'grouped_events' => $events,
            'categories' => $categories,
        ]);
    }
}
