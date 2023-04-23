<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use App\Models\PlaceTranslation;
use App\Models\PlaceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Place>
 */
class PlaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $name = $this->faker->name(),
            'slug' => $name,
            'address' => $this->faker->address,
            'place_type_id' => PlaceType::inRandomOrder()->first()->id,
            'category_id' => Category::where('parent_id', '<>', null)->inRandomOrder()->first()->id,
            'google_maps_src' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3119.9999999999995!2d-8.610000000000014!3d41.14999999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDQ2JzU0LjkiTiA3N8KwMjEnMjguOSJF!5e0!3m2!1sen!2spt!4v1610000000000!5m2!1sen!2spt',
            'featured_image' => 'https://api.lorem.space/image/burger?w=1200&h=720',
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Place $place) {
            PlaceTranslation::create([
                'locale' => 'es',
                'description' => $this->faker->paragraph(50),
                'place_id' => $place->id,
            ]);

            PlaceTranslation::create([
                'locale' => 'pt',
                'description' => $this->faker->paragraph(50),
                'place_id' => $place->id,
            ]);

            $city = City::inRandomOrder()->first();
            $place->city()->associate($city);
        });
    }
}
