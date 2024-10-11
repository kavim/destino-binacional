<?php

namespace App\Repositories;

use App\Models\Tour;

class TourRepository
{
    public function index()
    {
        return Tour::orderBy('id', 'DESC')
            ->paginate();
    }

    public function getByCategoryParentID(int $parent_id = null)
    {
        return Tour::whereHas('categories', function ($query) use ($parent_id) {
            return $query->whereIn('parent_id', [$parent_id]);
        })
            ->orderBy('order', 'DESC')
            ->paginate();
    }

    public function getByTourIdentifier(string $slug)
    {
        return Tour::where('slug', $slug)
            ->firstOrFail();
    }

    public function filtered($start = null, $end = null, $category_id = null)
    {
        if (is_null($start)) {
//            $start = now();
        }

        return Tour::orderBy('start')
            ->when($start, function ($query, $start) {
                $query->where('start', '>=', $start);
            })
            ->when($end, function ($query, $end) {
                $query->where('end', '<=', $end);
            })
            ->when($category_id, function ($query, $category_id) {
                $query->whereHas('categories', function ($query) use ($category_id) {
                    $query->where('id', $category_id);
                });
            })
            ->limit(250)
            ->get();
    }

    public function getBySlug(string $slug)
    {
        return Tour::where('slug', $slug)
            ->firstOrFail();
    }
}
