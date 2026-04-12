<?php

namespace Tests\Feature\Dashboard;

use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class TourControllerTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    private function makeTour(array $overrides = []): Tour
    {
        return Tour::forceCreate(array_merge([
            'title' => $title = fake()->sentence(),
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'guide' => fake()->name(),
            'meeting_point' => fake()->address(),
            'price' => 1500,
            'currency' => 'BRL',
            'google_maps_src' => null,
            'featured_image' => null,
            'start' => null,
            'end' => null,
            'recurrence_enabled' => false,
            'recurrence_day_hour' => null,
        ], $overrides));
    }

    // ── Auth guards ──────────────────────────────────────────────

    public function test_guest_cannot_access_tours_index(): void
    {
        $this->get('/tours')->assertRedirect('/login');
    }

    public function test_guest_cannot_access_tours_create(): void
    {
        $this->get('/tours/create')->assertRedirect('/login');
    }

    public function test_guest_cannot_store_tour(): void
    {
        $this->post('/tours', [])->assertRedirect('/login');
    }

    public function test_guest_cannot_edit_tour(): void
    {
        $tour = $this->makeTour();
        $this->get("/tours/{$tour->id}/edit")->assertRedirect('/login');
    }

    public function test_guest_cannot_update_tour(): void
    {
        $tour = $this->makeTour();
        $this->put("/tours/{$tour->id}", [])->assertRedirect('/login');
    }

    public function test_guest_cannot_delete_tour(): void
    {
        $tour = $this->makeTour();
        $this->delete("/tours/{$tour->id}")->assertRedirect('/login');
    }

    // ── Index ────────────────────────────────────────────────────

    public function test_index_renders_correct_component(): void
    {
        $this->actingAs($this->user)->get('/tours')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Tour/Index')
                ->has('tours')
                ->has('categories')
                ->has('grouped_categories')
                ->has('filters')
            );
    }

    public function test_index_paginates_tours(): void
    {
        for ($i = 0; $i < 15; $i++) {
            $this->makeTour(['title' => "Tour $i", 'slug' => "tour-$i"]);
        }

        $this->actingAs($this->user)->get('/tours')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours.data', 10)
                ->where('tours.current_page', 1)
            );
    }

    // ── Filters ──────────────────────────────────────────────────

    public function test_filter_by_search_returns_matching_tours(): void
    {
        $target = $this->makeTour(['title' => 'City Walking Tour', 'slug' => 'city-walking-tour']);
        $this->makeTour(['title' => 'Wine Tasting', 'slug' => 'wine-tasting']);

        $this->actingAs($this->user)->get('/tours?search=walking')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours.data', 1)
                ->where('tours.data.0.id', $target->id)
            );
    }

    public function test_filter_by_search_returns_empty_when_no_match(): void
    {
        $this->makeTour(['title' => 'Nightlife Tour', 'slug' => 'nightlife-tour']);

        $this->actingAs($this->user)->get('/tours?search=nonexistent')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours.data', 0)
            );
    }

    public function test_filter_by_sub_category_id(): void
    {
        $tour = $this->makeTour();
        $tour->categories()->attach($this->childCategory->id);

        $unrelated = $this->makeTour(['title' => 'Unrelated', 'slug' => 'unrelated']);

        $this->actingAs($this->user)
            ->get('/tours?sub_category_id='.$this->childCategory->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours.data', 1)
                ->where('tours.data.0.id', $tour->id)
            );
    }

    public function test_filter_by_parent_category_id(): void
    {
        $tour = $this->makeTour();
        $tour->categories()->attach($this->childCategory->id);

        $unrelated = $this->makeTour(['title' => 'Unrelated', 'slug' => 'unrelated']);

        $this->actingAs($this->user)
            ->get('/tours?category_id='.$this->parentCategory->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours.data', 1)
                ->where('tours.data.0.id', $tour->id)
            );
    }

    public function test_filter_uses_expanded_pagination_limit(): void
    {
        for ($i = 0; $i < 15; $i++) {
            $t = $this->makeTour(['title' => "Tour $i", 'slug' => "tour-$i"]);
            $t->categories()->attach($this->childCategory->id);
        }

        $this->actingAs($this->user)
            ->get('/tours?sub_category_id='.$this->childCategory->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours.data', 15)
            );
    }

    public function test_filters_are_echoed_back(): void
    {
        $this->actingAs($this->user)
            ->get('/tours?search=hello&category_id=99')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.search', 'hello')
                ->where('filters.category_id', '99')
            );
    }

    public function test_no_filters_returns_all_tours(): void
    {
        $this->makeTour(['title' => 'A', 'slug' => 'a']);
        $this->makeTour(['title' => 'B', 'slug' => 'b']);

        $this->actingAs($this->user)->get('/tours')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours.data', 2)
            );
    }

    // ── Create ───────────────────────────────────────────────────

    public function test_create_page_passes_required_data(): void
    {
        $this->actingAs($this->user)->get('/tours/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Tour/Create')
                ->has('parent_categories')
                ->has('grouped_categories')
                ->has('category_ids')
                ->has('recurrence_day_hour')
            );
    }

    // ── Store ────────────────────────────────────────────────────

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post('/tours', [])
            ->assertSessionHasErrors(['title', 'meeting_point', 'description', 'guide', 'featured_image']);
    }

    public function test_store_creates_tour_and_redirects(): void
    {
        $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $this->actingAs($this->user)
            ->post('/tours', [
                'title' => 'Tour pela Fronteira',
                'meeting_point' => 'Plaza Internacional',
                'description' => 'Un tour increíble por la frontera.',
                'guide' => 'Juan Pérez',
                'price' => 50,
                'currency' => 'BRL',
                'featured_image' => $base64Pixel,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect('/tours')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('tours', [
            'title' => 'Tour pela Fronteira',
            'slug' => 'tour-pela-fronteira',
            'guide' => 'Juan Pérez',
        ]);
    }

    public function test_store_rejects_invalid_currency(): void
    {
        $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $this->actingAs($this->user)
            ->post('/tours', [
                'title' => 'Tour X',
                'meeting_point' => 'Somewhere',
                'description' => 'Desc',
                'guide' => 'Guide',
                'price' => 100,
                'currency' => 'USD',
                'featured_image' => $base64Pixel,
            ])
            ->assertSessionHasErrors('currency');
    }

    // ── Show ─────────────────────────────────────────────────────

    public function test_show_renders_tour(): void
    {
        $tour = $this->makeTour();

        $this->actingAs($this->user)->get("/tours/{$tour->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Tour/Show', false)
                ->has('tour')
                ->where('tour.id', $tour->id)
            );
    }

    public function test_show_returns_404_for_nonexistent_tour(): void
    {
        $this->actingAs($this->user)->get('/tours/99999')
            ->assertNotFound();
    }

    // ── Edit ─────────────────────────────────────────────────────

    public function test_edit_page_loads_with_tour_data(): void
    {
        $tour = $this->makeTour(['price' => 5000]);

        $this->actingAs($this->user)->get("/tours/{$tour->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Tour/Edit')
                ->has('tour')
                ->where('tour.id', $tour->id)
                ->where('tour.price', 50)
                ->has('parent_categories')
                ->has('grouped_categories')
                ->has('category_ids')
            );
    }

    // ── Update ───────────────────────────────────────────────────

    public function test_update_changes_tour_data(): void
    {
        $tour = $this->makeTour();

        $this->actingAs($this->user)
            ->from("/tours/{$tour->id}/edit")
            ->put("/tours/{$tour->id}", [
                'title' => 'Tour Atualizado',
                'meeting_point' => 'Novo Ponto',
                'description' => 'Nova descrição',
                'guide' => 'Maria Silva',
                'recurrence_enabled' => false,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect('/tours')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('tours', [
            'id' => $tour->id,
            'title' => 'Tour Atualizado',
            'slug' => 'tour-atualizado',
            'guide' => 'Maria Silva',
        ]);
    }

    public function test_update_validates_required_fields(): void
    {
        $tour = $this->makeTour();

        $this->actingAs($this->user)
            ->put("/tours/{$tour->id}", [])
            ->assertSessionHasErrors(['title', 'meeting_point', 'description', 'guide']);
    }

    // ── Delete ───────────────────────────────────────────────────

    public function test_can_delete_tour(): void
    {
        $tour = $this->makeTour();

        $this->actingAs($this->user)
            ->delete("/tours/{$tour->id}")
            ->assertRedirect('/tours')
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('tours', ['id' => $tour->id]);
    }

    public function test_delete_nonexistent_tour_returns_404(): void
    {
        $this->actingAs($this->user)
            ->delete('/tours/99999')
            ->assertNotFound();
    }

    // ── Ordering ─────────────────────────────────────────────────

    public function test_tours_are_ordered_by_id_desc(): void
    {
        $first = $this->makeTour(['title' => 'Primeiro', 'slug' => 'primeiro']);
        $second = $this->makeTour(['title' => 'Segundo', 'slug' => 'segundo']);

        $this->actingAs($this->user)->get('/tours')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('tours.data.0.id', $second->id)
                ->where('tours.data.1.id', $first->id)
            );
    }
}
