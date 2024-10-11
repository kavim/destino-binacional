import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Collapsible } from 'collapsible-react-component'
import 'collapsible-react-component/dist/index.css'
import classNames from 'classnames';
import InputError from '@/Components/InputError';
import MultipleCheckbox from './MultipleCheckbox';

export default function Categories({ handleCheck }) {

    const { parent_categories, errors } = usePage().props;
    const [controls, setControls] = useState(parent_categories);

    const toggleControl = (id) => {
        setControls(controls.map(control => {
            if (control.id === id) {
                control.open = !control.open;
            }
            return control;
        }));
    }

    const isOpen = (id) => {
        let isOpen = false;
        controls.map(control => {
            if (control.id === id) {
                isOpen = control.open;
            }
        });
        return isOpen;
    }

    return (
        <>
            {parent_categories.map((cat, index) => {
                return (
                    <div key={index}>
                        <div className='bg-gray-100 rounded-lg mb-3 border shadow-sm'>
                            <div className='flex px-2 py-1 justify-between cursor-pointer' onClick={() => {
                                toggleControl(cat.id);
                            }}>
                                <div>
                                    <div className='flex justify-start items-center'>
                                        <div className='p-2 rounded-full' style={{ backgroundColor: cat.color }}>
                                            <img src={cat.icon} alt={cat.name} className="w-5 h-5 rounded-full" />
                                        </div>
                                        <span className='ml-3 text-md' >{cat.name}</span>
                                    </div>
                                </div>
                                <button
                                    type='button'
                                >
                                    <i className={classNames(['fas fa-chevron-down transition ease-in-out duration-250'], { '-rotate-180': isOpen(cat.id) })} ></i>
                                </button>
                            </div>
                            <Collapsible
                                open={isOpen(cat.id)}
                                revealType='bottomFirst'
                            >
                                <div className='my-2 mx-4'>
                                    <MultipleCheckbox catId={cat.id} handleCheck={handleCheck} />
                                </div>
                            </Collapsible>
                            <InputError message={errors.tag_ids} className="mt-2" />
                        </div>
                    </div>
                )
            })
            }
        </>
    );
}
