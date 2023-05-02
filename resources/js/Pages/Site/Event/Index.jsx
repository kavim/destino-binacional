import React, { useState } from 'react';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, useForm } from '@inertiajs/react';
import Header from './Header';
import EventList from './EventsList';
import DataPickerInputStart from '@/Shared/DataPickerInputStart';
import DataPickerInputEnd from '@/Shared/DataPickerInputEnd';
import PrimaryButton from '@/Components/PrimaryButton';
import { trans } from '@/utils';

export default function Index({ filters, events, category }) {

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
        console.log('limpar');
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <SiteLayout>
            <Head title='Eventos' />

            <Header category={category} />

            <div className='flex justify-center flex-col bg-white p-4'>

                {showFilters ? (
                    <div>
                        <form onSubmit={submit}>
                            <div className="">
                                <DataPickerInputStart
                                    start={data.start}
                                    handleOnChange={handleOnChange}
                                    className="block w-full text-stone-800 font-bold"
                                    placeholder="Desde"
                                />
                            </div>

                            <div className="">
                                <DataPickerInputEnd
                                    end={data.end}
                                    handleOnChange={handleOnChange}
                                    className="mt-2 block w-full text-stone-800 font-bold"
                                    placeholder="Hasta"
                                />
                            </div>
                            <div className='flex justify-between mt-4 mb-6'>
                                <a className='border border-gray-800 inline-flex items-center px-4 py-2 rounded-md text-xs uppercase tracking-widest' href={route('site.events.index')} onClick={limpar}>reset</a>
                                <PrimaryButton>{trans('buscar')}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className='w-full flex justify-end bg-white'>
                        <button className='inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150' onClick={toggleFilters}>
                            <i className="fa-solid fa-filter mr-2"></i> Filtros
                        </button>
                    </div>
                )}
            </div>

            <div>
                <EventList events={events}></EventList>
            </div>
        </SiteLayout>
    );
}
