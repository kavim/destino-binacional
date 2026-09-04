<?php

namespace App\Jobs;

use App\Services\ObservabilityService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RecordObservabilityHit implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @param  array<string, mixed>|null  $pageView
     * @param  array<string, mixed>|null  $performance
     */
    public function __construct(
        public readonly ?array $pageView,
        public readonly ?array $performance,
    ) {}

    public function handle(): void
    {
        ObservabilityService::persistPageView($this->pageView);
        ObservabilityService::persistPerformance($this->performance);
    }
}
