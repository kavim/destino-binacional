<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesAdmin;

class CategoryPolicy
{
    use AuthorizesAdmin;
}
