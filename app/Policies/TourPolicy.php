<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesStaff;

class TourPolicy
{
    use AuthorizesStaff;
}
