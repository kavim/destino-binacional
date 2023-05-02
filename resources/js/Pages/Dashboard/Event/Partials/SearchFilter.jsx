import React, { useState, useEffect, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import { usePrevious } from 'react-use';
import SelectInput from '@/Shared/SelectInput';
import pickBy from 'lodash/pickBy';

export default () => {
    const { filters, grouped_categories, categories } = usePage().props;
    const [opened, setOpened] = useState(false);

    const [values, setValues] = useState({
        search: filters.search || '',
        category_id: filters.category_id || ''
    });

    const prevValues = usePrevious(values);

    function reset() {
        setValues({
            search: '',
            category_id: ''
        });
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {

            // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
            if (prevValues) {
                const query = Object.keys(pickBy(values)).length
                    ? pickBy(values)
                    : { remember: 'forget' };
                Inertia.get(route(route().current()), query, {
                    replace: true,
                    preserveState: true
                });
            }

        }, 1500)

        return () => clearTimeout(delayDebounceFn)
    }, [values]);

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;

        setValues(values => ({
            ...values,
            [key]: value
        }));

        if (opened) setOpened(false);
    }

    return (
        <div className="flex items-center w-full max-w-md mr-4">
            <div className="relative flex w-full bg-white rounded shadow">
                <div
                    style={{ top: '100%' }}
                    className={`absolute ${opened ? '' : 'hidden'}`}
                >
                    <div
                        onClick={() => setOpened(false)}
                        className="fixed inset-0 z-20 bg-black opacity-25"
                    ></div>
                    <div className="relative z-30 w-64 px-4 py-6 mt-2 bg-white rounded shadow-lg">
                        <select className="select select-bordered w-36"
                            value={values.category_id}
                            name='category_id'
                            onChange={handleChange}
                        >
                            <option defaultValue hidden>Categoría</option>
                            {Object.keys(grouped_categories).map((group, index) => {
                                return (
                                    <optgroup key={index} label={categories[index].name}>
                                        {grouped_categories[group].map((option, index) => {
                                            return (
                                                <option key={index} value={option.id}>
                                                    {option.name}
                                                </option>
                                            );
                                        })}
                                    </optgroup>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => setOpened(true)}
                    className="px-4 border-r rounded-l md:px-6 hover:bg-gray-100 focus:outline-none focus:border-white focus:ring-2 focus:ring-indigo-400 focus:z-10"
                >
                    <div className="flex items-baseline">
                        <span className="hidden text-gray-700 md:inline">Filter</span>
                        <svg
                            className="w-2 h-2 text-gray-700 fill-current md:ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 961.243 599.998"
                        >
                            <path d="M239.998 239.999L0 0h961.243L721.246 240c-131.999 132-240.28 240-240.624 239.999-.345-.001-108.625-108.001-240.624-240z" />
                        </svg>
                    </div>
                </button>
                <input
                    className="relative w-full px-6 py-3 rounded-r focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    autoComplete="off"
                    type="text"
                    name="search"
                    value={values.search}
                    onChange={handleChange}
                    placeholder="Search…"
                />
            </div>
            <button
                onClick={reset}
                className="ml-3 text-sm text-gray-600 hover:text-gray-700 focus:text-indigo-700 focus:outline-none"
                type="button"
            >
                Reset
            </button>
        </div>
    );
};
