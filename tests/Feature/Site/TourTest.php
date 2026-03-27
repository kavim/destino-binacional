<?php

namespace Tests\Feature\Site;

use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class TourTest extends TestCase
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

    // ── Page rendering ───────────────────────────────────────────

    public function test_tours_page_returns_200(): void
    {
        $this->get('/t')->assertOk();
    }

    public function test_tours_page_renders_correct_component(): void
    {
        $this->get('/t')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Site/Tour/Index')
            );
    }

    public function test_tours_page_passes_tours_and_filters(): void
    {
        $this->get('/t')
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours')
                ->has('filters')
                ->has('filters.start')
                ->has('filters.end')
            );
    }

    // ── Date filtering ───────────────────────────────────────────

    public function test_filter_by_start_date(): void
    {
        $early = $this->makeTour([
            'title' => 'Early Tour',
            'slug' => 'early-tour',
            'start' => now()->subMonth(),
            'end' => now()->subWeek(),
        ]);

        $future = $this->makeTour([
            'title' => 'Future Tour',
            'slug' => 'future-tour',
            'start' => now()->addWeek(),
            'end' => now()->addWeeks(2),
        ]);

        $start = now()->format('Y-m-d');

        $this->get("/t?start=$start")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours', 1)
                ->where('tours.0.id', $future->id)
            );
    }

    public function test_filter_by_date_range(): void
    {
        $inRange = $this->makeTour([
            'title' => 'In Range',
            'slug' => 'in-range',
            'start' => now()->addDays(5),
            'end' => now()->addDays(10),
        ]);

        $outOfRange = $this->makeTour([
            'title' => 'Out of Range',
            'slug' => 'out-of-range',
            'start' => now()->addMonths(6),
            'end' => now()->addMonths(7),
        ]);

        $start = now()->format('Y-m-d');
        $end = now()->addDays(15)->format('Y-m-d');

        $this->get("/t?start=$start&end=$end")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours', 1)
                ->where('tours.0.id', $inRange->id)
            );
    }

    public function test_no_filters_returns_all_tours(): void
    {
        $this->makeTour(['title' => 'A', 'slug' => 'tour-a']);
        $this->makeTour(['title' => 'B', 'slug' => 'tour-b']);

        $this->get('/t')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours', 2)
            );
    }

    public function test_filters_are_echoed_back(): void
    {
        $this->get('/t?start=2026-06-01&end=2026-12-31')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.start', fn ($v) => str_contains($v, '2026-06-01'))
                ->where('filters.end', fn ($v) => str_contains($v, '2026-12-31'))
            );
    }

    // ── Show ─────────────────────────────────────────────────────

    public function test_show_displays_tour_by_slug(): void
    {
        $tour = $this->makeTour(['title' => 'Walking Tour', 'slug' => 'walking-tour']);

        $this->get('/t/walking-tour')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Site/Tour/Show')
                ->has('tour')
                ->where('tour.slug', 'walking-tour')
            );
    }

    public function test_show_returns_404_for_nonexistent_slug(): void
    {
        $this->get('/t/nonexistent-tour')
            ->assertNotFound();
    }
}
