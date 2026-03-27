<?php

namespace Tests\Feature\Dashboard;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class EventControllerTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    private function makeEvent(array $overrides = []): Event
    {
        return Event::forceCreate(array_merge([
            'title' => $title = fake()->sentence(),
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'start' => now()->addWeek()->format('Y-m-d'),
            'end' => now()->addWeeks(2)->format('Y-m-d'),
            'is_online' => false,
            'address' => fake()->address(),
            'city_id' => $this->city->id,
            'category_id' => $this->childCategory->id,
            'google_maps_src' => 'https://maps.google.com/embed',
            'featured_image' => null,
        ], $overrides));
    }

    // ── Auth guards ──────────────────────────────────────────────

    public function test_guest_cannot_access_events_index(): void
    {
        $this->get('/events')->assertRedirect('/login');
    }

    public function test_guest_cannot_access_events_create(): void
    {
        $this->get('/events/create')->assertRedirect('/login');
    }

    public function test_guest_cannot_store_event(): void
    {
        $this->post('/events', [])->assertRedirect('/login');
    }

    public function test_guest_cannot_delete_event(): void
    {
        $event = $this->makeEvent();
        $this->delete("/events/{$event->id}")->assertRedirect('/login');
    }

    // ── Index ────────────────────────────────────────────────────

    public function test_index_renders_correct_component(): void
    {
        $this->actingAs($this->user)->get('/events')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Event/Index')
                ->has('events')
                ->has('categories')
                ->has('grouped_categories')
                ->has('filters')
            );
    }

    public function test_index_paginates_events(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $this->makeEvent(['title' => "Evento $i", 'slug' => "evento-$i"]);
        }

        $this->actingAs($this->user)->get('/events')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events.data')
                ->where('events.current_page', 1)
            );
    }

    // ── Filtros ──────────────────────────────────────────────────

    public function test_filter_by_search_returns_matching_events(): void
    {
        $target = $this->makeEvent(['title' => 'Festival de Jazz Rivera', 'slug' => 'festival-de-jazz-rivera']);
        $other = $this->makeEvent(['title' => 'Feria del Libro', 'slug' => 'feria-del-libro']);

        $this->actingAs($this->user)->get('/events?search=jazz')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events.data', 1)
                ->where('events.data.0.id', $target->id)
            );
    }

    public function test_filter_by_search_returns_empty_when_no_match(): void
    {
        $this->makeEvent(['title' => 'Carnaval', 'slug' => 'carnaval']);

        $this->actingAs($this->user)->get('/events?search=nonexistent')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events.data', 0)
            );
    }

    public function test_filter_by_category_id(): void
    {
        $target = $this->makeEvent(['category_id' => $this->parentCategory->id]);
        $other = $this->makeEvent(['category_id' => $this->childCategory->id]);

        $this->actingAs($this->user)
            ->get('/events?category_id=' . $this->parentCategory->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events.data', 1)
                ->where('events.data.0.id', $target->id)
            );
    }

    public function test_filters_are_echoed_back(): void
    {
        $this->actingAs($this->user)
            ->get('/events?search=hello&category_id=99')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.search', 'hello')
                ->where('filters.category_id', '99')
            );
    }

    public function test_no_filters_returns_all_events(): void
    {
        $this->makeEvent(['title' => 'A', 'slug' => 'a']);
        $this->makeEvent(['title' => 'B', 'slug' => 'b']);

        $this->actingAs($this->user)->get('/events')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events.data', 2)
            );
    }

    // ── Create / Store ───────────────────────────────────────────

    public function test_create_page_passes_required_data(): void
    {
        $this->actingAs($this->user)->get('/events/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Event/Create')
                ->has('categories')
                ->has('grouped_categories')
                ->has('cities')
                ->has('parent_tags')
                ->has('grouped_tags')
            );
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post('/events', [])
            ->assertSessionHasErrors(['title', 'description', 'start', 'end', 'is_online', 'featured_image', 'tag_ids']);
    }

    public function test_store_validates_title_is_required(): void
    {
        $this->actingAs($this->user)
            ->post('/events', ['title' => ''])
            ->assertSessionHasErrors('title');
    }

    // ── Edit ─────────────────────────────────────────────────────

    public function test_edit_page_loads_with_event_data(): void
    {
        $event = $this->makeEvent();

        $this->actingAs($this->user)->get("/events/{$event->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Event/Edit')
                ->has('event')
                ->where('event.id', $event->id)
                ->where('event.title', $event->title)
                ->has('categories')
                ->has('cities')
                ->has('parent_tags')
            );
    }

    public function test_edit_returns_404_for_nonexistent_event(): void
    {
        $this->actingAs($this->user)->get('/events/99999/edit')
            ->assertNotFound();
    }

    // ── Delete ───────────────────────────────────────────────────

    public function test_can_delete_event(): void
    {
        $event = $this->makeEvent();

        $this->actingAs($this->user)
            ->delete("/events/{$event->id}")
            ->assertRedirect('/events')
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('events', ['id' => $event->id]);
    }

    public function test_delete_nonexistent_event_returns_404(): void
    {
        $this->actingAs($this->user)
            ->delete('/events/99999')
            ->assertNotFound();
    }

    // ── Ordering ─────────────────────────────────────────────────

    public function test_events_are_ordered_by_id_desc(): void
    {
        $first = $this->makeEvent(['title' => 'Primeiro', 'slug' => 'primeiro']);
        $second = $this->makeEvent(['title' => 'Segundo', 'slug' => 'segundo']);

        $this->actingAs($this->user)->get('/events')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('events.data.0.id', $second->id)
                ->where('events.data.1.id', $first->id)
            );
    }
}
