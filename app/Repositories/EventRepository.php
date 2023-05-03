<?php

namespace App\Repositories;

use App\Models\Event;
use Illuminate\Support\Collection;

class EventRepository
{
    public function index(): Collection
    {
        return Event::orderBy('name')
            ->paginate();
    }

    public function groupedByStartDateLimited(): Collection
    {
        return Event::where('start', '>=', now())
        ->orderBy('start')
        ->limit(50)
        ->get([
            'title',
            'slug',
            'start',
            'end',
            'featured_image',
        ])
        ->groupBy('start')
        ->map(function ($event) {
            return $event->take(8);
        });
    }

    public function filtered(?string $start = null, ?string $end = null, ?int $category_id = null): Collection
    {
        if (is_null($start)) {
            $start = now();
        }

        return Event::orderBy('start')
        ->when($start, function ($query, $start) {
            $query->where('start', '>=', $start);
        })
        ->when($end, function ($query, $end) {
            $query->where('end', '<=', $end);
        })
        ->when($category_id, function ($query, $category_id) {
            $query->where('category_id', $category_id);
        })
        ->limit(250)
        ->get();
    }

    public function getBySlug(string $slug): Event
    {
        return Event::where('slug', $slug)
            ->firstOrFail();
    }
}
