<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesAdmin;

class TourPolicy
{
    use AuthorizesAdmin;
}
