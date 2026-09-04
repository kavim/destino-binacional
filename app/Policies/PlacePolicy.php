<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesAdmin;

class PlacePolicy
{
    use AuthorizesAdmin;
}
