import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import MultipleCheckbox from './MultipleCheckbox';
import { Collapsible } from 'collapsible-react-component'
import 'collapsible-react-component/dist/index.css'
import classNames from 'classnames';
import InputError from '@/Components/InputError';

export default function Tags({ handleCheck }) {

    const { parent_tags, errors } = usePage().props;
    const [controls, setControls] = useState(parent_tags);

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
            {Object.keys(parent_tags).map((tag, index) => {
                return (
                    <div key={index} className='bg-gray-100 p-3 rounded-lg mb-3 border shadow-sm'>
                        <div className='flex justify-between cursor-pointer' onClick={() => {
                            toggleControl(parent_tags[index]['id']);
                        }}>
                            <span className='text-md font-bold'>{parent_tags[index]['name']}</span>
                            <button
                                type='button'
                            >
                                <i className={classNames(['fas fa-chevron-down transition ease-in-out duration-250'], { '-rotate-180': isOpen(parent_tags[index]['id']) })} ></i>
                            </button>
                        </div>
                        <Collapsible
                            open={isOpen(parent_tags[index]['id'])}
                            revealType='bottomFirst'
                        >
                            <div className='my-2'>
                                <MultipleCheckbox tagId={parent_tags[index]['id']} handleCheck={handleCheck} />
                            </div>
                        </Collapsible>
                        <InputError message={errors.tag_ids} className="mt-2" />
                    </div>
                );
            })}
        </>
    );
}