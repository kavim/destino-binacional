<?php

namespace Tests\Unit\Policies;

use App\Models\Event;
use App\Models\ObservabilityPageView;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_cms_and_observability(): void
    {
        $admin = User::factory()->admin()->create();
        $place = new Place;

        $this->assertTrue($admin->can('viewAny', Place::class));
        $this->assertTrue($admin->can('create', Place::class));
        $this->assertTrue($admin->can('update', $place));
        $this->assertTrue($admin->can('delete', $place));
        $this->assertTrue($admin->can('create', Event::class));
        $this->assertTrue($admin->can('viewAny', ObservabilityPageView::class));
    }

    public function test_non_admin_cannot_manage_cms(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $place = new Place;

        $this->assertFalse($user->can('viewAny', Place::class));
        $this->assertFalse($user->can('create', Place::class));
        $this->assertFalse($user->can('update', $place));
        $this->assertFalse($user->can('viewAny', ObservabilityPageView::class));
    }

    public function test_user_can_only_update_own_profile(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $other = User::factory()->create(['is_admin' => false]);

        $this->assertTrue($user->can('update', $user));
        $this->assertTrue($user->can('delete', $user));
        $this->assertFalse($user->can('update', $other));
        $this->assertFalse($user->can('delete', $other));
    }
}
