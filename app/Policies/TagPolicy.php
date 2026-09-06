<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesAdmin;

class TagPolicy
{
    use AuthorizesAdmin;
}
