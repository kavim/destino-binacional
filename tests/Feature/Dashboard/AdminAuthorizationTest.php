<?php

namespace Tests\Feature\Dashboard;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_places_and_observability(): void
    {
        $this->get('/places')->assertRedirect('/login');
        $this->get('/observability')->assertRedirect('/login');
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_non_admin_receives_403_on_places_and_observability(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/places')->assertForbidden();
        $this->actingAs($user)->get('/observability')->assertForbidden();
        $this->actingAs($user)->get('/dashboard')->assertForbidden();
        $this->actingAs($user)->get('/tracker')->assertForbidden();
        $this->actingAs($user)->get('/log-viewer')->assertForbidden();
    }

    public function test_admin_can_view_places_and_observability(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get('/places')->assertOk();
        $this->actingAs($admin)->get('/observability')->assertOk();
        $this->actingAs($admin)->get('/dashboard')->assertOk();
    }

    public function test_non_admin_can_still_edit_profile(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/profile')->assertOk();
    }
}
