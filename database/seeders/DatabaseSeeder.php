<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Kevin mm',
            'email' => 'kevin@loscarpinchos.com',
            'password' => Hash::make('123123123'),
        ]);

        $this->call([
            CitySeeder::class,
            PlaceTypeSeeder::class,
            CategorySeeder::class,
            // EventSeeder::class,
            // PlaceSeeder::class,
        ]);
    }
}
