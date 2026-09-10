<?php

namespace Tests\Feature\Dashboard;

use App\Enums\UserRole;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Event;
use App\Models\Place;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    private string $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    public function test_seed_data_without_auth_does_not_write_activity_logs(): void
    {
        $this->assertDatabaseCount('activity_logs', 0);
    }

    public function test_index_renders_for_staff(): void
    {
        $this->actingAs($this->user)->get('/activity-logs')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/ActivityLog/Index')
                ->has('logs.data')
                ->has('filters')
            );
    }

    public function test_creating_place_event_tour_and_category_writes_logs(): void
    {
        $this->actingAs($this->user)
            ->post('/places', [
                'name' => 'Museo de Rivera',
                'address' => 'Calle Principal 123',
                'city_id' => $this->city->id,
                'place_type_id' => $this->placeType->id,
                'description_pt' => 'Descrição em português.',
                'description_es' => 'Descripción en español.',
                'featured_image' => $this->base64Pixel,
                'order' => 5,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect('/places');

        $this->actingAs($this->user)
            ->post('/events', [
                'title' => 'Festival de Jazz',
                'description' => 'Descrição do evento de teste.',
                'start' => now()->addWeek()->format('Y-m-d'),
                'end' => now()->addWeeks(2)->format('Y-m-d'),
                'is_online' => false,
                'link' => '',
                'google_maps_src' => 'https://maps.google.com/embed',
                'address' => 'Calle Principal 123',
                'city_id' => $this->city->id,
                'category_id' => $this->childCategory->id,
                'featured_image' => $this->base64Pixel,
                'tag_ids' => [$this->childTag->id],
            ])
            ->assertRedirect();

        $this->actingAs($this->user)
            ->post('/tours', [
                'title' => 'Tour pela Fronteira',
                'meeting_point' => 'Plaza Internacional',
                'description' => 'Un tour increíble por la frontera.',
                'guide' => 'Juan Pérez',
                'price' => 50,
                'currency' => 'BRL',
                'featured_image' => $this->base64Pixel,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect('/tours');

        $this->actingAs($this->user)
            ->post('/categories', [
                'name_es' => 'Gastronomía',
                'name_pt' => 'Gastronomia',
                'parent_id' => $this->parentCategory->id,
            ])
            ->assertRedirect('/categories');

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->user->id,
            'action' => ActivityLog::ACTION_CREATED,
            'subject_type' => Place::class,
            'subject_label' => 'Museo de Rivera',
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'action' => ActivityLog::ACTION_CREATED,
            'subject_type' => Event::class,
            'subject_label' => 'Festival de Jazz',
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'action' => ActivityLog::ACTION_CREATED,
            'subject_type' => Tour::class,
            'subject_label' => 'Tour pela Fronteira',
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'action' => ActivityLog::ACTION_CREATED,
            'subject_type' => Category::class,
            'subject_label' => 'Gastronomía',
        ]);
    }

    public function test_updating_and_deleting_place_writes_logs_with_label_after_delete(): void
    {
        $this->actingAs($this->user)
            ->post('/places', [
                'name' => 'Cafe Central',
                'address' => 'Calle Principal 123',
                'city_id' => $this->city->id,
                'place_type_id' => $this->placeType->id,
                'description_pt' => 'Desc',
                'description_es' => 'Desc',
                'featured_image' => $this->base64Pixel,
                'order' => 1,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect('/places');

        $place = Place::query()->where('slug', 'cafe-central')->firstOrFail();

        $this->actingAs($this->user)
            ->from("/places/{$place->id}/edit")
            ->put("/places/{$place->id}", [
                'name' => 'Cafe Actualizado',
                'description_es' => 'Nueva',
                'description_pt' => 'Nova',
                'address' => 'Calle Nueva 456',
                'city_id' => $this->city->id,
                'place_type_id' => $this->placeType->id,
                'google_maps_src' => $place->google_maps_src,
                'featured_image' => $this->base64Pixel,
                'order' => 2,
                'category_ids' => [$this->childCategory->id],
            ])
            ->assertRedirect();

        $this->actingAs($this->user)
            ->delete("/places/{$place->id}")
            ->assertRedirect('/places');

        $this->assertDatabaseHas('activity_logs', [
            'action' => ActivityLog::ACTION_UPDATED,
            'subject_type' => Place::class,
            'subject_id' => $place->id,
            'subject_label' => 'Cafe Actualizado',
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'action' => ActivityLog::ACTION_DELETED,
            'subject_type' => Place::class,
            'subject_id' => $place->id,
            'subject_label' => 'Cafe Actualizado',
        ]);

        $this->actingAs($this->user)->get('/activity-logs')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('logs.data')
                ->where('logs.data.0.action', 'deleted')
                ->where('logs.data.0.subject_label', 'Cafe Actualizado')
            );
    }

    public function test_admin_user_crud_writes_logs_without_password(): void
    {
        $this->actingAs($this->user)->post('/users', [
            'name' => 'Maria Editor',
            'email' => 'maria@example.com',
            'password' => 'password1234',
            'password_confirmation' => 'password1234',
            'role' => UserRole::Editor->value,
        ])->assertRedirect('/users');

        $created = User::query()->where('email', 'maria@example.com')->firstOrFail();

        $this->assertDatabaseHas('activity_logs', [
            'action' => ActivityLog::ACTION_CREATED,
            'subject_type' => User::class,
            'subject_id' => $created->id,
            'subject_label' => 'Maria Editor (maria@example.com)',
        ]);

        $raw = ActivityLog::query()
            ->where('subject_type', User::class)
            ->where('subject_id', $created->id)
            ->get()
            ->toJson();

        $this->assertStringNotContainsString('password1234', $raw);

        $this->actingAs($this->user)->put("/users/{$created->id}", [
            'name' => 'Maria Actualizada',
            'email' => $created->email,
            'role' => UserRole::Editor->value,
        ])->assertRedirect('/users');

        $this->actingAs($this->user)->delete("/users/{$created->id}")
            ->assertRedirect('/users');

        $this->assertDatabaseHas('activity_logs', [
            'action' => ActivityLog::ACTION_UPDATED,
            'subject_type' => User::class,
            'subject_label' => 'Maria Actualizada (maria@example.com)',
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'action' => ActivityLog::ACTION_DELETED,
            'subject_type' => User::class,
            'subject_label' => 'Maria Actualizada (maria@example.com)',
        ]);
    }

    public function test_index_can_filter_by_action(): void
    {
        $this->actingAs($this->user)
            ->post('/categories', [
                'name_es' => 'Filtro Uno',
                'name_pt' => 'Filtro Um',
                'parent_id' => $this->parentCategory->id,
            ])
            ->assertRedirect('/categories');

        $this->actingAs($this->user)->get('/activity-logs?action=created')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.action', 'created')
                ->has('logs.data', 1)
            );

        $this->actingAs($this->user)->get('/activity-logs?action=deleted')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('logs.data', 0)
            );
    }
}
