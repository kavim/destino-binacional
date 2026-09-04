<?php

namespace App\Policies\Concerns;

use App\Models\User;

trait AuthorizesAdmin
{
    public function viewAny(User $user): bool
    {
        return $user->is_admin;
    }

    public function view(User $user, mixed $model): bool
    {
        return $user->is_admin;
    }

    public function create(User $user): bool
    {
        return $user->is_admin;
    }

    public function update(User $user, mixed $model): bool
    {
        return $user->is_admin;
    }

    public function delete(User $user, mixed $model): bool
    {
        return $user->is_admin;
    }
}
