import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { es } from 'dayjs/locale/es';

export default function Events() {
    dayjs.locale("es");
    const { grouped_events } = usePage().props;

    const [slectedDate, setSlectedDate] = useState(Object.keys(grouped_events)[0]);

    return (
        <div>
            <div className="text-5xl font-extrabold text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                    Próximos eventos
                </span>
            </div>
            {Object.keys(grouped_events).length > 0 ? (
                <>
                    <div className='flex max-w-ful overflow-x-auto'>
                        {Object.keys(grouped_events).map((group, index) => {
                            return (
                                <div
                                    key={index}
                                    label={index}
                                    className="bg-stone-400 px-4 pt-2 mx-1 rounded text-center cursor-pointer"
                                    onClick={() => setSlectedDate(group)}
                                >
                                    <div className='flex flex-col text-sm'>
                                        <span>{dayjs(group).format('MMM')}</span>
                                        <span>{dayjs(group).format('ddd')}</span>
                                    </div>
                                    <div className='text-3xl mt-4'>
                                        {dayjs(group).format('DD')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className='grid grid-cols-4 gap-4 py-3'>
                        {grouped_events[slectedDate].map((event, index) => {
                            return (
                                <div key={index} className="card w-full bg-base-100 shadow-xl mb-4">
                                    <figure><img src={event.image} alt="Shoes" /></figure>
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            {event.title}
                                        </h2>
                                        <div className="card-actions justify-start">
                                            <div className="badge badge-outline">{dayjs(event.start).format('DD/MM')}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className='flex justify-center w-full text-center'>
                    <span>There is no events</span>
                </div>
            )}

            <div>
                <Link href={route('site.events.index')} className="btn btn-primary">
                    Ver todos los eventos
                </Link>
            </div>
        </div>
    );
}
