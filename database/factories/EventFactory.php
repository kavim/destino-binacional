<?php

namespace Database\Factories;

use App\Models\City;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $title = $this->faker->sentence,
            'slug' => Str::slug($title),
            'description' => $this->faker->paragraph,
            'start' => Carbon::parse($this->faker->dateTimeBetween('+1 week', '+2 weeks'))->format('Y/m/d'),
            'end' => Carbon::parse($this->faker->dateTimeBetween('+2 weeks', '+3 weeks'))->format('Y/m/d'),
            'is_online' => $is_online = $this->faker->boolean,
            'link' => $is_online ? $this->faker->url : null,
            'google_maps_src' => $is_online ? null : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2884.8580000000003!2d-79.383999684344!3d43.653225979128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34f2f2f2f2f2%3A0x1d4d7a2f2f2f2f2f!2sToronto%2C%20ON!5e0!3m2!1sen!2sca!4v1620000000000!5m2!1sen!2sca',
            'address' => $is_online ? null : $this->faker->address,
            'city_id' => City::first()->id,
            'category_id' => $this->faker->numberBetween(1, 4),
            'price' => null,
            'door_time' => null,
            'featured_image' => null,
        ];
    }
}
