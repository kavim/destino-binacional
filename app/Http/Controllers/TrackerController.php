<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TrackerController extends Controller
{
    private function db()
    {
        return DB::connection('tracker');
    }

    public function index(Request $request)
    {
        $days = min(max((int) $request->get('days', 14), 1), 90);
        $since = Carbon::today()->subDays($days);

        try {
            // Total de sessões e page views
            $totalSessions = $this->db()->table('tracker_sessions')
                ->where('created_at', '>=', $since)
                ->where('is_robot', false)
                ->count();

            $totalPageViews = $this->db()->table('tracker_log')
                ->join('tracker_sessions', 'tracker_log.session_id', '=', 'tracker_sessions.id')
                ->where('tracker_sessions.created_at', '>=', $since)
                ->where('tracker_sessions.is_robot', false)
                ->count();

            // Sessões por dia
            $sessionsByDay = $this->db()->table('tracker_sessions')
                ->where('created_at', '>=', $since)
                ->where('is_robot', false)
                ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->mapWithKeys(fn ($r) => [$r->date => $r->total]);

            // Page views por dia
            $viewsByDay = $this->db()->table('tracker_log')
                ->join('tracker_sessions', 'tracker_log.session_id', '=', 'tracker_sessions.id')
                ->where('tracker_sessions.created_at', '>=', $since)
                ->where('tracker_sessions.is_robot', false)
                ->selectRaw('DATE(tracker_log.created_at) as date, COUNT(*) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->mapWithKeys(fn ($r) => [$r->date => $r->total]);

            // Páginas mais visitadas
            $topPaths = $this->db()->table('tracker_log')
                ->join('tracker_sessions', 'tracker_log.session_id', '=', 'tracker_sessions.id')
                ->join('tracker_paths', 'tracker_log.path_id', '=', 'tracker_paths.id')
                ->where('tracker_sessions.created_at', '>=', $since)
                ->where('tracker_sessions.is_robot', false)
                ->select('tracker_paths.path', DB::raw('COUNT(*) as views'))
                ->groupBy('tracker_paths.path')
                ->orderByDesc('views')
                ->limit(20)
                ->get();

            // Visitantes por país (geoip)
            $visitorsByCountry = $this->db()->table('tracker_sessions')
                ->join('tracker_geoip', 'tracker_sessions.geoip_id', '=', 'tracker_geoip.id')
                ->where('tracker_sessions.created_at', '>=', $since)
                ->where('tracker_sessions.is_robot', false)
                ->whereNotNull('tracker_geoip.country_code')
                ->select('tracker_geoip.country_name as country', 'tracker_geoip.country_code', DB::raw('COUNT(*) as total'))
                ->groupBy('tracker_geoip.country_name', 'tracker_geoip.country_code')
                ->orderByDesc('total')
                ->limit(15)
                ->get();

            // Navegadores mais usados
            $topBrowsers = $this->db()->table('tracker_sessions')
                ->join('tracker_agents', 'tracker_sessions.agent_id', '=', 'tracker_agents.id')
                ->where('tracker_sessions.created_at', '>=', $since)
                ->where('tracker_sessions.is_robot', false)
                ->select('tracker_agents.browser', DB::raw('COUNT(*) as total'))
                ->groupBy('tracker_agents.browser')
                ->orderByDesc('total')
                ->limit(10)
                ->get();

            // Mobile vs Desktop
            $devicesStats = $this->db()->table('tracker_sessions')
                ->join('tracker_devices', 'tracker_sessions.device_id', '=', 'tracker_devices.id')
                ->where('tracker_sessions.created_at', '>=', $since)
                ->where('tracker_sessions.is_robot', false)
                ->select('tracker_devices.is_mobile', DB::raw('COUNT(*) as total'))
                ->groupBy('tracker_devices.is_mobile')
                ->get()
                ->mapWithKeys(fn ($r) => [$r->is_mobile ? 'mobile' : 'desktop' => $r->total]);

            // Top referers
            $topReferers = $this->db()->table('tracker_sessions')
                ->join('tracker_referers', 'tracker_sessions.referer_id', '=', 'tracker_referers.id')
                ->where('tracker_sessions.created_at', '>=', $since)
                ->where('tracker_sessions.is_robot', false)
                ->select('tracker_referers.host', DB::raw('COUNT(*) as total'))
                ->groupBy('tracker_referers.host')
                ->orderByDesc('total')
                ->limit(15)
                ->get();

            // Sessões recentes com detalhes (users vêm do banco principal)
            $sessionsRaw = $this->db()->table('tracker_sessions')
                ->leftJoin('tracker_geoip', 'tracker_sessions.geoip_id', '=', 'tracker_geoip.id')
                ->leftJoin('tracker_agents', 'tracker_sessions.agent_id', '=', 'tracker_agents.id')
                ->leftJoin('tracker_devices', 'tracker_sessions.device_id', '=', 'tracker_devices.id')
                ->leftJoin('tracker_referers', 'tracker_sessions.referer_id', '=', 'tracker_referers.id')
                ->where('tracker_sessions.is_robot', false)
                ->select(
                    'tracker_sessions.id',
                    'tracker_sessions.client_ip',
                    'tracker_sessions.created_at',
                    'tracker_sessions.user_id',
                    'tracker_geoip.country_name as country',
                    'tracker_geoip.country_code',
                    'tracker_geoip.city',
                    'tracker_geoip.region',
                    'tracker_agents.browser',
                    'tracker_agents.name as agent_name',
                    'tracker_devices.kind as device_kind',
                    'tracker_devices.platform',
                    'tracker_devices.is_mobile',
                    'tracker_referers.host as referer_host'
                )
                ->orderByDesc('tracker_sessions.created_at')
                ->limit(80)
                ->get();

            $userIds = $sessionsRaw->pluck('user_id')->filter()->unique()->values()->all();
            $users = [];
            if (! empty($userIds)) {
                $users = DB::table('users')
                    ->whereIn('id', $userIds)
                    ->get()
                    ->keyBy('id');
            }

            $recentSessions = $sessionsRaw->map(fn ($s) => [
                'id' => $s->id,
                'client_ip' => $s->client_ip,
                'created_at' => Carbon::parse($s->created_at)->toIso8601String(),
                'country' => $s->country,
                'country_code' => $s->country_code,
                'city' => $s->city,
                'region' => $s->region,
                'browser' => $s->browser,
                'agent_name' => $s->agent_name,
                'device_kind' => $s->device_kind,
                'platform' => $s->platform,
                'is_mobile' => (bool) $s->is_mobile,
                'referer_host' => $s->referer_host,
                'user' => $s->user_id && isset($users[$s->user_id])
                    ? ['id' => $s->user_id, 'name' => $users[$s->user_id]->name, 'email' => $users[$s->user_id]->email]
                    : null,
            ]);

            // Contagem de page views por sessão (para as sessões recentes)
            $recentSessionIds = $sessionsRaw->pluck('id')->all();
            $pageCountBySession = collect();
            if (! empty($recentSessionIds)) {
                $pageCountBySession = $this->db()->table('tracker_log')
                    ->whereIn('session_id', $recentSessionIds)
                    ->selectRaw('session_id, COUNT(*) as cnt')
                    ->groupBy('session_id')
                    ->get()
                    ->mapWithKeys(fn ($r) => [$r->session_id => $r->cnt]);
            }

            $recentSessions = $recentSessions->map(fn ($s) => array_merge($s, [
                'page_views_count' => $pageCountBySession[$s['id']] ?? 0,
            ]));

            return Inertia::render('Dashboard/Tracker/Index', [
                'days' => $days,
                'summary' => [
                    'total_sessions' => $totalSessions,
                    'total_page_views' => $totalPageViews,
                    'avg_pages_per_session' => $totalSessions > 0 ? round($totalPageViews / $totalSessions, 1) : 0,
                ],
                'sessions_by_day' => $sessionsByDay,
                'views_by_day' => $viewsByDay,
                'top_paths' => $topPaths,
                'visitors_by_country' => $visitorsByCountry,
                'top_browsers' => $topBrowsers,
                'devices_stats' => [
                    'mobile' => $devicesStats['mobile'] ?? 0,
                    'desktop' => $devicesStats['desktop'] ?? 0,
                ],
                'top_referers' => $topReferers,
                'recent_sessions' => $recentSessions,
            ]);
        } catch (\Throwable $e) {
            return Inertia::render('Dashboard/Tracker/Index', [
                'days' => $days,
                'error' => $e->getMessage(),
                'summary' => ['total_sessions' => 0, 'total_page_views' => 0, 'avg_pages_per_session' => 0],
                'sessions_by_day' => [],
                'views_by_day' => [],
                'top_paths' => [],
                'visitors_by_country' => [],
                'top_browsers' => [],
                'devices_stats' => ['mobile' => 0, 'desktop' => 0],
                'top_referers' => [],
                'recent_sessions' => [],
            ]);
        }
    }
}
