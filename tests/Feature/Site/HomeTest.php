<?php

namespace Tests\Feature\Site;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_returns_200(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_home_renders_inertia_component(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('Site/Home/Home')
        );
    }

    public function test_home_passes_grouped_events(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->has('grouped_events')
        );
    }

    public function test_home_passes_categories(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->has('categories')
        );
    }

    public function test_privacy_policy_returns_200(): void
    {
        $response = $this->get('/privacy-policy');

        $response->assertStatus(200);
    }
}
