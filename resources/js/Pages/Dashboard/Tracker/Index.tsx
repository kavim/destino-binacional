import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

function BarChart({
    data,
    maxValue,
    valueLabel,
    barColor = 'bg-brand-green',
}: {
    data: Record<string, unknown>;
    maxValue?: number;
    valueLabel?: (v: unknown) => string;
    barColor?: string;
}) {
    const values = Object.values(data).map(Number);
    const max = maxValue || (values.length ? Math.max(...values, 1) : 1);
    const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
    return (
        <div className="space-y-1">
            {entries.map(([label, value]) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                    <span className="w-24 shrink-0 text-muted-foreground truncate">{label}</span>
                    <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                        <div
                            className={`h-full ${barColor} rounded transition-all`}
                            style={{ width: `${Math.min(100, (Number(value) / max) * 100)}%` }}
                        />
                    </div>
                    <span className="w-14 text-right font-medium shrink-0">
                        {String(valueLabel ? valueLabel(value) : value)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function DonutChart({ data, colors = ['#355bc8', '#0D9C4A'] }: { data: Record<string, unknown>; colors?: string[] }) {
    const total = Object.values(data).reduce<number>(
        (a, b) => a + Number(b),
        0,
    );
    if (total === 0) return <div className="text-sm text-muted-foreground">Sem dados</div>;
    const entries = Object.entries(data);
    let cumul = 0;
    const segments = entries.map(([label, value], i) => {
        const pct = (Number(value) / total) * 100;
        const start = cumul;
        cumul += pct;
        return { label, value: Number(value), pct, start, color: colors[i % colors.length] };
    });
    return (
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {segments.map((s, i) => (
                        <circle
                            key={i}
                            cx="18"
                            cy="18"
                            r="15.9"
                            fill="none"
                            stroke={s.color}
                            strokeWidth="3"
                            strokeDasharray={`${s.pct} ${100 - s.pct}`}
                            strokeDashoffset={-s.start}
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-foreground">{total.toLocaleString('pt-BR')}</span>
                </div>
            </div>
            <div className="flex-1 space-y-2">
                {segments.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm gap-2">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                            {s.label}
                        </span>
                        <span className="font-medium">{s.value.toLocaleString('pt-BR')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

type TrackerPageProps = {
    summary?: {
        total_sessions?: number;
        total_page_views?: number;
        avg_pages_per_session?: string | number | null;
    };
    sessions_by_day?: Record<string, unknown>;
    views_by_day?: Record<string, unknown>;
    top_paths?: Array<{ path: string; views: number }>;
    visitors_by_country?: Array<{ country?: string; country_code?: string; total: number }>;
    top_browsers?: Array<{ browser?: string; total: number }>;
    devices_stats?: { mobile?: number; desktop?: number };
    top_referers?: Array<{ host?: string; total: number }>;
    recent_sessions?: Array<{
        id?: number | string;
        created_at?: string;
        client_ip?: string;
        city?: string;
        country?: string;
        country_code?: string;
        browser?: string;
        agent_name?: string;
        is_mobile?: boolean;
        platform?: string;
        user?: { email?: string; name?: string };
        page_views_count?: number;
        referer_host?: string;
    }>;
    days?: number;
    error?: string;
};

export default function TrackerIndex() {
    const { summary, sessions_by_day, views_by_day, top_paths, visitors_by_country, top_browsers, devices_stats, top_referers, recent_sessions, days, error } =
        usePage().props as unknown as TrackerPageProps;

    const sessionsByDay = sessions_by_day ?? {};
    const viewsByDay = views_by_day ?? {};
    const visitorsByCountry = visitors_by_country ?? [];
    const topBrowsers = top_browsers ?? [];
    const topReferers = top_referers ?? [];

    const changeDays = (d: number) => {
        router.get(route('tracker.index'), { days: d }, { preserveState: true });
    };

    const devicesData = {
        Mobile: devices_stats?.mobile ?? 0,
        Desktop: devices_stats?.desktop ?? 0,
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">
                        Tracker (PragmaRX)
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Período:</span>
                        {[7, 14, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => changeDays(d)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${days === d
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {d} dias
                            </button>
                        ))}
                    </div>
                </div>
            }
        >
            <Head title="Tracker - Analytics" />
            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                {error && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300">
                        Erro ao carregar dados do Tracker: {error}
                    </div>
                )}

                {/* Resumo */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card shadow rounded-xl overflow-hidden border-l-4 border-brand-blue">
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground">Sessões</p>
                            <p className="text-3xl font-bold text-foreground">
                                {(summary?.total_sessions ?? 0).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </div>
                    <div className="bg-card shadow rounded-xl overflow-hidden border-l-4 border-brand-green">
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground">Page views</p>
                            <p className="text-3xl font-bold text-foreground">
                                {(summary?.total_page_views ?? 0).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </div>
                    <div className="bg-card shadow rounded-xl overflow-hidden border-l-4 border-primary/70">
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground">Páginas/sessão (média)</p>
                            <p className="text-3xl font-bold text-foreground">
                                {summary?.avg_pages_per_session ?? '—'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Gráficos por dia */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Sessões por dia</h3>
                        </div>
                        <div className="p-6">
                            {Object.keys(sessionsByDay).length > 0 ? (
                                <BarChart data={sessionsByDay} valueLabel={(v) => Number(v).toLocaleString('pt-BR')} barColor="bg-brand-green" />
                            ) : (
                                <p className="text-muted-foreground text-sm">Nenhum dado no período</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-card shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Page views por dia</h3>
                        </div>
                        <div className="p-6">
                            {Object.keys(viewsByDay).length > 0 ? (
                                <BarChart data={viewsByDay} valueLabel={(v) => Number(v).toLocaleString('pt-BR')} barColor="bg-brand-blue" />
                            ) : (
                                <p className="text-muted-foreground text-sm">Nenhum dado no período</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Páginas mais visitadas e Visitantes por país */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Páginas mais visitadas</h3>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Página</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Views</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {(!top_paths || top_paths.length === 0) ? (
                                        <tr><td colSpan={2} className="px-4 py-4 text-center text-muted-foreground">Nenhum dado</td></tr>
                                    ) : (
                                        top_paths.map((row) => (
                                            <tr key={row.path}>
                                                <td className="px-4 py-2 text-sm font-mono text-foreground truncate max-w-xs" title={row.path}>{row.path}</td>
                                                <td className="px-4 py-2 text-sm text-right">{row.views.toLocaleString('pt-BR')}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-card shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Visitantes por país</h3>
                        </div>
                        <div className="p-6">
                            {visitorsByCountry.length > 0 ? (
                                <BarChart
                                    data={Object.fromEntries(visitorsByCountry.map((r) => [r.country || r.country_code || '?', r.total]))}
                                    valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                    barColor="bg-brand-green"
                                />
                            ) : (
                                <p className="text-muted-foreground text-sm">Nenhum dado de geolocalização</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Navegadores e Dispositivos */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Navegadores</h3>
                        </div>
                        <div className="p-6">
                            {topBrowsers.length > 0 ? (
                                <BarChart
                                    data={Object.fromEntries(topBrowsers.map((r) => [r.browser || 'Desconhecido', r.total]))}
                                    valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                    barColor="bg-brand-blue"
                                />
                            ) : (
                                <p className="text-muted-foreground text-sm">Nenhum dado</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-card shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Mobile vs Desktop</h3>
                        </div>
                        <div className="p-6">
                            <DonutChart data={devicesData} colors={['#355bc8', '#0D9C4A']} />
                        </div>
                    </div>
                </section>

                {/* Top referers */}
                {topReferers.length > 0 && (
                    <section className="bg-card shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Principais origens (Referers)</h3>
                        </div>
                        <div className="p-6">
                            <BarChart
                                data={Object.fromEntries(topReferers.map((r) => [r.host || '(direto)', r.total]))}
                                valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                barColor="bg-brand-blue"
                            />
                        </div>
                    </section>
                )}

                {/* Sessões recentes */}
                <section className="bg-card shadow rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-lg font-medium text-foreground">Sessões recentes</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">IP, localização, navegador, dispositivo e usuário (se logado)</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Quando</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">IP</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Localização</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Navegador</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Dispositivo</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Usuário</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Páginas</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Referer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {(!recent_sessions || recent_sessions.length === 0) ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                            Nenhuma sessão registrada. O Tracker coleta dados de visitantes (sessões, paths, referers, dispositivos).
                                        </td>
                                    </tr>
                                ) : (
                                    recent_sessions.map((row) => (
                                        <tr key={row.id} className="hover:bg-muted">
                                            <td className="px-4 py-2 text-sm text-muted-foreground whitespace-nowrap">
                                                {new Date(row.created_at ?? '').toLocaleString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-2 text-sm font-mono text-foreground">{row.client_ip || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-foreground">
                                                {[row.city, row.country].filter(Boolean).join(', ') || row.country_code || '—'}
                                            </td>
                                            <td className="px-4 py-2 text-sm">{row.browser || row.agent_name || '—'}</td>
                                            <td className="px-4 py-2 text-sm">
                                                <span className={`inline-flex px-2 py-0.5 text-xs rounded ${row.is_mobile ? 'bg-success/15 text-success dark:bg-success/25 dark:text-success' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'}`}>
                                                    {row.is_mobile ? 'Mobile' : 'Desktop'}
                                                </span>
                                                {row.platform && <span className="ml-1 text-muted-foreground">{row.platform}</span>}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {row.user ? (
                                                    <span className="inline-flex px-2 py-0.5 text-xs rounded bg-success/15 text-success dark:bg-success/25 dark:text-success" title={row.user.email}>
                                                        {row.user.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">Anônimo</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-right">{row.page_views_count ?? '—'}</td>
                                            <td className="px-4 py-2 text-sm text-muted-foreground max-w-[120px] truncate" title={row.referer_host || ''}>
                                                {row.referer_host || '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
