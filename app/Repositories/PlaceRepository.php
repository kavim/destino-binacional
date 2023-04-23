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

    public function getByCategoryParentID(int $parent_id = null, string $slug = null)
    {
        return Place::whereHas('category', function ($query) use ($parent_id) {
            return $query->where('parent_id', $parent_id);
        })
        ->orderBy('name')
        ->paginate();
    }

    public function getByPlaceIdentifier(string $slug)
    {
        return Place::where('slug', $slug)
            ->firstOrFail();
    }
}
