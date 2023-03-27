import classNames from 'classnames';
import React, { useState } from 'react';
import { Collapse } from 'react-collapse';

export default function NavLinkCollapse({ active = false, text = 'button', iconClassName = null, children }) {
    const [open, setOpen] = useState(active);

    const toggleOpen = () => {
        setOpen(previousState => !previousState);
    };

    return (
        <div>
            <button
                onClick={toggleOpen}
                className={`w-full flex pl-3 pr-4 py-2 border-l-4 justify-between align-middle items-center ${
                    active || open
                        ? 'border-primary text-stone-100 bg-stone-900 focus:outline-none focus:text-white focus:bg-stone-700'
                        : 'border-transparent text-gray-300 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                } text-base font-medium focus:outline-none transition duration-150 ease-in-out`}
            >
                <div>
                    <i className={iconClassName}></i>
                    {text}
                </div>
                <div className="mr-4">
                    <i
                        className={classNames('fa-solid fa-angle-right transition-all duration-500', {
                            'rotate-90 ease-in-out': active || open,
                        })}
                    ></i>
                </div>
            </button>
            <Collapse isOpened={open}>
                <div className="w-full flex items-start pl-3 pr-4 py-2 border-l-4 border-primary text-stone-100 bg-stone-900 focus:outline-none focus:text-white focus:bg-stone-700">
                    {children}
                </div>
                {/* <div className="px-5 py-2 focus:bg-stone-700 border-primary">{children}</div> */}
            </Collapse>
            {/*
            <div
                className={classNames(
                    'max-h-0 flex w-full items-start pl-3 pr-4 py-2 border-l-4 text-stone-100 focus:outline-none focus:text-white focus:bg-stone-700 transition-all duration-200',
                    {
                        'border-primary max-h-auto bg-stone-700 ': open,
                        'bg-stone-100 ': !open,
                    },
                )}
            >
                {open && <div>{children}</div>}
            </div> */}
        </div>
    );
}
