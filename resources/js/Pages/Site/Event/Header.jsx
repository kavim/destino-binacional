import React from 'react';
import classNames from 'classnames';

export default function CategoryHeader() {

    const className = classNames(
        [
            'text-xl text-center whitespace-nowrap align-baseline font-bold',
            'inline-block leading-none',
            'h-[35vh]',
            'text-sm',
            'text-white',
            'flex',
            'items-center',
            'bg-cover bg-center',
        ],
    );

    return (
        <div className="w-full">
            <div className={className} style={{ backgroundImage: `url("/images/evento_bg.webp")` }}>
                <div className='flex justify-center items-center w-full h-full mx-auto px-10 bg-gradient-to-b from-transparent to-stone-800'>
                    <div className="flex flex-col md:flex-row justify-center items-center">
                        <div>
                            <img src="/images/icons/eventos.svg" alt="" className='w-10 md:w-24' />
                        </div>
                        <div>
                            <h2 className='text-5xl font-extrabold'>
                                Calendario de Eventos
                            </h2>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}
