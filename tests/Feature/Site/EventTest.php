<?php

namespace Tests\Feature\Site;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class EventTest extends TestCase
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

    // ── Page rendering ───────────────────────────────────────────

    public function test_events_page_returns_200(): void
    {
        $this->get('/eventos')->assertOk();
    }

    public function test_events_page_renders_correct_component(): void
    {
        $this->get('/eventos')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Site/Event/Index')
            );
    }

    public function test_events_page_passes_events_and_filters(): void
    {
        $this->get('/eventos')
            ->assertInertia(fn (Assert $page) => $page
                ->has('events')
                ->has('filters')
                ->has('filters.start')
                ->has('filters.end')
            );
    }

    // ── Date filtering ───────────────────────────────────────────

    public function test_filter_by_start_date_excludes_past_events(): void
    {
        $past = $this->makeEvent([
            'title' => 'Evento Passado',
            'slug' => 'evento-passado',
            'start' => now()->subMonths(2)->format('Y-m-d'),
            'end' => now()->subMonth()->format('Y-m-d'),
        ]);

        $future = $this->makeEvent([
            'title' => 'Evento Futuro',
            'slug' => 'evento-futuro',
            'start' => now()->addWeek()->format('Y-m-d'),
            'end' => now()->addWeeks(2)->format('Y-m-d'),
        ]);

        $this->get('/eventos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events', 1)
                ->where('events.0.id', $future->id)
            );
    }

    public function test_filter_by_date_range(): void
    {
        $inRange = $this->makeEvent([
            'title' => 'In Range',
            'slug' => 'in-range',
            'start' => now()->addDays(5)->format('Y-m-d'),
            'end' => now()->addDays(10)->format('Y-m-d'),
        ]);

        $outOfRange = $this->makeEvent([
            'title' => 'Out of Range',
            'slug' => 'out-of-range',
            'start' => now()->addMonths(3)->format('Y-m-d'),
            'end' => now()->addMonths(4)->format('Y-m-d'),
        ]);

        $start = now()->format('Y-m-d');
        $end = now()->addDays(15)->format('Y-m-d');

        $this->get("/eventos?start=$start&end=$end")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events', 1)
                ->where('events.0.id', $inRange->id)
            );
    }

    public function test_filter_returns_events_when_only_start_given(): void
    {
        $event = $this->makeEvent([
            'start' => now()->addDays(10)->format('Y-m-d'),
            'end' => now()->addDays(20)->format('Y-m-d'),
        ]);

        $start = now()->addDays(5)->format('Y-m-d');

        $this->get("/eventos?start=$start")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events', 1)
            );
    }

    public function test_filter_returns_events_when_only_end_given(): void
    {
        $event = $this->makeEvent([
            'start' => now()->addDays(1)->format('Y-m-d'),
            'end' => now()->addDays(5)->format('Y-m-d'),
        ]);

        $farFuture = $this->makeEvent([
            'title' => 'Far Future',
            'slug' => 'far-future',
            'start' => now()->addMonths(6)->format('Y-m-d'),
            'end' => now()->addMonths(7)->format('Y-m-d'),
        ]);

        $end = now()->addDays(10)->format('Y-m-d');

        $this->get("/eventos?end=$end")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events', 1)
                ->where('events.0.id', $event->id)
            );
    }

    public function test_filters_are_echoed_back_in_response(): void
    {
        $this->get('/eventos?start=2026-06-01&end=2026-12-31')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.start', fn ($v) => str_contains($v, '2026-06-01'))
                ->where('filters.end', fn ($v) => str_contains($v, '2026-12-31'))
            );
    }

    public function test_no_filters_shows_upcoming_events(): void
    {
        $upcoming = $this->makeEvent([
            'start' => now()->addDays(1)->format('Y-m-d'),
            'end' => now()->addDays(5)->format('Y-m-d'),
        ]);

        $this->get('/eventos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events', 1)
            );
    }

    // ── Show ─────────────────────────────────────────────────────

    public function test_show_displays_event_by_slug(): void
    {
        $event = $this->makeEvent(['title' => 'Festival Rock', 'slug' => 'festival-rock']);

        $this->get('/eventos/festival-rock')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Site/Event/Show')
                ->has('event')
                ->where('event.slug', 'festival-rock')
            );
    }

    public function test_show_returns_404_for_nonexistent_slug(): void
    {
        $this->get('/eventos/nonexistent-event')
            ->assertNotFound();
    }
}
