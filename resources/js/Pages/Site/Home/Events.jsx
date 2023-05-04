import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { es } from 'dayjs/locale/es';
import { trans } from '@/utils';
import { EventCard } from '@/Components/EventCard';

export default function Events() {
    dayjs.locale("es");
    const { grouped_events } = usePage().props;

    // const [slectedDate, setSlectedDate] = useState(Object.keys(grouped_events)[0]);
    const [slectedDate, setSlectedDate] = useState(null);

    const slideToStart = () => {
        const slider = document.getElementById('slider');
        slider.scrollLeft = 10;
    }

    const goToDate = (group) => {
        setSlectedDate(group);
        slideToStart();
    }

    return (
        <div className='bg-white rounded-xl md:p-2 sm:p-0 py-3 md:mx-4'>
            <div className="text-3xl md:text-4xl font-extrabold text-center">
                <span className="bg-clip-text text-transparent bg-stone-800">
                    Próximos eventos
                </span>
            </div>
            {Object.keys(grouped_events).length > 0 ? (
                <>
                    <div className='flex max-w-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide py-5 px-2'>
                        {Object.keys(grouped_events).map((group, index) => {
                            return (
                                <div
                                    key={index}
                                    label={index}
                                    onClick={() => goToDate(group)}
                                    className="min-w-32 min-h-48 font-medium mr-5 shadow-md border border-stone-800 rounded-lg cursor-pointer active:opacity-5 ease-in-out duration-200">
                                    <div className="w-32 md:w-24 flex-none text-center">
                                        <div className="block rounded-t-lg overflow-hidden text-center ">
                                            <div className="bg-red-900 bg- text-white py-1">
                                                {dayjs(group).format('MMM')}
                                            </div>
                                            <div className="pt-1 border-l border-r border-white bg-white">
                                                <span className="text-5xl md:text-3xl font-bold leading-tight">
                                                    {dayjs(group).format('DD')}
                                                </span>
                                            </div>
                                            <div className="border-l border-r border-b rounded-b-lg text-center border-white bg-white -pt-2 mb-1">
                                                <span className="text-sm">
                                                    {dayjs(group).format('dddd')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div id='slider' className='w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide px-2 py-5 flex flex-row'>
                        {slectedDate ? (
                            <>
                                {
                                    grouped_events[slectedDate].map((event, index) => (
                                        <EventCard key={index} index={index} event={event} />
                                    ))
                                }
                            </>
                        ) : (
                            <>
                                {
                                    Object.keys(grouped_events).map((group, index) => {
                                        return (
                                            grouped_events[group].map((event, index) => (
                                                <EventCard key={index} index={index} event={event} />
                                            ))
                                        )
                                    })
                                }
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div className='flex justify-center w-full text-center'>
                    <span>There is no events</span>
                </div>
            )}

            <div className='w-full flex justify-center my-5'>
                <Link href={route('site.events.index')} className="btn btn-outline">
                    {trans('see_more')} Eventos <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
            </div>
        </div >
    );
}
