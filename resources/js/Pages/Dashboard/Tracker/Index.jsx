import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

function BarChart({ data, maxValue, valueLabel, barColor = 'bg-emerald-500 dark:bg-emerald-600' }) {
    const values = Object.values(data).map(Number);
    const max = maxValue || (values.length ? Math.max(...values, 1) : 1);
    const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
    return (
        <div className="space-y-1">
            {entries.map(([label, value]) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                    <span className="w-24 shrink-0 text-gray-600 dark:text-gray-400 truncate">{label}</span>
                    <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                        <div
                            className={`h-full ${barColor} rounded transition-all`}
                            style={{ width: `${Math.min(100, (Number(value) / max) * 100)}%` }}
                        />
                    </div>
                    <span className="w-14 text-right font-medium shrink-0">{valueLabel ? valueLabel(value) : value}</span>
                </div>
            ))}
        </div>
    );
}

function DonutChart({ data, colors = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'] }) {
    const total = Object.values(data).reduce((a, b) => a + Number(b), 0);
    if (total === 0) return <div className="text-sm text-gray-500">Sem dados</div>;
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
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{total.toLocaleString('pt-BR')}</span>
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

export default function TrackerIndex() {
    const { summary, sessions_by_day, views_by_day, top_paths, visitors_by_country, top_browsers, devices_stats, top_referers, recent_sessions, days, error } = usePage().props;

    const changeDays = (d) => {
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
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Tracker (PragmaRX)
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Período:</span>
                        {[7, 14, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => changeDays(d)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${days === d
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden border-l-4 border-emerald-500">
                        <div className="p-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sessões</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {(summary?.total_sessions ?? 0).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden border-l-4 border-teal-500">
                        <div className="p-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Page views</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {(summary?.total_page_views ?? 0).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden border-l-4 border-cyan-500">
                        <div className="p-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Páginas/sessão (média)</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {summary?.avg_pages_per_session ?? '—'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Gráficos por dia */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sessões por dia</h3>
                        </div>
                        <div className="p-6">
                            {Object.keys(sessions_by_day || {}).length > 0 ? (
                                <BarChart data={sessions_by_day} valueLabel={(v) => Number(v).toLocaleString('pt-BR')} barColor="bg-emerald-500 dark:bg-emerald-600" />
                            ) : (
                                <p className="text-gray-500 text-sm">Nenhum dado no período</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Page views por dia</h3>
                        </div>
                        <div className="p-6">
                            {Object.keys(views_by_day || {}).length > 0 ? (
                                <BarChart data={views_by_day} valueLabel={(v) => Number(v).toLocaleString('pt-BR')} barColor="bg-teal-500 dark:bg-teal-600" />
                            ) : (
                                <p className="text-gray-500 text-sm">Nenhum dado no período</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Páginas mais visitadas e Visitantes por país */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Páginas mais visitadas</h3>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Página</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Views</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {(!top_paths || top_paths.length === 0) ? (
                                        <tr><td colSpan={2} className="px-4 py-4 text-center text-gray-500">Nenhum dado</td></tr>
                                    ) : (
                                        top_paths.map((row) => (
                                            <tr key={row.path}>
                                                <td className="px-4 py-2 text-sm font-mono text-gray-900 dark:text-gray-100 truncate max-w-xs" title={row.path}>{row.path}</td>
                                                <td className="px-4 py-2 text-sm text-right">{row.views.toLocaleString('pt-BR')}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Visitantes por país</h3>
                        </div>
                        <div className="p-6">
                            {visitors_by_country?.length > 0 ? (
                                <BarChart
                                    data={Object.fromEntries(visitors_by_country.map((r) => [r.country || r.country_code || '?', r.total]))}
                                    valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                    barColor="bg-cyan-500 dark:bg-cyan-600"
                                />
                            ) : (
                                <p className="text-gray-500 text-sm">Nenhum dado de geolocalização</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Navegadores e Dispositivos */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Navegadores</h3>
                        </div>
                        <div className="p-6">
                            {top_browsers?.length > 0 ? (
                                <BarChart
                                    data={Object.fromEntries(top_browsers.map((r) => [r.browser || 'Desconhecido', r.total]))}
                                    valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                    barColor="bg-sky-500 dark:bg-sky-600"
                                />
                            ) : (
                                <p className="text-gray-500 text-sm">Nenhum dado</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Mobile vs Desktop</h3>
                        </div>
                        <div className="p-6">
                            <DonutChart data={devicesData} colors={['#10b981', '#14b8a6']} />
                        </div>
                    </div>
                </section>

                {/* Top referers */}
                {top_referers?.length > 0 && (
                    <section className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Principais origens (Referers)</h3>
                        </div>
                        <div className="p-6">
                            <BarChart
                                data={Object.fromEntries(top_referers.map((r) => [r.host || '(direto)', r.total]))}
                                valueLabel={(v) => Number(v).toLocaleString('pt-BR')}
                                barColor="bg-violet-500 dark:bg-violet-600"
                            />
                        </div>
                    </section>
                )}

                {/* Sessões recentes */}
                <section className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sessões recentes</h3>
                        <p className="text-sm text-gray-500 mt-0.5">IP, localização, navegador, dispositivo e usuário (se logado)</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quando</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">IP</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Localização</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Navegador</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dispositivo</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Usuário</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Páginas</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Referer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {(!recent_sessions || recent_sessions.length === 0) ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                            Nenhuma sessão registrada. O Tracker coleta dados de visitantes (sessões, paths, referers, dispositivos).
                                        </td>
                                    </tr>
                                ) : (
                                    recent_sessions.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                {new Date(row.created_at).toLocaleString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-2 text-sm font-mono text-gray-700 dark:text-gray-300">{row.client_ip || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                {[row.city, row.country].filter(Boolean).join(', ') || row.country_code || '—'}
                                            </td>
                                            <td className="px-4 py-2 text-sm">{row.browser || row.agent_name || '—'}</td>
                                            <td className="px-4 py-2 text-sm">
                                                <span className={`inline-flex px-2 py-0.5 text-xs rounded ${row.is_mobile ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                                    {row.is_mobile ? 'Mobile' : 'Desktop'}
                                                </span>
                                                {row.platform && <span className="ml-1 text-gray-500">{row.platform}</span>}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {row.user ? (
                                                    <span className="inline-flex px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" title={row.user.email}>
                                                        {row.user.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Anônimo</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-right">{row.page_views_count ?? '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 max-w-[120px] truncate" title={row.referer_host || ''}>
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
