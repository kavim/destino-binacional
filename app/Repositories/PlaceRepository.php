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
}
