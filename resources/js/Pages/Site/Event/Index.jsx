import React, { useState } from 'react';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, useForm } from '@inertiajs/react';
import Header from './Header';
import EventList from './EventsList';
import DataPickerInputStart from '@/Shared/DataPickerInputStart';
import DataPickerInputEnd from '@/Shared/DataPickerInputEnd';
import PrimaryButton from '@/Components/PrimaryButton';

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

    return (
        <SiteLayout>
            <Head title='Eventos' />

            <Header category={category} />

            <div className='flex justify-center flex-col bg-white p-4'>
                {!showFilters && (
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
                            <div className='flex justify-between p-2'>
                                <a href={route('site.events.index')} onClick={limpar}>reset</a>
                                <PrimaryButton>DALE</PrimaryButton>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div>
                <EventList events={events}></EventList>
            </div>
        </SiteLayout>
    );
}
