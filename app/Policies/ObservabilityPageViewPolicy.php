<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesAdmin;

class ObservabilityPageViewPolicy
{
    use AuthorizesAdmin;
}
