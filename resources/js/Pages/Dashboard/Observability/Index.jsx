import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

function BarChart({ data, maxValue, labelKey = 'date', valueKey = 'total', valueLabel }) {
    const max = maxValue || Math.max(...Object.values(data).map(Number), 1);
    const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
    return (
        <div className="space-y-1">
            {entries.map(([label, value]) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                    <span className="w-24 shrink-0 text-gray-600 dark:text-gray-400">{label}</span>
                    <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
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
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Observabilidade
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Período:</span>
                        {[7, 14, 30].map((d) => (
                            <button
                                key={d}
                                onClick={() => changeDays(d)}
                                className={`px-3 py-1 rounded text-sm ${days === d
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
                <section className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Tráfego</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total de visualizações</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                    {traffic.total_views.toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Visitantes únicos (estimativa por IP)</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                    {traffic.unique_visitors_estimate.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>
                        {Object.keys(traffic.views_by_day).length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visualizações por dia</p>
                                <BarChart
                                    data={traffic.views_by_day}
                                    valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Páginas mais visitadas</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Página</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Visualizações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {traffic.top_pages.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="px-4 py-4 text-center text-gray-500">Nenhum dado no período</td>
                                            </tr>
                                        ) : (
                                            traffic.top_pages.map((row) => (
                                                <tr key={row.path}>
                                                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono">{row.path}</td>
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
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visitantes por país</p>
                                <BarChart
                                    data={Object.fromEntries(traffic.visitors_by_country.map((r) => [r.country || r.country_code || '?', r.total]))}
                                    valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                />
                            </div>
                        )}

                        {/* Visitas recentes com detalhes do visitante */}
                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visitas recentes (IP, localização, usuário, etc.)</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quando</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Página</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">IP</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Localização</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Usuário</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Referer</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User-Agent</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {(!traffic.recent_visits || traffic.recent_visits.length === 0) ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">Nenhuma visita registrada ainda. As novas visitas aparecerão aqui com IP, localização e se o usuário está logado.</td>
                                            </tr>
                                        ) : (
                                            traffic.recent_visits.map((row) => (
                                                <tr key={row.id}>
                                                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                        {new Date(row.viewed_at).toLocaleString('pt-BR')}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono max-w-xs truncate" title={row.path}>{row.path}</td>
                                                    <td className="px-4 py-2 text-sm font-mono text-gray-700 dark:text-gray-300">{row.ip || '—'}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                        {[row.city, row.region, row.country].filter(Boolean).join(', ') || row.timezone || '—'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {row.user ? (
                                                            <span className="inline-flex px-2 py-0.5 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" title={row.user.email}>
                                                                {row.user.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">Anônimo</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title={row.referer || ''}>
                                                        {row.referer ? (() => { try { return new URL(row.referer).hostname; } catch { return row.referer.slice(0, 40); } })() : '—'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 max-w-[180px] truncate font-mono text-xs" title={row.user_agent || ''}>
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
                <section className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Performance</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tempo médio de resposta</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                    {performance.avg_duration_ms != null ? `${performance.avg_duration_ms} ms` : '—'}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Memória média</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                    {performance.avg_memory_mb != null ? `${performance.avg_memory_mb} MB` : '—'}
                                </p>
                            </div>
                        </div>
                        {Object.keys(performance.by_day).length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tempo médio por dia (ms)</p>
                                <BarChart data={performance.by_day} valueLabel={(v) => `${v} ms`} />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rotas mais lentas (média)</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rota</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Média (ms)</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Máx (ms)</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Requisições</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {performance.slowest_routes.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">Nenhum dado no período</td>
                                            </tr>
                                        ) : (
                                            performance.slowest_routes.map((row) => (
                                                <tr key={`${row.path}-${row.route_name}`}>
                                                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono">{row.path}</td>
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
                <section className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Erros</h3>
                    </div>
                    <div className="p-6">
                        {errors.by_source.length > 0 && (
                            <div className="flex gap-4 mb-6">
                                {errors.by_source.map((row) => (
                                    <div key={row.source} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{row.source}</span>
                                        <span className="ml-2 font-semibold text-red-700 dark:text-red-300">{row.total}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Últimos erros registrados</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quando</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Origem</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mensagem</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">URL / Arquivo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {errors.recent.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-4 text-center text-gray-500">Nenhum erro registrado</td>
                                        </tr>
                                    ) : (
                                        errors.recent.map((row) => (
                                            <tr key={row.id}>
                                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                    {new Date(row.created_at).toLocaleString('pt-BR')}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`inline-flex px-2 py-0.5 text-xs rounded ${row.source === 'frontend' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                        {row.source}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 max-w-md truncate" title={row.message}>
                                                    {row.message}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={row.url || row.file || ''}>
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
