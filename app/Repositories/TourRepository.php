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

    public function getByCategoryParentID(?int $parent_id = null)
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

    public function filtered(?int $category_id = null)
    {
        return Tour::query()
            ->when($category_id, function ($query, $category_id) {
                $query->whereHas('categories', function ($q) use ($category_id) {
                    $q->where('categories.id', $category_id);
                });
            })
            ->orderBy('title')
            ->limit(250)
            ->get();
    }

    public function getBySlug(string $slug)
    {
        return Tour::where('slug', $slug)
            ->firstOrFail();
    }
}
