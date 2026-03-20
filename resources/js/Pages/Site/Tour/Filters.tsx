import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { trans } from '@/utils';
import DatePicker from 'react-date-picker'

export default function Filters({ filters }) {
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, errors, get, reset, processing, recentlySuccessful } = useForm({
        start: filters.start ? filters.start : '',
        end: filters.end ? filters.end : '',
    });

    const handleOnChange = event => {
        setData(event.target.name, event.target.value);
    };

    const submit = e => {
        e.preventDefault();
        get(route('site.events.index'), { onSuccess: () => reset() });
    };

    const limpar = () => {
        console.log('limpo!');
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const startDataChange = (date) => {
        let a = new Date(date);
        setData('start', a);

        console.log("start " + data.start);
    }

    const endDataChange = (date) => {
        let a = new Date(date);
        setData('end', a);

        console.log("a " + a);
        console.log("end " + data.end);
    }

    return (
        <div className='flex flex-col justify-center rounded-lg border border-border bg-card p-4 shadow-sm' >
            {
                showFilters ? (
                    <div>
                        <form onSubmit={submit}>
                            <div className="">
                                <DatePicker
                                    onChange={startDataChange}
                                    value={data.start}
                                    className="mt-2 block w-full font-semibold text-foreground kimput"
                                    calendarClassName="rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                                    locale="pt-BR"
                                />
                            </div>

                            <div className="">
                                <DatePicker
                                    onChange={endDataChange}
                                    value={data.end}
                                    className="mt-2 block w-full font-semibold text-foreground kimput"
                                    calendarClassName="rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                                    locale="pt-BR"
                                />
                            </div>
                            <div className='flex justify-between mt-4 mb-6'>
                                <a className='border border-border inline-flex items-center px-4 py-2 rounded-md text-xs uppercase tracking-widest' href={route('site.events.index')} onClick={limpar}>reset</a>
                                <PrimaryButton>{trans('buscar')}</PrimaryButton>
                            </div>
                        </form>
                    </div >
                ) : (
                    <div className='w-full flex justify-end bg-card'>
                        <button type="button" className='inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background' onClick={toggleFilters}>
                            <i className="fa-solid fa-filter mr-2"></i> Filtros
                        </button>
                    </div>
                )
            }
        </div >
    );
}
