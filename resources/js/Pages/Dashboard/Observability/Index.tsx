import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

function BarChart({ data, maxValue, labelKey = 'date', valueKey = 'total', valueLabel }) {
    const max = maxValue || Math.max(...Object.values(data).map(Number), 1);
    const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
    return (
        <div className="space-y-1">
            {entries.map(([label, value]) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                    <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
                    <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 dark:bg-indigo-600 rounded"
                            style={{ width: `${Math.min(100, (Number(value) / max) * 100)}%` }}
                        />
                    </div>
                    <span className="w-12 text-right font-medium">{valueLabel ? valueLabel(value) : value}</span>
                </div>
            ))}
        </div>
    );
}

export default function ObservabilityIndex() {
    const { traffic, errors, performance, days, log_viewer_url } = usePage().props;

    const changeDays = (d) => {
        router.get(route('observability.index'), { days: d }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">
                        Observabilidade
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Período:</span>
                        {[7, 14, 30].map((d) => (
                            <button
                                key={d}
                                onClick={() => changeDays(d)}
                                className={`px-3 py-1 rounded text-sm ${days === d
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {d} dias
                            </button>
                        ))}
                        <a
                            href={log_viewer_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 px-3 py-1 rounded text-sm bg-amber-600 text-white hover:bg-amber-700"
                        >
                            Ver logs (Laravel)
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Observabilidade" />
            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                {/* Tráfego */}
                <section className="bg-card shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-lg font-medium text-foreground">Tráfego</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Total de visualizações</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {traffic.total_views.toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Visitantes únicos (estimativa por IP)</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {traffic.unique_visitors_estimate.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>
                        {Object.keys(traffic.views_by_day).length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-medium text-foreground mb-2">Visualizações por dia</p>
                                <BarChart
                                    data={traffic.views_by_day}
                                    valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-foreground mb-2">Páginas mais visitadas</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Página</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Visualizações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {traffic.top_pages.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="px-4 py-4 text-center text-muted-foreground">Nenhum dado no período</td>
                                            </tr>
                                        ) : (
                                            traffic.top_pages.map((row) => (
                                                <tr key={row.path}>
                                                    <td className="px-4 py-2 text-sm text-foreground font-mono">{row.path}</td>
                                                    <td className="px-4 py-2 text-sm text-right">{row.views.toLocaleString('pt-BR')}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Visitantes por país */}
                        {traffic.visitors_by_country?.length > 0 && (
                            <div className="mt-6">
                                <p className="text-sm font-medium text-foreground mb-2">Visitantes por país</p>
                                <BarChart
                                    data={Object.fromEntries(traffic.visitors_by_country.map((r) => [r.country || r.country_code || '?', r.total]))}
                                    valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                />
                            </div>
                        )}

                        {/* Visitas recentes com detalhes do visitante */}
                        <div className="mt-6">
                            <p className="text-sm font-medium text-foreground mb-2">Visitas recentes (IP, localização, usuário, etc.)</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Quando</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Página</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">IP</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Localização</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Usuário</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Referer</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">User-Agent</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {(!traffic.recent_visits || traffic.recent_visits.length === 0) ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-4 text-center text-muted-foreground">Nenhuma visita registrada ainda. As novas visitas aparecerão aqui com IP, localização e se o usuário está logado.</td>
                                            </tr>
                                        ) : (
                                            traffic.recent_visits.map((row) => (
                                                <tr key={row.id}>
                                                    <td className="px-4 py-2 text-sm text-muted-foreground whitespace-nowrap">
                                                        {new Date(row.viewed_at).toLocaleString('pt-BR')}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-foreground font-mono max-w-xs truncate" title={row.path}>{row.path}</td>
                                                    <td className="px-4 py-2 text-sm font-mono text-foreground">{row.ip || '—'}</td>
                                                    <td className="px-4 py-2 text-sm text-foreground">
                                                        {[row.city, row.region, row.country].filter(Boolean).join(', ') || row.timezone || '—'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {row.user ? (
                                                            <span className="inline-flex px-2 py-0.5 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" title={row.user.email}>
                                                                {row.user.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground">Anônimo</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-muted-foreground max-w-[200px] truncate" title={row.referer || ''}>
                                                        {row.referer ? (() => { try { return new URL(row.referer).hostname; } catch { return row.referer.slice(0, 40); } })() : '—'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-muted-foreground max-w-[180px] truncate font-mono text-xs" title={row.user_agent || ''}>
                                                        {row.user_agent ? row.user_agent.slice(0, 50) + (row.user_agent.length > 50 ? '…' : '') : '—'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Performance */}
                <section className="bg-card shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-lg font-medium text-foreground">Performance</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Tempo médio de resposta</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {performance.avg_duration_ms != null ? `${performance.avg_duration_ms} ms` : '—'}
                                </p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Memória média</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {performance.avg_memory_mb != null ? `${performance.avg_memory_mb} MB` : '—'}
                                </p>
                            </div>
                        </div>
                        {Object.keys(performance.by_day).length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-medium text-foreground mb-2">Tempo médio por dia (ms)</p>
                                <BarChart data={performance.by_day} valueLabel={(v) => `${v} ms`} />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-foreground mb-2">Rotas mais lentas (média)</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Rota</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Média (ms)</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Máx (ms)</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">Requisições</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {performance.slowest_routes.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">Nenhum dado no período</td>
                                            </tr>
                                        ) : (
                                            performance.slowest_routes.map((row) => (
                                                <tr key={`${row.path}-${row.route_name}`}>
                                                    <td className="px-4 py-2 text-sm text-foreground font-mono">{row.path}</td>
                                                    <td className="px-4 py-2 text-sm text-right">{Math.round(row.avg_ms)}</td>
                                                    <td className="px-4 py-2 text-sm text-right">{row.max_ms}</td>
                                                    <td className="px-4 py-2 text-sm text-right">{row.requests}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Erros */}
                <section className="bg-card shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-lg font-medium text-foreground">Erros</h3>
                    </div>
                    <div className="p-6">
                        {errors.by_source.length > 0 && (
                            <div className="flex gap-4 mb-6">
                                {errors.by_source.map((row) => (
                                    <div key={row.source} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <span className="text-sm text-muted-foreground">{row.source}</span>
                                        <span className="ml-2 font-semibold text-red-700 dark:text-red-300">{row.total}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-sm font-medium text-foreground mb-2">Últimos erros registrados</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Quando</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Origem</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Mensagem</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">URL / Arquivo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {errors.recent.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">Nenhum erro registrado</td>
                                        </tr>
                                    ) : (
                                        errors.recent.map((row) => (
                                            <tr key={row.id}>
                                                <td className="px-4 py-2 text-sm text-muted-foreground whitespace-nowrap">
                                                    {new Date(row.created_at).toLocaleString('pt-BR')}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`inline-flex px-2 py-0.5 text-xs rounded ${row.source === 'frontend' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-muted text-foreground'}`}>
                                                        {row.source}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-foreground max-w-md truncate" title={row.message}>
                                                    {row.message}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-muted-foreground max-w-xs truncate" title={row.url || row.file || ''}>
                                                    {row.url || row.file || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
