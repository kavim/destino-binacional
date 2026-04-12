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

    public function test_tours_page_passes_tours_filters_and_category_options(): void
    {
        $this->get('/t')
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours')
                ->has('filters')
                ->has('filters.category')
                ->has('filterCategories')
            );
    }

    // ── Category filtering ───────────────────────────────────────

    public function test_filter_by_category_slug(): void
    {
        $tagged = $this->makeTour([
            'title' => 'Tagged Tour',
            'slug' => 'tagged-tour',
        ]);
        $tagged->categories()->attach($this->parentCategory->id);

        $this->makeTour([
            'title' => 'Other Tour',
            'slug' => 'other-tour',
        ]);

        $this->get('/t?category=cultura')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours', 1)
                ->where('tours.0.id', $tagged->id)
                ->where('filters.category', 'cultura')
            );
    }

    public function test_invalid_category_slug_ignored_lists_all_tours(): void
    {
        $this->makeTour(['title' => 'A', 'slug' => 'tour-a']);
        $this->makeTour(['title' => 'B', 'slug' => 'tour-b']);

        $this->get('/t?category=nonexistent-slug-xyz')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tours', 2)
                ->where('filters.category', null)
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

    public function test_filters_echo_selected_category_slug(): void
    {
        $this->get('/t?category=cultura')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.category', 'cultura')
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
