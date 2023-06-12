<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Arr;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PlaceControllerTest extends TestCase
{
    use DatabaseTransactions, WithFaker;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_can_view_place_edit_form()
    {
        $place = Place::factory()->create();

        $this->actingAs($this->user)->get('/places/'.$place->id.'/edit')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Place/Edit')
                ->has('place', fn (Assert $page) => $page
                    ->where('id', $place->id)
                    ->where('name', $place->name)
                    ->where('description_es', $place->translate('es')->description)
                    ->where('description_pt', $place->translate('pt')->description)
                    ->etc()
                )
            );
    }

    public function test_update_all_place_ok()
    {
        $place = Place::factory()->create();

        $response = $this->actingAs($this->user)
            ->from('/places/'.$place->id.'/edit')
            ->put('/places/'.$place->id, [
                'name' => 'novo nome',
                'description_es' => $description_es = $this->faker->paragraph(50),
                'description_pt' => $description_pt = $this->faker->paragraph(50),
                'address' => $this->faker->address,
                'city_id' => $place->city_id,
                'place_type_id' => $place->place_type_id,
                'google_maps_src' => $place->google_maps_src,
                'featured_image' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC',
                'order' => 2,
                'category_ids' => Arr::flatten([Category::where('parent_id', '<>', null)->inRandomOrder()->first('id')->id]),
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('places', [
            'id' => $place->id,
            'name' => 'novo nome',
        ]);
    }

    public function test_update_partial_place_ok()
    {
        $place = Place::factory()->create();

        $response = $this->actingAs($this->user)
            ->from('/places/'.$place->id.'/edit')
            ->put('/places/'.$place->id, [
                'name' => $place->name,
                'description_es' => $place->translate('es')->description,
                'description_pt' => $place->translate('pt')->description,
                'address' => $address = $this->faker->address,
                'city_id' => $place->city_id,
                'place_type_id' => $place->place_type_id,
                'google_maps_src' => $place->google_maps_src,
                'current_image' => $place->featured_image,
                'order' => $place->featured_image,
                'category_ids' => Arr::flatten([Category::where('parent_id', '<>', null)->inRandomOrder()->first('id')->id]),
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('places', [
            'id' => $place->id,
            'address' => $address,
        ]);
    }
}
