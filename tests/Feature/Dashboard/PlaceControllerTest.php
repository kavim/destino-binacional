<?php

namespace Tests\Feature\Dashboard;

use App\Models\Place;
use App\Models\PlaceTranslation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class PlaceControllerTest extends TestCase
{
    use RefreshDatabase, SeedsTestData, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    private function makePlace(array $overrides = []): Place
    {
        $place = Place::forceCreate(array_merge([
            'name' => $name = fake()->company(),
            'slug' => Str::slug($name),
            'address' => fake()->address(),
            'city_id' => $this->city->id,
            'place_type_id' => $this->placeType->id,
            'category_id' => $this->childCategory->id,
            'google_maps_src' => 'https://www.google.com/maps/embed?pb=test',
            'featured_image' => 'test.jpg',
            'order' => 0,
        ], $overrides));

        PlaceTranslation::forceCreate([
            'place_id' => $place->id,
            'locale' => 'es',
            'description' => fake()->paragraph(),
        ]);

        PlaceTranslation::forceCreate([
            'place_id' => $place->id,
            'locale' => 'pt',
            'description' => fake()->paragraph(),
        ]);

        $place->categories()->attach($this->childCategory->id);

        return $place;
    }

    // ── Auth guards ──────────────────────────────────────────────

    public function test_guest_cannot_access_places_index(): void
    {
        $this->get('/places')->assertRedirect('/login');
    }

    public function test_guest_cannot_access_places_create(): void
    {
        $this->get('/places/create')->assertRedirect('/login');
    }

    public function test_guest_cannot_store_place(): void
    {
        $this->post('/places', [])->assertRedirect('/login');
    }

    public function test_guest_cannot_edit_place(): void
    {
        $place = $this->makePlace();
        $this->get("/places/{$place->id}/edit")->assertRedirect('/login');
    }

    public function test_guest_cannot_update_place(): void
    {
        $place = $this->makePlace();
        $this->put("/places/{$place->id}", [])->assertRedirect('/login');
    }

    public function test_guest_cannot_delete_place(): void
    {
        $place = $this->makePlace();
        $this->delete("/places/{$place->id}")->assertRedirect('/login');
    }

    // ── Index ────────────────────────────────────────────────────

    public function test_index_renders_correct_component(): void
    {
        $this->actingAs($this->user)->get('/places')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Place/Index')
                ->has('places')
                ->has('categories')
                ->has('grouped_categories')
                ->has('filters')
            );
    }

    public function test_index_paginates_10_by_default(): void
    {
        for ($i = 0; $i < 15; $i++) {
            $this->makePlace(['name' => "Place $i", 'slug' => "place-$i"]);
        }

        $this->actingAs($this->user)->get('/places')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('places.data', 10)
            );
    }

    // ── Filters ──────────────────────────────────────────────────

    public function test_filter_by_search_returns_matching_places(): void
    {
        $target = $this->makePlace(['name' => 'Museo Histórico Rivera', 'slug' => 'museo-historico-rivera']);
        $this->makePlace(['name' => 'Parque Acuático', 'slug' => 'parque-acuatico']);

        $this->actingAs($this->user)->get('/places?search=museo')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('places.data', 1)
                ->where('places.data.0.id', $target->id)
            );
    }

    public function test_filter_by_search_is_case_insensitive_via_slug(): void
    {
        $this->makePlace(['name' => 'Plaza Internacional', 'slug' => 'plaza-internacional']);

        $this->actingAs($this->user)->get('/places?search=PLAZA')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('places.data', 1)
            );
    }

    public function test_filter_by_sub_category_id(): void
    {
        $place = $this->makePlace();

        $unrelated = $this->makePlace(['name' => 'No Category', 'slug' => 'no-category']);
        $unrelated->categories()->detach();

        $this->actingAs($this->user)
            ->get('/places?sub_category_id='.$this->childCategory->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('places.data', 1)
                ->where('places.data.0.id', $place->id)
            );
    }

    public function test_filter_by_parent_category_id(): void
    {
        $place = $this->makePlace();

        $unrelated = $this->makePlace(['name' => 'No Category', 'slug' => 'no-category']);
        $unrelated->categories()->detach();

        $this->actingAs($this->user)
            ->get('/places?category_id='.$this->parentCategory->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('places.data', 1)
                ->where('places.data.0.id', $place->id)
            );
    }

    public function test_filter_by_search_returns_empty_when_no_match(): void
    {
        $this->makePlace(['name' => 'Restaurante', 'slug' => 'restaurante']);

        $this->actingAs($this->user)->get('/places?search=nonexistent')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('places.data', 0)
            );
    }

    public function test_filter_expands_pagination_to_100(): void
    {
        for ($i = 0; $i < 15; $i++) {
            $this->makePlace(['name' => "Place Museum $i", 'slug' => "place-museum-$i"]);
        }

        $this->actingAs($this->user)
            ->get('/places?search=museum')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('places.data', 15)
            );
    }

    public function test_filters_are_echoed_back(): void
    {
        $this->actingAs($this->user)
            ->get('/places?search=hello&category_id=99')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.search', 'hello')
                ->where('filters.category_id', '99')
            );
    }

    public function test_combined_search_and_category_filter(): void
    {
        $match = $this->makePlace(['name' => 'Museo de Arte', 'slug' => 'museo-de-arte']);

        $wrongName = $this->makePlace(['name' => 'Parque', 'slug' => 'parque']);
        $wrongName->categories()->attach($this->childCategory->id);

        $wrongCat = $this->makePlace(['name' => 'Museo Viejo', 'slug' => 'museo-viejo']);
        $wrongCat->categories()->detach();

        $this->actingAs($this->user)
            ->get('/places?search=museo&sub_category_id='.$this->childCategory->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('places.data', 1)
                ->where('places.data.0.id', $match->id)
            );
    }

    // ── Create ───────────────────────────────────────────────────

    public function test_create_page_passes_required_data(): void
    {
        $this->actingAs($this->user)->get('/places/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Place/Create')
                ->has('parent_categories')
                ->has('grouped_categories')
                ->has('cities')
                ->has('place_types')
                ->has('category_ids')
            );
    }

    // ── Store ────────────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post('/places', [])
            ->assertSessionHasErrors(['name', 'address', 'city_id', 'place_type_id', 'description_pt', 'description_es', 'featured_image', 'order']);
    }

    public function test_store_validates_city_exists(): void
    {
        $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $this->actingAs($this->user)
            ->post('/places', [
                'name' => 'Test',
                'address' => 'Test',
                'city_id' => 99999,
                'place_type_id' => $this->placeType->id,
                'description_pt' => 'Desc',
                'description_es' => 'Desc',
                'featured_image' => $base64Pixel,
                'order' => 1,
            ])
            ->assertSessionHasErrors('city_id');
    }

    public function test_store_validates_place_type_exists(): void
    {
        $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $this->actingAs($this->user)
            ->post('/places', [
                'name' => 'Test',
                'address' => 'Test',
                'city_id' => $this->city->id,
                'place_type_id' => 99999,
                'description_pt' => 'Desc',
                'description_es' => 'Desc',
                'featured_image' => $base64Pixel,
                'order' => 1,
            ])
            ->assertSessionHasErrors('place_type_id');
    }

    public function test_store_validates_order_is_numeric(): void
    {
        $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $this->actingAs($this->user)
            ->post('/places', [
                'name' => 'Test',
                'address' => 'Test',
                'city_id' => $this->city->id,
                'place_type_id' => $this->placeType->id,
                'description_pt' => 'Desc',
                'description_es' => 'Desc',
                'featured_image' => $base64Pixel,
                'order' => 'not-a-number',
            ])
            ->assertSessionHasErrors('order');
    }

    public function test_store_creates_place_and_redirects(): void
    {
        $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $this->actingAs($this->user)
            ->post('/places', [
                'name' => 'Museo de Rivera',
                'address' => 'Calle Principal 123',
                'city_id' => $this->city->id,
                'place_type_id' => $this->placeType->id,
                'description_pt' => 'Descrição em português.',
                'description_es' => 'Descripción en español.',
                'featured_image' => $base64Pixel,
                'order' => 5,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect('/places')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('places', [
            'name' => 'Museo de Rivera',
            'slug' => 'museo-de-rivera',
        ]);
    }

    // ── Show ─────────────────────────────────────────────────────

    public function test_show_renders_place(): void
    {
        $place = $this->makePlace();

        $this->actingAs($this->user)->get("/places/{$place->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Place/Show', false)
                ->has('place')
                ->where('place.id', $place->id)
            );
    }

    public function test_show_returns_404_for_nonexistent_place(): void
    {
        $this->actingAs($this->user)->get('/places/99999')
            ->assertNotFound();
    }

    // ── Edit ─────────────────────────────────────────────────────

    public function test_edit_page_loads_with_place_data(): void
    {
        $place = $this->makePlace();

        $this->actingAs($this->user)->get("/places/{$place->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Place/Edit')
                ->has('place')
                ->where('place.id', $place->id)
                ->where('place.name', $place->name)
                ->has('parent_categories')
                ->has('grouped_categories')
                ->has('cities')
                ->has('place_types')
                ->has('category_ids')
            );
    }

    public function test_edit_returns_404_for_nonexistent_place(): void
    {
        $this->actingAs($this->user)->get('/places/99999/edit')
            ->assertNotFound();
    }

    // ── Update ───────────────────────────────────────────────────

    public function test_update_all_fields(): void
    {
        $place = $this->makePlace();
        $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $this->actingAs($this->user)
            ->from("/places/{$place->id}/edit")
            ->put("/places/{$place->id}", [
                'name' => 'Nome Atualizado',
                'description_es' => 'Nueva descripción',
                'description_pt' => 'Nova descrição',
                'address' => 'Calle Nueva 456',
                'city_id' => $this->city->id,
                'place_type_id' => $this->placeType->id,
                'google_maps_src' => $place->google_maps_src,
                'featured_image' => $base64Pixel,
                'order' => 2,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('places', [
            'id' => $place->id,
            'name' => 'Nome Atualizado',
            'slug' => 'nome-atualizado',
            'address' => 'Calle Nueva 456',
        ]);
    }

    public function test_update_partial_without_new_image(): void
    {
        $place = $this->makePlace();

        $this->actingAs($this->user)
            ->from("/places/{$place->id}/edit")
            ->put("/places/{$place->id}", [
                'name' => $place->name,
                'description_es' => $place->translate('es')->description,
                'description_pt' => $place->translate('pt')->description,
                'address' => $newAddress = $this->faker->address(),
                'city_id' => $place->city_id,
                'place_type_id' => $place->place_type_id,
                'google_maps_src' => $place->google_maps_src,
                'current_image' => $place->featured_image,
                'order' => 1,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('places', [
            'id' => $place->id,
            'address' => $newAddress,
        ]);
    }

    public function test_update_validates_category_ids(): void
    {
        $place = $this->makePlace();

        $this->actingAs($this->user)
            ->put("/places/{$place->id}", [
                'name' => 'Test',
                'address' => 'Test',
                'city_id' => $this->city->id,
                'place_type_id' => $this->placeType->id,
                'description_pt' => 'D',
                'description_es' => 'D',
                'current_image' => $place->featured_image,
                'order' => 1,
                'category_ids' => [99999],
            ])
            ->assertSessionHasErrors('category_ids.0');
    }

    // ── Delete ───────────────────────────────────────────────────

    public function test_can_delete_place(): void
    {
        $place = $this->makePlace();

        $this->actingAs($this->user)
            ->delete("/places/{$place->id}")
            ->assertRedirect('/places')
            ->assertSessionHas('success');

        $this->assertSoftDeleted('places', ['id' => $place->id]);
    }

    public function test_delete_nonexistent_place_returns_404(): void
    {
        $this->actingAs($this->user)
            ->delete('/places/99999')
            ->assertNotFound();
    }

    // ── Ordering ─────────────────────────────────────────────────

    public function test_places_are_ordered_by_id_desc(): void
    {
        $first = $this->makePlace(['name' => 'Primeiro', 'slug' => 'primeiro']);
        $second = $this->makePlace(['name' => 'Segundo', 'slug' => 'segundo']);

        $this->actingAs($this->user)->get('/places')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('places.data.0.id', $second->id)
                ->where('places.data.1.id', $first->id)
            );
    }
}
