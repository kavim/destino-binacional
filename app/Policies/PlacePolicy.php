<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesStaff;

class PlacePolicy
{
    use AuthorizesStaff;
}
