<?php

namespace App\Http\Controllers;

use App\Models\ObservabilityError;
use App\Models\ObservabilityPageView;
use App\Models\ObservabilityPerformance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ObservabilityController extends Controller
{
    public function index(Request $request)
    {
        $days = min(max((int) $request->get('days', 14), 1), 90);
        $since = Carbon::today()->subDays($days);

        // Tráfego: visualizações por dia e por página
        $viewsByDay = ObservabilityPageView::query()
            ->where('viewed_at', '>=', $since)
            ->selectRaw('DATE(viewed_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(fn ($r) => [$r->date => $r->total]);

        $topPages = ObservabilityPageView::query()
            ->where('viewed_at', '>=', $since)
            ->select('path', DB::raw('COUNT(*) as views'))
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(20)
            ->get();

        $totalViews = ObservabilityPageView::where('viewed_at', '>=', $since)->count();
        $uniqueVisitorsEstimate = ObservabilityPageView::where('viewed_at', '>=', $since)
            ->whereNotNull('ip_hash')
            ->distinct('ip_hash')
            ->count('ip_hash');

        // Visitantes recentes com detalhes (IP, localização, usuário logado, etc.)
        $recentVisits = ObservabilityPageView::query()
            ->with('user:id,name,email')
            ->orderByDesc('viewed_at')
            ->limit(100)
            ->get()
            ->map(fn ($v) => [
                'id' => $v->id,
                'path' => $v->path,
                'viewed_at' => $v->viewed_at->toIso8601String(),
                'ip' => $v->ip,
                'user' => $v->user ? [
                    'id' => $v->user->id,
                    'name' => $v->user->name,
                    'email' => $v->user->email,
                ] : null,
                'user_agent' => $v->user_agent,
                'referer' => $v->referer,
                'country' => $v->country,
                'country_code' => $v->country_code,
                'region' => $v->region,
                'city' => $v->city,
                'timezone' => $v->timezone,
            ]);

        // Visitantes por país (apenas registros com country_code)
        $visitorsByCountry = ObservabilityPageView::query()
            ->where('viewed_at', '>=', $since)
            ->whereNotNull('country_code')
            ->select('country', 'country_code', DB::raw('COUNT(*) as total'))
            ->groupBy('country', 'country_code')
            ->orderByDesc('total')
            ->limit(15)
            ->get();

        // Erros recentes
        $recentErrors = ObservabilityError::query()
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        $errorsBySource = ObservabilityError::query()
            ->where('created_at', '>=', $since)
            ->select('source', DB::raw('COUNT(*) as total'))
            ->groupBy('source')
            ->get();

        // Performance: médias e rotas mais lentas
        $performanceSince = Carbon::today()->subDays(min($days, 7)); // últimos 7 dias para performance
        $avgPerformance = ObservabilityPerformance::query()
            ->where('measured_at', '>=', $performanceSince)
            ->selectRaw('AVG(duration_ms) as avg_ms, AVG(memory_bytes) as avg_memory')
            ->first();

        $slowestRoutes = ObservabilityPerformance::query()
            ->where('measured_at', '>=', $performanceSince)
            ->select('path', 'route_name', DB::raw('AVG(duration_ms) as avg_ms'), DB::raw('MAX(duration_ms) as max_ms'), DB::raw('COUNT(*) as requests'))
            ->groupBy('path', 'route_name')
            ->orderByDesc('avg_ms')
            ->limit(15)
            ->get();

        $performanceByDay = ObservabilityPerformance::query()
            ->where('measured_at', '>=', $performanceSince)
            ->selectRaw('DATE(measured_at) as date, AVG(duration_ms) as avg_ms')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(fn ($r) => [$r->date => (float) round($r->avg_ms, 2)]);

        return Inertia::render('Dashboard/Observability/Index', [
            'days' => $days,
            'traffic' => [
                'total_views' => $totalViews,
                'unique_visitors_estimate' => $uniqueVisitorsEstimate,
                'views_by_day' => $viewsByDay,
                'top_pages' => $topPages,
                'recent_visits' => $recentVisits,
                'visitors_by_country' => $visitorsByCountry,
            ],
            'errors' => [
                'recent' => $recentErrors,
                'by_source' => $errorsBySource,
            ],
            'performance' => [
                'avg_duration_ms' => $avgPerformance ? round($avgPerformance->avg_ms, 2) : null,
                'avg_memory_mb' => $avgPerformance && $avgPerformance->avg_memory ? round($avgPerformance->avg_memory / 1024 / 1024, 2) : null,
                'slowest_routes' => $slowestRoutes,
                'by_day' => $performanceByDay,
            ],
            'log_viewer_url' => url('/log-viewer'),
        ]);
    }
}
