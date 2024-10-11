import React from 'react';
import classNames from 'classnames';

export default function Header() {

    const className = classNames(
        [
            'text-xl text-center whitespace-nowrap align-baseline font-bold',
            'inline-block leading-none',
            'h-[50vh]',
            'text-sm',
            'text-white',
            'flex',
            'items-center',
            'bg-cover bg-center',
            'header-filters'
        ],
    );

    return (
        <div className="w-full">
            <div className={className} style={{ backgroundImage: `url("/images/tour_bg.webp")` }}>
                <div className='flex justify-center items-center w-full h-full mx-auto px-10 degrade'>
                    <div className="flex flex-col md:flex-row justify-center items-center">
                        <div>
                            <img src="/images/icons/tours.svg" alt="" className='w-16 md:w-24' />
                        </div>
                        <div>
                            <span className='text-3xl md:text-5xl font-extrabold break-words ml-2'>
                                Tours
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}
