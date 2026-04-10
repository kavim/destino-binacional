import React, { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { trans } from '@/utils';
import { cn } from '@/lib/utils';
import DatePicker from 'react-date-picker';
import type { DatePickerValue } from '@/lib/datePickerValue';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { datePickerValueToDate } from '@/lib/datePickerValue';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { CalendarRange, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';

export type EventFiltersState = { start?: string; end?: string; search?: string };

export type NormalizedEventFilters = { start: string; end: string; search: string };

/** Carbon/Inertia enviam ISO; inputs e query usam YYYY-MM-DD. */
function normalizeEventFilters(f?: EventFiltersState): NormalizedEventFilters {
    const date = (v: unknown) => {
        if (v == null || v === '') return '';
        if (typeof v !== 'string') return '';
        const m = v.match(/^(\d{4}-\d{2}-\d{2})/);
        return m ? m[1] : '';
    };
    const searchRaw = f?.search;
    return {
        start: date(f?.start),
        end: date(f?.end),
        search: typeof searchRaw === 'string' ? searchRaw : '',
    };
}

function hasActiveFilters(n: NormalizedEventFilters): boolean {
    return Boolean(n.start || n.end || n.search.trim());
}

function formatChipDate(ymd: string): string {
    const d = dayjs(ymd);
    return d.isValid() ? d.locale('pt-br').format('D MMM YYYY') : ymd;
}

const visitOpts = {
    preserveState: true,
    preserveScroll: true,
    replace: true as const,
    only: ['events', 'filters'] as const,
};

export default function Filters({ filters }: { filters?: EventFiltersState }) {
    dayjs.locale('pt-br');

    const committed = useMemo(() => normalizeEventFilters(filters), [filters]);

    const [showFilters, setShowFilters] = useState(() => hasActiveFilters(normalizeEventFilters(filters)));
    const [draft, setDraft] = useState<NormalizedEventFilters>(() => normalizeEventFilters(filters));

    const togglePanel = () => {
        setShowFilters((open) => {
            if (open) {
                setDraft(committed);
            }
            return !open;
        });
    };

    const formatDateForQuery = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const parseYmdToDate = (ymd: string) => {
        if (!ymd) return null;
        const dateObj = new Date(ymd.replace(/-/g, '/'));
        return isNaN(dateObj.getTime()) ? null : dateObj;
    };

    const startDataChange = (value: DatePickerValue) => {
        const date = datePickerValueToDate(value);
        setDraft((prev) => ({
            ...prev,
            start: date ? formatDateForQuery(date) : '',
        }));
    };

    const endDataChange = (value: DatePickerValue) => {
        const date = datePickerValueToDate(value);
        setDraft((prev) => ({
            ...prev,
            end: date ? formatDateForQuery(date) : '',
        }));
    };

    const applyFilters = () => {
        setShowFilters(false);
        const q: Record<string, string> = {};
        if (draft.start) q.start = draft.start;
        if (draft.end) q.end = draft.end;
        const s = draft.search.trim();
        if (s) q.search = s;
        router.get(route('site.events.index'), q, visitOpts);
    };

    const clearFilters = () => {
        setShowFilters(false);
        router.get(route('site.events.index'), {}, visitOpts);
    };

    const chipRange = Boolean(committed.start || committed.end);
    const chipSearch = Boolean(committed.search.trim());

    return (
        <div
            className={cn(
                'overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-md shadow-black/[0.04] backdrop-blur-md dark:border-border dark:bg-card/90 dark:shadow-black/20',
                showFilters && 'ring-2 ring-primary/25',
            )}
        >
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-5">
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span className="text-sm font-semibold text-foreground">Período dos eventos</span>
                    </div>
                    {chipRange || chipSearch ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {chipSearch ? (
                                <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                                    <Search className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                                    <span className="truncate" title={committed.search}>
                                        “{committed.search.trim()}”
                                    </span>
                                </span>
                            ) : null}
                            {chipRange ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    <CalendarRange className="h-3.5 w-3.5" aria-hidden />
                                    {committed.start ? formatChipDate(committed.start) : '…'}
                                    {committed.end ? (
                                        <>
                                            <span className="text-primary/60">→</span>
                                            {formatChipDate(committed.end)}
                                        </>
                                    ) : null}
                                </span>
                            ) : null}
                        </div>
                    ) : (
                        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                            A lista mostra eventos que ainda não terminaram. Abra{' '}
                            <strong className="font-medium text-foreground">Filtros</strong> para
                            buscar por título ou limitar o período.
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    aria-expanded={showFilters}
                    aria-controls="event-date-filters-panel"
                    className={cn(
                        'inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto sm:min-w-[10.5rem]',
                    )}
                    onClick={togglePanel}
                >
                    <span className="sm:hidden">Datas</span>
                    <span className="hidden sm:inline">{showFilters ? 'Fechar' : 'Filtros'}</span>
                    <ChevronDown
                        className={cn('h-4 w-4 transition-transform duration-200', showFilters && 'rotate-180')}
                        aria-hidden
                    />
                </button>
            </div>

            <div
                id="event-date-filters-panel"
                className={cn(
                    'border-t border-border/60 bg-muted/20 transition-all duration-200 dark:bg-muted/10',
                    showFilters ? 'max-h-[880px] opacity-100' : 'max-h-0 overflow-hidden border-t-0 opacity-0',
                )}
            >
                {showFilters ? (
                    <div className="space-y-5 p-4 sm:p-5">
                        <div>
                            <label
                                className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                htmlFor="event-search-public"
                            >
                                <Search className="h-3.5 w-3.5" aria-hidden />
                                Título do evento (opcional)
                            </label>
                            <input
                                id="event-search-public"
                                type="search"
                                value={draft.search}
                                onChange={(e) => setDraft((p) => ({ ...p, search: e.target.value }))}
                                placeholder="Deixe em branco para listar todos no período"
                                autoComplete="off"
                                className="mt-1 flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    className="mb-2 block text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                    htmlFor="event-filter-start"
                                >
                                    De
                                </label>
                                <DatePicker
                                    id="event-filter-start"
                                    onChange={startDataChange}
                                    value={parseYmdToDate(draft.start)}
                                    clearIcon={draft.start ? undefined : null}
                                    className="kimput mt-1 block w-full font-semibold text-foreground"
                                    calendarClassName="rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                                    locale="pt-BR"
                                    format="dd/MM/yyyy"
                                    portalContainer={
                                        typeof document !== 'undefined' ? document.body : null
                                    }
                                />
                            </div>
                            <div>
                                <label
                                    className="mb-2 block text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                    htmlFor="event-filter-end"
                                >
                                    Até
                                </label>
                                <DatePicker
                                    id="event-filter-end"
                                    onChange={endDataChange}
                                    value={parseYmdToDate(draft.end)}
                                    clearIcon={draft.end ? undefined : null}
                                    className="kimput mt-1 block w-full font-semibold text-foreground"
                                    calendarClassName="rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                                    locale="pt-BR"
                                    format="dd/MM/yyyy"
                                    portalContainer={
                                        typeof document !== 'undefined' ? document.body : null
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="button"
                                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                onClick={clearFilters}
                            >
                                Limpar filtros
                            </button>
                            <PrimaryButton
                                type="button"
                                className="min-h-11 w-full sm:w-auto sm:px-8"
                                onClick={applyFilters}
                            >
                                {trans('buscar')}
                            </PrimaryButton>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
