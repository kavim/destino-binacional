import React, { useState } from 'react';
import { router } from '@inertiajs/react'
import { usePage } from '@inertiajs/react';
import { usePrevious } from 'react-use';
import pickBy from 'lodash/pickBy';
import { cn } from '@/lib/utils';

export default function PlaceSearchFilter() {
    const { filters, grouped_categories, categories } = usePage().props as unknown as {
        filters: { search?: string; category_id?: string; sub_category_id?: string };
        grouped_categories: Record<string, Array<{ id: string | number; name: string }>>;
        categories: Array<{ id: string | number; name: string }>;
    };
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState({
        search: filters.search || '',
        category_id: filters.category_id || '',
        sub_category_id: filters.sub_category_id || ''
    });

    const hasSomeFilter = Object.keys(pickBy(values)).length > 0;

    const prevValues = usePrevious(values);

    function reset() {
        setValues({
            search: '',
            category_id: '',
            sub_category_id: ''
        });

        router.get(route(route().current()));
    }

    const doTheSearch = () => {
        setLoading(true);

        const delayDebounceFn = setTimeout(() => {
            // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
            if (prevValues) {
                const query = Object.keys(pickBy(values)).length
                    ? pickBy(values)
                    : { remember: 'forget' };
                router.get(route(route().current()), query, {
                    replace: true,
                    preserveState: true
                });

                setLoading(false);
            }

        }, 200)

        return () => clearTimeout(delayDebounceFn)
    }

    function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
        const key = e.target.name;
        const value = e.target.value;

        setValues(values => ({
            ...values,
            [key]: value
        }));

        if (opened) setOpened(false);
    }

    return (
        <div>
            <div className="form-control flex row flex-row">
                <div className="flex gap-2">
                    <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-36"
                        value={values.category_id}
                        name='category_id'
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>
                            Categoría
                        </option>
                        <option value={''}>Todas</option>
                        {categories.map((cat, index) => {
                            return (
                                <option key={index} value={cat.id}>
                                    {cat.name}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className={
                            cn(
                                [
                                    'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm inline trasnsition-all ease-in-out duration-300'
                                ],
                                {
                                    'w-0 p-0 m-0': !values.category_id,
                                    'w-32': values.category_id,
                                }
                            )
                        }
                        value={values.sub_category_id}
                        name='sub_category_id'
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>
                            SubCategoría
                        </option>
                        <option value={''}>Todas</option>

                        {values.category_id && (
                            <>
                                {
                                    grouped_categories[values.category_id]?.map((option, index) => {
                                        return (
                                            <option key={index} value={option.id}>
                                                {option.name}
                                            </option>
                                        );
                                    })
                                }
                            </>
                        )}
                    </select>

                    <input onChange={handleChange} name='search' type="text" placeholder="Buscar..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />

                    <button type='button' onClick={doTheSearch} className={
                        cn(
                            [
                                'inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground ease-in-out transition-all'
                            ],
                            {
                                'loading ease-in-out transition-all': loading,
                            }
                        )
                    }>
                        {loading ? '' : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                    </button>
                </div>
                {hasSomeFilter && (
                    <button type='button' onClick={reset} className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg> </button>
                )}
            </div>
        </div >


    );
}
