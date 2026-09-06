<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->seedAdminUser();

        $this->call([
            CitySeeder::class,
            PlaceTypeSeeder::class,
            CategorySeeder::class,
            // EventSeeder::class,
            // PlaceSeeder::class,
        ]);
    }

    private function seedAdminUser(): void
    {
        $email = config('app.admin_email');
        $password = config('app.admin_password');
        $name = config('app.admin_name') ?: 'Admin';

        if (app()->environment('production')) {
            if (! $this->isUsableAdminEmail($email) || ! $this->isStrongAdminPassword($password)) {
                throw new RuntimeException(
                    'In production, ADMIN_EMAIL and ADMIN_PASSWORD (min 12 characters) must be set. Refusing to seed a default admin.'
                );
            }
        }

        if (! $this->isUsableAdminEmail($email) || ! is_string($password) || $password === '') {
            throw new RuntimeException(
                'Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding the admin user.'
            );
        }

        User::factory()->admin()->create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);
    }

    private function isUsableAdminEmail(mixed $email): bool
    {
        return is_string($email) && $email !== '';
    }

    private function isStrongAdminPassword(mixed $password): bool
    {
        return is_string($password) && strlen($password) >= 12;
    }
}
