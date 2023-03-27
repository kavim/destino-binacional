<?php

namespace App\Repositories;

use App\Models\Event;

class EventRepository
{
    public function index()
    {
        return Event::orderBy('name')
            ->paginate();
    }
}
