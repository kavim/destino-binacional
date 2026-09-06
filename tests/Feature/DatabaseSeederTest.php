<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_admin_from_environment_in_testing(): void
    {
        $this->seed(DatabaseSeeder::class);

        $user = User::query()->where('email', config('app.admin_email'))->first();

        $this->assertNotNull($user);
        $this->assertTrue($user->isAdmin());
        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertTrue(Hash::check(config('app.admin_password'), $user->password));
    }

    public function test_refuses_missing_password_in_production(): void
    {
        $this->app['env'] = 'production';
        config([
            'app.admin_email' => 'ops@example.com',
            'app.admin_password' => null,
        ]);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('ADMIN_PASSWORD');

        (new DatabaseSeeder)->run();
    }

    public function test_refuses_weak_password_in_production(): void
    {
        $this->app['env'] = 'production';
        config([
            'app.admin_email' => 'ops@example.com',
            'app.admin_password' => 'short',
        ]);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('min 12');

        (new DatabaseSeeder)->run();
    }
}
