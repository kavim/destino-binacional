import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { trans } from '@/utils';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

export default function Filters({ filters }) {
    const [showFilters, setShowFilters] = useState(false);
    const { data, setData, get } = useForm({
        start: filters.start || '',
        end: filters.end || '',
    });

    const formatDateForQuery = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseUrlDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') return null;
        const dateObj = new Date(dateStr.replace(/-/g, '\/'));
        return isNaN(dateObj.getTime()) ? null : dateObj;
    };

    const startDataChange = (date) => {
        if (date) {
            setData('start', formatDateForQuery(date));
        } else {
            setData('start', '');
        }
    };

    const endDataChange = (date) => {
        if (date) {
            setData('end', formatDateForQuery(date));
        } else {
            setData('end', '');
        }
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const submit = e => {
        e.preventDefault();
        setShowFilters(false);

        get(route('site.events.index'), {
            data: data,
            preserveState: true,
            replace: true
        });
    };

    return (
        <div className='flex justify-center flex-col bg-white p-4'>
            <div className='w-full flex justify-end bg-white'>
                <button 
                    type="button"
                    className='inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md text-xs text-white uppercase tracking-widest hover:bg-gray-700 transition ease-in-out duration-150' 
                    onClick={toggleFilters}
                >
                    <i className={`fa-solid ${showFilters ? 'fa-xmark' : 'fa-filter'} mr-2`}></i>
                    {showFilters ? 'Fechar' : 'Filtros'}
                </button>
            </div>


            {showFilters && (
                <div className="mt-4">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1 text-left">
                                De:
                            </label>
                            <DatePicker
                                onChange={startDataChange}
                                value={parseUrlDate(data.start)}
                                clearIcon={data.start ? undefined : null}
                                className="mt-1 block w-full text-stone-800 font-bold kimput"
                                calendarClassName="bg-white border rounded-lg shadow-lg"
                                locale="pt-BR"
                                format="dd/MM/yyyy"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1 text-left">
                                Até:
                            </label>
                            <DatePicker
                                onChange={endDataChange}
                                value={parseUrlDate(data.end)}
                                clearIcon={data.end ? undefined : null}
                                className="mt-1 block w-full text-stone-800 font-bold kimput"
                                calendarClassName="bg-white border rounded-lg shadow-lg"
                                locale="pt-BR"
                                format="dd/MM/yyyy"
                            />
                        </div>

                        <div className='flex justify-end mt-4 mb-6'>
                            <PrimaryButton>{trans('buscar')}</PrimaryButton>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}