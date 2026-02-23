<?php

namespace App\Console\Commands;

use App\Models\ObservabilityError;
use App\Models\ObservabilityPageView;
use App\Models\ObservabilityPerformance;
use Carbon\Carbon;
use Illuminate\Console\Command;

class PruneObservabilityData extends Command
{
    protected $signature = 'observability:prune {--days= : Número de dias de retenção (usa config se não informado)}';

    protected $description = 'Remove dados de observabilidade mais antigos que o período de retenção';

    public function handle(): int
    {
        $days = (int) ($this->option('days') ?? config('observability.retention_days'));
        if ($days <= 0) {
            $this->warn('Retenção desativada (retention_days = null) ou inválida. Nada a fazer.');
            return self::SUCCESS;
        }

        $before = Carbon::today()->subDays($days);

        $pv = ObservabilityPageView::where('viewed_at', '<', $before)->delete();
        $pe = ObservabilityError::where('created_at', '<', $before)->delete();
        $perf = ObservabilityPerformance::where('measured_at', '<', $before)->delete();

        $this->info("Removidos: {$pv} page views, {$pe} erros, {$perf} registros de performance (antes de {$before->toDateString()}).");
        return self::SUCCESS;
    }
}
