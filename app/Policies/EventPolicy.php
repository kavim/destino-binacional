<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesStaff;

class EventPolicy
{
    use AuthorizesStaff;
}
