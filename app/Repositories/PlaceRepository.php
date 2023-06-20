<?php

namespace App\Repositories;

use App\Models\Place;

class PlaceRepository
{
    public function index()
    {
        return Place::orderBy('name')
            ->paginate();
    }

    public function getByCategoryParentID(int $parent_id = null)
    {
        return Place::whereHas('categories', function ($query) use ($parent_id) {
            return $query->whereIn('parent_id', [$parent_id]);
        })
            ->orderBy('order', 'DESC')
            ->paginate();
    }

    public function getByPlaceIdentifier(string $slug)
    {
        return Place::where('slug', $slug)
            ->firstOrFail();
    }
}
