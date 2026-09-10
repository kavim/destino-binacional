<?php

namespace Tests\Unit\Services;

use App\Models\Place;
use App\Models\User;
use App\Services\DashboardActivityLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardActivityLoggerTest extends TestCase
{
    use RefreshDatabase;

    public function test_does_not_record_without_authenticated_user(): void
    {
        $place = Place::forceCreate([
            'name' => 'Sin Auth',
            'slug' => 'sin-auth',
            'address' => 'X',
            'order' => 0,
        ]);

        (new DashboardActivityLogger)->created($place);

        $this->assertDatabaseCount('activity_logs', 0);
    }

    public function test_records_for_authenticated_user(): void
    {
        $admin = User::factory()->admin()->create();
        $place = Place::forceCreate([
            'name' => 'Con Auth',
            'slug' => 'con-auth',
            'address' => 'X',
            'order' => 0,
        ]);

        $this->actingAs($admin);
        (new DashboardActivityLogger)->created($place);

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $admin->id,
            'action' => 'created',
            'subject_label' => 'Con Auth',
        ]);
    }
}
