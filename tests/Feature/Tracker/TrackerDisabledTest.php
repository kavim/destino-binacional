<?php

namespace Tests\Feature\Tracker;

use App\Models\User;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PragmaRX\Tracker\Vendor\Laravel\Middlewares\Tracker;
use Tests\TestCase;

class TrackerDisabledTest extends TestCase
{
    use RefreshDatabase;

    public function test_tracker_is_disabled_by_default(): void
    {
        $this->assertFalse((bool) config('tracker.enabled'));
        $this->assertFalse(config()->has('app.tracker_enabled'));
    }

    public function test_web_middleware_group_does_not_include_tracker(): void
    {
        $web = app(Kernel::class)->getMiddlewareGroups()['web'] ?? [];

        $this->assertFalse(
            collect($web)->contains(fn ($middleware) => $middleware === Tracker::class)
        );
    }

    public function test_public_request_does_not_write_to_tracker_connection_when_disabled(): void
    {
        $this->assertFalse((bool) config('tracker.enabled'));

        $trackerQueries = [];

        DB::listen(function ($query) use (&$trackerQueries) {
            if ($query->connectionName === 'tracker') {
                $trackerQueries[] = $query->sql;
            }
        });

        $this->get('/')->assertOk();

        $this->assertSame([], $trackerQueries);
    }

    public function test_tracker_dashboard_is_not_found_when_disabled(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get('/tracker')->assertNotFound();
    }
}
