<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, User $model): bool
    {
        return $user->isAdmin() || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->isAdmin();
    }

    public function delete(User $user, User $model): bool
    {
        if ($model->isSoleAdmin()) {
            return false;
        }

        if ($user->id === $model->id) {
            return true;
        }

        return $user->isAdmin();
    }

    public function assignRole(User $user, User $model, UserRole $role): bool
    {
        if (! $user->isAdmin()) {
            return false;
        }

        if ($model->isSoleAdmin() && $role !== UserRole::Admin) {
            return false;
        }

        return in_array($role, UserRole::assignable(), true);
    }
}
