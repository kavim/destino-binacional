<?php

namespace Tests\Feature\Dashboard;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_places_and_observability(): void
    {
        $this->get('/places')->assertRedirect('/login');
        $this->get('/observability')->assertRedirect('/login');
        $this->get('/dashboard')->assertRedirect('/login');
        $this->get('/users')->assertRedirect('/login');
        $this->get('/activity-logs')->assertRedirect('/login');
    }

    public function test_non_staff_receives_403_on_cms_and_observability(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/places')->assertForbidden();
        $this->actingAs($user)->get('/observability')->assertForbidden();
        $this->actingAs($user)->get('/dashboard')->assertForbidden();
        $this->actingAs($user)->get('/tracker')->assertForbidden();
        $this->actingAs($user)->get('/log-viewer')->assertForbidden();
        $this->actingAs($user)->get('/users')->assertForbidden();
        $this->actingAs($user)->get('/activity-logs')->assertForbidden();
    }

    public function test_editor_can_view_cms_but_not_analytics_or_users(): void
    {
        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)->get('/places')->assertOk();
        $this->actingAs($editor)->get('/dashboard')->assertOk();
        $this->actingAs($editor)->get('/events')->assertOk();
        $this->actingAs($editor)->get('/categories')->assertOk();
        $this->actingAs($editor)->get('/tags')->assertOk();
        $this->actingAs($editor)->get('/tours')->assertOk();
        $this->actingAs($editor)->get('/activity-logs')->assertOk();

        $this->actingAs($editor)->get('/observability')->assertForbidden();
        $this->actingAs($editor)->get('/tracker')->assertForbidden();
        $this->actingAs($editor)->get('/log-viewer')->assertForbidden();
        $this->actingAs($editor)->get('/users')->assertForbidden();
        $this->actingAs($editor)->get('/users/create')->assertForbidden();
    }

    public function test_admin_can_view_places_observability_and_users(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get('/places')->assertOk();
        $this->actingAs($admin)->get('/observability')->assertOk();
        $this->actingAs($admin)->get('/dashboard')->assertOk();
        $this->actingAs($admin)->get('/users')->assertOk();
        $this->actingAs($admin)->get('/activity-logs')->assertOk();
    }

    public function test_non_staff_can_still_edit_profile(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/profile')->assertOk();
    }

    public function test_editor_dashboard_does_not_share_admin_only_routes_as_accessible(): void
    {
        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('auth.user.role', UserRole::Editor->value)
                ->where('auth.user.is_admin', false)
                ->where('auth.user.is_staff', true)
            );
    }
}
