<?php

namespace Tests\Feature\Observability;

use App\Jobs\RecordObservabilityHit;
use App\Models\ObservabilityPageView;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ObservabilityQueueTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_view_is_dispatched_to_queue(): void
    {
        Bus::fake();

        $this->get('/')->assertOk();

        Bus::assertDispatched(RecordObservabilityHit::class);
    }

    public function test_job_persists_page_view(): void
    {
        Http::fake();
        $job = new RecordObservabilityHit([
            'path' => 'eventos',
            'method' => 'GET',
            'route_name' => 'site.events.index',
            'ip' => '203.0.113.10',
            'user_id' => null,
            'user_agent' => 'PHPUnit',
            'referer' => null,
        ], [
            'path' => 'eventos',
            'method' => 'GET',
            'route_name' => 'site.events.index',
            'duration_ms' => 12,
            'memory_bytes' => 1000,
            'status_code' => 200,
            'measured_at' => now()->toDateTimeString(),
        ]);

        $job->handle();

        $this->assertDatabaseHas('observability_page_views', [
            'path' => 'eventos',
            'method' => 'GET',
        ]);
        $this->assertSame(1, ObservabilityPageView::query()->count());
    }

    public function test_frontend_error_ingest_contract_is_unchanged(): void
    {
        $this->postJson('/api/observability/errors', [
            'message' => 'queue spec client error',
        ])->assertCreated();
    }
}
