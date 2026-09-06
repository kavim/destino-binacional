<?php

namespace Tests\Unit\Models;

use App\Enums\UserRole;
use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function test_fillable_attributes(): void
    {
        $user = new User;

        $this->assertContains('name', $user->getFillable());
        $this->assertContains('email', $user->getFillable());
        $this->assertContains('password', $user->getFillable());
        $this->assertNotContains('role', $user->getFillable());
        $this->assertNotContains('is_admin', $user->getFillable());
    }

    public function test_hidden_attributes_include_password_and_token(): void
    {
        $user = new User;

        $this->assertContains('password', $user->getHidden());
        $this->assertContains('remember_token', $user->getHidden());
    }

    public function test_casts_include_role_enum(): void
    {
        $user = new User;
        $casts = $user->getCasts();

        $this->assertArrayHasKey('email_verified_at', $casts);
        $this->assertSame('datetime', $casts['email_verified_at']);
        $this->assertArrayHasKey('role', $casts);
        $this->assertSame(UserRole::class, $casts['role']);
        $this->assertArrayNotHasKey('is_admin', $casts);
    }
}
