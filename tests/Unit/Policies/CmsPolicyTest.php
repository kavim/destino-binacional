<?php

namespace Tests\Unit\Policies;

use App\Enums\UserRole;
use App\Models\Event;
use App\Models\ObservabilityPageView;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_cms_observability_and_users(): void
    {
        $admin = User::factory()->admin()->create();
        $place = new Place;
        $other = User::factory()->editor()->create();

        $this->assertTrue($admin->can('viewAny', Place::class));
        $this->assertTrue($admin->can('create', Place::class));
        $this->assertTrue($admin->can('update', $place));
        $this->assertTrue($admin->can('delete', $place));
        $this->assertTrue($admin->can('create', Event::class));
        $this->assertTrue($admin->can('viewAny', ObservabilityPageView::class));
        $this->assertTrue($admin->can('viewAny', User::class));
        $this->assertTrue($admin->can('create', User::class));
        $this->assertTrue($admin->can('update', $other));
        $this->assertTrue($admin->can('delete', $other));
    }

    public function test_editor_can_manage_cms_but_not_observability_or_users(): void
    {
        $editor = User::factory()->editor()->create();
        $place = new Place;
        $other = User::factory()->editor()->create();

        $this->assertTrue($editor->can('viewAny', Place::class));
        $this->assertTrue($editor->can('create', Place::class));
        $this->assertTrue($editor->can('update', $place));
        $this->assertTrue($editor->can('delete', $place));
        $this->assertFalse($editor->can('viewAny', ObservabilityPageView::class));
        $this->assertFalse($editor->can('viewAny', User::class));
        $this->assertFalse($editor->can('create', User::class));
        $this->assertFalse($editor->can('update', $other));
        $this->assertFalse($editor->can('delete', $other));
    }

    public function test_non_staff_cannot_manage_cms(): void
    {
        $user = User::factory()->create();
        $place = new Place;

        $this->assertFalse($user->can('viewAny', Place::class));
        $this->assertFalse($user->can('create', Place::class));
        $this->assertFalse($user->can('update', $place));
        $this->assertFalse($user->can('viewAny', ObservabilityPageView::class));
    }

    public function test_user_can_only_update_own_profile(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->assertTrue($user->can('update', $user));
        $this->assertTrue($user->can('delete', $user));
        $this->assertFalse($user->can('update', $other));
        $this->assertFalse($user->can('delete', $other));
    }

    public function test_cannot_delete_or_assign_non_admin_role_to_last_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $otherAdmin = User::factory()->admin()->create();

        $this->assertTrue($otherAdmin->can('delete', $admin));

        $otherAdmin->delete();

        $this->assertTrue($admin->fresh()->isSoleAdmin());
        $this->assertFalse($admin->can('delete', $admin));
        $this->assertFalse($admin->can('assignRole', [$admin, UserRole::Editor]));
        $this->assertTrue($admin->can('assignRole', [$admin, UserRole::Admin]));
    }
}
