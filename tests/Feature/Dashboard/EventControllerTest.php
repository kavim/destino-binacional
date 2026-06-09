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

    private string $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    private function makeEvent(array $overrides = [], bool $attachTags = true): Event
    {
        $event = Event::forceCreate(array_merge([
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
            'featured_image' => 'test-event.jpg',
        ], $overrides));

        if ($attachTags) {
            $event->tags()->attach($this->childTag->id);
        }

        return $event;
    }

    private function validEventPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Festival de Jazz',
            'description' => 'Descrição do evento de teste.',
            'start' => now()->addWeek()->format('Y-m-d'),
            'end' => now()->addWeeks(2)->format('Y-m-d'),
            'is_online' => false,
            'link' => '',
            'google_maps_src' => 'https://maps.google.com/embed',
            'address' => 'Calle Principal 123',
            'city_id' => $this->city->id,
            'category_id' => $this->childCategory->id,
            'featured_image' => $this->base64Pixel,
            'tag_ids' => [$this->childTag->id],
        ], $overrides);
    }

    private function validUpdatePayload(Event $event, array $overrides = []): array
    {
        return array_merge([
            'title' => $event->title,
            'description' => $event->description,
            'start' => $event->start->format('Y-m-d'),
            'end' => $event->end->format('Y-m-d'),
            'is_online' => $event->is_online,
            'link' => $event->link ?? '',
            'google_maps_src' => $event->google_maps_src,
            'address' => $event->address,
            'city_id' => $event->city_id,
            'category_id' => $event->category_id,
            'image' => $event->image,
            'featured_image' => '',
            'tag_ids' => [$this->childTag->id],
        ], $overrides);
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

    public function test_guest_cannot_update_event(): void
    {
        $event = $this->makeEvent();
        $this->put("/events/{$event->id}", [])->assertRedirect('/login');
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
                ->has('parent_tags')
                ->has('grouped_tags')
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
                ->has('events.data', 10)
                ->where('events.current_page', 1)
            );
    }

    // ── Filtros ──────────────────────────────────────────────────

    public function test_filter_by_search_returns_matching_events(): void
    {
        $target = $this->makeEvent(['title' => 'Festival de Jazz Rivera', 'slug' => 'festival-de-jazz-rivera']);
        $this->makeEvent(['title' => 'Feria del Libro', 'slug' => 'feria-del-libro']);

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

    public function test_filter_by_parent_tag_id(): void
    {
        $withTag = $this->makeEvent();
        $withTag->tags()->sync([$this->childTag->id]);

        $this->makeEvent(attachTags: false);

        $this->actingAs($this->user)
            ->get('/events?parent_tag_id='.$this->parentTag->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events.data', 1)
                ->where('events.data.0.id', $withTag->id)
            );
    }

    public function test_filter_by_tag_id(): void
    {
        $target = $this->makeEvent();
        $target->tags()->sync([$this->childTag->id]);

        $other = $this->makeEvent();
        $other->tags()->sync([$this->parentTag->id]);

        $this->actingAs($this->user)
            ->get('/events?tag_id='.$this->childTag->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events.data', 1)
                ->where('events.data.0.id', $target->id)
            );
    }

    public function test_filters_are_echoed_back(): void
    {
        $this->actingAs($this->user)
            ->get('/events?search=hello&parent_tag_id=99&tag_id=88')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.search', 'hello')
                ->where('filters.parent_tag_id', '99')
                ->where('filters.tag_id', '88')
            );
    }

    public function test_filter_expands_pagination_to_100(): void
    {
        for ($i = 0; $i < 15; $i++) {
            $this->makeEvent(['title' => "Evento Jazz $i", 'slug' => "evento-jazz-$i"]);
        }

        $this->actingAs($this->user)
            ->get('/events?search=jazz')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events.data', 15)
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

    public function test_store_validates_link_when_online(): void
    {
        $payload = $this->validEventPayload([
            'is_online' => true,
            'link' => '',
        ]);

        $this->actingAs($this->user)
            ->post('/events', $payload)
            ->assertSessionHasErrors('link');
    }

    public function test_store_validates_address_when_offline(): void
    {
        $payload = $this->validEventPayload([
            'address' => '',
        ]);

        $this->actingAs($this->user)
            ->post('/events', $payload)
            ->assertSessionHasErrors('address');
    }

    public function test_store_creates_event_and_redirects(): void
    {
        $this->actingAs($this->user)
            ->post('/events', $this->validEventPayload())
            ->assertRedirect('/events')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('events', [
            'title' => 'Festival de Jazz',
            'slug' => 'festival-de-jazz',
            'city_id' => $this->city->id,
            'category_id' => $this->childCategory->id,
        ]);

        $event = Event::where('slug', 'festival-de-jazz')->first();
        $this->assertNotNull($event->featured_image);
        $this->assertTrue($event->tags->contains('id', $this->childTag->id));
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
                ->where('event.category_id', $event->category_id)
                ->has('current_image')
                ->has('tag_ids')
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

    // ── Update ───────────────────────────────────────────────────

    public function test_update_with_new_image_succeeds(): void
    {
        $event = $this->makeEvent(['featured_image' => 'old-image.jpg']);

        $this->actingAs($this->user)
            ->from("/events/{$event->id}/edit")
            ->put("/events/{$event->id}", $this->validUpdatePayload($event, [
                'featured_image' => $this->base64Pixel,
                'image' => '',
            ]))
            ->assertRedirect('/events')
            ->assertSessionHas('success');

        $event->refresh();
        $this->assertNotNull($event->featured_image);
        $this->assertNotSame('old-image.jpg', $event->featured_image);
    }

    public function test_update_without_new_image_preserves_featured_image(): void
    {
        $event = $this->makeEvent(['featured_image' => 'keep-me.jpg']);

        $this->actingAs($this->user)
            ->from("/events/{$event->id}/edit")
            ->put("/events/{$event->id}", $this->validUpdatePayload($event, [
                'address' => 'Nueva dirección 456',
            ]))
            ->assertRedirect('/events')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'featured_image' => 'keep-me.jpg',
            'address' => 'Nueva dirección 456',
        ]);
    }

    public function test_update_changes_title_and_slug(): void
    {
        $event = $this->makeEvent();

        $this->actingAs($this->user)
            ->put("/events/{$event->id}", $this->validUpdatePayload($event, [
                'title' => 'Nuevo Título del Evento',
            ]))
            ->assertRedirect('/events');

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'title' => 'Nuevo Título del Evento',
            'slug' => 'nuevo-titulo-del-evento',
        ]);
    }

    public function test_update_validates_required_fields(): void
    {
        $event = $this->makeEvent();

        $this->actingAs($this->user)
            ->put("/events/{$event->id}", [])
            ->assertSessionHasErrors(['title', 'description', 'start', 'end', 'is_online']);
    }

    public function test_update_requires_image_or_featured_image(): void
    {
        $event = $this->makeEvent();

        $this->actingAs($this->user)
            ->put("/events/{$event->id}", $this->validUpdatePayload($event, [
                'image' => '',
                'featured_image' => '',
            ]))
            ->assertSessionHasErrors(['image', 'featured_image']);
    }

    public function test_update_preserves_category_id(): void
    {
        $event = $this->makeEvent(['category_id' => $this->childCategory->id]);

        $this->actingAs($this->user)
            ->put("/events/{$event->id}", $this->validUpdatePayload($event, [
                'title' => 'Título atualizado',
            ]))
            ->assertRedirect('/events');

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'category_id' => $this->childCategory->id,
        ]);
    }

    public function test_update_preserves_tags(): void
    {
        $event = $this->makeEvent();
        $event->tags()->sync([$this->childTag->id]);

        $this->actingAs($this->user)
            ->put("/events/{$event->id}", $this->validUpdatePayload($event, [
                'title' => 'Evento com tags',
            ]))
            ->assertRedirect('/events');

        $this->assertTrue($event->fresh()->tags->contains('id', $this->childTag->id));
    }

    public function test_update_nonexistent_event_returns_404(): void
    {
        $this->actingAs($this->user)
            ->put('/events/99999', $this->validEventPayload())
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
