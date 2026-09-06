<?php

namespace Tests\Feature\Dashboard;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_users(): void
    {
        $this->get('/users')->assertRedirect('/login');
        $this->get('/users/create')->assertRedirect('/login');
        $this->post('/users', [])->assertRedirect('/login');
    }

    public function test_editor_cannot_manage_users(): void
    {
        $editor = User::factory()->editor()->create();
        $other = User::factory()->editor()->create();

        $this->actingAs($editor)->get('/users')->assertForbidden();
        $this->actingAs($editor)->get('/users/create')->assertForbidden();
        $this->actingAs($editor)->post('/users', [
            'name' => 'Nuevo',
            'email' => 'nuevo@example.com',
            'password' => 'password1234',
            'password_confirmation' => 'password1234',
            'role' => UserRole::Editor->value,
        ])->assertForbidden();
        $this->actingAs($editor)->get("/users/{$other->id}/edit")->assertForbidden();
        $this->actingAs($editor)->put("/users/{$other->id}", [
            'name' => 'Hacked',
            'email' => $other->email,
            'role' => UserRole::Admin->value,
        ])->assertForbidden();
        $this->actingAs($editor)->delete("/users/{$other->id}")->assertForbidden();
    }

    public function test_admin_can_view_users_index(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->editor()->create(['name' => 'Editor Uno']);

        $this->actingAs($admin)->get('/users')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/User/Index')
                ->has('users.data', 2)
            );
    }

    public function test_admin_can_create_editor(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get('/users/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/User/Create')
                ->has('roles', 2)
            );

        $this->actingAs($admin)->post('/users', [
            'name' => 'Maria Editor',
            'email' => 'maria@example.com',
            'password' => 'password1234',
            'password_confirmation' => 'password1234',
            'role' => UserRole::Editor->value,
        ])->assertRedirect('/users');

        $created = User::query()->where('email', 'maria@example.com')->first();

        $this->assertNotNull($created);
        $this->assertTrue($created->isEditor());
        $this->assertTrue(Hash::check('password1234', $created->password));
    }

    public function test_admin_can_update_user_and_optional_password(): void
    {
        $admin = User::factory()->admin()->create();
        $editor = User::factory()->editor()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);

        $this->actingAs($admin)->get("/users/{$editor->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/User/Edit')
                ->where('managedUser.email', 'old@example.com')
            );

        $this->actingAs($admin)->put("/users/{$editor->id}", [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'role' => UserRole::Editor->value,
        ])->assertRedirect('/users');

        $editor->refresh();
        $this->assertSame('New Name', $editor->name);
        $this->assertSame('new@example.com', $editor->email);

        $this->actingAs($admin)->put("/users/{$editor->id}", [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'role' => UserRole::Editor->value,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])->assertRedirect('/users');

        $this->assertTrue(Hash::check('newpassword123', $editor->fresh()->password));
    }

    public function test_admin_can_promote_editor_to_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $editor = User::factory()->editor()->create();

        $this->actingAs($admin)->put("/users/{$editor->id}", [
            'name' => $editor->name,
            'email' => $editor->email,
            'role' => UserRole::Admin->value,
        ])->assertRedirect('/users');

        $this->assertTrue($editor->fresh()->isAdmin());
    }

    public function test_admin_can_delete_editor(): void
    {
        $admin = User::factory()->admin()->create();
        $editor = User::factory()->editor()->create();

        $this->actingAs($admin)->delete("/users/{$editor->id}")
            ->assertRedirect('/users');

        $this->assertNull(User::query()->find($editor->id));
    }

    public function test_cannot_delete_own_account_from_users_panel(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->admin()->create();

        $this->actingAs($admin)->delete("/users/{$admin->id}")
            ->assertRedirect();

        $this->assertNotNull(User::query()->find($admin->id));
    }

    public function test_cannot_delete_or_demote_last_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->delete("/users/{$admin->id}")->assertForbidden();

        $this->actingAs($admin)->put("/users/{$admin->id}", [
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => UserRole::Editor->value,
        ])->assertSessionHasErrors('role');

        $this->assertTrue($admin->fresh()->isAdmin());
    }

    public function test_cannot_create_user_with_plain_user_role(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/users', [
            'name' => 'No Access',
            'email' => 'nobody@example.com',
            'password' => 'password1234',
            'password_confirmation' => 'password1234',
            'role' => UserRole::User->value,
        ])->assertSessionHasErrors('role');
    }
}
