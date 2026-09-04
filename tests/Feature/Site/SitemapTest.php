<?php

namespace Tests\Feature\Site;

use App\Models\Event;
use App\Models\Place;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class SitemapTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    public function test_sitemap_returns_200_with_home_and_place_slug(): void
    {
        Place::forceCreate([
            'name' => 'Plaza Internacional',
            'slug' => 'plaza-internacional',
            'address' => 'Frontera',
            'city_id' => $this->city->id,
            'place_type_id' => $this->placeType->id,
            'category_id' => $this->childCategory->id,
            'google_maps_src' => null,
            'featured_image' => null,
            'order' => 0,
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $this->assertStringContainsString('xml', (string) $response->headers->get('Content-Type'));
        $response->assertSee(url('/'), false);
        $response->assertSee('/p/plaza-internacional', false);
    }

    public function test_sitemap_includes_upcoming_events_and_excludes_ended(): void
    {
        Event::forceCreate([
            'title' => 'Vivo',
            'slug' => 'evento-vivo',
            'description' => 'x',
            'start' => now()->toDateString(),
            'end' => now()->addWeek()->toDateString(),
            'is_online' => false,
            'city_id' => $this->city->id,
            'category_id' => $this->childCategory->id,
        ]);

        Event::forceCreate([
            'title' => 'Passado',
            'slug' => 'evento-passado',
            'description' => 'x',
            'start' => now()->subMonths(2)->toDateString(),
            'end' => now()->subMonth()->toDateString(),
            'is_online' => false,
            'city_id' => $this->city->id,
            'category_id' => $this->childCategory->id,
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertSee('/eventos/evento-vivo', false);
        $response->assertDontSee('/eventos/evento-passado', false);
    }

    public function test_robots_txt_points_sitemap_using_app_url(): void
    {
        $sitemap = rtrim((string) config('app.url'), '/').'/sitemap.xml';

        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('User-agent: *', false)
            ->assertSee('Sitemap: '.$sitemap, false);
    }
}
