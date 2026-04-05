import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Collapsible } from 'collapsible-react-component';
import 'collapsible-react-component/dist/index.css';
import { cn } from '@/lib/utils';
import InputError from '@/Components/InputError';
import MultipleCheckbox from './MultipleCheckbox';

type CategoryCheckHandler = (e: {
    target: { value?: string | number; checked: boolean };
}) => void;

type CategoriesProps = {
    handleCheck: CategoryCheckHandler;
};

export default function Categories({ handleCheck }: CategoriesProps) {
    const { parent_categories, errors: fieldErrors } = usePage().props as unknown as {
        parent_categories: Array<{
            id: number;
            name: string;
            color: string;
            icon: string;
            open?: boolean;
        }>;
        errors: Record<string, string>;
    };
    const [controls, setControls] = useState(parent_categories);

    const toggleControl = (id: number) => {
        setControls(
            controls.map((control) => {
                if (control.id === id) {
                    return { ...control, open: !control.open };
                }
                return control;
            }),
        );
    };

    const isCategoryOpen = (id: number): boolean => {
        const c = controls.find((control) => control.id === id);
        return Boolean(c?.open);
    };

    return (
        <>
            {parent_categories.map((cat) => (
                <div key={cat.id} className="mb-3 rounded-lg border bg-muted shadow-sm">
                    <div
                        className="flex cursor-pointer justify-between px-2 py-1"
                        onClick={() => {
                            toggleControl(cat.id);
                        }}
                    >
                        <div>
                            <div className="flex items-center justify-start">
                                <div
                                    className="rounded-full p-2"
                                    style={{ backgroundColor: cat.color }}
                                >
                                    <img
                                        src={cat.icon}
                                        alt={cat.name}
                                        className="h-5 w-5 rounded-full"
                                    />
                                </div>
                                <span className="ml-3 text-md">{cat.name}</span>
                            </div>
                        </div>
                        <button type="button">
                            <i
                                className={cn(
                                    'fas fa-chevron-down transition duration-250 ease-in-out',
                                    { '-rotate-180': isCategoryOpen(cat.id) },
                                )}
                            />
                        </button>
                    </div>
                    <Collapsible open={isCategoryOpen(cat.id)} revealType="bottomFirst">
                        <div className="mx-4 my-2">
                            <MultipleCheckbox catId={cat.id} handleCheck={handleCheck} />
                        </div>
                    </Collapsible>
                    <InputError
                        message={fieldErrors?.category_ids}
                        className="mt-2"
                    />
                </div>
            ))}
        </>
    );
}
