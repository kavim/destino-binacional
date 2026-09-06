<?php

namespace App\Policies\Concerns;

use App\Models\User;

trait AuthorizesStaff
{
    public function viewAny(User $user): bool
    {
        return $user->isStaff();
    }

    public function view(User $user, mixed $model): bool
    {
        return $user->isStaff();
    }

    public function create(User $user): bool
    {
        return $user->isStaff();
    }

    public function update(User $user, mixed $model): bool
    {
        return $user->isStaff();
    }

    public function delete(User $user, mixed $model): bool
    {
        return $user->isStaff();
    }
}
