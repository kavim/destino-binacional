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

    public function test_home_passes_shared_categories(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->has('cats.categories')
        );
    }

    public function test_privacy_policy_returns_200(): void
    {
        $response = $this->get('/privacy-policy');

        $response->assertStatus(200);
    }

    public function test_home_redirects_temporarily_when_url_configured(): void
    {
        $target = 'https://178422638489b24119fa036ecb.temporary.link/';
        config(['app.home_temporary_redirect_url' => $target]);

        $this->get('/')
            ->assertStatus(302)
            ->assertRedirect($target);

        $this->get('/home')
            ->assertStatus(302)
            ->assertRedirect($target);
    }

    public function test_privacy_policy_does_not_redirect_when_home_redirect_configured(): void
    {
        config(['app.home_temporary_redirect_url' => 'https://178422638489b24119fa036ecb.temporary.link/']);

        $this->get('/privacy-policy')->assertStatus(200);
    }
}
