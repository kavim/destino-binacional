import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { trans } from '@/utils';
import DatePicker from 'react-date-picker';
import type { DatePickerValue } from '@/lib/datePickerValue';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { datePickerValueToDate } from '@/lib/datePickerValue';

export type EventFiltersState = { start?: string; end?: string };

export default function Filters({ filters }: { filters?: EventFiltersState }) {
    const [showFilters, setShowFilters] = useState(false);
    const { data, setData, get } = useForm({
        start: filters?.start || '',
        end: filters?.end || '',
    });

    const formatDateForQuery = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseUrlDate = (dateStr: unknown) => {
        if (!dateStr || typeof dateStr !== 'string') return null;
        const dateObj = new Date(dateStr.replace(/-/g, '/'));
        return isNaN(dateObj.getTime()) ? null : dateObj;
    };

    const startDataChange = (value: DatePickerValue) => {
        const date = datePickerValueToDate(value);
        if (date) {
            setData('start', formatDateForQuery(date));
        } else {
            setData('start', '');
        }
    };

    const endDataChange = (value: DatePickerValue) => {
        const date = datePickerValueToDate(value);
        if (date) {
            setData('end', formatDateForQuery(date));
        } else {
            setData('end', '');
        }
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const limpar = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setData({ start: '', end: '' });
        get(route('site.events.index'), {
            data: { start: '', end: '' },
            preserveState: true,
            replace: true,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowFilters(false);

        get(route('site.events.index'), {
            data: data,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="flex flex-col justify-center rounded-xl border border-border bg-card p-4 shadow-sm dark:shadow-black/20">
            <div className="flex w-full justify-end bg-card">
                <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground transition duration-150 ease-in-out hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:bg-primary/80"
                    onClick={toggleFilters}
                >
                    <i
                        className={`fa-solid ${showFilters ? 'fa-xmark' : 'fa-filter'} mr-2`}
                    />
                    {showFilters ? 'Fechar' : 'Filtros'}
                </button>
            </div>

            {showFilters && (
                <div className="mt-4">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="mb-1 block text-left text-xs font-semibold uppercase text-muted-foreground">
                                De:
                            </label>
                            <DatePicker
                                onChange={startDataChange}
                                value={parseUrlDate(data.start)}
                                clearIcon={data.start ? undefined : null}
                                className="kimput mt-2 block w-full font-semibold text-foreground"
                                calendarClassName="rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                                locale="pt-BR"
                                format="dd/MM/yyyy"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="mb-1 block text-left text-xs font-semibold uppercase text-muted-foreground">
                                Até:
                            </label>
                            <DatePicker
                                onChange={endDataChange}
                                value={parseUrlDate(data.end)}
                                clearIcon={data.end ? undefined : null}
                                className="kimput mt-2 block w-full font-semibold text-foreground"
                                calendarClassName="rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                                locale="pt-BR"
                                format="dd/MM/yyyy"
                            />
                        </div>

                        <div className="mb-6 mt-4 flex justify-between">
                            <a
                                className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-muted/60"
                                href={route('site.events.index')}
                                onClick={limpar}
                            >
                                reset
                            </a>
                            <PrimaryButton>{trans('buscar')}</PrimaryButton>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
