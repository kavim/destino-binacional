<?php

namespace App\Http\Controllers\Site;

use App\Services\TourService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TourController
{
    public function __construct(
        protected TourService $tourService = new TourService,
    ) {}

    public function index(Request $request): \Inertia\Response
    {
        $start = $request->filled('start') ? Carbon::parse($request->string('start')) : null;
        $end = $request->filled('end') ? Carbon::parse($request->string('end')) : null;
        $tours = $this->tourService->filtered($start, $end);

        return Inertia::render('Site/Tour/Index', [
            'tours' => $tours,
            'filters' => [
                'start' => ! is_null($start) ? $start : null,
                'end' => ! is_null($end) ? $end : null,
            ],
        ]);
    }

    public function show(string $slug): \Inertia\Response
    {
        $tour = $this->tourService->getBySlug($slug);

        return Inertia::render('Site/Tour/Show', [
            'tour' => $tour,
        ]);
    }
}
