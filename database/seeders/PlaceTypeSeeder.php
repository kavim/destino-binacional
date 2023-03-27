<?php

namespace Database\Seeders;

use App\Models\PlaceType;
use Illuminate\Database\Seeder;

class PlaceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $place_types = ['Establecimiento', 'Punto turístico'];

        foreach ($place_types as $pt) {
            PlaceType::create(['name' => $pt]);
        }
    }
}
